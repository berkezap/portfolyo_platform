import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PortfolioService } from '@/lib/portfolioService'
import { portfolioUpdateSchema, validateRequest, sanitizeString } from '@/lib/validation'
import * as Sentry from '@sentry/nextjs'
import { GitHubService } from '@/lib/github'
import { formatUserDataForTemplate, renderTemplate } from '@/lib/templateEngine'

// GET - Portfolio detayını getir (public access)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🔍 Portfolio detayı getiriliyor:', id)
    
    const portfolio = await PortfolioService.getPortfolio(id)
    
    if (!portfolio) {
      console.log('❌ Portfolio bulunamadı:', id)
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    console.log('✅ Portfolio bulundu:', portfolio.id)
    
    // snake_case -> camelCase dönüşümü yap ve frontend'e gönder
    return NextResponse.json({
      success: true,
      portfolio: {
        id: portfolio.id,
        template: portfolio.selected_template,
        selectedRepos: portfolio.selected_repos,
        cvUrl: portfolio.cv_url,
        generatedHtml: portfolio.generated_html,
        metadata: portfolio.metadata,
        createdAt: portfolio.created_at,
        updatedAt: portfolio.updated_at
      }
    })

  } catch (error) {
    console.error('💥 Portfolio getirme hatası:', error)
    Sentry.captureException(error, { tags: { api: 'portfolio-get' } })
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Portfolio güncelle (requires authentication and ownership)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string = ''
  
  try {
    id = (await params).id
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || !session.accessToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const existingPortfolio = await PortfolioService.getPortfolio(id)
    if (!existingPortfolio) {
      return NextResponse.json({ success: false, error: 'Portfolio not found' }, { status: 404 })
    }

    if (existingPortfolio.user_id !== session.user.email) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
    }

    const requestBody = await request.json()
    const validation = await validateRequest(portfolioUpdateSchema, {
      template: requestBody.template,
      selectedRepos: requestBody.selectedRepos,
      cvUrl: requestBody.cvUrl,
      userBio: requestBody.userBio
    })
    
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid update data', details: validation.error }, { status: 400 })
    }
    
    const { template, selectedRepos, cvUrl, userBio } = validation.data
    
    const updatePayload: Partial<import('@/lib/supabase').Portfolio> = {
      selected_template: template,
      selected_repos: selectedRepos,
      cv_url: cvUrl,
    };
    
    let newGeneratedHtml: string | undefined = undefined;

    if (template || selectedRepos) {
      const githubService = new GitHubService(session.accessToken)
      const [userData, allRepos] = await Promise.all([
        githubService.getUserData(),
        githubService.getUserRepos()
      ]);

      const finalTemplateName = template || existingPortfolio.selected_template;
      const finalSelectedRepos = selectedRepos || existingPortfolio.selected_repos;
      const finalCvUrl = cvUrl !== undefined ? cvUrl : existingPortfolio.cv_url;
      const finalUserBio = userBio !== undefined ? userBio : existingPortfolio.metadata?.user_bio;

      const templateData = formatUserDataForTemplate(userData, allRepos, finalSelectedRepos);

      if (finalCvUrl) templateData.CV_URL = finalCvUrl;
      if (finalUserBio) templateData.USER_BIO = finalUserBio;
      
      newGeneratedHtml = renderTemplate(finalTemplateName, templateData);
      updatePayload.generated_html = newGeneratedHtml;
      updatePayload.metadata = PortfolioService.createMetadataFromTemplateData(templateData, finalTemplateName);
    } else {
      // Sadece user_bio değişmişse metadata'yı güncelle
      updatePayload.metadata = {
        ...existingPortfolio.metadata,
        user_bio: userBio !== undefined ? userBio : existingPortfolio.metadata?.user_bio,
      };
    }

    const updatedPortfolio = await PortfolioService.updatePortfolio(id, updatePayload)
    if (!updatedPortfolio) {
      return NextResponse.json({ success: false, error: 'Failed to update portfolio' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, portfolio: updatedPortfolio })

  } catch (error) {
    console.error('💥 Portfolio güncelleme hatası:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Portfolio sil (requires authentication and ownership)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string = ''
  try {
    id = (await params).id
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const existingPortfolio = await PortfolioService.getPortfolio(id)
    if (!existingPortfolio) {
      return NextResponse.json({ success: false, error: 'Portfolio not found' }, { status: 404 })
    }

    if (existingPortfolio.user_id !== session.user.email) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
    }

    const deleted = await PortfolioService.deletePortfolio(id)
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Failed to delete portfolio' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Portfolio successfully deleted' })
  } catch (error) {
    console.error('💥 Portfolio silme hatası:', error)
    Sentry.captureException(error, { tags: { api: 'portfolio-delete' }, extra: { portfolioId: id } })
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

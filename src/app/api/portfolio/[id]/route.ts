import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PortfolioService } from '@/lib/portfolioService'
import { portfolioUpdateSchema, validateRequest } from '@/lib/validation'
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
    
    // Veritabanından gelen formatı doğrudan döndür (zaten snake_case)
    return NextResponse.json({
      success: true,
      portfolio: {
        id: portfolio.id,
        selected_template: portfolio.selected_template,
        selected_repos: portfolio.selected_repos,
        cv_url: portfolio.cv_url,
        generated_html: portfolio.generated_html,
        metadata: portfolio.metadata,
        created_at: portfolio.created_at,
        updated_at: portfolio.updated_at
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
    if (!session?.user?.email || !session.user.accessToken) {
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
    console.log('📥 PATCH isteği alındı:', requestBody)
    
    // Frontend'den gelen snake_case formatını kabul et
    const validation = await validateRequest(portfolioUpdateSchema, {
      template: requestBody.selected_template || requestBody.template,
      selectedRepos: requestBody.selected_repos || requestBody.selectedRepos,
      cvUrl: requestBody.cv_url || requestBody.cvUrl,
      userBio: requestBody.user_bio || requestBody.userBio
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
      try {
        const githubService = new GitHubService(session.user.accessToken)
        const [userData, allRepos] = await Promise.all([
          githubService.getUserData(),
          githubService.getUserRepos()
        ]);

        const finalTemplateName = template || existingPortfolio.selected_template;
        const finalSelectedRepos = selectedRepos || existingPortfolio.selected_repos;
        const finalCvUrl = cvUrl !== undefined ? cvUrl : existingPortfolio.cv_url;
        const finalUserBio = userBio !== undefined ? userBio : existingPortfolio.metadata?.user_bio;

        console.log('🔄 Template verisi hazırlanıyor...', {
          templateName: finalTemplateName,
          repoCount: finalSelectedRepos.length,
          cvUrl: finalCvUrl,
          userBio: finalUserBio
        });

        const templateData = formatUserDataForTemplate(userData, allRepos, finalSelectedRepos);

        if (finalCvUrl) templateData.CV_URL = finalCvUrl;
        if (finalUserBio) templateData.USER_BIO = finalUserBio;
        
        console.log('🎨 Template render ediliyor...');
        newGeneratedHtml = renderTemplate(finalTemplateName, templateData);
        
        if (!newGeneratedHtml) {
          throw new Error('Generated HTML is empty');
        }
        
        console.log('✅ Template başarıyla render edildi, HTML uzunluğu:', newGeneratedHtml.length);
        
        updatePayload.generated_html = newGeneratedHtml;
        updatePayload.metadata = PortfolioService.createMetadataFromTemplateData(templateData, finalTemplateName);
      } catch (error) {
        console.error('❌ Template render hatası:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to generate portfolio HTML',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    } else {
      // Sadece user_bio değişmişse metadata'yı güncelle
      updatePayload.metadata = {
        ...existingPortfolio.metadata,
        user_bio: userBio !== undefined ? userBio : existingPortfolio.metadata?.user_bio,
      };
    }

    console.log('📤 Veritabanına gönderilen payload:', updatePayload)
    
    const updatedPortfolio = await PortfolioService.updatePortfolio(id, updatePayload)
    if (!updatedPortfolio) {
      return NextResponse.json({ success: false, error: 'Failed to update portfolio' }, { status: 500 })
    }
    
    console.log('✅ Portfolio başarıyla güncellendi:', updatedPortfolio.id)
    
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

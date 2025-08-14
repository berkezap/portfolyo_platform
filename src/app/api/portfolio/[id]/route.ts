import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PortfolioService } from '@/lib/portfolioService';
import { portfolioUpdateSchema, validateRequest } from '@/lib/validation';
import * as Sentry from '@sentry/nextjs';
import { GitHubService } from '@/lib/github';
import { formatUserDataForTemplate, renderTemplate } from '@/lib/templateEngine';
import type { GitHubUser, GitHubRepo } from '@/types/github'; // tipler buradan import edildi
import { withRateLimit } from '@/lib/rateLimit';
import { createErrorResponse } from '@/lib/errorHandler';
import { requireAuth, requirePortfolioOwnership } from '@/lib/security';

// UUID validation helper
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// GET - Portfolio detayını getir (public access)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log('🔍 Portfolio detayı getiriliyor:', id);

    // UUID validation
    if (!isValidUUID(id)) {
      return createErrorResponse(
        'Invalid portfolio ID format',
        'Portfolio ID must be a valid UUID',
        400,
        { endpoint: 'portfolio-get', action: 'get' },
        { providedId: id }
      );
    }

    const portfolio = await PortfolioService.getPortfolio(id);

    if (!portfolio) {
      console.log('❌ Portfolio bulunamadı:', id);
      return NextResponse.json({ success: false, error: 'Portfolio not found' }, { status: 404 });
    }

    console.log('✅ Portfolio bulundu:', portfolio.id);

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
        updated_at: portfolio.updated_at,
        // Publishing fields - database colonlarıyla uyumlu
        slug: portfolio.slug,
        status: portfolio.status,
        published_at: portfolio.published_at,
        slug_last_changed_at: portfolio.slug_last_changed_at,
        slug_change_count: portfolio.slug_change_count,
        // Legacy uyumluluğu için
        public_slug: portfolio.slug,
        is_published: portfolio.status === 'published',
      },
    });
  } catch (error) {
    console.error('💥 Portfolio getirme hatası:', error);
    Sentry.captureException(error, { tags: { api: 'portfolio-get' } });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Portfolio güncelle (requires authentication and ownership)
async function patchHandler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    // UUID validation
    if (!isValidUUID(id)) {
      return createErrorResponse(
        'Invalid portfolio ID format',
        'Portfolio ID must be a valid UUID',
        400,
        { endpoint: 'portfolio-patch', action: 'update' },
        { providedId: id }
      );
    }

    // Centralized auth
    const auth = await requireAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const session = auth.session;
    const userId = (session.user as any).email || session.user.id;

    // Ownership check
    const owns = await requirePortfolioOwnership(id, String(userId));
    if (!owns) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const requestBody = await request.json();
    console.log('📥 PATCH isteği alındı:', requestBody);

    // Frontend'den gelen snake_case formatını kabul et
    const validation = await validateRequest(portfolioUpdateSchema, {
      template: requestBody.selected_template || requestBody.template,
      selectedRepos: requestBody.selected_repos || requestBody.selectedRepos,
      cvUrl: requestBody.cv_url || requestBody.cvUrl,
      userBio: requestBody.user_bio || requestBody.userBio,
    });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid update data', details: validation.error },
        { status: 400 },
      );
    }

    const { template, selectedRepos, cvUrl, userBio } = validation.data;

    const existingPortfolio = await PortfolioService.getPortfolio(id);
    if (!existingPortfolio) {
      return NextResponse.json({ success: false, error: 'Portfolio not found' }, { status: 404 });
    }

    const updatePayload: Partial<import('@/lib/supabase').Portfolio> = {
      selected_template: template,
      selected_repos: selectedRepos,
      cv_url: cvUrl,
    };

    // Template render işlemini optimize et - sadece gerekli olduğunda yap
    const needsTemplateRender =
      !!template || !!selectedRepos || cvUrl !== undefined || userBio !== undefined;

    if (needsTemplateRender) {
      try {
        const accessToken = (session.user as any)?.accessToken as string | undefined;
        if (!accessToken) {
          return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        const githubService = new GitHubService(accessToken);

        // Paralel veri çekme - daha hızlı
        const [userDataRaw, allReposRaw] = await Promise.all([
          githubService.getUserData(),
          githubService.getUserRepos(),
        ]);
        const userData = userDataRaw as GitHubUser;
        const allRepos = allReposRaw as GitHubRepo[];

        const finalTemplateName = template || existingPortfolio.selected_template;
        const finalSelectedRepos = selectedRepos || existingPortfolio.selected_repos;
        const finalCvUrl = typeof cvUrl === 'string' ? cvUrl : (existingPortfolio.cv_url ?? ''); // tip hatası giderildi
        const finalUserBio = userBio !== undefined ? userBio : existingPortfolio.metadata?.user_bio;

        console.log('🔄 Template verisi hazırlanıyor...', {
          templateName: finalTemplateName,
          repoCount: finalSelectedRepos.length,
          cvUrl: finalCvUrl,
          userBio: finalUserBio,
        });

        const templateData = formatUserDataForTemplate(userData, allRepos, finalSelectedRepos);

        if (finalCvUrl) templateData.CV_URL = finalCvUrl;
        if (finalUserBio && typeof finalUserBio === 'string') templateData.USER_BIO = finalUserBio;

        console.log('🎨 Template render ediliyor...');
        const newGeneratedHtml = renderTemplate(finalTemplateName, templateData);

        if (!newGeneratedHtml) {
          throw new Error('Generated HTML is empty');
        }

        console.log('✅ Template başarıyla render edildi, HTML uzunluğu:', newGeneratedHtml.length);

        updatePayload.generated_html = newGeneratedHtml;
        // Free v1 kuralı: yayınlıysa canlı HTML de güncellensin
        if (existingPortfolio.is_published) {
          (updatePayload as any).published_html = newGeneratedHtml;
        }
        updatePayload.metadata = PortfolioService.createMetadataFromTemplateData(
          templateData,
          finalTemplateName,
        );
      } catch (error) {
        console.error('❌ Template render hatası:', error);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to generate portfolio HTML',
            details: error instanceof Error ? error.message : 'Unknown error',
          },
          { status: 500 },
        );
      }
    } else {
      // Sadece user_bio değişmişse metadata'yı güncelle
      updatePayload.metadata = {
        ...existingPortfolio.metadata,
        user_bio: userBio !== undefined ? userBio : existingPortfolio.metadata?.user_bio,
      };
    }

    console.log('📤 Veritabanına gönderilen payload:', updatePayload);

    const updatedPortfolio = await PortfolioService.updatePortfolio(id, updatePayload);
    if (!updatedPortfolio) {
      return NextResponse.json(
        { success: false, error: 'Failed to update portfolio' },
        { status: 500 },
      );
    }

    console.log('✅ Portfolio başarıyla güncellendi:', updatedPortfolio.id);

    return NextResponse.json({ success: true, portfolio: updatedPortfolio });
  } catch (error) {
    console.error('💥 Portfolio güncelleme hatası:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
export const PATCH = withRateLimit(patchHandler as any);

// DELETE - Portfolio sil (requires authentication and ownership)
async function deleteHandler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    // UUID validation
    if (!isValidUUID(id)) {
      return createErrorResponse(
        'Invalid portfolio ID format',
        'Portfolio ID must be a valid UUID',
        400,
        { endpoint: 'portfolio-delete', action: 'delete' },
        { providedId: id }
      );
    }

    // Centralized auth
    const auth = await requireAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const session = auth.session;
    const userId = (session.user as any).email || session.user.id;

    // Ownership check
    const owns = await requirePortfolioOwnership(id, String(userId));
    if (!owns) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const deleted = await PortfolioService.deletePortfolio(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete portfolio' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: 'Portfolio successfully deleted' });
  } catch (error) {
    console.error('💥 Portfolio silme hatası:', error);
    Sentry.captureException(error, {
      tags: { api: 'portfolio-delete' },
      extra: { portfolioId: id },
    });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
export const DELETE = withRateLimit(deleteHandler as any);

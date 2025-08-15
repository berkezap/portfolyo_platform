import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PortfolioService } from '@/lib/portfolioService';
import type { SessionUser } from '@/types/auth';
import { withRateLimit } from '@/lib/rateLimit';

async function getHandler(request: Request) {
  console.log('📋 Portfolio List API çağrıldı!');

  try {
    // Demo mode kontrolü
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    let userId: string;

    if (demoMode) {
      // Demo mode - test user kullan
      userId = 'test@example.com';
    } else {
      // Gerçek mode - session kontrolü
      const session = await getServerSession(authOptions);
      console.log('🔐 Portfolio List - Session var mı?', !!session);

      if (session) {
        console.log('✅ Portfolio List - Session bulundu:', {
          userEmail: session.user?.email,
          hasAccessToken: !!(session.user as SessionUser)?.accessToken,
        });
      } else {
        console.log(
          '❌ Portfolio List - Session bulunamadı - cookies:',
          request.headers.get('cookie'),
        );
      }

      if (!session?.user?.email) {
        console.log('❌ Session yok, unauthorized');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userId = session.user.email;
    }
    console.log('👤 User ID:', userId);

    // 📊 Kullanıcının portfolyolarını getir
    const portfolios = await PortfolioService.getUserPortfolios(userId);

    console.log(`✅ ${portfolios.length} portfolio bulundu:`);
    portfolios.forEach((portfolio) => {
      console.log(
        `  - ${portfolio.id} (${portfolio.selected_template}, ${portfolio.metadata?.repoCount || '?'} repo)`,
      );
    });

    // 📋 Portfolio listesini formatla
    const formattedPortfolios = portfolios.map((portfolio) => ({
      id: portfolio.id,
      template: portfolio.selected_template,
      selectedRepos: portfolio.selected_repos || [],
      cvUrl: portfolio.cv_url,
      createdAt: portfolio.created_at,
      updatedAt: portfolio.updated_at,
      metadata: portfolio.metadata || {},
      // Publishing fields
      is_published: portfolio.is_published,
      public_slug: portfolio.public_slug,
      slug: portfolio.slug,
      status: portfolio.status,
      published_at: portfolio.published_at,
      visibility: portfolio.visibility,
    }));

    return NextResponse.json({
      success: true,
      portfolios: formattedPortfolios,
      count: portfolios.length,
    });
  } catch (error) {
    console.error('💥 Portfolio list hatası:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 });
  }
}

export const GET = withRateLimit(getHandler as any);

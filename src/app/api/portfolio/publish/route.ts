import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';
import { withRateLimit } from '@/lib/rateLimit';

const publishSchema = z.object({
  portfolioId: z.string().min(1),
  slug: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9-]+$/),
});

async function postHandler(request: NextRequest) {
  try {
    console.log('🚀 Portfolio Publish API çağrıldı!');

    // Environment kontrolü
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isPreview = process.env.VERCEL_ENV === 'preview';
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    console.log('🔍 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      isDevelopment,
      isPreview,
      demoMode,
    });

    if (demoMode) {
      const body = await request.json();
      const parsed = publishSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: 'Invalid data', details: parsed.error.flatten() },
          { status: 400 },
        );
      }
      const { portfolioId, slug } = parsed.data;

      // Rezerve slug'ları demo'da da aynı şekilde engelle
      const reservedSlugs = [
        'admin',
        'api',
        'app',
        'www',
        'mail',
        'ftp',
        'localhost',
        'test',
        'dashboard',
        'portfolio',
        'portfolyo',
        'user',
        'auth',
        'login',
        'register',
        'signup',
        'signin',
        'logout',
        'profile',
        'settings',
        'billing',
        'pricing',
        'about',
        'contact',
        'help',
        'support',
        'docs',
        'documentation',
        'blog',
        'news',
        'legal',
        'privacy',
        'terms',
        'cookie',
        'cookies',
        'gdpr',
        'status',
        'health',
      ];
      if (reservedSlugs.includes(slug)) {
        return NextResponse.json(
          { success: false, error: 'Bu slug rezerve edilmiş' },
          { status: 400 },
        );
      }

      console.log('🎭 Demo mode: publish success mocked for', { portfolioId, slug });
      return NextResponse.json({
        success: true,
        portfolioId,
        slug,
        url: `https://${slug}.portfolyo.tech`,
        message: 'Portfolio (demo) başarıyla yayınlandı!',
        isDevelopment: false,
      });
    }

    // Session kontrolü
    const session = await getServerSession(authOptions);
    console.log('🔐 Session var mı?', !!session);

    if (!session?.user?.email) {
      console.log('❌ Session bulunamadı');
      return NextResponse.json(
        {
          success: false,
          error: 'Oturum açmanız gerekiyor',
        },
        { status: 401 },
      );
    }

    console.log('✅ Session bulundu:', {
      userEmail: session.user.email,
    });

    // Request body'sini al ve doğrula
    const body = await request.json();
    const parsed = publishSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { portfolioId, slug } = parsed.data;

    console.log('📥 Request data:', { portfolioId, slug });

    // Slug formatı ve rezerve isimler ekstra kontrol
    const slugRegex = /^[a-z0-9-]{3,30}$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug formatı geçersiz (sadece küçük harf, rakam ve tire, 3-30 karakter)',
        },
        { status: 400 },
      );
    }

    const reservedSlugs = [
      'admin',
      'api',
      'app',
      'www',
      'mail',
      'ftp',
      'localhost',
      'test',
      'dashboard',
      'portfolio',
      'portfolyo',
      'user',
      'auth',
      'login',
      'register',
      'signup',
      'signin',
      'logout',
      'profile',
      'settings',
      'billing',
      'pricing',
      'about',
      'contact',
      'help',
      'support',
      'docs',
      'documentation',
      'blog',
      'news',
      'legal',
      'privacy',
      'terms',
      'cookie',
      'cookies',
      'gdpr',
      'status',
      'health',
    ];

    if (reservedSlugs.includes(slug)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bu slug rezerve edilmiş',
        },
        { status: 400 },
      );
    }

    // Portfolio'nun kullanıcıya ait olduğunu kontrol et
    console.log('📋 Portfolio kontrolü başlıyor:', { portfolioId, userEmail: session.user.email });

    const { data: portfolio, error: portfolioError } = await supabaseAdmin
      .from('portfolios')
      .select(
        'id, user_id, generated_html, selected_template, slug, slug_last_changed_at, slug_change_count',
      )
      .eq('id', portfolioId)
      .eq('user_id', session.user.email)
      .single();

    console.log('📋 Portfolio query sonucu:', { portfolio, portfolioError });

    if (portfolioError || !portfolio) {
      console.log('❌ Portfolio bulunamadı:', portfolioError);
      return NextResponse.json(
        {
          success: false,
          error: 'Portfolio bulunamadı',
          debug: { portfolioError, portfolioId, userEmail: session.user.email },
        },
        { status: 404 },
      );
    }

    console.log('✅ Portfolio bulundu:', portfolio.id);

    // Subscription kontrolü ve limit kontrolü
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('plan, status')
      .eq('user_email', session.user.email)
      .single();

    const isPro = subscription?.plan === 'PRO' && subscription?.status === 'active';
    console.log('🎯 Subscription check:', { isPro, subscription });

    // Kullanıcının yayınlanmış portfolyolarını kontrol et
    const { data: publishedPortfolios, error: publishedError } = await supabaseAdmin
      .from('portfolios')
      .select('id, public_slug')
      .eq('user_id', session.user.email)
      .eq('is_published', true);

    console.log('📊 Published portfolios:', { publishedPortfolios, publishedError });

    // Bu portfolio zaten yayınlanmış mı?
    const isCurrentPortfolioPublished = publishedPortfolios?.some((p) => p.id === portfolioId);

    // Plan limitleri
    const maxPublishedPortfolios = isPro ? 5 : 1;
    const currentPublishedCount = publishedPortfolios?.length || 0;

    // Yeni portfolio yayınlanacaksa ve limit aşılacaksa
    if (!isCurrentPortfolioPublished && currentPublishedCount >= maxPublishedPortfolios) {
      if (isPro) {
        return NextResponse.json(
          {
            success: false,
            error: `PRO planında en fazla ${maxPublishedPortfolios} portfolio yayınlayabilirsiniz. Önce mevcut portfolyolardan birini kaldırın.`,
          },
          { status: 403 },
        );
      } else {
        // FREE kullanıcılar için otomatik unpublish
        console.log('🔄 FREE user publishing new portfolio, unpublishing old ones...');

        const { error: unpublishError } = await supabaseAdmin
          .from('portfolios')
          .update({
            is_published: false,
            visibility: 'unlisted',
            public_slug: null,
          })
          .eq('user_id', session.user.email)
          .eq('is_published', true)
          .neq('id', portfolioId);

        if (unpublishError) {
          console.log('❌ Eski portfolio unpublish hatası:', unpublishError);
          return NextResponse.json(
            {
              success: false,
              error: 'Önceki portfolio kaldırılırken hata oluştu',
              debug: { unpublishError },
            },
            { status: 500 },
          );
        }

        console.log('✅ Eski portfolios unpublished for FREE user');
      }
    }

    // Eğer slug değiştiriliyorsa ve freemium kullanıcısıysa limit kontrolü yap
    const isSlugChange = portfolio.slug && portfolio.slug !== slug;
    if (isSlugChange && portfolio.slug_last_changed_at) {
      const lastChangeDate = new Date(portfolio.slug_last_changed_at);
      const sixMonthsLater = new Date(lastChangeDate);
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

      const now = new Date();
      if (now < sixMonthsLater) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Freemium kullanıcılar 6 ayda bir slug değiştirebilir. Lütfen daha sonra tekrar deneyin.',
          },
          { status: 403 },
        );
      }
    }

    // Slug kullanılabilir mi?
    const { data: existingSlug, error: slugError } = await supabaseAdmin
      .from('portfolios')
      .select('id')
      .eq('public_slug', slug)
      .maybeSingle();

    if (slugError) {
      console.log('❌ Slug kontrol hatası:', slugError);
      return NextResponse.json(
        {
          success: false,
          error: 'Slug kontrolü sırasında hata oluştu',
        },
        { status: 500 },
      );
    }

    if (existingSlug && existingSlug.id !== portfolioId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bu slug zaten kullanımda',
        },
        { status: 409 },
      );
    }

    // Portfolio yayınlama - Preview ve Production'da gerçekten yayınla
    const shouldPublish = !isDevelopment; // Sadece local development'ta yayınlama

    const updateData = {
      public_slug: slug,
      is_published: shouldPublish,
      visibility: shouldPublish ? 'public' : 'unlisted',
      published_html: portfolio.generated_html,
      ...(shouldPublish ? { published_at: new Date().toISOString() } : {}),
    };

    console.log('📤 Portfolio güncelleme başlıyor:', { updateData, portfolioId });

    const { data: updatedPortfolio, error: updateError } = await supabaseAdmin
      .from('portfolios')
      .update(updateData)
      .eq('id', portfolioId)
      .select('id, public_slug, is_published, published_at')
      .single();

    console.log('📤 Portfolio güncelleme sonucu:', { updatedPortfolio, updateError });

    if (updateError || !updatedPortfolio) {
      console.log('❌ Publish güncelleme hatası:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'Yayınlama sırasında bir hata oluştu',
          debug: { updateError, updateData, portfolioId },
        },
        { status: 500 },
      );
    }

    // URL oluşturma - Preview ve Production'da subdomain
    const baseUrl = isDevelopment
      ? `http://localhost:${process.env.PORT || 3000}`
      : `https://${slug}.portfolyo.tech`;

    const portfolioUrl = isDevelopment ? `${baseUrl}/portfolio/${slug}` : baseUrl;

    console.log(
      isDevelopment
        ? `🔧 Development mode: Portfolio preview hazır (yayınlanmadı): ${portfolioUrl}`
        : `✅ ${isPreview ? 'Preview' : 'Production'} mode: Portfolio yayınlandı: ${portfolioUrl}`,
    );

    return NextResponse.json({
      success: true,
      portfolioId,
      slug,
      url: portfolioUrl,
      message: isDevelopment
        ? 'Portfolio preview hazır! (Development modunda - henüz yayınlanmadı)'
        : `Portfolio başarıyla yayınlandı! ${isPreview ? '(Preview ortamında)' : ''}`,
      isDevelopment,
      isPreview,
    });
  } catch (error) {
    console.error('❌ Portfolio publish hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Sunucu hatası',
        debug: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      },
      { status: 500 },
    );
  }
}

export const POST = withRateLimit(postHandler);

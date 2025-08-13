import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Portfolio Publish API çağrıldı!');

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

    // Request body'sini al
    const body = await request.json();
    const { portfolioId, slug } = body;

    console.log('📥 Request data:', { portfolioId, slug });

    if (!portfolioId || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Portfolio ID ve slug gerekli',
        },
        { status: 400 },
      );
    }

    // Slug formatını kontrol et
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

    // Reserved slug'ları kontrol et
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
    const { data: portfolio, error: portfolioError } = await supabaseAdmin
      .from('portfolios')
      .select(
        'id, user_id, generated_html, selected_template, slug, slug_last_changed_at, slug_change_count',
      )
      .eq('id', portfolioId)
      .eq('user_id', session.user.email)
      .single();

    if (portfolioError || !portfolio) {
      console.log('❌ Portfolio bulunamadı:', portfolioError);
      return NextResponse.json(
        {
          success: false,
          error: 'Portfolio bulunamadı',
        },
        { status: 404 },
      );
    }

    console.log('✅ Portfolio bulundu:', portfolio.id);

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
            error: `URL değişikliği 6 ayda bir yapılabilir. Sonraki değişiklik tarihi: ${sixMonthsLater.toLocaleDateString('tr-TR')}`,
          },
          { status: 400 },
        );
      }
    }

    // Slug'ın kullanılabilir olduğunu kontrol et
    const { data: existingPortfolio, error: slugCheckError } = await supabaseAdmin
      .from('portfolios')
      .select('id')
      .eq('slug', slug)
      .neq('id', portfolioId)
      .single();

    if (existingPortfolio) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bu slug zaten kullanımda',
        },
        { status: 400 },
      );
    }

    // Portfolio'yu güncelle (slug ekle ve published olarak işaretle)
    const updateData: any = {
      slug: slug,
      status: 'published',
      published_at: new Date().toISOString(),
    };

    // Eğer slug değiştiriliyorsa, slug değişiklik tarihini ve sayısını güncelle
    if (isSlugChange) {
      updateData.slug_last_changed_at = new Date().toISOString();
      updateData.slug_change_count = (portfolio.slug_change_count || 0) + 1;
    }

    const { error: updateError } = await supabaseAdmin
      .from('portfolios')
      .update(updateData)
      .eq('id', portfolioId);

    if (updateError) {
      console.log('❌ Portfolio güncellenirken hata:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'Portfolio yayınlanırken hata oluştu',
        },
        { status: 500 },
      );
    }

    console.log('✅ Portfolio başarıyla yayınlandı:', {
      portfolioId,
      slug,
      url: `https://${slug}.portfolyo.tech`,
    });

    return NextResponse.json({
      success: true,
      portfolioId,
      slug,
      url: `https://${slug}.portfolyo.tech`,
      message: 'Portfolio başarıyla yayınlandı!',
    });
  } catch (error) {
    console.error('❌ Portfolio publish hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Sunucu hatası',
      },
      { status: 500 },
    );
  }
}

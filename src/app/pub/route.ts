import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Edge runtime optimized for speed
export const runtime = 'edge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  console.log('🔍 Public portfolio request for slug:', slug);

  if (!slug) {
    console.log('❌ No slug provided');
    return new NextResponse('Portfolio not found', { status: 404 });
  }

  try {
    // Get published portfolio from database
    console.log('🔍 Searching for portfolio with slug:', slug);
    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .select('published_html, public_slug, is_published')
      .eq('public_slug', slug)
      .eq('is_published', true)
      .single();

    console.log('📊 Database result:', { portfolio: !!portfolio, error, slug });

    if (error || !portfolio) {
      console.log('❌ Portfolio not found:', { error, slug });
      return new NextResponse('Portfolio not found', { status: 404 });
    }

    console.log(
      '✅ Portfolio found, serving HTML (published_html length:',
      portfolio.published_html?.length || 0,
      ')',
    );
    // Return HTML with proper headers
    return new NextResponse(portfolio.published_html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=10, s-maxage=30', // Reduced cache for debugging
        'Content-Security-Policy':
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; img-src * data: blob:; font-src * data:;",
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error serving portfolio:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

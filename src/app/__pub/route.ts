import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(req: NextRequest) {
  try {
    const slug = (req.nextUrl.searchParams.get('slug') || '').toLowerCase();
    if (!slug || !/^[a-z0-9-]{3,30}$/.test(slug)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('portfolios')
      .select('published_html,is_published,visibility')
      .eq('public_slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Public fetch error:', error);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }

    if (!data || !data.is_published || data.visibility === 'private' || !data.published_html) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    headers.set(
      'Content-Security-Policy',
      "default-src 'none'; style-src 'self' 'unsafe-inline'; img-src https: data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'",
    );

    return new NextResponse(data.published_html as string, { headers });
  } catch (e) {
    console.error('Public route error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

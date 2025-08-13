import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'edge';

export default async function Page({ searchParams }: { searchParams: { slug?: string } }) {
  try {
    const slug = (searchParams.slug || '').toLowerCase();

    if (!slug || !/^[a-z0-9-]{3,30}$/.test(slug)) {
      return (
        <html>
          <body>
            <h1>404 - Not Found</h1>
            <p>Invalid or missing slug</p>
          </body>
        </html>
      );
    }

    const { data, error } = await supabaseAdmin
      .from('portfolios')
      .select('published_html,is_published,visibility')
      .eq('public_slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Public fetch error:', error);
      return (
        <html>
          <body>
            <h1>500 - Server Error</h1>
            <p>Database error</p>
          </body>
        </html>
      );
    }

    if (!data || !data.is_published || data.visibility === 'private' || !data.published_html) {
      return (
        <html>
          <body>
            <h1>404 - Not Found</h1>
            <p>Portfolio not found or not published</p>
          </body>
        </html>
      );
    }

    // Direkt HTML return
    return <div dangerouslySetInnerHTML={{ __html: data.published_html }} />;
  } catch (error) {
    console.error('Public page error:', error);
    return (
      <html>
        <body>
          <h1>500 - Server Error</h1>
          <p>Internal error</p>
        </body>
      </html>
    );
  }
}

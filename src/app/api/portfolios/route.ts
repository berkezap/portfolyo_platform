import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(request: NextRequest) {
  try {
    // Get all portfolios with basic info (for debugging)
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('id, name, public_slug, is_published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 });
    }

    return NextResponse.json({ portfolios: portfolios || [] });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

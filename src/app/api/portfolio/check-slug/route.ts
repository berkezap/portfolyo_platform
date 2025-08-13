import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug required' }, { status: 400 });
  }

  // Slug formatını kontrol et
  if (!/^[a-z0-9-]+$/.test(slug) || slug.length < 3 || slug.length > 30) {
    return NextResponse.json({ available: false, reason: 'Invalid format' });
  }

  // Reserved slug'ları kontrol et
  const reserved = ['www', 'api', 'app', 'admin', 'static', 'cdn', 'mail', 'blog'];
  if (reserved.includes(slug)) {
    return NextResponse.json({ available: false, reason: 'Reserved' });
  }

  try {
    // Database'de bu slug'ın kullanılıp kullanılmadığını kontrol et
    const { data, error } = await supabase
      .from('portfolios')
      .select('id')
      .eq('public_slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, bu istediğimiz durum
      console.error('Slug check error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Eğer data varsa slug kullanılıyor
    const available = !data;
    return NextResponse.json({
      available,
      slug,
      reason: available ? 'Available' : 'Already taken',
    });
  } catch (error) {
    console.error('Slug availability check failed:', error);
    return NextResponse.json({ error: 'Check failed' }, { status: 500 });
  }
}

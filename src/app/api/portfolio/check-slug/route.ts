import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const slugSchema = z
  .string()
  .min(3)
  .max(30)
  .regex(/^[a-z0-9-]+$/);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug required' }, { status: 400 });
  }

  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) {
    return NextResponse.json({ available: false, reason: 'Invalid format' });
  }

  // Reserved slug'lar
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
      .maybeSingle();

    if (error && (error as any).code !== 'PGRST116') {
      // PGRST116 = no rows found, bu istediğimiz durum
      console.error('Slug check error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

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

// POST method - body'den slug alır
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = body?.slug;

    if (!slug) {
      return NextResponse.json({ error: 'Slug required in body' }, { status: 400 });
    }

    const parsed = slugSchema.safeParse(slug);
    if (!parsed.success) {
      return NextResponse.json({ available: false, reason: 'Invalid format' });
    }

    // Reserved slug'lar
    const reserved = ['www', 'api', 'app', 'admin', 'static', 'cdn', 'mail', 'blog'];
    if (reserved.includes(slug)) {
      return NextResponse.json({ available: false, reason: 'Reserved' });
    }

    // Database'de bu slug'ın kullanılıp kullanılmadığını kontrol et
    const { data, error } = await supabase
      .from('portfolios')
      .select('id')
      .eq('public_slug', slug)
      .maybeSingle();

    if (error && (error as any).code !== 'PGRST116') {
      console.error('Slug check error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const available = !data;
    return NextResponse.json({
      available,
      slug,
      reason: available ? 'Available' : 'Already taken',
    });
  } catch (error) {
    console.error('POST slug check failed:', error);
    return NextResponse.json({ error: 'Check failed' }, { status: 500 });
  }
}

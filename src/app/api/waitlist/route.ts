import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

const waitlistSchema = z.object({
  email: z.string().email('Geçersiz e‑posta'),
  feature: z.enum(['pro', 'custom-domain', 'analytics', 'priority-support']).default('pro'),
  source: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = waitlistSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(', ') },
        { status: 400 },
      );
    }

    const { email, feature, source } = parsed.data;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('[WAITLIST] Supabase env yok; dev modda kabul ediliyor:', { email, feature });
      return NextResponse.json({ ok: true, note: 'dev-no-store' });
    }

    // Idempotent insert: unique(email, feature)
    const { error } = await supabaseAdmin
      .from('waitlist')
      .insert({ email, feature, source: source ?? null })
      .select()
      .single();

    if (error && !String(error.message).toLowerCase().includes('duplicate')) {
      console.error('[WAITLIST] insert error, dev olarak kabul ediliyor', error);
      return NextResponse.json({ ok: true, note: 'stored-failed' });
    }

    return NextResponse.json({ ok: true, note: error ? 'duplicate' : 'stored' });
  } catch (e) {
    console.error('Waitlist API error', e);
    // Dev ortamda kullanıcıyı bloklamayalım
    return NextResponse.json({ ok: true, note: 'internal-dev' });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

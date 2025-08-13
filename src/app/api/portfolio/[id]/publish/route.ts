import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { PortfolioService } from '@/lib/portfolioService';

const RESERVED = new Set(['www', 'api', 'app', 'admin', 'static', 'cdn']);

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const raw = String(body?.slug || '');
  const normalized = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!normalized || normalized.length < 3 || normalized.length > 30 || RESERVED.has(normalized)) {
    return NextResponse.json({ success: false, error: 'Invalid slug' }, { status: 400 });
  }

  // Slug benzersiz mi?
  const { data: existingSlug } = await supabaseAdmin
    .from('portfolios')
    .select('id')
    .eq('public_slug', normalized)
    .maybeSingle();

  if (existingSlug && existingSlug.id !== id) {
    return NextResponse.json({ success: false, error: 'Slug already in use' }, { status: 409 });
  }

  // Kayıt ve sahiplik
  const p = await PortfolioService.getPortfolio(id);
  if (!p) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  if (p.user_id !== session.user.email)
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

  // Kullanıcı başına tek yayın kuralı — farklı kayıt zaten yayındaysa 409
  const { data: alreadyPub } = await supabaseAdmin
    .from('portfolios')
    .select('id')
    .eq('user_id', session.user.email)
    .eq('is_published', true)
    .maybeSingle();

  if (alreadyPub && alreadyPub.id !== id) {
    return NextResponse.json(
      { success: false, error: 'User already has a published portfolio' },
      { status: 409 },
    );
  }

  if (!p.generated_html) {
    return NextResponse.json({ success: false, error: 'Nothing to publish' }, { status: 400 });
  }

  const updated = await PortfolioService.updatePortfolio(id, {
    published_html: p.generated_html,
    is_published: true,
    public_slug: normalized,
    published_at: new Date().toISOString(),
    visibility: 'public',
  } as any);

  if (!updated)
    return NextResponse.json({ success: false, error: 'Publish failed' }, { status: 500 });

  const publicUrl = `https://${normalized}.portfolyo.tech`;
  return NextResponse.json({ success: true, publicUrl, portfolio: updated });
}

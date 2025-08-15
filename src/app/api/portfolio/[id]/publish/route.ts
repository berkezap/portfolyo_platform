import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { PortfolioService } from '@/lib/portfolioService';
import { withRateLimit } from '@/lib/rateLimit';
import { createErrorResponse } from '@/lib/errorHandler';
import { requireAuth, requirePortfolioOwnership } from '@/lib/security';

const RESERVED = new Set(['www', 'api', 'app', 'admin', 'static', 'cdn']);

// UUID validation helper
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

async function postHandler(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  // UUID validation
  if (!isValidUUID(id)) {
    return createErrorResponse(
      'Invalid portfolio ID format',
      'Portfolio ID must be a valid UUID',
      400,
      { endpoint: 'portfolio-publish', action: 'publish' },
      { providedId: id },
    );
  }

  // Centralized auth
  const auth = await requireAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const session = auth.session;
  const userId = (session.user as any).email || session.user.id;

  const body = await request.json().catch(() => ({}));
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
  const owns = await requirePortfolioOwnership(id, String(userId));
  if (!owns) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

  const p = await PortfolioService.getPortfolio(id);
  if (!p) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

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

  const publicUrl = `http://${normalized}.portfolyo.tech`; // TODO: Change to HTTPS when SSL is ready
  return NextResponse.json({ success: true, publicUrl, portfolio: updated });
}

export const POST = withRateLimit(postHandler as any);

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PortfolioService } from '@/lib/portfolioService';
import { createErrorResponse } from '@/lib/errorHandler';
import { requireAuth, requirePortfolioOwnership } from '@/lib/security';
import { withRateLimit } from '@/lib/rateLimit';

// UUID validation helper
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

async function postHandler(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  
  // UUID validation
  if (!isValidUUID(id)) {
    return createErrorResponse(
      'Invalid portfolio ID format',
      'Portfolio ID must be a valid UUID',
      400,
      { endpoint: 'portfolio-unpublish', action: 'unpublish' },
      { providedId: id }
    );
  }

  const auth = await requireAuth(req);
  if ('error' in auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const session = auth.session;
  const userId = (session.user as any).email || session.user.id;

  const owns = await requirePortfolioOwnership(id, String(userId));
  if (!owns) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

  const p = await PortfolioService.getPortfolio(id);
  if (!p) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

  const updated = await PortfolioService.updatePortfolio(id, { is_published: false } as any);
  if (!updated)
    return NextResponse.json({ success: false, error: 'Unpublish failed' }, { status: 500 });

  return NextResponse.json({ success: true, portfolio: updated });
}

export const POST = withRateLimit(postHandler as any);

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PortfolioService } from '@/lib/portfolioService';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const p = await PortfolioService.getPortfolio(id);
  if (!p) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  if (p.user_id !== session.user.email)
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

  const updated = await PortfolioService.updatePortfolio(id, { is_published: false } as any);
  if (!updated)
    return NextResponse.json({ success: false, error: 'Unpublish failed' }, { status: 500 });

  return NextResponse.json({ success: true, portfolio: updated });
}

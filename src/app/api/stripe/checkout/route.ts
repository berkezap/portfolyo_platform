import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { stripe } from '@/lib/stripe/config';
import { PLANS } from '@/lib/stripe/plans';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, planType } = await req.json();

    if (!priceId || !planType) {
      return NextResponse.json({ error: 'Price ID and plan type are required' }, { status: 400 });
    }

    const plan = PLANS[planType as keyof typeof PLANS];
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
      metadata: {
        userId: session.user.id || session.user.email,
        planType,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id || session.user.email,
          planType,
        },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

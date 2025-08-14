import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe/config';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({
        customer: null,
        subscription: null,
        status: 'no_subscription',
      });
    }

    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json({
        customer: null,
        subscription: null,
        status: 'no_subscription',
      });
    }

    // Get active subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
        },
        subscription: null,
        status: 'no_active_subscription',
      });
    }

    const subscription = subscriptions.data[0];
    if (!subscription) {
      return NextResponse.json({
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
        },
        subscription: null,
        status: 'no_active_subscription',
      });
    }

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(
          (subscription as any).current_period_start * 1000,
        ).toISOString(),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000).toISOString(),
        plan: subscription.items.data[0]?.price,
      },
      status: 'active',
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

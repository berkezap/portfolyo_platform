import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, planType } = session.metadata || {};

  if (!userId || !planType) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  // TODO: Update user subscription in database
  console.log('Checkout completed:', {
    userId,
    planType,
    subscriptionId: session.subscription,
    customerId: session.customer,
  });

  // Here you would update your database:
  // await prisma.user.update({
  //   where: { id: userId },
  //   data: {
  //     subscriptionStatus: 'active',
  //     subscriptionId: session.subscription as string,
  //     customerId: session.customer as string,
  //     planType: planType,
  //     subscriptionCurrentPeriodEnd: new Date(
  //       subscription.current_period_end * 1000
  //     ),
  //   },
  // })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { userId } = subscription.metadata || {};

  if (!userId) {
    console.error('Missing userId in subscription metadata:', subscription.id);
    return;
  }

  console.log('Subscription updated:', {
    userId,
    subscriptionId: subscription.id,
    status: subscription.status,
  });

  // TODO: Update subscription status in database
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { userId } = subscription.metadata || {};

  if (!userId) {
    console.error('Missing userId in subscription metadata:', subscription.id);
    return;
  }

  console.log('Subscription deleted:', {
    userId,
    subscriptionId: subscription.id,
  });

  // TODO: Update user to free plan in database
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Invoice'da subscription bilgisi yok, customer üzerinden bulmalıyız
  console.log('Payment failed for customer:', invoice.customer);

  // TODO: Handle payment failure (send email, update status, etc.)
  // You would need to fetch the subscription from customer ID
}

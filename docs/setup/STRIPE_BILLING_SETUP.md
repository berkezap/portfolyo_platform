# Stripe Billing Integration Setup Guide

## Overview

This guide will help you set up the complete Stripe billing integration for your portfolio platform, following the official [Stripe Billing Quickstart](https://docs.stripe.com/billing/quickstart?client=react&lang=node).

## What's Included

✅ **Client-side Stripe integration** (`src/lib/stripe/client.ts`)
✅ **Server-side Stripe configuration** (`src/lib/stripe/config.ts`)  
✅ **Subscription checkout flow** (`src/app/api/stripe/checkout/route.ts`)
✅ **Customer portal access** (`src/app/api/stripe/customer-portal/route.ts`)
✅ **Subscription status checking** (`src/app/api/stripe/subscription/route.ts`)
✅ **Webhook handling** (`src/app/api/stripe/webhook/route.ts`)
✅ **React components** for pricing, checkout, and status
✅ **Success and cancel pages** for checkout flow

## Setup Steps

> **Security Note:** Never commit your Stripe API keys to your repository. Always store them in a `.env.local` file that is ignored by git (check your `.gitignore`).

### 1. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Add them to your `.env.local` file (make sure `.env.local` is listed in your `.gitignore` to keep your keys safe):
3. Copy your **Secret key** (starts with `sk_test_`)
4. Add them to your `.env.local` file:

### 2. Create Products and Prices

Create your subscription products in the Stripe Dashboard:

1. Go to [Products page](https://dashboard.stripe.com/products)
2. Click "Add product"
3. Create products for each plan (Pro, Premium)
4. For each product, create a **recurring price** (monthly)
5. Copy the Price IDs (start with `price_`)

### 3. Update Your Plans Configuration

Update `src/lib/stripe/plans.ts` with your actual Stripe Price IDs:

```typescript
export const PLANS: Record<PlanType, Plan> = {
  // ... other plans
  PRO: {
    // ... other properties
    priceId: 'price_1234567890abcdef', // Your actual Stripe Price ID
  },
  PREMIUM: {
    // ... other properties
    priceId: 'price_0987654321fedcba', // Your actual Stripe Price ID
  },
};
```

### 4. Set Up Webhooks

1. Go to [Webhooks page](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Use this URL: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add it to your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET="YOUR_WEBHOOK_SIGNING_SECRET_FROM_STRIPE"
```

### 5. Configure Customer Portal

1. Go to [Customer Portal settings](https://dashboard.stripe.com/settings/billing/portal)
2. Enable the portal and configure:
   - Allow customers to update payment methods
   - Allow customers to cancel subscriptions
   - Allow customers to update billing information
3. Set business information and branding

## Usage

### Basic Subscription Flow

1. **Pricing Page**: Users see plans at `/pricing`
2. **Checkout**: Click "Subscribe" → Stripe Checkout
3. **Success**: Redirect to `/checkout/success`
4. **Dashboard**: View subscription status and manage billing

### Components Available

```typescript
// Pricing page with all plans
import PricingPlans from '@/components/stripe/PricingPlans';

// Individual subscription checkout button
import SubscriptionCheckout from '@/components/stripe/SubscriptionCheckout';

// Show current subscription status
import SubscriptionStatus from '@/components/stripe/SubscriptionStatus';

// Dashboard subscription section
import DashboardSubscriptionSection from '@/components/dashboard/DashboardSubscriptionSection';
```

### API Endpoints

- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/customer-portal` - Access billing portal
- `GET /api/stripe/subscription` - Get subscription status
- `GET /api/stripe/checkout-session` - Get session details
- `POST /api/stripe/webhook` - Handle Stripe events

## Testing

### Test with Stripe Test Mode

Use these test card numbers:

- **Successful payment**: `4242424242424242`
- **Payment requires authentication**: `4000002500003155`
- **Payment fails**: `4000000000000002`

### Test Webhooks Locally

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the webhook signing secret to your `.env.local`

## Production Checklist

- [ ] Replace test keys with live keys
- [ ] Update webhook URL to production domain
- [ ] Configure proper error handling and logging
- [ ] Set up monitoring for failed payments
- [ ] Configure email notifications
- [ ] Test the complete flow in production

## Troubleshooting

### Common Issues

1. **"Invalid signature"** - Check webhook secret is correct
2. **"Price not found"** - Verify Price IDs in plans configuration
3. **"Customer not found"** - Make sure customer is created properly
4. **CORS errors** - Check API routes are properly configured

### Debug Mode

Enable detailed logging by adding to your webhook handler:

```typescript
console.log('Stripe event:', event.type, event.data.object.id);
```

## Next Steps

1. Set up your Stripe account and products
2. Update the Price IDs in your configuration
3. Test the complete flow
4. Deploy and configure production webhooks
5. Monitor your first subscriptions!

For more advanced features, check the [Stripe documentation](https://docs.stripe.com/billing).

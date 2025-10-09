export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: '$',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '3 portfolios',
      'Basic templates',
      'GitHub integration',
      'Custom subdomain',
      'Basic analytics',
    ],
    limitations: ['Limited to 3 portfolios', 'Basic templates only', 'Community support'],
    cta: 'Get Started',
    highlighted: false,
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 5,
    currency: '$',
    period: 'month',
    description: 'For professionals',
    badge: 'Coming Soon - Q2 2025',
    features: [
      'Unlimited portfolios',
      'Premium templates',
      'Custom domain support',
      'Advanced analytics',
      'Priority support',
      'Remove PortfolYO branding',
      'Export portfolio as PDF',
      'Team collaboration (soon)',
    ],
    limitations: [],
    cta: 'Join Waitlist',
    highlighted: true,
    discount: {
      text: 'Early bird: 50% off first 3 months',
      originalPrice: 10,
    },
  },
} as const;

export type PlanId = keyof typeof PLANS;

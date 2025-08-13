export type PlanType = 'FREE' | 'PRO';

export interface Plan {
  name: string;
  description: string;
  price: number;
  priceId: string | null;
  features: string[];
  maxPortfolios: number;
  customDomain: boolean;
  analytics: boolean;
  support: 'community' | 'email' | 'priority';
  popular?: boolean;
}

export const PLANS: Record<PlanType, Plan> = {
  FREE: {
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    priceId: null,
    maxPortfolios: 1,
    customDomain: false,
    analytics: false,
    support: 'community',
    features: [
      '1 PortfolYO',
      'Temel Şablonlar',
      'portfolyo.tech alt alan adı',
      'Topluluk Desteği',
      'Özelleştirme',
    ],
  },
  PRO: {
    name: 'Pro',
    description: 'For professionals and creators',
    price: 5.0,
    priceId: 'price_1RvKT0331Jb2MS8X1eWVui6t', // Gerçek Stripe Price ID
    maxPortfolios: 5,
    customDomain: true,
    analytics: true,
    support: 'email',
    popular: true,
    features: [
      '5 PortfolYO',
      'Premium Şablonlar',
      'Özel Domain',
      'Analitik Raporlar',
      'Email Destek',
      'Gelişmiş Özelleştirme',
      'SEO Optimizasyonu',
    ],
  },
};

export function getPlanByType(planType: PlanType): Plan {
  return PLANS[planType];
}

export function isPlanFeatureEnabled(planType: PlanType, feature: keyof Plan): boolean {
  const plan = getPlanByType(planType);
  return !!plan[feature];
}

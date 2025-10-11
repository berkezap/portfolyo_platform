'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DashboardHeader } from '@/components/dashboard/DashboardHeaderNew';
import { LiquidHeader } from '@/components/ui/LiquidHeader';
import { Check } from 'lucide-react';

// Plans configuration (inline to avoid dependencies)
const PLANS = {
  FREE: {
    price: 0,
    maxPortfolios: 1,
  },
  PRO: {
    price: 5.0,
    maxPortfolios: 5,
    popular: true,
  },
};

function PricingPlans() {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="py-24 px-4 max-w-4xl mx-auto">
      {/* Simple Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
          {t('pricingPage.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">{t('pricingPage.subtitle')}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          {t('pricingPage.comingSoonBadge')}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Free Plan */}
        <div className="relative">
          <div className="border border-gray-200 rounded-xl p-8 bg-white">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('pricingPage.hobbyPlan')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{t('pricingPage.hobbyDesc')}</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-semibold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">{t('pricingPage.perMonth')}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                t('pricingPage.planFeatures.free.portfolio'),
                t('pricingPage.planFeatures.free.templates'),
                t('pricingPage.planFeatures.free.subdomain'),
                t('pricingPage.planFeatures.free.support'),
                t('pricingPage.planFeatures.free.customization'),
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (!session) {
                  router.push('/');
                }
              }}
              className="w-full py-2.5 px-4 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {session ? t('pricingPage.currentPlan') : t('pricingPage.getStarted')}
            </button>
          </div>
        </div>

        {/* Pro Plan - Coming Soon */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl opacity-10"></div>
          <div className="relative border border-gray-900 rounded-xl p-8 bg-white">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                {t('pricingPage.comingSoon')}
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('pricingPage.proPlan')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{t('pricingPage.proDesc')}</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-semibold text-gray-900">${PLANS.PRO.price}</span>
                <span className="text-gray-600 ml-2">{t('pricingPage.perMonth')}</span>
              </div>
              <p className="text-xs text-blue-600 mt-2">{t('pricingPage.waitlistDiscount')}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                t('pricingPage.planFeatures.pro.portfolios'),
                t('pricingPage.planFeatures.pro.templates'),
                t('pricingPage.planFeatures.pro.domain'),
                t('pricingPage.planFeatures.pro.analytics'),
                t('pricingPage.planFeatures.pro.support'),
                t('pricingPage.planFeatures.pro.customization'),
                t('pricingPage.planFeatures.pro.seo'),
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Coming Soon Button with Email Collection */}
            <div className="space-y-3">
              <button
                onClick={async () => {
                  // Email collection modal or redirect to waitlist
                  const email = prompt(t('pricingPage.waitlistPrompt'));
                  if (email && email.includes('@')) {
                    try {
                      const response = await fetch('/api/waitlist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, feature: 'pro', source: 'pricing_page' }),
                      });
                      if (response.ok) {
                        alert(t('pricingPage.waitlistSuccess'));
                      } else {
                        alert(t('pricingPage.waitlistError'));
                      }
                    } catch (error) {
                      alert(t('pricingPage.waitlistError'));
                    }
                  }
                }}
                className="w-full py-2.5 px-4 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t('pricingPage.joinWaitlist')}
              </button>
              <p className="text-xs text-center text-gray-500">{t('pricingPage.waitlistLaunch')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Feature List */}
      <div className="border-t border-gray-200 pt-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('pricingPage.features.title')}
          </h2>
          <p className="text-gray-600">{t('pricingPage.features.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">{t('pricingPage.features.speed')}</h3>
            <p className="text-sm text-gray-600">{t('pricingPage.features.speedDesc')}</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">{t('pricingPage.features.themes')}</h3>
            <p className="text-sm text-gray-600">{t('pricingPage.features.themesDesc')}</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">{t('pricingPage.features.upToDate')}</h3>
            <p className="text-sm text-gray-600">{t('pricingPage.features.upToDateDesc')}</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              {t('pricingPage.features.mobileOptimized')}
            </h3>
            <p className="text-sm text-gray-600">{t('pricingPage.features.mobileOptimizedDesc')}</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              {t('pricingPage.features.analytics')}
            </h3>
            <p className="text-sm text-gray-600">{t('pricingPage.features.analyticsDesc')}</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              {t('pricingPage.features.customDomains')}
            </h3>
            <p className="text-sm text-gray-600">{t('pricingPage.features.customDomainsDesc')}</p>
          </div>
        </div>
      </div>

      {/* Simple FAQ */}
      <div className="border-t border-gray-200 pt-16 mt-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('pricingPage.faq.title')}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{t('pricingPage.faq.q1')}</h3>
            <p className="text-gray-600">{t('pricingPage.faq.a1')}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">{t('pricingPage.faq.q2')}</h3>
            <p className="text-gray-600">{t('pricingPage.faq.a2')}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">{t('pricingPage.faq.q3')}</h3>
            <p className="text-gray-600">{t('pricingPage.faq.a3')}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">{t('pricingPage.faq.q4')}</h3>
            <p className="text-gray-600">{t('pricingPage.faq.a4')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {session ? (
        <DashboardHeader demoMode={false} variant="transparent" />
      ) : (
        <LiquidHeader demoMode={false} variant="transparent" />
      )}

      {/* Pricing Content */}
      <div className={session ? 'pt-16' : 'pt-16'}>
        <PricingPlans />
      </div>
    </div>
  );
}

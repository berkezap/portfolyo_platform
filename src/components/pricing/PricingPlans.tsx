'use client';

import { PLANS } from '@/lib/pricing/plans';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PricingPlans() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleWaitlistSignup = async () => {
    const email = prompt(
      '🚀 Get notified when Pro launches (Q2 2025):\n\n• 50% off first 3 months\n• Premium templates\n• Custom domains\n• Advanced analytics\n\nEnter your email:',
    );
    if (email && email.includes('@')) {
      try {
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, feature: 'pro', source: 'pricing_page' }),
        });
        if (response.ok) {
          alert("🎉 Thanks! We'll notify you when Pro is ready with your early bird discount!");
        } else {
          alert('⚠️ Something went wrong, please try again later.');
        }
      } catch (error) {
        alert('⚠️ Something went wrong, please try again later.');
      }
    }
  };

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signin');
    }
  };

  return (
    <div className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start for free, upgrade when you need more power
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-shadow">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{PLANS.FREE.name}</h3>
              <p className="text-gray-600 mb-4">{PLANS.FREE.description}</p>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-gray-900">
                  {PLANS.FREE.currency}
                  {PLANS.FREE.price}
                </span>
                <span className="text-gray-600 ml-2">/{PLANS.FREE.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.FREE.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleGetStarted}
              className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              {PLANS.FREE.cta}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl border-2 border-blue-500 p-8 hover:shadow-2xl transition-shadow">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                {PLANS.PRO.badge}
              </span>
            </div>

            <div className="mb-8 pt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{PLANS.PRO.name}</h3>
              <p className="text-gray-700 mb-4">{PLANS.PRO.description}</p>

              {/* Discount Badge */}
              {PLANS.PRO.discount && (
                <div className="mb-4 p-3 bg-white rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700">Early Bird Discount</span>
                    <span className="text-sm font-bold text-blue-700">50% OFF</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{PLANS.PRO.discount.text}</p>
                </div>
              )}

              <div className="flex items-baseline">
                {PLANS.PRO.discount && (
                  <span className="text-2xl font-bold text-gray-400 line-through mr-2">
                    {PLANS.PRO.currency}
                    {PLANS.PRO.discount.originalPrice}
                  </span>
                )}
                <span className="text-5xl font-bold text-gray-900">
                  {PLANS.PRO.currency}
                  {PLANS.PRO.price}
                </span>
                <span className="text-gray-700 ml-2">/{PLANS.PRO.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.PRO.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleWaitlistSignup}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
            >
              {PLANS.PRO.cta}
            </button>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-2">Need a custom plan for your team or organization?</p>
          <a
            href="mailto:hello@portfolyo.tech"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact us →
          </a>
        </div>
      </div>
    </div>
  );
}

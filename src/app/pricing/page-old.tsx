import PricingPlans from '@/components/stripe/PricingPlans';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PricingPlans />
    </div>
  );

  const handleSubscribe = async (planType: PlanType) => {
    if (planType === 'FREE') {
      // Free plan - just redirect to dashboard
      window.location.href = '/dashboard';
      return;
    }

    try {
      setLoading(planType);

      const plan = PLANS[planType];
      if (!plan.priceId) {
        throw new Error('Price ID not found for this plan');
      }

      // Call our checkout API
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Choose Your Plan</h2>
          <p className="mt-4 text-xl text-gray-600">
            Start building your professional portfolio today
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {Object.entries(PLANS).map(([key, plan]) => {
            const planType = key as PlanType;
            const isLoading = loading === planType;

            return (
              <div
                key={planType}
                className={`border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 ${
                  plan.popular ? 'border-blue-500 relative' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-500 text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{plan.name}</h3>
                  <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-base font-medium text-gray-500">/month</span>
                    )}
                  </p>

                  <button
                    onClick={() => handleSubscribe(planType)}
                    disabled={isLoading}
                    className={`mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                  >
                    {isLoading ? 'Loading...' : plan.price === 0 ? 'Get Started' : 'Subscribe'}
                  </button>
                </div>

                <div className="pt-6 pb-8 px-6">
                  <h4 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                    What's included
                  </h4>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex space-x-3">
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

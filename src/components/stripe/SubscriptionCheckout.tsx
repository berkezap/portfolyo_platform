'use client';

import { useState } from 'react';
import { getStripe } from '@/lib/stripe/client';

interface SubscriptionCheckoutProps {
  priceId: string;
  planType: string;
  productName: string;
  price: string;
  popular?: boolean;
}

export default function SubscriptionCheckout({
  priceId,
  planType,
  productName,
  price,
  popular = false,
}: SubscriptionCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, planType }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Checkout error:', data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-2.5 px-4 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Processing...
        </div>
      ) : (
        'Get started'
      )}
    </button>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface SubscriptionData {
  customer: {
    id: string;
    email: string;
    name: string;
  } | null;
  subscription: {
    id: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    plan: any;
  } | null;
  status: string;
}

export default function SubscriptionStatus() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/stripe/subscription');
      const data = await response.json();
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!subscriptionData?.customer?.id) return;

    setPortalLoading(true);
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId: subscriptionData.customer.id }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 border rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!subscriptionData || subscriptionData.status === 'no_subscription') {
    return (
      <div className="p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
        <p className="text-gray-600 mb-4">You don't have an active subscription yet.</p>
        <a
          href="/pricing"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Plans
        </a>
      </div>
    );
  }

  if (subscriptionData.status === 'active' && subscriptionData.subscription) {
    const { subscription } = subscriptionData;
    const endDate = new Date(subscription.currentPeriodEnd);

    return (
      <div className="p-6 border rounded-lg bg-green-50 border-green-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Active Subscription</h3>
            <p className="text-green-700 mb-2">
              Status: <span className="font-medium capitalize">{subscription.status}</span>
            </p>
            <p className="text-green-700 mb-4">
              Next billing date: <span className="font-medium">{endDate.toLocaleDateString()}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>

        <button
          onClick={openCustomerPortal}
          disabled={portalLoading}
          className="w-full mt-4 bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 disabled:bg-gray-400"
        >
          {portalLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Opening...
            </div>
          ) : (
            'Manage Subscription'
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-yellow-50 border-yellow-200">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Subscription Issue</h3>
      <p className="text-yellow-700 mb-4">
        There seems to be an issue with your subscription. Please contact support.
      </p>
      <button
        onClick={openCustomerPortal}
        disabled={portalLoading}
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:bg-yellow-400"
      >
        {portalLoading ? 'Opening...' : 'Manage Subscription'}
      </button>
    </div>
  );
}

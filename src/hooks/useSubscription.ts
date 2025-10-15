'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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

export function useSubscription() {
  const { data: session } = useSession();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    fetchSubscriptionStatus();
  }, [session]);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/subscription');

      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      setSubscriptionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlan = (): 'FREE' | 'PRO' => {
    // TEST MODE: Enable PRO features for testing
    if (process.env.NEXT_PUBLIC_TEST_PRO_MODE === 'true') {
      console.log('🧪 TEST MODE: PRO features enabled');
      return 'PRO';
    }
    
    if (!subscriptionData || subscriptionData.status !== 'active') {
      return 'FREE';
    }
    return 'PRO'; // Şu an sadece Pro plan var
  };

  const hasFeature = (feature: 'customDomain' | 'analytics' | 'premiumTemplates'): boolean => {
    const currentPlan = getCurrentPlan();

    if (currentPlan === 'FREE') {
      return false;
    }

    // Pro plan tüm özelliklere sahip
    return true;
  };

  const canCreatePortfolio = (currentCount: number): boolean => {
    const currentPlan = getCurrentPlan();

    if (currentPlan === 'FREE') {
      return currentCount < 1; // Free plan: 1 portfolio
    }

    return currentCount < 5; // Pro plan: 5 portfolio
  };

  const getPortfolioLimit = (): number => {
    const currentPlan = getCurrentPlan();
    return currentPlan === 'FREE' ? 1 : 5;
  };

  return {
    subscriptionData,
    loading,
    error,
    refetch: fetchSubscriptionStatus,
    currentPlan: getCurrentPlan(),
    hasFeature,
    canCreatePortfolio,
    portfolioLimit: getPortfolioLimit(),
  };
}

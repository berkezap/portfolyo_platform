'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface SubscriptionData {
  plan: 'FREE' | 'PRO';
  isPro: boolean;
  status: string;
  endDate?: string;
}

export function useSubscription() {
  const { data: session, status: sessionStatus } = useSession();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === 'loading') {
      return; // Wait for session to load
    }

    fetchSubscriptionStatus();
  }, [session, sessionStatus]);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first (1 minute TTL)
      const cached = localStorage.getItem('subscription_cache');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        if (age < 1 * 60 * 1000) { // 1 minute
          setSubscriptionData(data);
          setLoading(false);
          return;
        }
      }

      const response = await fetch('/api/subscription/status');

      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      setSubscriptionData(data);

      // Cache the result
      localStorage.setItem('subscription_cache', JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');

      // Fallback to FREE plan on error
      setSubscriptionData({
        plan: 'FREE',
        isPro: false,
        status: 'active',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlan = (): 'FREE' | 'PRO' => {
    // Remove TEST_PRO_MODE for production
    if (!subscriptionData) {
      return 'FREE';
    }

    return subscriptionData.plan;
  };

  const isPro = (): boolean => {
    return getCurrentPlan() === 'PRO';
  };

  const hasFeature = (feature: 'customDomain' | 'analytics' | 'premiumTemplates'): boolean => {
    return isPro();
  };

  const canCreatePortfolio = (currentCount: number): boolean => {
    const currentPlan = getCurrentPlan();

    if (currentPlan === 'FREE') {
      return currentCount < 1; // Free plan: 1 portfolio
    }

    return currentCount < 5; // Pro plan: 5 portfolios
  };

  const getPortfolioLimit = (): number => {
    const currentPlan = getCurrentPlan();
    return currentPlan === 'FREE' ? 1 : 5;
  };

  const clearCache = () => {
    localStorage.removeItem('subscription_cache');
    fetchSubscriptionStatus();
  };

  return {
    subscriptionData,
    loading,
    error,
    refetch: fetchSubscriptionStatus,
    clearCache,
    currentPlan: getCurrentPlan(),
    isPro: isPro(),
    hasFeature,
    canCreatePortfolio,
    portfolioLimit: getPortfolioLimit(),
  };
}

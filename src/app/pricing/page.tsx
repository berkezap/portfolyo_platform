'use client';

import { useSession } from 'next-auth/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeaderNew';
import { LiquidHeader } from '@/components/ui/LiquidHeader';
import PricingPlans from '@/components/stripe/PricingPlans';

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

'use client';

import Link from 'next/link';

interface PortfolioLimitBannerProps {
  currentCount: number;
  maxAllowed: number;
  planType: 'FREE' | 'PRO';
}

export default function PortfolioLimitBanner({
  currentCount,
  maxAllowed,
  planType,
}: PortfolioLimitBannerProps) {
  const isAtLimit = currentCount >= maxAllowed;
  const isNearLimit = currentCount >= maxAllowed - 1;

  if (!isNearLimit) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            {isAtLimit
              ? `PortfolYO limitine ulaştınız (${currentCount}/${maxAllowed})`
              : `PortfolYO limitine yaklaştınız (${currentCount}/${maxAllowed})`}
          </h3>
        </div>
      </div>
    </div>
  );
}

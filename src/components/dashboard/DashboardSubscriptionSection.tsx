'use client';

interface DashboardSubscriptionSectionProps {
  className?: string;
}

export default function DashboardSubscriptionSection({
  className = '',
}: DashboardSubscriptionSectionProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-600"
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
            <h2 className="text-lg font-semibold text-gray-900">Account Status</h2>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Free Plan
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            You&apos;re currently using the free plan. All core features are available.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Premium features coming soon! 🚀</p>
        </div>
      </div>
    </div>
  );
}

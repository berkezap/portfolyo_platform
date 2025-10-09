'use client';

import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme İptal Edildi</h1>
          <p className="text-gray-600">
            Herhangi bir ücret tahsil edilmedi. İstediğiniz zaman tekrar deneyebilirsiniz.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/pricing"
            className="block w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Fiyatlandırmaya Dön
          </Link>
          <Link
            href="/dashboard"
            className="block w-full py-3 px-6 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300 transition-colors"
          >
            Dashboard'a Git
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">Sorularınız için: support@portfolyo.tech</p>
      </div>
    </div>
  );
}

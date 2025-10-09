'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme Başarılı! 🎉</h1>
          <p className="text-gray-600">
            Subscription aktifleştirildi. 5 saniye içinde dashboard'a yönlendirileceksiniz...
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Dashboard'a Git
          </Link>
          <Link
            href="/pricing"
            className="block w-full py-3 px-6 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300 transition-colors"
          >
            Fiyatlandırmaya Dön
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">Not: İyzico entegrasyonu hazırlanıyor</p>
      </div>
    </div>
  );
}

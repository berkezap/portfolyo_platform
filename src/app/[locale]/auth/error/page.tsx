'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const t = useTranslations('auth');
  const locale = useLocale();

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return t('configError');
      case 'AccessDenied':
        return t('accessDenied');
      case 'Verification':
        return t('verificationError');
      case 'Default':
      default:
        return t('defaultError');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('errorTitle')}</h1>

            <p className="text-gray-600 mb-8">{getErrorMessage(error)}</p>

            <div className="space-y-3">
              <Link href={`/${locale}`}>
                <Button size="lg" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  {t('backToHome')}
                </Button>
              </Link>

              <Link href="/api/auth/signin">
                <Button variant="secondary" size="lg" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('tryAgain')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthErrorFallback() {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<AuthErrorFallback />}>
      <AuthErrorContent />
    </Suspense>
  );
}

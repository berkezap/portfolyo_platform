import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, AlertCircle, Check, Globe, ExternalLink, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { useSubscription } from '@/hooks/useSubscription';
import { usePortfolioList } from '@/hooks/usePortfolioList';

interface PublishStepProps {
  loading: boolean;
  error: string | null;
  onPublish: (slug: string) => void;
  onBack: () => void;
}

export function PublishStep({ loading, error, onPublish, onBack }: PublishStepProps) {
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = useSession();
  const { canCreatePortfolio, portfolioLimit } = useSubscription();
  const { portfolios, isLoading: portfoliosLoading } = usePortfolioList(Boolean(session));
  const [slug, setSlug] = useState('');
  const [slugError, setSlugError] = useState('');
  const [checkingSlug, setCheckingSlug] = useState(false);

  const normalizeSlug = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30);
  };

  const validateSlug = (slug: string): boolean => {
    if (!slug || slug.length < 3) {
      setSlugError(t('dashboard.minChars'));
      return false;
    }
    if (slug.length > 30) {
      setSlugError(t('dashboard.maxChars'));
      return false;
    }
    const reserved = ['www', 'api', 'app', 'admin', 'static', 'cdn', 'mail', 'blog'];
    if (reserved.includes(slug)) {
      setSlugError(t('dashboard.slugReserved'));
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugError(t('dashboard.onlyLowercase'));
      return false;
    }
    setSlugError('');
    return true;
  };

  const checkSlugAvailability = useCallback(async (slug: string) => {
    if (!validateSlug(slug)) return;

    setCheckingSlug(true);
    try {
      const response = await fetch(`/api/portfolio/check-slug?slug=${slug}`);
      const data = await response.json();

      if (!data.available) {
        setSlugError(t('dashboard.slugTaken'));
      } else {
        setSlugError('');
      }
    } catch (err) {
      console.error(t('dashboard.slugCheckFailed'), err);
    }
    setCheckingSlug(false);
  }, []);

  const handleSlugChange = (value: string) => {
    const normalized = normalizeSlug(value);
    setSlug(normalized);

    if (normalized.length >= 3) {
      checkSlugAvailability(normalized);
    } else {
      setSlugError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Portfolio limit kontrolü - mevcut portfolio sayısını kontrol et
    const currentCount = portfolios?.length || 0;
    const canCreate = canCreatePortfolio(currentCount);

    if (!canCreate) {
      return; // Form submit edilmez, UI'da upgrade mesajı gösterilir
    }

    if (validateSlug(slug) && !slugError && !checkingSlug) {
      onPublish(slug);
    }
  };

  const isValid = slug.length >= 3 && !slugError && !checkingSlug;

  // Client-side environment detection
  const getEnvironmentUrl = () => {
    if (typeof window === 'undefined') return ''; // SSR guard

    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      return `http://localhost:${window.location.port || 3000}/portfolio/${slug}`;
    } else {
      // Always show production URL for preview
      return `https://${slug}.portfolyo.tech`;
    }
  };

  const isDevelopment =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const previewUrl = getEnvironmentUrl();

  // Limit kontrolü - mevcut portfolio sayısına göre
  // Portfolio listesi yüklenene kadar limit kontrolü yapma
  const currentPortfolioCount = portfolios?.length || 0;
  const hasReachedLimit = !portfoliosLoading && !canCreatePortfolio(currentPortfolioCount);

  return (
    <div className="max-w-full mx-auto">
      {/* Header Section - Kompakt */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {t('dashboard.publishTitle')}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t('dashboard.publishSubtitle')}
          </p>
        </div>
      </div>

      {/* Portfolio Limit Warning - FREE plan için */}
      {hasReachedLimit && (
        <div className="p-6 rounded-xl border-2 border-gray-200 bg-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6 text-gray-900" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Create More?
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                You've created your first portfolio! Upgrade to PRO to create up to 5 portfolios and unlock premium features.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/pricing')}
                  className="sm:flex-1"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to PRO
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onBack}
                  className="sm:w-auto"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!hasReachedLimit && (
        <div className="space-y-6">
          {/* URL Input Card */}
          <div className="p-6 rounded-xl border-2 border-gray-200 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('dashboard.portfolioWebAddress')}
                  {isDevelopment && (
                    <span className="inline-flex items-center ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      {t('dashboard.devMode')}
                    </span>
                  )}
                </label>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors">
                  <span className="text-gray-500 text-base">
                    {isDevelopment ? 'http://localhost:3000/portfolio/' : 'https://'}
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder={t('dashboard.placeholder')}
                    className="bg-transparent border-none outline-none text-gray-900 font-semibold placeholder-gray-400 min-w-0 flex-1 text-base px-1"
                    maxLength={30}
                    disabled={loading}
                    autoFocus
                  />
                  <span className="text-gray-500 text-base">{isDevelopment ? '' : '.portfolyo.tech'}</span>
                </div>

                {/* Validation State */}
                <div className="mt-3 min-h-[24px]">
                  {checkingSlug && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">{t('dashboard.checking')}</span>
                    </div>
                  )}

                  {slugError && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{slugError}</span>
                    </div>
                  )}

                  {isValid && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Perfect! This URL is available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Display - Portfolio limit için özel mesaj */}
              {error && (
                <>
                  {error.includes('FREE plan') || error.includes('portfolio') || error.includes('limit') ? (
                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-gray-900 mb-2">
                            🎉 Great Job! You've Created Your First Portfolio
                          </h4>
                          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                            Want to create more? Upgrade to PRO and unlock up to 5 portfolios, premium templates, and exclusive features!
                          </p>
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => router.push('/pricing')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            Upgrade to PRO
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-red-900 mb-1">Error</h4>
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={onBack}
                  disabled={loading}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  {t('common.back')}
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!isValid || loading}
                  className="w-full sm:flex-1 order-1 sm:order-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {t('dashboard.publishing')}
                    </>
                  ) : (
                    <>
                      <Globe className="w-5 h-5 mr-2" />
                      {t('dashboard.goLive')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Instant Live</h4>
                  <p className="text-xs text-blue-700">Your portfolio goes live immediately</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-purple-900 mb-1">Secure</h4>
                  <p className="text-xs text-purple-700">HTTPS enabled by default</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-900 mb-1">Fast & Free</h4>
                  <p className="text-xs text-green-700">No hosting fees required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

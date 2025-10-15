import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, AlertCircle, Check, Globe, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';
import ModernCard from '@/components/ui/ModernCard';

interface PublishStepProps {
  loading: boolean;
  error: string | null;
  onPublish: (slug: string) => void;
  onBack: () => void;
}

export function PublishStep({ loading, error, onPublish, onBack }: PublishStepProps) {
  const t = useTranslations();
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
    const isProduction = window.location.hostname === 'portfolyo.tech';

    if (isLocalhost) {
      return `http://localhost:${window.location.port || 3000}/portfolio/${slug}`;
    } else if (isProduction) {
      return `https://${slug}.portfolyo.tech`;
    } else {
      // Preview/Vercel environment
      return `${window.location.protocol}//${window.location.host}/portfolio/${slug}`;
    }
  };

  const isDevelopment =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const previewUrl = getEnvironmentUrl();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('dashboard.publishTitle')}</h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">{t('dashboard.publishSubtitle')}</p>
      </div>

      {/* Slug Selection Form */}
      <ModernCard variant="elevated" className="mb-6">
        <ModernCard.Content className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Preview */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('dashboard.portfolioWebAddress')}
                {isDevelopment && (
                  <span className="text-orange-600 text-xs ml-2">{t('dashboard.devMode')}</span>
                )}
                {!isDevelopment &&
                  typeof window !== 'undefined' &&
                  window.location.hostname !== 'portfolyo.tech' && (
                    <span className="text-blue-600 text-xs ml-2">Preview Mode</span>
                  )}
              </label>
              <div className="flex items-center text-lg">
                <span className="text-gray-600">
                  {isDevelopment
                    ? 'http://localhost:3000/portfolio/'
                    : typeof window !== 'undefined' && window.location.hostname === 'portfolyo.tech'
                      ? 'https://'
                      : `${typeof window !== 'undefined' ? window.location.protocol : 'https:'}//${typeof window !== 'undefined' ? window.location.host : ''}/portfolio/`}
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder={t('dashboard.placeholder')}
                  className="bg-transparent border-none outline-none text-blue-600 font-medium placeholder-gray-400 min-w-0 flex-1"
                  maxLength={30}
                  disabled={loading}
                />
                <span className="text-gray-600">
                  {isDevelopment
                    ? ''
                    : typeof window !== 'undefined' && window.location.hostname === 'portfolyo.tech'
                      ? '.portfolyo.tech'
                      : ''}
                </span>
              </div>
            </div>

            {/* Validation State */}
            <div className="min-h-[24px]">
              {checkingSlug && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{t('dashboard.checking')}</span>
                </div>
              )}

              {slugError && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{slugError}</span>
                </div>
              )}

              {isValid && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">{t('dashboard.slugAvailable')}</span>
                </div>
              )}
            </div>

            {/* Preview URL */}
            {isValid && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">
                      {t('dashboard.portfolioURL')}
                    </p>
                    <p className="text-blue-600 font-mono">{previewUrl}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onBack}
                disabled={loading}
                className="flex-1"
              >
                {t('common.back')}
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!isValid || loading}
                className="flex-1 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('dashboard.publishing')}
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    {t('dashboard.goLive')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </ModernCard.Content>
      </ModernCard>

      {/* Info */}
      <div className="text-center text-sm text-gray-500">
        <p>{t('dashboard.publishMessage')}</p>
      </div>
    </div>
  );
}

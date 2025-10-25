'use client';

import { CheckCircle2, ExternalLink, FolderOpen, Share2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useTranslations, useLocale } from 'next-intl';

interface PortfolioResult {
  success: boolean;
  html?: string;
  metadata?: {
    user: string;
    repoCount: number;
    totalStars: number;
    template: string;
  };
  error?: string;
}

interface CompletedStepProps {
  portfolioResult: PortfolioResult | null;
  demoMode: boolean;
  userName?: string;
  onNewPortfolio: () => void;
  publishedUrl?: string; // Published portfolio URL
  isDevelopment?: boolean; // Development mode indicator
  portfolioId?: string; // Portfolio ID for direct edit
}

export function CompletedStep({
  portfolioResult,
  demoMode: _demoMode,
  onNewPortfolio,
  publishedUrl,
  isDevelopment,
  portfolioId,
}: CompletedStepProps) {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const handleViewPortfolio = () => {
    console.log(
      '🎯 CompletedStep - View clicked, portfolioId:',
      portfolioId,
      'publishedUrl:',
      publishedUrl,
    );

    if (publishedUrl) {
      // Prioritize published URL if available
      console.log('🔗 Opening published URL:', publishedUrl);
      window.open(publishedUrl, '_blank');
    } else if (portfolioId) {
      // Fallback: Preview URL for drafts
      const previewUrl = `/${locale}/portfolio/${portfolioId}?preview=true&portfolio_id=${portfolioId}`;
      console.log('🔗 Opening preview URL:', previewUrl);
      window.open(previewUrl, '_blank');
    } else {
      console.error('❌ No publishedUrl or portfolioId available');
    }
  };

  const handleShare = async () => {
    const text = t('shareText');
    const url = 'https://portfolyo.dev';

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PortfolYO',
          text: text,
          url: url,
        });
      } catch (error) {
        // Share canceled veya diğer hatalar için sessizce geç
        if (error instanceof Error && error.name !== 'AbortError') {
          console.log('Share failed:', error);
        }
      }
    } else {
      // Fallback: Twitter'da paylaş
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank',
      );
    }
  };

  const handleManagePortfolios = () => {
    // Eğer portfolioId varsa direkt edit sayfasına git, yoksa portfolio listesine
    if (portfolioId) {
      window.location.href = `/${locale}/dashboard/edit/${portfolioId}`;
    } else {
      window.location.href = `/${locale}/my-portfolios`;
    }
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {portfolioResult?.success ? 'Portfolio Live' : t('operationFailed')}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {portfolioResult?.success 
              ? isDevelopment 
                ? t('portfolioPreviewReady')
                : 'Your portfolio is now live and ready to share'
              : t('somethingWentWrong')
            }
          </p>
        </div>
      </div>

      {portfolioResult?.success && (
        <div className="space-y-6">
          {/* Success Card with URL */}
          <div className="p-6 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Portfolio is Live
                </h3>
                {publishedUrl && (
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-200 mb-3">
                    <ExternalLink className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <code className="text-sm font-mono text-green-900 flex-1 break-all">
                      {publishedUrl}
                    </code>
                  </div>
                )}
                {isDevelopment && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-xs font-medium text-yellow-800">
                      {t('devModeNotPublished')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* View Portfolio */}
            <button
              onClick={handleViewPortfolio}
              className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-900 hover:shadow-lg transition-all text-left group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <ExternalLink className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">View Portfolio</h3>
              <p className="text-sm text-gray-600">See your live portfolio</p>
            </button>

            {/* Edit Portfolio */}
            <button
              onClick={handleManagePortfolios}
              className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-900 hover:shadow-lg transition-all text-left group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                <FolderOpen className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Edit Portfolio</h3>
              <p className="text-sm text-gray-600">Customize and update</p>
            </button>

            {/* Share Portfolio */}
            <button
              onClick={handleShare}
              className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-900 hover:shadow-lg transition-all text-left group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                <Share2 className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Share Portfolio</h3>
              <p className="text-sm text-gray-600">Tell the world about it</p>
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {!portfolioResult?.success && (
        <div className="p-6 rounded-xl border-2 border-red-200 bg-red-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                {t('operationFailed')}
              </h3>
              <p className="text-sm text-red-700 mb-4">{t('somethingWentWrong')}</p>
              <Button
                variant="primary"
                size="md"
                onClick={onNewPortfolio}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

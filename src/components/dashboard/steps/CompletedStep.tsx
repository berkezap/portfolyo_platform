import { CheckCircle2, ExternalLink, FolderOpen, Share2, Download } from 'lucide-react';
import Button from '@/components/ui/Button';

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
  const handleViewPortfolio = () => {
    if (publishedUrl) {
      // Published portfolio veya development preview
      window.open(publishedUrl, '_blank');
    } else if (portfolioResult?.success && portfolioResult?.html) {
      // Fallback - blob URL
      const blob = new Blob([portfolioResult.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const handleDownloadHTML = () => {
    if (portfolioResult?.success && portfolioResult?.html) {
      const blob = new Blob([portfolioResult.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleShare = async () => {
    const text = 'PortfolYO ile 5 dakikada portfolyo oluşturdum! 🚀';
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
      window.location.href = `/dashboard/edit/${portfolioId}`;
    } else {
      window.location.href = '/my-portfolios';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-6 py-6">
        <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
        {portfolioResult?.success ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tebrikler!</h2>
            {isDevelopment ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Portfolio preview hazır!</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-xs font-medium text-yellow-800">
                    🔧 Development Mode - Henüz yayınlanmadı
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Portfolyonuz başarıyla yayınlandı!</p>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">İşlem tamamlanamadı</h2>
            <p className="text-sm text-gray-500">
              Bir şeyler ters gitti. Lütfen geri dönüp yeniden deneyin.
            </p>
          </div>
        )}

        {portfolioResult?.success && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
            <Button
              variant="primary"
              size="md"
              onClick={handleViewPortfolio}
              className="flex items-center justify-center gap-2 px-6 py-3"
            >
              <ExternalLink className="w-4 h-4" />
              Gör
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleManagePortfolios}
              className="flex items-center justify-center gap-2 px-6 py-3"
            >
              <FolderOpen className="w-4 h-4" />
              Düzenle
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleDownloadHTML}
              className="flex items-center justify-center gap-2 px-6 py-3"
            >
              <Download className="w-4 h-4" />
              HTML İndir
            </Button>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2"
          >
            <Share2 className="w-4 h-4" />
            Paylaş
          </Button>

          <Button variant="secondary" size="sm" onClick={onNewPortfolio} className="px-4 py-2">
            Yeni Portfolyo
          </Button>
        </div>
      </div>
    </div>
  );
}

import { CheckCircle2, ExternalLink, FolderOpen, Share2, Download } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface PortfolioResult {
  success: boolean
  html?: string
  metadata?: {
    user: string
    repoCount: number
    totalStars: number
    template: string
  }
  error?: string
}

interface CompletedStepProps {
  portfolioResult: PortfolioResult | null
  demoMode: boolean
  userName?: string
  onNewPortfolio: () => void
}

export function CompletedStep({ 
  portfolioResult, 
  demoMode, 
  onNewPortfolio 
}: CompletedStepProps) {
  const handleViewPortfolio = () => {
    if (portfolioResult?.success && portfolioResult?.html) {
      const blob = new Blob([portfolioResult.html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    }
  }

  const handleDownloadHTML = () => {
    if (portfolioResult?.success && portfolioResult?.html) {
      const blob = new Blob([portfolioResult.html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'portfolio.html'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleShare = async () => {
    const text = 'PortfolYO ile 5 dakikada portfolyo oluşturdum! 🚀'
    const url = 'https://portfolyo.dev'
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PortfolYO',
          text: text,
          url: url
        })
      } catch (error) {
        // Share canceled veya diğer hatalar için sessizce geç
        if (error instanceof Error && error.name !== 'AbortError') {
          console.log('Share failed:', error)
        }
      }
    } else {
      // Fallback: Twitter'da paylaş
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    }
  }

  const handleManagePortfolios = () => {
    window.location.href = '/my-portfolios'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card variant="portfolio" className="mb-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Portfolyo Oluşturuldu!</h2>
            <p className="text-gray-600 text-lg">
              Tebrikler! Portfolyo siteniz başarıyla oluşturuldu{demoMode ? '' : ' ve yayında'}.
            </p>
          </div>

          {portfolioResult?.metadata && (
            <div className="bg-gray-50 rounded-lg p-4 w-full max-w-md">
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Kullanıcı:</strong> {portfolioResult.metadata.user}</p>
                <p><strong>Proje Sayısı:</strong> {portfolioResult.metadata.repoCount}</p>
                <p><strong>Toplam Yıldız:</strong> {portfolioResult.metadata.totalStars}</p>
                <p><strong>Şablon:</strong> {portfolioResult.metadata.template}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Button 
              variant="gradient-blue" 
              size="lg" 
              onClick={handleViewPortfolio}
              className="flex-1"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              {demoMode ? 'Demo Portfolyonu Görüntüle' : 'Portfolyomu Görüntüle'}
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleDownloadHTML}
              className="flex-1"
            >
              <Download className="w-5 h-5 mr-2" />
              HTML İndir
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Button 
          variant="gradient-blue" 
          onClick={handleManagePortfolios}
          className="w-full"
        >
          <FolderOpen className="w-5 h-5 mr-2" />
          Portfolyolarımı Yönet
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={handleShare}
          className="w-full"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Paylaş
        </Button>
      </div>

      <div className="flex justify-center">
        <Button 
          variant="gradient-blue" 
          onClick={onNewPortfolio}
        >
          Yeni Portfolyo Oluştur
        </Button>
      </div>

      {demoMode && (
        <Card className="mt-8">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Modu:</strong> Bu portfolyo gerçek değildir. Gerçek portfolyo oluşturmak için GitHub OAuth'u kurmanız gerekir.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
} 
import { Check, Globe } from 'lucide-react'

interface CompletedStepProps {
  demoMode: boolean
  portfolioResult: any
  portfolioError: string | null
  userName?: string
  onNewPortfolio: () => void
}

export function CompletedStep({
  demoMode,
  portfolioResult,
  portfolioError,
  userName,
  onNewPortfolio
}: CompletedStepProps) {
  return (
    <div className="text-center">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Portfolyonuz Hazır!
          </h2>
          <p className="text-gray-600 mb-6">
            Tebrikler! Portfolyo siteniz başarıyla oluşturuldu{demoMode ? '' : ' ve canlıya alındı'}.
          </p>

          {portfolioResult?.metadata && !demoMode && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Kullanıcı:</strong> {portfolioResult.metadata.user}</p>
                <p><strong>Proje Sayısı:</strong> {portfolioResult.metadata.repoCount}</p>
                <p><strong>Toplam Yıldız:</strong> {portfolioResult.metadata.totalStars}</p>
                <p><strong>Şablon:</strong> {portfolioResult.metadata.template}</p>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Portfolio siteniz:</p>
            <p className="font-mono text-blue-600 font-medium break-all">
              {demoMode 
                ? 'https://mockuser.portfolyo.dev'
                : `https://${userName?.toLowerCase().replace(/\s+/g, '')}.portfolyo.dev`
              }
            </p>
          </div>

          <div className="space-y-4">
            {demoMode ? (
              <button
                onClick={() => window.open('https://portfolyo.dev/templates/modern-demo', '_blank')}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Globe className="inline-block mr-2 h-5 w-5" />
                Demo Portfolyonu Görüntüle
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (portfolioResult?.html) {
                      const blob = new Blob([portfolioResult.html], { type: 'text/html' })
                      const url = URL.createObjectURL(blob)
                      window.open(url, '_blank')
                    }
                  }}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Globe className="inline-block mr-2 h-5 w-5" />
                  Portfolyonu Önizle
                </button>
                
                <button
                  onClick={() => {
                    if (portfolioResult?.html) {
                      const blob = new Blob([portfolioResult.html], { type: 'text/html' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'portfolio.html'
                      a.click()
                      URL.revokeObjectURL(url)
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  📥 HTML İndir
                </button>
              </>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.open('https://twitter.com/intent/tweet?text=PortfolYO ile 5 dakikada portfolyo oluşturdum! 🚀', '_blank')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                📢 Paylaş
              </button>
              <button
                onClick={onNewPortfolio}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🔄 Yeni Portfolyo
              </button>
            </div>
          </div>

          {demoMode && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Modu:</strong> Bu portfolyo gerçek değildir. Gerçek portfolyo oluşturmak için GitHub OAuth'u kurmanız gerekir.
              </p>
            </div>
          )}

          {portfolioError && !demoMode && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Hata:</strong> {portfolioError}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
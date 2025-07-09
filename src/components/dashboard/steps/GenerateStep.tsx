interface GenerateStepProps {
  selectedReposCount: number
  demoMode: boolean
  portfolioLoading: boolean
  portfolioResult: any
  portfolioError: string | null
  onBack: () => void
}

export function GenerateStep({
  selectedReposCount,
  demoMode,
  portfolioLoading,
  portfolioResult,
  portfolioError,
  onBack
}: GenerateStepProps) {
  return (
    <div className="text-center">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          {portfolioError && !demoMode ? (
            // Error state
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Portfolyo Oluşturulamadı
              </h2>
              <p className="text-red-600 mb-6">
                {portfolioError}
              </p>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Geri Dön
              </button>
            </>
          ) : (
            // Loading state
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Portfolyonuz Oluşturuluyor...
              </h2>
              <p className="text-gray-600 mb-6">
                {demoMode 
                  ? `Seçtiğiniz ${selectedReposCount} proje ve şablon kullanılarak portfolyo sitesi hazırlanıyor.`
                  : `Seçtiğiniz ${selectedReposCount} proje ve şablon kullanılarak gerçek portfolyo sitesi hazırlanıyor.`
                }
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                {demoMode ? (
                  <>
                    <p>✅ GitHub verileriniz çekiliyor...</p>
                    <p>✅ Şablon uygulanıyor...</p>
                    <p>⏳ Statik site oluşturuluyor...</p>
                    <p>⏳ Canlıya alınıyor...</p>
                  </>
                ) : (
                  <>
                    <p>✅ GitHub verileriniz çekiliyor...</p>
                    <p>{portfolioLoading ? '⏳' : '✅'} Şablon uygulanıyor...</p>
                    <p>{portfolioResult ? '✅' : '⏳'} HTML oluşturuluyor...</p>
                    <p>⏳ İşlem tamamlanıyor...</p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 
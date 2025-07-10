import { RefreshCw, Github, Lock, BookOpen, AlertCircle } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { RepositoryGridSkeleton } from '@/components/ui/Skeleton'

interface RepositorySelectionProps {
  repos: any[]
  selectedRepos: number[]
  onToggleRepo: (repoId: number) => void
  onNext: () => void
  demoMode: boolean
  loading: boolean
  error: string | null
  onRefetch: () => void
}

export function RepositorySelection({
  repos,
  selectedRepos,
  onToggleRepo,
  onNext,
  demoMode,
  loading,
  error,
  onRefetch
}: RepositorySelectionProps) {
  
  // Simplified state management
  const [renderKey, setRenderKey] = useState(0)
  const [hasShownRepos, setHasShownRepos] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Mark component as mounted
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Optimized repos update effect - LOG ONLY ONCE
  useEffect(() => {
    if (repos.length > 0 && !hasShownRepos) {
      setRenderKey(prev => prev + 1)
      setHasShownRepos(true)
      // Only log the important change
      console.log('✅ Repos loaded:', repos.length)
    }
  }, [repos.length, hasShownRepos])
  
  // Auto-refetch fallback (only once)
  useEffect(() => {
    if (mounted && !loading && repos.length === 0 && !error && !hasShownRepos) {
      const timer = setTimeout(() => {
        console.log('🔄 Auto refetch')
        onRefetch()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [mounted, loading, repos.length, error, hasShownRepos, onRefetch])
  
  // Simple & Fast
  const hasRepos = repos.length > 0
  const isLoading = loading || (!hasRepos && !error && !hasShownRepos)

  // Show repos immediately if we have them
  if (hasRepos) {
    return (
      <div className="max-w-6xl mx-auto" key={`repos-${renderKey}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Projelerinizi Seçin ({selectedRepos.length} seçili)
          </h1>
          <p className="text-gray-600">
            Portfolio sitenizde gösterilecek GitHub projelerini seçin
          </p>
          {demoMode && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm">
              🎭 Demo Mode: Örnek projeler gösteriliyor
            </div>
          )}
        </div>

        {/* Repository Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedRepos.includes(repo.id)
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onToggleRepo(repo.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 break-words leading-tight">
                    {repo.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 break-words leading-relaxed min-h-[3rem]">
                    {repo.description || 'No description available'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedRepos.includes(repo.id)}
                  onChange={() => {}}
                  className="h-5 w-5 text-blue-600 rounded ml-4 mt-1 flex-shrink-0"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
                  {repo.language || 'Unknown'}
                </span>
                <div className="flex items-center space-x-4 text-gray-500">
                  <span className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center">
                    <span className="text-blue-500 mr-1">🍴</span>
                    {repo.forks_count}
                  </span>
                </div>
              </div>

              {selectedRepos.includes(repo.id) && (
                <div className="mt-4 flex items-center justify-center">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    ✓ Seçili
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selection Summary and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Seçim Özeti
              </h3>
              <p className="text-gray-600">
                {selectedRepos.length} proje seçildi
              </p>
            </div>
            {selectedRepos.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-green-600 font-medium">
                  ✓ Portfolyo oluşturmaya hazır
                </p>
              </div>
            )}
          </div>

          {selectedRepos.length === 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 text-sm">
                  En az bir proje seçmelisiniz
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={onNext}
              disabled={selectedRepos.length === 0}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Devam Et ({selectedRepos.length} proje)
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Loading State with Skeleton
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Projelerinizi Seçin
          </h1>
          <p className="text-gray-600">
            Portfolio sitenizde gösterilecek GitHub projelerini seçin
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">GitHub projeleriniz yükleniyor...</span>
          </div>
        </div>
        
        <RepositoryGridSkeleton count={6} />
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Projelerinizi Seçin
          </h1>
          <p className="text-gray-600">
            Portfolio sitenizde gösterilecek GitHub projelerini seçin
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">GitHub Bağlantı Hatası</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          <button
            onClick={onRefetch}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Yeniden Deniyor...' : 'Tekrar Dene'}
          </button>
        </div>
      </div>
    )
  }

  // Empty State
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Projelerinizi Seçin
        </h1>
        <p className="text-gray-600">
          Portfolio sitenizde gösterilecek GitHub projelerini seçin
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 border border-orange-200">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Github className="h-10 w-10 text-orange-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Henüz Public Projeniz Yok
          </h2>
          
          <p className="text-gray-600 mb-6">
            Portfolio oluşturmak için en az bir public GitHub projeniz olması gerekiyor.
          </p>

          <div className="space-y-3">
            <button
              onClick={onRefetch}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Yeniden Kontrol Ediliyor...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Projeleri Yeniden Yükle
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
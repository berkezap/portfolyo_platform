import { RefreshCw, Github, AlertCircle, Star, GitBranch } from 'lucide-react'
import { useState, useEffect } from 'react'
import { RepositoryGridSkeleton } from '@/components/ui/Skeleton'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  html_url: string
  created_at: string | null
  updated_at: string | null
  topics: string[]
  homepage: string | null
}

interface RepositorySelectionProps {
  repos: GitHubRepo[]
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
  const [renderKey, setRenderKey] = useState(0)
  const [hasShownRepos, setHasShownRepos] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (repos.length > 0 && !hasShownRepos) {
      setRenderKey(prev => prev + 1)
      setHasShownRepos(true)
    }
  }, [repos.length, hasShownRepos])
  useEffect(() => {
    if (mounted && !loading && repos.length === 0 && !error && !hasShownRepos) {
      const timer = setTimeout(() => { onRefetch() }, 2000)
      return () => clearTimeout(timer)
    }
  }, [mounted, loading, repos.length, error, hasShownRepos, onRefetch])

  const hasRepos = repos.length > 0
  const isLoading = loading || (!hasRepos && !error && !hasShownRepos)

  if (hasRepos) {
    return (
      <div className="max-w-6xl mx-auto" key={`repos-${renderKey}`}>  
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Projelerinizi Seçin</h1>
          <div className="flex justify-center items-center mb-2">
            <span className="inline-block text-blue-600 bg-blue-50 rounded-full px-4 py-1 text-base font-semibold shadow-sm">
              {selectedRepos.length} seçili
            </span>
          </div>
          <p className="text-gray-500 text-base">Portfolio sitenizde gösterilecek GitHub projelerini seçin</p>
          {demoMode && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
              Demo Modu: Örnek projeler gösteriliyor
            </div>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className={`group transition-all duration-200 shadow-sm hover:shadow-lg rounded-xl p-6 bg-white flex flex-col gap-3 cursor-pointer ${
                selectedRepos.includes(repo.id) 
                  ? 'border-2 border-blue-500' 
                  : 'border border-gray-200'
              }`}
              onClick={() => onToggleRepo(repo.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base font-semibold text-gray-900 truncate">{repo.name}</span>
                <span className="ml-auto text-xs text-gray-400">{repo.language || 'Unknown'}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{repo.description || 'No description available'}</p>
              <div className="flex items-center gap-4 mt-auto">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Star className="w-4 h-4" /> {repo.stargazers_count}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <GitBranch className="w-4 h-4" /> {repo.forks_count}
                </span>
                <span className={`ml-auto text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
                  selectedRepos.includes(repo.id) 
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {selectedRepos.includes(repo.id) ? '✓ Seçili' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 mt-12 mb-8">
          {selectedRepos.length === 0 && (
            <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm font-medium">
              <AlertCircle className="h-5 w-5" /> En az bir proje seçmelisiniz
            </div>
          )}
          <Button
            onClick={onNext}
            disabled={selectedRepos.length === 0}
            size="lg"
            variant="gradient-blue"
            className="w-full max-w-xs"
          >
            Devam Et ({selectedRepos.length} proje)
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projelerinizi Seçin</h1>
          <p className="text-gray-500">Portfolio sitenizde gösterilecek GitHub projelerini seçin</p>
          <div className="mt-4 inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">GitHub projeleriniz yükleniyor...</span>
          </div>
        </div>
        <RepositoryGridSkeleton count={6} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projelerinizi Seçin</h1>
          <p className="text-gray-500">Portfolio sitenizde gösterilecek GitHub projelerini seçin</p>
        </div>
        <Card className="mb-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold text-sm mb-1">
                {error.includes('rate limit') ? 'GitHub API Rate Limit' : 'Hata'}
              </h3>
              <p className="text-red-700 text-sm mb-3">{error}</p>
              {error.includes('rate limit') ? (
                <div className="space-y-2">
                  <p className="text-red-600 text-xs">
                    GitHub API'ye çok fazla istek gönderildi. Lütfen birkaç dakika bekleyin.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={(e) => {
                        e.preventDefault()
                        onRefetch()
                      }}
                      variant="secondary"
                      icon={RefreshCw}
                      size="sm"
                      disabled={loading}
                    >
                      Tekrar Dene
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.preventDefault()
                        // Cache'i temizle ve tekrar dene
                        window.location.reload()
                      }}
                      variant="secondary"
                      size="sm"
                    >
                      Sayfayı Yenile
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={(e) => {
                    e.preventDefault()
                    onRefetch()
                  }}
                  variant="secondary"
                  icon={RefreshCw}
                  size="sm"
                >
                  Tekrar Dene
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Empty State
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projelerinizi Seçin</h1>
        <p className="text-gray-500">Portfolio sitenizde gösterilecek GitHub projelerini seçin</p>
      </div>
      <Card className="p-8 text-center border-orange-200">
        <div className="flex flex-col items-center mb-6">
          <Github className="h-10 w-10 text-orange-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Henüz Public Projeniz Yok</h2>
          <p className="text-gray-500 mb-4">Portfolio oluşturmak için en az bir public GitHub projeniz olması gerekiyor.</p>
        </div>
        <Button onClick={onRefetch} disabled={loading} size="md" className="w-full max-w-xs mx-auto">
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
        </Button>
      </Card>
    </div>
  )
} 
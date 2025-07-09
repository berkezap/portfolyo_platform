import { Star, RefreshCw } from 'lucide-react'
import { GitHubRepo } from '@/types/dashboard'

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
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Projelerinizi Seçin
        </h1>
        <p className="text-gray-600 mb-4">
          Portfolyonuzda göstermek istediğiniz 4-6 projeyi seçin. En iyi projelerinizi seçmenizi öneririz.
        </p>
        
        {!demoMode && (
          <div className="flex items-center justify-center space-x-4">
            {loading && (
              <div className="flex items-center text-blue-600">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                GitHub'dan projeler yükleniyor...
              </div>
            )}
            {error && (
              <div className="text-red-600 text-sm">
                Hata: {error} 
                <button 
                  onClick={onRefetch}
                  className="ml-2 text-blue-600 hover:text-blue-700 underline"
                >
                  Tekrar Dene
                </button>
              </div>
            )}
            {!loading && !error && repos.length === 0 && (
              <div className="text-gray-500 text-sm">
                Hiç public repository bulunamadı
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading && !demoMode ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg border-2 border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          repos.map((repo) => (
          <div
            key={repo.id}
            className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedRepos.includes(repo.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onToggleRepo(repo.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 truncate">{repo.name}</h3>
              <input
                type="checkbox"
                checked={selectedRepos.includes(repo.id)}
                onChange={() => {}}
                className="h-5 w-5 text-blue-600 rounded"
              />
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {repo.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  repo.language === 'TypeScript' ? 'bg-blue-500' :
                  repo.language === 'JavaScript' ? 'bg-yellow-500' :
                  repo.language === 'Python' ? 'bg-green-500' : 'bg-gray-500'
                }`}></div>
                {repo.language}
              </span>
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                {repo.stargazers_count}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {repo.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
          ))
        )}
      </div>

      <div className="text-center">
        <button
          onClick={onNext}
          disabled={selectedRepos.length === 0}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Devam Et ({selectedRepos.length} proje seçildi)
        </button>
      </div>
    </div>
  )
} 
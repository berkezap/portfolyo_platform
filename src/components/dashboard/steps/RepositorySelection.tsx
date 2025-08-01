import { RefreshCw, Github, AlertCircle, Star, GitBranch } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RepositoryGridSkeleton } from '@/components/ui/Skeleton';
import ModernCard from '@/components/ui/ModernCard';
import ButtonNew from '@/components/ui/ButtonNew';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  created_at: string | null;
  updated_at: string | null;
  topics: string[];
  homepage: string | null;
}

interface RepositorySelectionProps {
  repos: GitHubRepo[];
  selectedRepos: number[];
  onToggleRepo: (repoId: number) => void;
  onNext: () => void;
  demoMode: boolean;
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
}

export function RepositorySelection({
  repos,
  selectedRepos,
  onToggleRepo,
  onNext,
  demoMode,
  loading,
  error,
  onRefetch,
}: RepositorySelectionProps) {
  const [renderKey, setRenderKey] = useState(0);
  const [hasShownRepos, setHasShownRepos] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (repos.length > 0 && !hasShownRepos) {
      setRenderKey((prev) => prev + 1);
      setHasShownRepos(true);
    }
  }, [repos.length, hasShownRepos]);
  useEffect(() => {
    if (mounted && !loading && repos.length === 0 && !error && !hasShownRepos) {
      const timer = setTimeout(() => {
        onRefetch();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mounted, loading, repos.length, error, hasShownRepos, onRefetch]);

  const hasRepos = repos.length > 0;
  const isLoading = loading || (!hasRepos && !error && !hasShownRepos);

  if (hasRepos) {
    return (
      <div className="max-w-full mx-auto" key={`repos-${renderKey}`}>
        {/* Hero Section - Daha geniş boşluklar */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
            Projelerinizi Seçin
          </h1>
          <div className="flex justify-center items-center mb-2">
            <span className="inline-block text-blue-600 bg-blue-50 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm">
              {selectedRepos.length} seçili
            </span>
          </div>
          <p className="text-gray-500 text-sm max-w-xl mx-auto leading-normal">
            Portfolio sitenizde gösterilecek GitHub projelerini seçin
          </p>
          {demoMode && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-medium border border-purple-200">
              Demo Modu: Örnek projeler gösteriliyor
            </div>
          )}
        </div>

        {/* Repository Grid - Daha geniş boşluklar */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {repos.map((repo) => (
            <ModernCard
              key={repo.id}
              variant={selectedRepos.includes(repo.id) ? 'elevated' : 'glass'}
              className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                selectedRepos.includes(repo.id)
                  ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => onToggleRepo(repo.id)}
            >
              <ModernCard.Header className="pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">{repo.name}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {repo.language || 'Unknown'}
                  </span>
                </div>
              </ModernCard.Header>

              <ModernCard.Content className="pt-0">
                <p className="text-gray-600 line-clamp-2 mb-6 leading-relaxed">
                  {repo.description || 'No description available'}
                </p>

                <div className="flex items-center gap-6">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Star className="w-4 h-4" /> {repo.stargazers_count}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" /> {repo.forks_count}
                  </span>
                  {selectedRepos.includes(repo.id) && (
                    <span className="ml-auto text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                      ✓ Seçili
                    </span>
                  )}
                </div>
              </ModernCard.Content>
            </ModernCard>
          ))}
        </div>

        {/* Action Section - Daha geniş boşluklar */}
        <div className="flex flex-col items-center gap-6 mt-20 mb-12">
          {selectedRepos.length === 0 && (
            <div className="flex items-center gap-3 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-4 text-base font-medium">
              <AlertCircle className="h-6 w-6" /> En az bir proje seçmelisiniz
            </div>
          )}
          <ButtonNew
            onClick={onNext}
            disabled={selectedRepos.length === 0}
            size="lg"
            variant="primary"
            className="w-full max-w-sm text-lg py-4"
          >
            Devam Et ({selectedRepos.length} proje)
          </ButtonNew>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-full mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Projelerinizi Seçin</h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Portfolio sitenizde gösterilecek GitHub projelerini seçin
          </p>
          <div className="mt-8 inline-flex items-center space-x-3 text-blue-600 bg-blue-50 px-6 py-3 rounded-xl">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-base font-medium">GitHub projeleriniz yükleniyor...</span>
          </div>
        </div>
        <RepositoryGridSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projelerinizi Seçin</h1>
          <p className="text-gray-500">Portfolio sitenizde gösterilecek GitHub projelerini seçin</p>
        </div>
        <ModernCard variant="elevated" className="mb-8 border-red-200 bg-red-50">
          <ModernCard.Content>
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-sm mb-1">
                  {error.includes('rate limit') ? 'GitHub API Rate Limit' : 'Hata'}
                </h3>
                <p className="text-red-700 text-sm mb-3">{error}</p>
                {error.includes('rate limit') ? (
                  <div className="space-y-3">
                    <p className="text-red-600 text-xs">
                      GitHub API&apos;ye çok fazla istek gönderildi. Lütfen birkaç dakika bekleyin.
                    </p>
                    <div className="flex gap-2">
                      <ButtonNew
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          onRefetch();
                        }}
                        variant="secondary"
                        size="sm"
                        disabled={loading}
                        className="!text-red-700 !border-red-300 hover:!bg-red-100"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tekrar Dene
                      </ButtonNew>
                      <ButtonNew
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          window.location.reload();
                        }}
                        variant="secondary"
                        size="sm"
                        className="!text-red-700 !border-red-300 hover:!bg-red-100"
                      >
                        Sayfayı Yenile
                      </ButtonNew>
                    </div>
                  </div>
                ) : (
                  <ButtonNew
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      onRefetch();
                    }}
                    variant="secondary"
                    size="sm"
                    className="!text-red-700 !border-red-300 hover:!bg-red-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tekrar Dene
                  </ButtonNew>
                )}
              </div>
            </div>
          </ModernCard.Content>
        </ModernCard>
      </div>
    );
  }

  // Empty State
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projelerinizi Seçin</h1>
        <p className="text-gray-500">Portfolio sitenizde gösterilecek GitHub projelerini seçin</p>
      </div>
      <ModernCard variant="elevated" className="text-center border-orange-200 bg-orange-50">
        <ModernCard.Content className="p-8">
          <div className="flex flex-col items-center mb-6">
            <Github className="h-10 w-10 text-orange-600 mb-2" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Henüz Public Projeniz Yok</h2>
            <p className="text-gray-500 mb-4">
              Portfolio oluşturmak için en az bir public GitHub projeniz olması gerekiyor.
            </p>
          </div>
          <ButtonNew
            onClick={onRefetch}
            disabled={loading}
            size="md"
            variant="primary"
            className="w-full max-w-xs mx-auto"
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
          </ButtonNew>
        </ModernCard.Content>
      </ModernCard>
    </div>
  );
}

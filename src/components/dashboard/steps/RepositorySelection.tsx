import { RefreshCw, FolderGit2, AlertCircle, Star, GitBranch } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RepositoryGridSkeleton } from '@/components/ui/Skeleton';
import ModernCard from '@/components/ui/ModernCard';
import Button from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations();
  const [renderKey, setRenderKey] = useState(0);
  const [hasShownRepos, setHasShownRepos] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const REPOS_PER_PAGE = 9;

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

  // Pagination logic
  const totalPages = Math.ceil(repos.length / REPOS_PER_PAGE);
  const startIndex = (currentPage - 1) * REPOS_PER_PAGE;
  const endIndex = startIndex + REPOS_PER_PAGE;
  const currentRepos = repos.slice(startIndex, endIndex);

  if (hasRepos) {
    return (
      <div className="max-w-full mx-auto" key={`repos-${renderKey}`}>
        {/* Hero Section - Kompakt */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {t('dashboard.selectRepos')}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {t('dashboard.selectReposDesc')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {demoMode && (
              <span className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-200">
                Demo Mode
              </span>
            )}
            <span className="inline-flex items-center text-gray-900 bg-gray-100 rounded-lg px-3 py-1.5 text-sm font-medium">
              {selectedRepos.length} {t('dashboard.selected')}
            </span>
          </div>
        </div>

        {/* Repository Grid - Auto-fit for last page */}
        <div className={`grid gap-4 mb-6 ${
          currentRepos.length >= 6 
            ? 'md:grid-cols-2 lg:grid-cols-3' 
            : currentRepos.length >= 3
            ? 'md:grid-cols-2 lg:grid-cols-3'
            : 'md:grid-cols-2'
        }`}>
          {currentRepos.map((repo) => (
            <div
              key={repo.id}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col
                ${selectedRepos.includes(repo.id)
                  ? 'border-gray-900 bg-white shadow-lg ring-2 ring-gray-900 ring-offset-2'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
              onClick={() => onToggleRepo(repo.id)}
            >
              {selectedRepos.includes(repo.id) && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center z-10 shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-900 truncate flex-1 mr-2">{repo.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md whitespace-nowrap">
                  {repo.language || 'Unknown'}
                </span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed flex-1">
                {repo.description || 'No description available'}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" /> {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch className="w-4 h-4" /> {repo.forks_count}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mb-6">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="secondary"
              size="sm"
              className="!px-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <span className="text-sm text-gray-600 font-medium min-w-[3rem] text-center">
              {currentPage}/{totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="secondary"
              size="sm"
              className="!px-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        )}

        {/* Action Section */}
        <div className="flex flex-col items-center gap-3 mt-4">
          {selectedRepos.length === 0 && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {t('dashboard.selectAtLeastOneRepo')}
            </div>
          )}
          <Button
            onClick={onNext}
            disabled={selectedRepos.length === 0}
            size="lg"
            variant="primary"
            className="w-full max-w-sm"
          >
            {t('dashboard.continue')}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-full mx-auto">
        {/* Kompakt Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {t('dashboard.selectRepos')}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {t('dashboard.selectReposDesc')}
            </p>
          </div>
        </div>
        
        {/* Loading Indicator - Kompakt */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200 mb-6">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm text-blue-700">{t('dashboard.reposLoading')}</span>
        </div>
        
        <RepositoryGridSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.selectRepos')}</h1>
          <p className="text-gray-500">{t('dashboard.selectReposDesc')}</p>
        </div>
        <ModernCard variant="elevated" className="mb-8 border-red-200 bg-red-50">
          <ModernCard.Content>
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-sm mb-1">
                  {error.includes('rate limit') ? 'GitHub API Rate Limit' : 'Error'}
                </h3>
                <p className="text-red-700 text-sm mb-3">{error}</p>
                {error.includes('rate limit') ? (
                  <div className="space-y-3">
                    <p className="text-red-600 text-xs">
                      Too many requests to GitHub API. Please wait a few minutes.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          onRefetch();
                        }}
                        variant="secondary"
                        size="sm"
                        disabled={loading}
                        icon={RefreshCw}
                      >
                        Retry
                      </Button>
                      <Button
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          window.location.reload();
                        }}
                        variant="secondary"
                        size="sm"
                      >
                        Refresh Page
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      onRefetch();
                    }}
                    variant="secondary"
                    size="sm"
                    disabled={loading}
                    icon={RefreshCw}
                  >
                    Try Again
                  </Button>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.selectRepos')}</h1>
        <p className="text-gray-500">{t('dashboard.selectReposDesc')}</p>
      </div>
      <ModernCard variant="elevated" className="text-center border-orange-200 bg-orange-50">
        <ModernCard.Content className="p-8">
          <div className="flex flex-col items-center mb-6">
            <FolderGit2 className="h-10 w-10 text-orange-600 mb-2" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Public Repositories Found</h2>
            <p className="text-gray-500 mb-4">{t('dashboard.noRepos')}</p>
          </div>
          <Button
            onClick={onRefetch}
            disabled={loading}
            size="md"
            variant="primary"
            className="w-full max-w-xs mx-auto"
            icon={loading ? undefined : RefreshCw}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Refreshing...
              </span>
            ) : (
              'Reload Repositories'
            )}
          </Button>
        </ModernCard.Content>
      </ModernCard>
    </div>
  );
}

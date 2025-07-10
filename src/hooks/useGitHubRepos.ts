import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { GitHubRepo } from '@/lib/github'

// GitHub repos fetch function
const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  console.log('🔗 GitHub Repos API endpoint hit')
  
  const response = await fetch('/api/github/repos', {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw new Error('GitHub oturumunuz sona erdi. Lütfen çıkış yapıp tekrar giriş yapın.')
      case 403:
        throw new Error('GitHub API limiti aşıldı. Lütfen biraz bekleyip tekrar deneyin.')
      case 429:
        throw new Error('Çok fazla istek gönderildi. Lütfen biraz bekleyip tekrar deneyin.')
      case 500:
      case 502:
      case 503:
      case 504:
        throw new Error('GitHub servisleri şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.')
      default:
        throw new Error(`GitHub API hatası (${response.status}). Lütfen tekrar deneyin.`)
    }
  }

  const data = await response.json()
  
  if (!data.repos || !Array.isArray(data.repos)) {
    console.error('📋 Invalid data from GitHub API:', data)
    throw new Error('GitHub API\'dan geçersiz veri alındı.')
  }

  console.log('✅ GitHub API response:', {
    repoCount: data.repos.length,
    firstRepo: data.repos[0]?.name,
    sampleRepos: data.repos.slice(0, 3).map((repo: GitHubRepo) => ({
      name: repo.name,
      language: repo.language
    }))
  })

  return data.repos
}

export function useGitHubRepos() {
  const { data: session, status } = useSession()
  
  const queryResult = useQuery({
    queryKey: ['github-repos', session?.user?.email],
    queryFn: fetchGitHubRepos,
    enabled: status === 'authenticated' && !!session?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && (
        error.message.includes('401') || 
        error.message.includes('403')
      )) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  return {
    repos: queryResult.data || [],
    loading: queryResult.isLoading,
    error: queryResult.error?.message || null,
    refetch: queryResult.refetch,
    isRetrying: queryResult.isRefetching,
    initialLoad: queryResult.isLoading && !queryResult.data,
    // React Query specific states
    isFetching: queryResult.isFetching,
    isStale: queryResult.isStale,
    dataUpdatedAt: queryResult.dataUpdatedAt,
  }
} 
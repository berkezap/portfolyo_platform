import { useQuery } from '@tanstack/react-query'
import { GitHubRepo } from '@/types/github'

const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  const response = await fetch('/api/github/repos')
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    
    // Rate limit hatası için özel mesaj
    if (response.status === 429) {
      throw new Error('GitHub API rate limit exceeded. Please wait a few minutes and try again.')
    }
    
    throw new Error(errorData.error || 'Failed to fetch GitHub repositories')
  }
  const data = await response.json()
  return data.repos || []
}

export function useGitHubRepos() {
  return useQuery<GitHubRepo[], Error>({
    queryKey: ['githubRepos'],
    queryFn: fetchGitHubRepos,
    staleTime: 5 * 60 * 1000, // 5 dakika boyunca fresh kabul et (cache ile uyumlu)
    gcTime: 10 * 60 * 1000, // 10 dakika cache'de tut
    refetchOnWindowFocus: false, // Gereksiz refetch'i engelle
    refetchOnMount: false, // Component mount olduğunda refetch etme
    retry: (failureCount, error) => {
      // Rate limit hatası ise retry etme
      if (error.message.includes('rate limit')) {
        return false
      }
      // Diğer hatalar için sadece 1 kez retry et
      return failureCount < 1
    },
    retryDelay: 2000, // 2 saniye bekle
  })
} 
import { useQuery } from '@tanstack/react-query'
import { GitHubRepo } from '@/types/github'

const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  const response = await fetch('/api/github/repos')
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch GitHub repositories')
  }
  const data = await response.json()
  return data.repos || []
}

export function useGitHubRepos() {
  return useQuery<GitHubRepo[], Error>({
    queryKey: ['githubRepos'],
    queryFn: fetchGitHubRepos,
    staleTime: 30 * 60 * 1000, // 30 dakika boyunca fresh kabul et (10'dan 30'a çıkardık)
    gcTime: 60 * 60 * 1000, // 1 saat cache'de tut (30'dan 60'a çıkardık)
    refetchOnWindowFocus: false, // Gereksiz refetch'i engelle
    refetchOnMount: false, // Component mount olduğunda refetch etme
    retry: 1, // Sadece 1 kez retry et (varsayılan 3'ten 1'e düşürdük)
    retryDelay: 1000, // 1 saniye bekle
  })
} 
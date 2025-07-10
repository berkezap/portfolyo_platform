import { useQuery } from '@tanstack/react-query'
import { GitHubRepo } from '@/lib/github'

const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  const response = await fetch('/api/github/repos')
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch GitHub repositories')
  }
  const data = await response.json()
  return data.repos || [] // Ensure we return an array, even if data.repos is undefined
}

export function useGitHubRepos() {
  return useQuery<GitHubRepo[], Error>({
    queryKey: ['githubRepos'],
    queryFn: fetchGitHubRepos,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
} 
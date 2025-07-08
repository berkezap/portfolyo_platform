import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { GitHubRepo } from '@/lib/github'

export function useGitHubRepos() {
  const { data: session, status } = useSession()
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchRepos()
    }
  }, [session, status])

  const fetchRepos = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/github/repos')
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories')
      }
      
      const data = await response.json()
      setRepos(data.repos || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching repos:', err)
    } finally {
      setLoading(false)
    }
  }

  return { repos, loading, error, refetch: fetchRepos }
} 
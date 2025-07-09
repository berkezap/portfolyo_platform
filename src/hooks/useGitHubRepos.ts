import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { GitHubRepo } from '@/lib/github'

// Global cache for GitHub repos (5 minute cache)
const reposCache = new Map<string, { data: GitHubRepo[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useGitHubRepos() {
  const { data: session, status } = useSession()
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchingRef = useRef(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchRepos()
    }
  }, [session, status])

  const fetchRepos = async (force = false) => {
    if (fetchingRef.current && !force) {
      console.log('📋 GitHub repos fetch already in progress, skipping...')
      return // Prevent multiple simultaneous requests
    }
    
    const cacheKey = session?.user?.email || 'default'
    const cached = reposCache.get(cacheKey)
    
    // Use cache if valid and not forced
    if (!force && cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('📋 Using cached GitHub repos')
      setRepos(cached.data)
      return
    }
    
    fetchingRef.current = true
    setLoading(true)
    setError(null)
    
    try {
      console.log('📋 Fetching fresh GitHub repos from API')
      const response = await fetch('/api/github/repos')
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories')
      }
      
      const data = await response.json()
      const repoData = data.repos || []
      
      // Update cache
      reposCache.set(cacheKey, {
        data: repoData,
        timestamp: Date.now()
      })
      
      setRepos(repoData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching repos:', err)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  return { repos, loading, error, refetch: () => fetchRepos(true) }
} 
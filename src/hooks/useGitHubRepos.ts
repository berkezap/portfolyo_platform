import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { GitHubRepo } from '@/lib/github'

// Global cache for GitHub repos (5 minute cache)
const reposCache = new Map<string, { data: GitHubRepo[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const REQUEST_TIMEOUT = 15000 // 15 seconds
const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 2000, 4000] // Exponential backoff

export function useGitHubRepos() {
  const { data: session, status } = useSession()
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [initialLoad, setInitialLoad] = useState(true) // Track if this is the first load
  const fetchingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    
    if (status === 'authenticated' && session?.accessToken) {
      // Check cache first to avoid showing "no repos" state
      const cacheKey = session.user?.email || 'default'
      const cached = reposCache.get(cacheKey)
      
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        setRepos(cached.data)
        setError(null)
        setInitialLoad(false)
        return
      }
      
      fetchRepos()
    } else if (status === 'unauthenticated') {
      // Clear repos when not authenticated
      setRepos([])
      setError(null)
      setInitialLoad(false)
    }
  }, [session, status])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [])

  const createTimeoutPromise = (timeout: number, signal: AbortSignal) => {
    return new Promise((_, reject) => {
      const timeoutId = setTimeout(() => {
        if (!signal.aborted) {
          reject(new Error('Request timeout'))
        }
      }, timeout)
      
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId)
      })
    })
  }

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const fetchRepos = async (force = false, attemptNumber = 0) => {
    // Prevent multiple simultaneous requests
    if (fetchingRef.current && !force) {
      return
    }
    
    // Check if component is still mounted
    if (!mountedRef.current) {
      return
    }
    
    const cacheKey = session?.user?.email || 'default'
    const cached = reposCache.get(cacheKey)
    
    // Use cache if valid and not forced
    if (!force && cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      setRepos(cached.data)
      setError(null)
      setInitialLoad(false)
      return
    }
    
    fetchingRef.current = true
    setLoading(true)
    setError(null)
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal
    
    try {
      // Make the request
      const fetchPromise = fetch('/api/github/repos', {
        signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const response = await Promise.race([
        fetchPromise,
        createTimeoutPromise(REQUEST_TIMEOUT, signal)
      ]) as Response
      
      // Check if component is still mounted and signal not aborted
      if (!mountedRef.current || signal.aborted) {
        return
      }
      
      if (!response.ok) {
        // Handle different HTTP status codes
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
      
      // Double-check component is still mounted before updating state
      if (!mountedRef.current || signal.aborted) {
        return
      }
      
      // Cache the successful result
      reposCache.set(cacheKey, {
        data: data.repos,
        timestamp: Date.now()
      })
      
      setRepos(data.repos)
      setRetryCount(0)
      setInitialLoad(false)
      
    } catch (err) {
      // Don't handle errors if component is unmounted or signal was aborted
      if (!mountedRef.current) {
        return
      }
      
      if (err instanceof Error && err.name === 'AbortError') {
        // In development mode, this is normal due to HMR - no need to log
        return
      }
      
      // Only log actual errors, not AbortErrors
      if (!(err instanceof Error && err.name === 'AbortError')) {
        console.error(`❌ GitHub repos fetch error (attempt ${attemptNumber + 1}):`, err)
      }
      
      let errorMessage = 'GitHub projeleriniz yüklenirken bir hata oluştu.'
      
      if (err instanceof Error) {
        if (err.message === 'Request timeout') {
          errorMessage = 'Bağlantı zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.'
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.'
        } else {
          errorMessage = err.message
        }
      }
      
      // Retry logic with exponential backoff
      if (attemptNumber < MAX_RETRIES && 
          !(err instanceof Error && err.message?.includes('401')) && 
          !(err instanceof Error && err.message?.includes('403'))) {
        
        const delayMs = RETRY_DELAYS[attemptNumber] || 4000
        
        setRetryCount(attemptNumber + 1)
        fetchingRef.current = false
        
        await delay(delayMs)
        
        // Only retry if component is still mounted
        if (mountedRef.current) {
          return fetchRepos(force, attemptNumber + 1)
        }
      } else {
        // Final error after all retries
        if (mountedRef.current) {
          setError(errorMessage)
          setRetryCount(0)
          setInitialLoad(false)
        }
      }
      
    } finally {
      if (mountedRef.current) {
        fetchingRef.current = false
        setLoading(false)
      }
    }
  }

  const refetch = () => {
    if (mountedRef.current) {
      setInitialLoad(false) // Not initial load anymore
      fetchRepos(true)
    }
  }

  return {
    repos,
    loading,
    error,
    retryCount,
    refetch,
    isRetrying: retryCount > 0,
    initialLoad // Export this so components can handle initial state better
  }
} 
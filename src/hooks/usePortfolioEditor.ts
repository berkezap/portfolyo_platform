import { useState, useEffect, useRef } from 'react'

interface Portfolio {
  id: string
  template: string
  selectedRepos: string[]
  cvUrl?: string
  url?: string
  createdAt: string
  updatedAt: string
  metadata: {
    user?: string
    repoCount?: number
    totalStars?: number
    template?: string
  }
}

interface UsePortfolioEditorReturn {
  portfolio: Portfolio | null
  loading: boolean
  error: string | null
  updatePortfolio: (data: Partial<Portfolio>) => Promise<boolean>
  refetch: () => Promise<void>
}

// Cache for portfolio data
const portfolioCache = new Map<string, { data: Portfolio, timestamp: number }>()
const PORTFOLIO_CACHE_DURATION = 2 * 60 * 1000 // 2 minutes

export function usePortfolioEditor(portfolioId: string): UsePortfolioEditorReturn {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchingRef = useRef(false)

  const fetchPortfolio = async (force = false) => {
    if (!portfolioId) return
    if (fetchingRef.current && !force) {
      console.log('📋 Portfolio fetch already in progress, skipping...')
      return
    }
    
    // Check cache first
    const cached = portfolioCache.get(portfolioId)
    if (!force && cached && (Date.now() - cached.timestamp) < PORTFOLIO_CACHE_DURATION) {
      console.log('📋 Using cached portfolio:', portfolioId)
      setPortfolio(cached.data)
      return
    }
    
    fetchingRef.current = true
    console.log('📋 Fetching fresh portfolio from API, ID:', portfolioId)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/portfolio/${portfolioId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Portfolio bulunamadı')
        } else if (response.status === 403) {
          throw new Error('Bu portfolyoya erişim yetkiniz yok')
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      }

      const data = await response.json()
      
      if (data.success) {
        // Update cache
        portfolioCache.set(portfolioId, {
          data: data.portfolio,
          timestamp: Date.now()
        })
        
        setPortfolio(data.portfolio)
        console.log('✅ Portfolio başarıyla yüklendi:', data.portfolio.id)
      } else {
        setError('Portfolio yüklenemedi')
      }
    } catch (err) {
      console.error('❌ Portfolio yükleme hatası:', err)
      setError(err instanceof Error ? err.message : 'Bağlantı hatası')
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  const updatePortfolio = async (updateData: Partial<Portfolio>): Promise<boolean> => {
    if (!portfolioId) return false
    
    console.log('🔄 Portfolio güncelleniyor, ID:', portfolioId)
    console.log('📝 Güncelleme verileri:', updateData)
    
    try {
      const response = await fetch(`/api/portfolio/${portfolioId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Portfolio bulunamadı')
        } else if (response.status === 403) {
          throw new Error('Bu portfolyoyu güncelleme yetkiniz yok')
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      }

      const data = await response.json()
      
      if (data.success) {
        // Update both state and cache
        portfolioCache.set(portfolioId, {
          data: data.portfolio,
          timestamp: Date.now()
        })
        setPortfolio(data.portfolio)
        console.log('✅ Portfolio başarıyla güncellendi')
        return true
      } else {
        throw new Error('Portfolio güncellenemedi')
      }
    } catch (err) {
      console.error('❌ Portfolio güncelleme hatası:', err)
      setError(err instanceof Error ? err.message : 'Güncelleme hatası')
      return false
    }
  }

  useEffect(() => {
    fetchPortfolio()
  }, [portfolioId])

  return {
    portfolio,
    loading,
    error,
    updatePortfolio,
    refetch: () => fetchPortfolio(true)
  }
} 
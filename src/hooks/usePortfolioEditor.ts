import { useState, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

// The frontend interface uses camelCase for consistency in component code.
interface Portfolio {
  id: string
  template: string
  selectedRepos: string[]
  cvUrl?: string
  url?: string // This can represent the generated URL for viewing
  createdAt: string
  updatedAt: string
  metadata: {
    user?: string
    repoCount?: number
    totalStars?: number
    template?: string
    user_bio?: string
  }
}

interface UsePortfolioEditorReturn {
  portfolio: Portfolio | null
  loading: boolean
  error: string | null
  updatePortfolio: (data: Partial<Omit<Portfolio, 'generatedHtml'>>) => Promise<boolean>
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
  const queryClient = useQueryClient();

  const fetchPortfolio = async (force = false) => {
    if (!portfolioId) return
    if (fetchingRef.current && !force) return
    
    const cached = portfolioCache.get(portfolioId)
    if (!force && cached && (Date.now() - cached.timestamp) < PORTFOLIO_CACHE_DURATION) {
      setPortfolio(cached.data)
      return
    }
    
    fetchingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/portfolio/${portfolioId}`)
      
      if (!response.ok) {
        if (response.status === 404) throw new Error('Portfolio bulunamadı')
        if (response.status === 403) throw new Error('Bu portfolyoya erişim yetkiniz yok')
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.portfolio) {
        // API'den gelen veri zaten camelCase olmalı (bir sonraki adımla düzelteceğiz)
        // Bu yüzden doğrudan kullanabiliriz.
        setPortfolio(data.portfolio)
        portfolioCache.set(portfolioId, { data: data.portfolio, timestamp: Date.now() })
        console.log('✅ Portfolio başarıyla yüklendi:', data.portfolio.id)
      } else {
        throw new Error(data.error || 'Portfolio yüklenemedi')
      }
    } catch (err) {
      console.error('❌ Portfolio yükleme hatası:', err)
      setError(err instanceof Error ? err.message : 'Bağlantı hatası')
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  const updatePortfolio = async (updateData: Partial<Omit<Portfolio, 'generatedHtml'>>): Promise<boolean> => {
    if (!portfolioId) return false
    
    console.log('🔄 Portfolio güncelleniyor, ID:', portfolioId)
    
    try {
      const response = await fetch(`/api/portfolio/${portfolioId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData) // Gönderilen veri zaten camelCase
      })
      
      if (!response.ok) {
        if (response.status === 404) throw new Error('Portfolio bulunamadı')
        if (response.status === 403) throw new Error('Bu portfolyoyu güncelleme yetkiniz yok')
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.portfolio) {
         // Dönen veri snake_case, camelCase'e çevir
        const updatedPortfolioData: Portfolio = {
          id: data.portfolio.id,
          template: data.portfolio.selected_template,
          selectedRepos: data.portfolio.selected_repos,
          cvUrl: data.portfolio.cv_url,
          url: `/portfolio/${data.portfolio.id}`,
          createdAt: data.portfolio.created_at,
          updatedAt: data.portfolio.updated_at,
          metadata: data.portfolio.metadata
        };

        setPortfolio(updatedPortfolioData)
        portfolioCache.set(portfolioId, { data: updatedPortfolioData, timestamp: Date.now() })
        // Invalidate portfolio list cache so /my-portfolios reflects latest data
        queryClient.invalidateQueries({ queryKey: ['portfolio-list'] });
        console.log('✅ Portfolio başarıyla güncellendi')
        return true
      } else {
        throw new Error(data.error || 'Portfolio güncellenemedi')
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
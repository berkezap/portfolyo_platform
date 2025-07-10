import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export interface Portfolio {
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

interface PortfolioListResponse {
  success: boolean
  portfolios: Portfolio[]
  count: number
}

// Portfolio list fetch function
const fetchPortfolioList = async (): Promise<Portfolio[]> => {
  console.log('📋 Portfolio List API çağrıldı!')
  
  const response = await fetch('/api/portfolio/list')
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const data: PortfolioListResponse = await response.json()
  
  if (!data.success) {
    throw new Error('Portfolio listesi getirilemedi')
  }

  console.log(`✅ ${data.count} portfolio bulundu:`)
  data.portfolios.forEach(p => {
    console.log(`  - ${p.id} (${p.template}, ${p.selectedRepos?.length || '?'} repo)`)
  })

  return data.portfolios
}

// Portfolio delete function
const deletePortfolio = async (portfolioId: string): Promise<void> => {
  console.log('🗑️ Portfolio siliniyor:', portfolioId)

  const response = await fetch(`/api/portfolio/${portfolioId}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'Portfolio silinemedi')
  }

  console.log('✅ Portfolio başarıyla silindi:', portfolioId)
}

export function usePortfolioList() {
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()
  
  const queryResult = useQuery({
    queryKey: ['portfolio-list', session?.user?.email],
    queryFn: fetchPortfolioList,
    enabled: status === 'authenticated' && !!session?.user?.email,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePortfolio,
    onSuccess: (_, portfolioId) => {
      // Remove from cache optimistically
      queryClient.setQueryData<Portfolio[]>(
        ['portfolio-list', session?.user?.email],
        (oldData) => oldData?.filter(p => p.id !== portfolioId) || []
      )
      console.log('✅ Portfolio cache\'den kaldırıldı:', portfolioId)
    },
    onError: (error) => {
      console.error('❌ Portfolio silme hatası:', error)
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ['portfolio-list', session?.user?.email]
      })
    }
  })

  const deletePortfolioMutation = (portfolioId: string) => {
    if (!confirm('Bu portfolyoyu silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!')) {
      return Promise.resolve()
    }
    return deleteMutation.mutateAsync(portfolioId)
  }

  return {
    portfolios: queryResult.data || [],
    loading: queryResult.isLoading,
    error: queryResult.error?.message || null,
    refetch: queryResult.refetch,
    isRefetching: queryResult.isRefetching,
    
    // Delete operations
    deletePortfolio: deletePortfolioMutation,
    isDeleting: deleteMutation.isPending,
    deletingError: deleteMutation.error?.message || null,
    
    // React Query specific states
    isFetching: queryResult.isFetching,
    isStale: queryResult.isStale,
    dataUpdatedAt: queryResult.dataUpdatedAt,
  }
} 
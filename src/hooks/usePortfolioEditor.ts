import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Veri yapıları için net arayüzler (Type Safety)
export interface Portfolio {
  id: string
  selected_template: string
  selected_repos: string[]
  cv_url?: string
  updated_at: string
}

interface UpdatePortfolioPayload {
  id: string
  data: Partial<Omit<Portfolio, 'id' | 'updated_at'>>
}

// --- Fetcher Fonksiyonları: Sorumlulukları net ve tekil ---

// 1. Portfolio verisini çeken fonksiyon
// - Başarılı olursa, beklenen veriyi döndürür.
// - Başarısız olursa, anlamlı bir hata fırlatır (Error Propagation).
const fetchPortfolioById = async (portfolioId: string): Promise<Portfolio> => {
  if (!portfolioId) throw new Error('Portfolio ID is required.')

  const response = await fetch(`/api/portfolio/${portfolioId}`)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Failed to fetch portfolio (status: ${response.status})`)
  }
  const data = await response.json()
  if (!data.success || !data.portfolio) {
    throw new Error(data.error || 'Invalid portfolio data received.')
  }
  return data.portfolio // Veri Yapısı Garantisi: Her zaman Portfolio nesnesi döner
}

// 2. Portfolio verisini güncelleyen fonksiyon
const updatePortfolioById = async (payload: UpdatePortfolioPayload): Promise<Portfolio> => {
  const { id, data } = payload
  console.log('[RQ] updatePortfolioById - Gönderilen veri:', { id, data })
  const response = await fetch(`/api/portfolio/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Failed to update portfolio (status: ${response.status})`)
  }
  const result = await response.json()
  console.log('[RQ] updatePortfolioById - API yanıtı:', result)
  if (!result.success) {
    throw new Error(result.error || 'Failed to process portfolio update.')
  }
  return result.portfolio
}


// --- "Kurşun Geçirmez" Custom Hook ---

export function usePortfolioEditor(portfolioId: string) {
  const queryClient = useQueryClient()

  // VERİ ÇEKME (QUERY) - Optimized with better caching
  const { 
    data: portfolio, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<Portfolio, Error>({
    queryKey: ['portfolio', portfolioId],
    queryFn: () => fetchPortfolioById(portfolioId),
    enabled: !!portfolioId,
    staleTime: 5 * 60 * 1000, // 5 dakika boyunca fresh kabul et (2'den 5'e çıkardık)
    gcTime: 15 * 60 * 1000, // 15 dakika cache'de tut (10'dan 15'e çıkardık)
    refetchOnWindowFocus: false, // Gereksiz refetch'i engelle
    refetchOnMount: false, // Component mount olduğunda refetch etme
    retry: 1, // Sadece 1 kez retry et
    retryDelay: 1000, // 1 saniye bekle
  })

  // VERİ GÜNCELLEME (MUTATION) - Optimized with optimistic updates
  const { 
    mutate: updatePortfolio, 
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
    error: updateError
  } = useMutation<Portfolio, Error, Partial<Omit<Portfolio, 'id' | 'updated_at'>>>({
    mutationFn: (updateData) => updatePortfolioById({ id: portfolioId, data: updateData }),
    onMutate: async (newData) => {
      // Optimistic update - UI'ı hemen güncelle
      await queryClient.cancelQueries({ queryKey: ['portfolio', portfolioId] })
      const previousPortfolio = queryClient.getQueryData(['portfolio', portfolioId])
      
      queryClient.setQueryData(['portfolio', portfolioId], (old: Portfolio | undefined) => {
        if (!old) return old
        return { ...old, ...newData, updated_at: new Date().toISOString() }
      })
      
      return { previousPortfolio }
    },
    onError: (err, newData, context: unknown) => {
      // Hata durumunda önceki veriyi geri yükle
      const typedContext = context as { previousPortfolio?: Portfolio }
      if (typedContext?.previousPortfolio) {
        queryClient.setQueryData(['portfolio', portfolioId], typedContext.previousPortfolio)
      }
    },
    onSettled: () => {
      // İşlem bittikten sonra cache'i temizle
      queryClient.invalidateQueries({ queryKey: ['portfolio', portfolioId] })
      queryClient.invalidateQueries({ queryKey: ['portfolios'] })
    },
  })

  // Hook'un dışarıya sunduğu arayüz (Interface)
  return {
    // Veri ve Durumları
    portfolio,
    isLoading,
    isUpdating,
    isUpdateSuccess,
    error: error || updateError, // Hem query hem de mutation hatalarını tek bir yerden yönet

    // Fonksiyonlar
    updatePortfolio,
    refetch,
  }
} 
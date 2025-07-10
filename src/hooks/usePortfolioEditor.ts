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

  // VERİ ÇEKME (QUERY)
  // - enabled: !!portfolioId -> ID yoksa gereksiz API isteği yapmaz.
  const { 
    data: portfolio, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<Portfolio, Error>({
    queryKey: ['portfolio', portfolioId], // Net Query Key
    queryFn: () => fetchPortfolioById(portfolioId),
    enabled: !!portfolioId,
  })

  // VERİ GÜNCELLEME (MUTATION)
  // - onSuccess ve onError mantığı hook içinde yönetilir.
  const { 
    mutate: updatePortfolio, 
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
    error: updateError
  } = useMutation<Portfolio, Error, Partial<Omit<Portfolio, 'id' | 'updated_at'>>>({
    mutationFn: (updateData) => updatePortfolioById({ id: portfolioId, data: updateData }),
    onSuccess: (updatedData) => {
      // Başarılı güncelleme sonrası ilgili cache'leri geçersiz kıl.
      // Bu, React Query'nin veriyi arka planda tazeleyip UI'ı güncellemesini tetikler.
      queryClient.invalidateQueries({ queryKey: ['portfolio', portfolioId] })
      queryClient.invalidateQueries({ queryKey: ['portfolios'] })
    },
    // onError: Hata yönetimi burada merkezi olarak yapılabilir.
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
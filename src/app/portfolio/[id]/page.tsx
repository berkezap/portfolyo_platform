'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'


interface Portfolio {
  id: string
  selected_template: string
  selected_repos: string[]
  cv_url?: string
  generated_html?: string
  metadata?: {
    user?: string
    repoCount?: number
    user_bio?: string
    user_avatar?: string
    user_email?: string
    github_url?: string
    total_repos?: number
    total_stars?: number
    years_experience?: number
    generated_at?: string
  }
}

export default function PortfolioViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    fetchPortfolio()
  }, [id])

  const fetchPortfolio = async () => {
    console.log('🔍 Portfolio HTML getiriliyor:', id)
    
    try {
      setLoading(true)
      setError(null)
      
      // Ana API endpoint'ini kullanarak kayıtlı portfolyo verisini çek
      const response = await fetch(`/api/portfolio/${id}`)
      
      if (response.status === 404) {
        setNotFoundError(true)
        return
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success && data.portfolio?.generated_html) {
        // Gelen portfolyo verisini doğrudan state'e set et
        setPortfolio(data.portfolio)
        console.log('✅ Portfolio yüklendi:', data.portfolio.id)
      } else {
        setError(data.error || 'Portfolio could not be loaded.')
        console.log('❌ Portfolio yüklenemedi veya HTML içeriği boş:', data)
      }
    } catch (err) {
      console.error('❌ Portfolio getirme hatası:', err)
      setError(err instanceof Error ? err.message : 'Portfolio yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Show 404 page for invalid portfolio IDs
  if (notFoundError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Portfolyo Bulunamadı</h1>
          <p className="text-gray-600 mb-8">
            Aradığınız portfolyo mevcut değil veya kaldırılmış olabilir.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ana Sayfaya Dön
            </button>
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bir Hata Oluştu</h1>
          <p className="text-red-600 mb-8">{error}</p>
          <div className="space-y-4">
            <button
              onClick={fetchPortfolio}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Tekrar Dene
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Portfolio yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Portfolio var ve HTML yüklendi - iframe ile göster
  if (portfolio?.generated_html) {
    return (
      <div className="min-h-screen bg-white">
        <div 
          className="w-full h-screen"
          dangerouslySetInnerHTML={{ __html: portfolio.generated_html }}
        />
      </div>
    )
  }

  // Portfolio var ama HTML yok
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Hazırlanıyor</h1>
        <p className="text-gray-600 mb-8">
          Bu portfolio henüz hazırlanma aşamasında. Lütfen daha sonra tekrar deneyin.
        </p>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  )
} 
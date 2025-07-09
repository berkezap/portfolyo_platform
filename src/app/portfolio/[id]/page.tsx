'use client'

import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'

interface PortfolioPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PortfolioPage({ params }: PortfolioPageProps) {
  const resolvedParams = use(params)
  const portfolioId = resolvedParams.id
  
  const [portfolioHtml, setPortfolioHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        console.log('🎨 Portfolio HTML getiriliyor, ID:', portfolioId)
        const response = await fetch(`/api/portfolio/${portfolioId}/html`)
        
        if (response.status === 404) {
          console.log('❌ Portfolio bulunamadı:', portfolioId)
          notFound()
          return
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        
        if (data.success && data.html) {
          setPortfolioHtml(data.html)
          console.log('✅ Portfolio HTML başarıyla yüklendi')
        } else {
          throw new Error('Portfolio HTML bulunamadı')
        }
      } catch (err) {
        console.error('❌ Portfolio yükleme hatası:', err)
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [portfolioId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Portfolio yükleniyor...</p>
          <p className="text-sm text-gray-500 mt-1">Lütfen bekleyin</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Portfolio Yüklenemedi</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 Tekrar Dene
            </button>
            <button 
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Geri Dön
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen"
      dangerouslySetInnerHTML={{ __html: portfolioHtml }}
    />
  )
} 
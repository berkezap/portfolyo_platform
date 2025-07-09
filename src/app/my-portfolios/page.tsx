'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

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

interface PortfolioListResponse {
  success: boolean
  portfolios: Portfolio[]
  count: number
}

export default function MyPortfoliosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/')
      return
    }

    fetchPortfolios()
  }, [session, status, router])

  const fetchPortfolios = async () => {
    console.log('📋 Portfolio listesi getiriliyor...')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/portfolio/list')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data: PortfolioListResponse = await response.json()
      
      if (data.success) {
        setPortfolios(data.portfolios)
        console.log(`✅ ${data.count} portfolio yüklendi`)
      } else {
        setError('Portfolio listesi getirilemedi')
      }
    } catch (err) {
      console.error('❌ Portfolio listesi hatası:', err)
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (portfolioId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    console.log('🔧 Düzenle butonu tıklandı, portfolio ID:', portfolioId)
    console.log('🔧 Router push çağrılıyor:', `/dashboard/edit/${portfolioId}`)
    router.push(`/dashboard/edit/${portfolioId}`)
  }

  const handleDelete = async (portfolioId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    if (!confirm('Bu portfolyoyu silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!')) {
      return
    }

    // Loading state'i başlat
    setDeletingIds(prev => new Set(prev).add(portfolioId))

    try {
      console.log('🗑️ Portfolio siliniyor:', portfolioId)
      
      const response = await fetch(`/api/portfolio/${portfolioId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Portfolio bulunamadı')
        } else if (response.status === 403) {
          throw new Error('Bu portfolyoyu silme yetkiniz yok')
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      }

      const data = await response.json()
      
      if (data.success) {
        console.log('✅ Portfolio başarıyla silindi')
        
        // Portfolio listesini güncelle (silinen portfolio'yu kaldır)
        setPortfolios(prev => prev.filter(p => p.id !== portfolioId))
        
        // Success toast yerine daha subtil feedback
        console.log('Portfolio başarıyla silindi! 🗑️')
      } else {
        throw new Error('Portfolio silinemedi')
      }
    } catch (err) {
      console.error('❌ Silme hatası:', err)
      const errorMessage = err instanceof Error ? err.message : 'Silme işleminde hata oluştu'
      alert(`Hata: ${errorMessage}`)
    } finally {
      // Loading state'i bitir
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(portfolioId)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTemplateDisplayName = (template: string) => {
    const templateNames: Record<string, string> = {
      'modern-developer': 'Modern Developer',
      'creative-portfolio': 'Creative Portfolio',
      'professional-tech': 'Professional Tech'
    }
    return templateNames[template] || template
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <DashboardHeader demoMode={false} />
      
      <div className="container mx-auto px-4 py-8">
        
        {/* Page Header - simplified since navigation is now in DashboardHeader */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolyolarım</h1>
              <p className="text-gray-600 mt-2">Oluşturduğunuz portfolyoları yönetin</p>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault()
                router.push('/dashboard')
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ Yeni Portfolyo
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Portfolyolar yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-semibold">Hata</h3>
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    fetchPortfolios()
                  }}
                  className="mt-3 text-red-600 hover:text-red-800 underline"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio List */}
        {!loading && !error && (
          <>
            {portfolios.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz portfolyo oluşturmadınız</h3>
                <p className="text-gray-500 mb-6">İlk portfolyonuzu oluşturmak için başlayın</p>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    router.push('/dashboard')
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Portfolyo Oluştur
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {portfolios.map((portfolio) => (
                  <div key={portfolio.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    
                    {/* Portfolio Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-500">
                        {getTemplateDisplayName(portfolio.template)}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => handleEdit(portfolio.id, e)}
                          disabled={deletingIds.has(portfolio.id)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Düzenle"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={(e) => handleDelete(portfolio.id, e)}
                          disabled={deletingIds.has(portfolio.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Sil"
                        >
                          {deletingIds.has(portfolio.id) ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    </div>

                    {/* Portfolio Stats */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>📂 {portfolio.metadata.repoCount || 0} proje</span>
                        <span>⭐ {portfolio.metadata.totalStars || 0} yıldız</span>
                      </div>
                    </div>

                    {/* Repository List */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Projeler:</p>
                      <div className="flex flex-wrap gap-1">
                        {portfolio.selectedRepos.slice(0, 3).map((repo, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {repo}
                          </span>
                        ))}
                        {portfolio.selectedRepos.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{portfolio.selectedRepos.length - 3} daha
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-gray-500 mb-4">
                      Oluşturulma: {formatDate(portfolio.createdAt)}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => handleEdit(portfolio.id, e)}
                        disabled={deletingIds.has(portfolio.id)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingIds.has(portfolio.id) ? 'Siliniyor...' : 'Düzenle'}
                      </button>
                      {portfolio.url && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            window.open(portfolio.url, '_blank')
                          }}
                          disabled={deletingIds.has(portfolio.id)}
                          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Görüntüle
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

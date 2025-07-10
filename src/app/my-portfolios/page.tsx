'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { usePortfolioList } from '@/hooks/usePortfolioList'
import { PortfolioGridSkeleton } from '@/components/ui/Skeleton'

export default function MyPortfoliosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // React Query hook - API calls artık otomatik!
  const {
    portfolios,
    loading,
    error,
    deletePortfolio,
    isDeleting,
    refetch
  } = usePortfolioList()

  // Redirect if not authenticated
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

  if (!session) {
    router.push('/')
    return null
  }

  const handleEdit = (portfolioId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    // Prevent action if any delete operation is in progress
    if (isDeleting) {
      return
    }
    
    console.log('🔧 Düzenle butonu tıklandı, portfolio ID:', portfolioId)
    router.push(`/dashboard/edit/${portfolioId}`)
  }

  const handleDelete = async (portfolioId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    // Prevent multiple operations
    if (isDeleting) {
      return
    }
    
    // Use the hook's delete function (already has confirm dialog)
    try {
      await deletePortfolio(portfolioId)
    } catch (err) {
      console.error('❌ Portfolio silme hatası:', err)
      alert('Portfolio silinirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleView = (portfolioId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    // Prevent action if any delete operation is in progress
    if (isDeleting) {
      return
    }
    
    console.log('👁️ Görüntüle butonu tıklandı, portfolio ID:', portfolioId)
    router.push(`/portfolio/${portfolioId}`)
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

        {/* Loading State with Skeleton */}
        {loading && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">Portfolyolar yükleniyor...</span>
              </div>
            </div>
            <PortfolioGridSkeleton count={6} />
          </>
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
                    refetch()
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
                  <div key={portfolio.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                                                 <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{color: '#111827'}}>
                           {getTemplateDisplayName(portfolio.template)}
                         </h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium mr-2">📂 Projeler:</span>
                            <span className="text-gray-900 font-semibold" style={{color: '#111827'}}>
                              {portfolio.selectedRepos?.length || 0} proje
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium mr-2">📅 Oluşturulma:</span>
                            <span className="text-gray-700" style={{color: '#374151'}}>
                              {new Date(portfolio.createdAt).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Template Icon */}
                      <div className="text-3xl ml-4">
                        {portfolio.template === 'modern-developer' && '🎯'}
                        {portfolio.template === 'creative-portfolio' && '🎨'}
                        {portfolio.template === 'professional-tech' && '🏢'}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      {/* View Button */}
                      <button
                        onClick={(e) => handleView(portfolio.id, e)}
                        disabled={isDeleting}
                        className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: isDeleting ? '#9ca3af' : '#16a34a',
                          color: '#ffffff'
                        }}
                      >
                        👁️ Görüntüle
                      </button>
                      
                      {/* Edit Button */}
                      <button
                        onClick={(e) => handleEdit(portfolio.id, e)}
                        disabled={isDeleting}
                        className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: isDeleting ? '#9ca3af' : '#2563eb',
                          color: '#ffffff'
                        }}
                      >
                        ✏️ Düzenle
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDelete(portfolio.id, e)}
                        disabled={isDeleting}
                        className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: isDeleting ? '#9ca3af' : '#dc2626',
                          color: '#ffffff'
                        }}
                      >
                        {isDeleting ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Siliniyor...
                          </span>
                        ) : (
                          '🗑️ Sil'
                        )}
                      </button>
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

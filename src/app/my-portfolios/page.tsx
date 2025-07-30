'use client'

import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { usePortfolioList } from '@/hooks/usePortfolioList'
import { PortfolioGridSkeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import IconButton from '@/components/ui/IconButton'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  FolderOpen, 
  Calendar,
  Palette,
  ExternalLink,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

export default function MyPortfoliosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const shouldFetchPortfolios = Boolean(session && status === 'authenticated')
  const {
    portfolios,
    isLoading,
    error,
    deletePortfolio,
    isDeleting,
    refetch
  } = usePortfolioList(shouldFetchPortfolios)

  // Eğer kullanıcının hiç portfolyosu yoksa ve veriler yüklendiyse dashboard'a yönlendir
  useEffect(() => {
    if (!isLoading && !error && portfolios.length === 0 && status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [isLoading, error, portfolios.length, status, router])

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-500 text-sm font-medium">Yükleniyor...</p>
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
    
    if (isDeleting) return
    
    router.push(`/dashboard/edit/${portfolioId}`)
  }

  const handleDelete = async (portfolioId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    if (isDeleting) return
    
    try {
      await deletePortfolio(portfolioId)
    } catch (err) {
      console.error('Portfolio silme hatası:', err)
      alert('Portfolio silinirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleView = (portfolioId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    if (isDeleting) return
    
    window.open(`/portfolio/${portfolioId}`, '_blank')
  }

  const getTemplateDisplayName = (template: string) => {
    const templateNames: Record<string, string> = {
      'modern-developer': 'Modern Developer',
      'creative-portfolio': 'Creative Portfolio',
      'professional-tech': 'Professional Tech',
      'minimalist-professional': 'Minimalist Professional',
      'creative-technologist': 'Creative Technologist',
      'storyteller': 'Storyteller'
    }
    return templateNames[template] || template
  }

  const getTemplateIcon = (template: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'modern-developer': <Palette className="w-5 h-5" />,
      'creative-portfolio': <Palette className="w-5 h-5" />,
      'professional-tech': <Palette className="w-5 h-5" />,
      'minimalist-professional': <Palette className="w-5 h-5" />,
      'creative-technologist': <Palette className="w-5 h-5" />,
      'storyteller': <Palette className="w-5 h-5" />
    }
    return iconMap[template] || <Palette className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader demoMode={false} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Portfolyolarım
              </h1>
              <p className="text-gray-600 text-base">
                Oluşturduğunuz portfolyoları yönetin ve düzenleyin
              </p>
            </div>
            <Button 
              onClick={(e) => {
                e.preventDefault()
                router.push('/dashboard')
              }}
              icon={Plus}
              size="lg"
            >
              Yeni Portfolyo
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                <span className="text-sm font-medium">Portfolyolar yükleniyor...</span>
              </div>
            </div>
            <PortfolioGridSkeleton count={6} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-sm mb-1">Hata</h3>
                <p className="text-red-700 text-sm mb-3">{error}</p>
                <Button 
                  onClick={(e) => {
                    e.preventDefault()
                    refetch()
                  }}
                  variant="secondary"
                  icon={RefreshCw}
                  size="sm"
                >
                  Tekrar Dene
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Portfolio List */}
        {!isLoading && !error && (
          <>
            {portfolios.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Henüz portfolyo oluşturmadınız
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  İlk portfolyonuzu oluşturarak projelerinizi dünyaya gösterin
                </p>
                <Button 
                  onClick={(e) => {
                    e.preventDefault()
                    router.push('/dashboard')
                  }}
                  icon={Plus}
                  size="lg"
                >
                  Portfolyo Oluştur
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {portfolios.map((portfolio) => (
                  <Card key={portfolio.id} variant="portfolio">
                    {/* Card Header */}
                    <div className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                            {getTemplateDisplayName(portfolio.template)}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-500">
                            {getTemplateIcon(portfolio.template)}
                            <span className="text-sm">Template</span>
                          </div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FolderOpen className="w-4 h-4" />
                            <span className="font-medium">Projeler</span>
                          </div>
                          <span className="text-gray-900 font-semibold">
                            {portfolio.selectedRepos?.length || 0}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">Oluşturulma</span>
                          </div>
                          <span className="text-gray-700">
                            {new Date(portfolio.createdAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {/* Primary Action - Edit */}
                      <Button
                        onClick={(e) => handleEdit(portfolio.id, e)}
                        disabled={isDeleting}
                        icon={Edit3}
                        className="flex-1"
                      >
                        Düzenle
                      </Button>
                      
                      {/* Secondary Action - View */}
                      <IconButton
                        onClick={(e) => handleView(portfolio.id, e)}
                        disabled={isDeleting}
                        icon={ExternalLink}
                        variant="secondary"
                        title="Portfolyoyu Görüntüle"
                      />
                      
                      {/* Destructive Action - Delete */}
                      <IconButton
                        onClick={(e) => handleDelete(portfolio.id, e)}
                        disabled={isDeleting}
                        icon={Trash2}
                        variant="destructive"
                        loading={isDeleting}
                        title="Portfolyoyu Sil"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

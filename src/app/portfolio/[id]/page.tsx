'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { AlertCircle, FileWarning, Loader2, CheckCircle2 } from 'lucide-react'

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

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      setError(null)
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
        setPortfolio(data.portfolio)
      } else {
        setError(data.error || 'Portfolio could not be loaded.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Portfolio yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolio()
  }, [id])

  if (notFoundError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="flex items-center justify-center mb-6">
            <FileWarning className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Portfolyo Bulunamadı</h1>
          <p className="text-gray-600 mb-8">
            Aradığınız portfolyo mevcut değil veya kaldırılmış olabilir.
          </p>
          <div className="space-y-4">
            <Button onClick={() => router.push('/')} size="lg" className="w-full">
              Ana Sayfaya Dön
            </Button>
            <Button variant="secondary" onClick={() => router.back()} size="lg" className="w-full">
              Geri Dön
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="flex items-center justify-center mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bir Hata Oluştu</h1>
          <p className="text-red-600 mb-8">{error}</p>
          <div className="space-y-4">
            <Button onClick={fetchPortfolio} size="lg" className="w-full">
              Tekrar Dene
            </Button>
            <Button variant="secondary" onClick={() => router.push('/')} size="lg" className="w-full">
              Ana Sayfaya Dön
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <p className="text-gray-600">Portfolio yükleniyor...</p>
        </Card>
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md mx-auto text-center p-8">
        <div className="flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Hazırlanıyor</h1>
        <p className="text-gray-600 mb-8">
          Bu portfolio henüz hazırlanma aşamasında. Lütfen daha sonra tekrar deneyin.
        </p>
        <Button onClick={() => router.push('/')} size="lg" className="w-full">
          Ana Sayfaya Dön
        </Button>
      </Card>
    </div>
  )
} 
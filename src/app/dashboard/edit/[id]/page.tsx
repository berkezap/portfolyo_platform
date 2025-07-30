'use client'

import { useState, useEffect, use, useMemo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'
import { usePortfolioEditor } from '@/hooks/usePortfolioEditor'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { 
  Eye, 
  ArrowLeft, 
  Save, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  Star,
  GitBranch
} from 'lucide-react'
import { GitHubRepo } from '@/types/github'
import { TemplateSelection } from '@/components/dashboard/steps/TemplateSelection'

interface EditPortfolioPageProps {
  params: Promise<{
    id: string
  }>
}

const templateNameToId: { [key: string]: number } = {
  'modern-developer': 1,
  'creative-portfolio': 2,
  'professional-tech': 3,
  'minimalist-professional': 4,
  'creative-technologist': 5,
  'storyteller': 6,
}

const templateIdToName: { [key: number]: string } = {
  1: 'modern-developer', 2: 'creative-portfolio', 3: 'professional-tech', 
  4: 'minimalist-professional', 5: 'creative-technologist', 6: 'storyteller'
}

const templateDisplayNames: { [key: number]: string } = {
  1: 'Modern Developer', 2: 'Creative Portfolio', 3: 'Professional Tech',
  4: 'Minimalist Professional', 5: 'Creative Technologist', 6: 'Storyteller'
}

export default function EditPortfolioPage({ params }: EditPortfolioPageProps) {
  const { status: sessionStatus } = useSession()
  const router = useRouter()
  
  const resolvedParams = use(params)
  const portfolioId = resolvedParams.id
  
  const { 
    portfolio, isLoading: portfolioLoading, error: portfolioError,
    isUpdating, isUpdateSuccess, updatePortfolio: updatePortfolioMutation
  } = usePortfolioEditor(portfolioId);
  const { data: allRepos, isLoading: reposLoading } = useGitHubRepos()
  
  const [selectedRepos, setSelectedRepos] = useState<number[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1)
  // Preview modal'ı kaldırıldı - güvenlik nedeniyle

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  // Auth kontrolü - sadece bir kez çalışsın
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/')
    }
  }, [sessionStatus, router])

  // Portfolio ve repos verilerini işle - memoized
  const processedData = useMemo(() => {
    if (!portfolio || !allRepos) return null
    
    const templateId = templateNameToId[portfolio.selected_template] || 1
    const repoIds = (portfolio.selected_repos || [])
      .map(repoName => allRepos.find(repo => repo.name === repoName)?.id)
      .filter((id): id is number => !!id)
    
    return { templateId, repoIds }
  }, [portfolio, allRepos])

  // State'leri güncelle - sadece processedData değiştiğinde
  useEffect(() => {
    if (processedData) {
      setSelectedTemplate(processedData.templateId)
      setSelectedRepos(processedData.repoIds)
    }
  }, [processedData])

  // Güncelleme sonrası yönlendirme
  useEffect(() => {
    if(isUpdateSuccess) {
      setTimeout(() => {
        router.push('/my-portfolios')
      }, 2000)
    }
  }, [isUpdateSuccess, router])

  // Memoized callback'ler
  const toggleRepo = useCallback((repoId: number) => {
    setSelectedRepos(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    )
  }, [])

  const handleSave = useCallback(async () => {
    console.log('Kaydet tıklandı');
    
    if (!allRepos || selectedRepos.length === 0) {
      console.error('Repo seçimi gerekli');
      return;
    }
    
    const selectedRepoNames = selectedRepos
      .map(repoId => allRepos.find(repo => repo.id === repoId)?.name)
      .filter((name): name is string => !!name);

    const updateData = {
      selected_template: templateIdToName[selectedTemplate],
      selected_repos: selectedRepoNames,
    };
    
    console.log('Update data:', updateData);
    updatePortfolioMutation(updateData);
  }, [allRepos, selectedRepos, selectedTemplate, updatePortfolioMutation])

  const handleViewPortfolio = useCallback(() => {
    window.open(`/portfolio/${portfolioId}`, '_blank')
  }, [portfolioId])

  // Preview fonksiyonu kaldırıldı

  // Loading state - daha hızlı feedback
  if (portfolioLoading || reposLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader demoMode={demoMode} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  if (portfolioError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader demoMode={demoMode} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 p-8">
              <AlertCircle className="w-12 h-12 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Hata</h2>
              <p className="text-red-700">{portfolioError.message}</p>
              <Button variant="primary" onClick={() => router.push('/my-portfolios')}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Portfolyolarıma Dön
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader demoMode={demoMode} />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 p-8">
              <AlertCircle className="w-12 h-12 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">Portfolyo Bulunamadı</h2>
              <p className="text-gray-600">Bu ID ile bir portfolyo bulunamadı.</p>
              <Button variant="primary" onClick={() => router.push('/my-portfolios')}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Geri Dön
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader demoMode={demoMode} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolyo Düzenle</h1>
          <p className="text-gray-600">Portfolyonuzun projelerini ve template'ini güncelleyin</p>
        </div>

        {isUpdateSuccess && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <div className="flex items-center space-x-3 p-6">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-green-800 font-semibold">Başarılı!</h3>
                <p className="text-green-700">Portfolio başarıyla güncellendi. Yönlendiriliyorsunuz...</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Template Seçimi */}
            <Card className="p-0 bg-transparent shadow-none border-none">
              <TemplateSelection
                templates={Object.entries(templateDisplayNames).map(([id, name]) => ({
                  id: Number(id),
                  name,
                  description: '',
                  previewHtml: '',
                  features: [],
                }))}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
                onNext={() => {}}
                onBack={() => {}}
                onPreview={() => {}} // Preview butonu devre dışı
              />
            </Card>

            {/* Proje Seçimi */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">
                  Proje Seçimi ({selectedRepos.length} seçili)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {(allRepos || []).map((repo: GitHubRepo) => (
                    <div
                      key={repo.id}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                        selectedRepos.includes(repo.id) 
                          ? 'border-blue-500 bg-blue-50 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleRepo(repo.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-sm break-words flex-1 mr-2 leading-tight">
                          {repo.name}
                        </h3>
                        <input 
                          type="checkbox" 
                          checked={selectedRepos.includes(repo.id)} 
                          readOnly 
                          className="h-5 w-5 text-blue-600 rounded flex-shrink-0 mt-1"
                        />
                      </div>
                      <p className="text-xs text-gray-600 mb-3 break-words leading-relaxed min-h-[3rem]">
                        {repo.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate mr-2 font-medium bg-gray-100 px-2 py-1 rounded">
                          {repo.language || 'Unknown'}
                        </span>
                        <div className="flex items-center space-x-3 flex-shrink-0">
                          <span className="flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center">
                            <GitBranch className="w-3 h-3 mr-1" />
                            {repo.forks_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mevcut Portfolio Bilgileri */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Mevcut Portfolio</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-600 font-medium text-xs uppercase tracking-wide">Template:</span>
                    <span className="text-gray-900 font-semibold">
                      {(() => {
                        const templateId = portfolio.selected_template && templateNameToId[portfolio.selected_template];
                        return templateId && templateDisplayNames[templateId] 
                          ? templateDisplayNames[templateId]
                          : 'Modern Developer';
                      })()}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-600 font-medium text-xs uppercase tracking-wide">Proje Sayısı:</span>
                    <span className="text-gray-900 font-semibold text-lg">
                      {Array.isArray(portfolio.selected_repos) ? portfolio.selected_repos.length : 0}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-600 font-medium text-xs uppercase tracking-wide">Son Güncelleme:</span>
                    <span className="text-gray-900">
                      {new Date(portfolio.updated_at).toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* İşlemler */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">İşlemler</h3>
                <div className="space-y-4">
                  <Button 
                    variant="secondary" 
                    onClick={handleViewPortfolio} 
                    className="w-full"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Portfolyoyu Görüntüle
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    onClick={handleSave} 
                    disabled={isUpdating || selectedRepos.length === 0} 
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Değişiklikleri Kaydet
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    onClick={() => router.push('/my-portfolios')} 
                    className="w-full"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Geri Dön
                  </Button>
                </div>
                
                {selectedRepos.length === 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="text-red-600 text-sm font-medium">En az bir proje seçmelisiniz</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
      {/* Preview modal'ı kaldırıldı - güvenlik nedeniyle */}
    </div>
  )
} 
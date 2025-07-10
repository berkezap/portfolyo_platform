'use client'

import { useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'
import { usePortfolioEditor } from '@/hooks/usePortfolioEditor'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { GitHubRepo } from '@/types/github'

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

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/')
    }
  }, [sessionStatus, router])

  useEffect(() => {
    if (portfolio && allRepos) {
      const templateId = templateNameToId[portfolio.selected_template]
      if (templateId) setSelectedTemplate(templateId)
      
      const repoIds = (portfolio.selected_repos || [])
        .map(repoName => allRepos.find(repo => repo.name === repoName)?.id)
        .filter((id): id is number => !!id)
      setSelectedRepos(repoIds)
    }
  }, [portfolio, allRepos])

  // Güncelleme sonrası yönlendirme
  useEffect(() => {
    if(isUpdateSuccess) {
      setTimeout(() => {
        router.push('/my-portfolios')
      }, 2000)
    }
  }, [isUpdateSuccess, router])

  const toggleRepo = (repoId: number) => {
    setSelectedRepos(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    )
  }

  const handleSave = async () => {
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
  }

  const handleViewPortfolio = () => {
    window.open(`/portfolio/${portfolioId}`, '_blank')
  }

  if (portfolioLoading || reposLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader demoMode={demoMode} />
        <div className="container mx-auto px-4 py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Portfolyo ve Projeler Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (portfolioError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader demoMode={demoMode} />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">Hata</h2>
            <p className="text-red-700 mb-6">{portfolioError.message}</p>
            <button onClick={() => router.push('/my-portfolios')} className="px-6 py-3 bg-blue-600 text-white rounded-lg">
              Portfolyolarıma Dön
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
        <div className="min-h-screen bg-gray-50">
          <DashboardHeader demoMode={demoMode} />
          <div className="container mx-auto px-4 py-8 text-center">
              <p className="mt-4 text-gray-600">Bu ID ile bir portfolyo bulunamadı.</p>
              <button onClick={() => router.push('/my-portfolios')} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">
                Portfolyolarıma Dön
              </button>
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="text-green-600 text-xl mr-3">✅</div>
              <div>
                <h3 className="text-green-800 font-semibold">Başarılı!</h3>
                <p className="text-green-700">Portfolio başarıyla güncellendi. Yönlendiriliyorsunuz...</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Template Seçimi</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(templateDisplayNames).map(([id, name]) => (
                  <div
                    key={id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${selectedTemplate === Number(id) ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setSelectedTemplate(Number(id))}
                  >
                    <div className="text-center space-y-3">
                       <h3 className="font-bold text-lg text-gray-900">{name}</h3>
                      {selectedTemplate === Number(id) && (
                        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">✓ Seçili</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Proje Seçimi ({selectedRepos.length} seçili)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {(allRepos || []).map((repo: GitHubRepo) => (
                    <div
                      key={repo.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${selectedRepos.includes(repo.id) ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => toggleRepo(repo.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-sm break-words flex-1 mr-2 leading-tight">{repo.name}</h3>
                        <input type="checkbox" checked={selectedRepos.includes(repo.id)} readOnly className="h-5 w-5 text-blue-600 rounded flex-shrink-0 mt-1"/>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 break-words leading-relaxed min-h-[3rem]">{repo.description || 'No description available'}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate mr-2 font-medium bg-gray-100 px-2 py-1 rounded">{repo.language || 'Unknown'}</span>
                        <div className="flex items-center space-x-3 flex-shrink-0">
                          <span className="flex items-center">⭐ {repo.stargazers_count}</span>
                          <span className="flex items-center">🍴 {repo.forks_count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Mevcut Portfolio</h3>
              <div className="space-y-4 text-sm">
                 <div className="flex flex-col space-y-2">
                  <span className="text-gray-600 font-medium text-xs uppercase tracking-wide">Template:</span>
                  <span className="text-gray-900 font-semibold">{templateDisplayNames[templateNameToId[portfolio.selected_template]]}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="text-gray-600 font-medium text-xs uppercase tracking-wide">Proje Sayısı:</span>
                  <span className="text-gray-900 font-semibold text-lg">{Array.isArray(portfolio.selected_repos) ? portfolio.selected_repos.length : 0}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="text-gray-600 font-medium text-xs uppercase tracking-wide">Son Güncelleme:</span>
                  <span className="text-gray-900">{new Date(portfolio.updated_at).toLocaleString('tr-TR')}</span>
                </div>
              </div>
          </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">İşlemler</h3>
              <div className="space-y-4">
                <button onClick={handleViewPortfolio} className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700">👁️ Portfolyoyu Görüntüle</button>
                <button onClick={handleSave} disabled={isUpdating || selectedRepos.length === 0} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg disabled:bg-gray-400">
                  {isUpdating ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
                </button>
                <button onClick={() => router.push('/my-portfolios')} className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700">← Geri Dön</button>
              </div>
              {selectedRepos.length === 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">⚠️ En az bir proje seçmelisiniz</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
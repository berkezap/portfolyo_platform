'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Github, Star, GitFork, Calendar, Globe, Upload, FileText, Check, RefreshCw, LogOut } from 'lucide-react'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'

// Mock GitHub repositories data
const mockRepos = [
  {
    id: 1,
    name: 'e-commerce-app',
    description: 'Modern React e-commerce application with Next.js, TypeScript and Stripe integration',
    html_url: 'https://github.com/user/e-commerce-app',
    language: 'TypeScript',
    stargazers_count: 42,
    forks_count: 12,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-12-20T15:45:00Z',
    topics: ['react', 'nextjs', 'ecommerce', 'typescript'],
    homepage: 'https://my-shop.vercel.app'
  },
  {
    id: 2,
    name: 'task-manager-api',
    description: 'RESTful API for task management built with Node.js, Express, and MongoDB',
    html_url: 'https://github.com/user/task-manager-api',
    language: 'JavaScript',
    stargazers_count: 18,
    forks_count: 5,
    created_at: '2024-02-10T08:20:00Z',
    updated_at: '2024-11-30T12:15:00Z',
    topics: ['nodejs', 'express', 'mongodb', 'api'],
    homepage: null
  },
  {
    id: 3,
    name: 'portfolio-website',
    description: 'Personal portfolio website with modern design and dark mode support',
    html_url: 'https://github.com/user/portfolio-website',
    language: 'JavaScript',
    stargazers_count: 8,
    forks_count: 3,
    created_at: '2024-03-05T14:10:00Z',
    updated_at: '2024-10-15T09:30:00Z',
    topics: ['portfolio', 'website', 'responsive'],
    homepage: 'https://johndoe.dev'
  },
  {
    id: 4,
    name: 'data-visualization-tool',
    description: 'Interactive data visualization dashboard using D3.js and React',
    html_url: 'https://github.com/user/data-visualization-tool',
    language: 'JavaScript',
    stargazers_count: 35,
    forks_count: 8,
    created_at: '2024-04-20T11:45:00Z',
    updated_at: '2024-12-01T16:20:00Z',
    topics: ['d3js', 'react', 'dataviz', 'dashboard'],
    homepage: 'https://dataviz-demo.netlify.app'
  },
  {
    id: 5,
    name: 'mobile-chat-app',
    description: 'Real-time chat application for mobile devices built with React Native',
    html_url: 'https://github.com/user/mobile-chat-app',
    language: 'TypeScript',
    stargazers_count: 67,
    forks_count: 23,
    created_at: '2024-05-12T13:25:00Z',
    updated_at: '2024-12-18T10:45:00Z',
    topics: ['react-native', 'chat', 'realtime', 'firebase'],
    homepage: null
  },
  {
    id: 6,
    name: 'ai-image-generator',
    description: 'AI-powered image generation tool using OpenAI API and Stable Diffusion',
    html_url: 'https://github.com/user/ai-image-generator',
    language: 'Python',
    stargazers_count: 156,
    forks_count: 45,
    created_at: '2024-06-08T09:15:00Z',
    updated_at: '2024-12-22T14:30:00Z',
    topics: ['ai', 'machine-learning', 'image-generation', 'openai'],
    homepage: 'https://ai-img-gen.herokuapp.com'
  }
]

const portfolioTemplates = [
  {
    id: 1,
    name: 'Modern Developer',
    description: 'Clean, minimal design with dark mode support',
    previewHtml: `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100%; padding: 20px; color: white; font-family: Inter, sans-serif;">
        <div style="text-align: center;">
          <h1 style="font-size: 24px; margin-bottom: 8px;">John Doe</h1>
          <p style="opacity: 0.8; margin-bottom: 16px;">Full Stack Developer</p>
          <div style="display: flex; gap: 8px; justify-content: center;">
            <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 6px; font-size: 12px;">React</div>
            <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 6px; font-size: 12px;">Node.js</div>
          </div>
        </div>
        <div style="margin-top: 20px; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
          <h3 style="margin-bottom: 8px; font-size: 14px;">Modern E-commerce</h3>
          <p style="font-size: 12px; opacity: 0.8;">TypeScript, React, Next.js</p>
        </div>
      </div>
    `,
    features: ['Dark/Light Mode', 'Responsive Design', 'Project Showcase', 'CV Section']
  },
  {
    id: 2,
    name: 'Creative Portfolio',
    description: 'Colorful, creative layout perfect for frontend developers',
    previewHtml: `
      <div style="background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); background-size: 400% 400%; animation: gradient 3s ease infinite; height: 100%; padding: 20px; color: white; font-family: Poppins, sans-serif;">
        <div style="text-align: center;">
          <h1 style="font-size: 22px; margin-bottom: 8px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Creative Dev</h1>
          <p style="margin-bottom: 16px; font-size: 14px;">🎨 Frontend Wizard</p>
          <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
            <div style="background: linear-gradient(45deg, #ff6b6b, #ee5a24); padding: 6px 12px; border-radius: 20px; font-size: 10px;">Vue.js</div>
            <div style="background: linear-gradient(45deg, #4ecdc4, #45b7d1); padding: 6px 12px; border-radius: 20px; font-size: 10px;">Animation</div>
          </div>
        </div>
        <div style="margin-top: 16px; background: rgba(255,255,255,0.15); padding: 10px; border-radius: 12px; backdrop-filter: blur(10px);">
          <h3 style="margin-bottom: 6px; font-size: 12px;">🚀 Cool Project</h3>
          <p style="font-size: 10px; opacity: 0.9;">Creative animations & effects</p>
        </div>
      </div>
    `,
    features: ['Animations', 'Grid Layout', 'Image Gallery', 'Contact Form']
  },
  {
    id: 3,
    name: 'Professional Tech',
    description: 'Corporate-style design ideal for senior developers',
    previewHtml: `
      <div style="background: #2c3e50; height: 100%; padding: 20px; color: white; font-family: Roboto, sans-serif;">
        <div style="text-align: center; border-bottom: 1px solid #34495e; padding-bottom: 16px;">
          <h1 style="font-size: 20px; margin-bottom: 6px; font-weight: 700;">Senior Developer</h1>
          <p style="color: #bdc3c7; font-size: 12px;">Technical Lead & Architect</p>
        </div>
        <div style="margin-top: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px;">JavaScript</span>
            <span style="font-size: 10px; color: #3498db;">95%</span>
          </div>
          <div style="background: #34495e; height: 4px; border-radius: 2px;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); width: 95%; height: 100%; border-radius: 2px;"></div>
          </div>
        </div>
        <div style="margin-top: 12px; background: #34495e; padding: 10px; border-radius: 6px; border-left: 3px solid #3498db;">
          <h3 style="margin-bottom: 4px; font-size: 12px;">Enterprise Platform</h3>
          <p style="font-size: 10px; color: #bdc3c7;">Microservices Architecture</p>
        </div>
      </div>
    `,
    features: ['Timeline View', 'Skill Bars', 'Testimonials', 'Blog Section']
  }
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const { repos: realRepos, loading: reposLoading, error: reposError, refetch } = useGitHubRepos()
  
  // Demo mode kontrolü
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  
  // Mock veriler veya gerçek veriler
  const repos = demoMode ? mockRepos : realRepos
  
  const [selectedRepos, setSelectedRepos] = useState<number[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [step, setStep] = useState<'repos' | 'template' | 'cv' | 'generate' | 'completed'>('repos')
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; templateId: number | null }>({ isOpen: false, templateId: null })

  const toggleRepo = (repoId: number) => {
    setSelectedRepos(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    )
  }

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setCvFile(file)
    }
  }

  const handleGenerate = () => {
    setStep('generate')
    // Bu kısım gerçek uygulamada portfolyo oluşturma işlemini yapacak
    setTimeout(() => {
      setStep('completed')
    }, 3000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 rounded-lg p-2">
                <Github className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PortfolYO</span>
            </div>
            <div className="flex items-center space-x-4">
              {demoMode ? (
                <>
                  <span className="text-sm text-gray-600">Mock User (Demo Mode)</span>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">MU</span>
                  </div>
                  <a
                    href="/"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Ana Sayfa
                  </a>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-600">{session?.user?.name || 'GitHub User'}</span>
                  {session?.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Github className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Çıkış
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto px-4">
            <div className={`flex items-center space-x-2 ${step === 'repos' ? 'text-blue-600' : step === 'template' || step === 'cv' || step === 'generate' || step === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'repos' ? 'border-blue-600 bg-blue-50' : step === 'template' || step === 'cv' || step === 'generate' || step === 'completed' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                {step === 'template' || step === 'cv' || step === 'generate' || step === 'completed' ? <Check className="h-5 w-5" /> : '1'}
              </div>
              <span className="font-medium text-sm md:text-base">Repo Seçimi</span>
            </div>
            
            <div className="w-16 h-px bg-gray-300"></div>
            
                         <div className={`flex items-center space-x-2 ${step === 'template' ? 'text-blue-600' : step === 'cv' || step === 'generate' || step === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'template' ? 'border-blue-600 bg-blue-50' : step === 'cv' || step === 'generate' || step === 'completed' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                 {step === 'cv' || step === 'generate' || step === 'completed' ? <Check className="h-5 w-5" /> : '2'}
              </div>
              <span className="font-medium text-sm md:text-base">Şablon</span>
            </div>
            
            <div className="w-16 h-px bg-gray-300"></div>
            
                         <div className={`flex items-center space-x-2 ${step === 'cv' ? 'text-blue-600' : step === 'generate' || step === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'cv' ? 'border-blue-600 bg-blue-50' : step === 'generate' || step === 'completed' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                 {step === 'generate' || step === 'completed' ? <Check className="h-5 w-5" /> : '3'}
              </div>
              <span className="font-medium text-sm md:text-base">CV Yükleme</span>
            </div>
            
            <div className="w-16 h-px bg-gray-300"></div>
            
                         <div className={`flex items-center space-x-2 ${step === 'generate' ? 'text-blue-600' : step === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'generate' ? 'border-blue-600 bg-blue-50' : step === 'completed' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                 {step === 'completed' ? <Check className="h-5 w-5" /> : '4'}
              </div>
              <span className="font-medium text-sm md:text-base">Oluştur</span>
            </div>
          </div>
        </div>

        {/* Step 1: Repository Selection */}
        {step === 'repos' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Projelerinizi Seçin
              </h1>
              <p className="text-gray-600 mb-4">
                Portfolyonuzda göstermek istediğiniz 4-6 projeyi seçin. En iyi projelerinizi seçmenizi öneririz.
              </p>
              
              {!demoMode && (
                <div className="flex items-center justify-center space-x-4">
                  {reposLoading && (
                    <div className="flex items-center text-blue-600">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      GitHub'dan projeler yükleniyor...
                    </div>
                  )}
                  {reposError && (
                    <div className="text-red-600 text-sm">
                      Hata: {reposError} 
                      <button 
                        onClick={refetch}
                        className="ml-2 text-blue-600 hover:text-blue-700 underline"
                      >
                        Tekrar Dene
                      </button>
                    </div>
                  )}
                  {!reposLoading && !reposError && repos.length === 0 && (
                    <div className="text-gray-500 text-sm">
                      Hiç public repository bulunamadı
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reposLoading && !demoMode ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border-2 border-gray-200 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                repos.map((repo) => (
                <div
                  key={repo.id}
                  className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedRepos.includes(repo.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleRepo(repo.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 truncate">{repo.name}</h3>
                    <input
                      type="checkbox"
                      checked={selectedRepos.includes(repo.id)}
                      onChange={() => {}}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {repo.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        repo.language === 'TypeScript' ? 'bg-blue-500' :
                        repo.language === 'JavaScript' ? 'bg-yellow-500' :
                        repo.language === 'Python' ? 'bg-green-500' : 'bg-gray-500'
                      }`}></div>
                      {repo.language}
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {repo.stargazers_count}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                ))
              )}
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep('template')}
                disabled={selectedRepos.length === 0}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Devam Et ({selectedRepos.length} proje seçildi)
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 'template' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Şablonunuzu Seçin
              </h1>
              <p className="text-gray-600">
                Portfolyonuz için modern ve profesyonel şablonlardan birini seçin.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {portfolioTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="aspect-video bg-white rounded-lg mb-4 border overflow-hidden">
                    <iframe
                      srcDoc={template.previewHtml}
                      className="w-full h-full border-0"
                      title={`${template.name} Preview`}
                    />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  
                  <div className="space-y-1 mb-4">
                    {template.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewModal({ isOpen: true, templateId: template.id })
                    }}
                    className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Globe className="h-4 w-4 mr-1 inline" />
                    Büyük Önizleme
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep('cv')}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Devam Et
              </button>
            </div>

            {/* Template Preview Modal */}
            {previewModal.isOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">
                      {portfolioTemplates.find(t => t.id === previewModal.templateId)?.name} - Önizleme
                    </h3>
                    <button
                      onClick={() => setPreviewModal({ isOpen: false, templateId: null })}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 p-4">
                    <iframe
                      srcDoc={portfolioTemplates.find(t => t.id === previewModal.templateId)?.previewHtml}
                      className="w-full h-full border border-gray-200 rounded-lg"
                      title="Template Preview"
                    />
                  </div>
                  <div className="p-4 border-t flex justify-between">
                    <button
                      onClick={() => {
                        if (previewModal.templateId) {
                          setSelectedTemplate(previewModal.templateId)
                        }
                        setPreviewModal({ isOpen: false, templateId: null })
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Bu Şablonu Seç
                    </button>
                    <button
                      onClick={() => setPreviewModal({ isOpen: false, templateId: null })}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: CV Upload */}
        {step === 'cv' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                CV'nizi Yükleyin (Opsiyonel)
              </h1>
              <p className="text-gray-600">
                Portfolio sitenizde CV'nizi de göstermek istiyorsanız PDF formatında yükleyebilirsiniz.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                cvFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
              }`}>
                {cvFile ? (
                  <div>
                    <FileText className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-green-700 font-medium mb-2">{cvFile.name}</p>
                    <p className="text-sm text-green-600">CV başarıyla yüklendi!</p>
                    <button
                      onClick={() => setCvFile(null)}
                      className="mt-2 text-sm text-green-600 hover:text-green-700 underline"
                    >
                      Değiştir
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">CV'nizi buraya sürükleyin</p>
                    <p className="text-sm text-gray-500 mb-4">veya dosya seçmek için tıklayın</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleCvUpload}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      PDF Seç
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-8 space-x-4">
              <button
                onClick={handleGenerate}
                className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                CV Olmadan Devam Et
              </button>
              <button
                onClick={handleGenerate}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Portfolyomu Oluştur
              </button>
            </div>
          </div>
        )}

                 {/* Step 4: Generate */}
         {step === 'generate' && (
           <div className="text-center">
             <div className="max-w-md mx-auto">
               <div className="bg-white rounded-lg p-8 shadow-lg">
                 <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-4">
                   Portfolyonuz Oluşturuluyor...
                 </h2>
                 <p className="text-gray-600 mb-6">
                   Seçtiğiniz {selectedRepos.length} proje ve şablon kullanılarak portfolyo sitesi hazırlanıyor.
                 </p>
                 <div className="space-y-2 text-sm text-gray-500">
                   <p>✅ GitHub verileriniz çekiliyor...</p>
                   <p>✅ Şablon uygulanıyor...</p>
                   <p>⏳ Statik site oluşturuluyor...</p>
                   <p>⏳ Canlıya alınıyor...</p>
                 </div>
               </div>
             </div>
           </div>
         )}

         {/* Step 5: Completed */}
         {step === 'completed' && (
           <div className="text-center">
             <div className="max-w-lg mx-auto">
               <div className="bg-white rounded-lg p-8 shadow-lg">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Check className="h-10 w-10 text-green-600" />
                 </div>
                 <h2 className="text-3xl font-bold text-gray-900 mb-4">
                   🎉 Portfolyonuz Hazır!
                 </h2>
                 <p className="text-gray-600 mb-6">
                   Tebrikler! Portfolyo siteniz başarıyla oluşturuldu ve canlıya alındı.
                 </p>
                 
                 <div className="bg-gray-50 rounded-lg p-4 mb-6">
                   <p className="text-sm text-gray-600 mb-2">Portfolio siteniz:</p>
                   <p className="font-mono text-blue-600 font-medium break-all">
                     https://mockuser.portfolyo.dev
                   </p>
                 </div>

                 <div className="space-y-4">
                   <button
                     onClick={() => window.open('https://portfolyo.dev/templates/modern-demo', '_blank')}
                     className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                   >
                     <Globe className="inline-block mr-2 h-5 w-5" />
                     Portfolyonu Görüntüle
                   </button>
                   
                   <div className="grid grid-cols-2 gap-3">
                     <button
                       onClick={() => window.open('https://twitter.com/intent/tweet?text=PortfolYO ile 5 dakikada portfolyo oluşturdum! 🚀', '_blank')}
                       className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                     >
                       📢 Paylaş
                     </button>
                     <button
                       onClick={() => setStep('repos')}
                       className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                     >
                       🔄 Yeni Portfolyo
                     </button>
                   </div>
                 </div>

                 <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                   <p className="text-sm text-blue-800">
                     <strong>Demo Modu:</strong> Bu portfolyo gerçek değildir. Gerçek portfolyo oluşturmak için GitHub OAuth'u kurmanız gerekir.
                   </p>
                 </div>
               </div>
             </div>
           </div>
         )}
      </div>
    </div>
  )
} 
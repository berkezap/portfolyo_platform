'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'
import { usePortfolioGenerator } from '@/hooks/usePortfolioGenerator'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ProgressSteps } from '@/components/dashboard/ProgressSteps'
import { RepositorySelection } from '@/components/dashboard/steps/RepositorySelection'
import { TemplateSelection } from '@/components/dashboard/steps/TemplateSelection'
import { CVUpload } from '@/components/dashboard/steps/CVUpload'
import { GenerateStep } from '@/components/dashboard/steps/GenerateStep'
import { CompletedStep } from '@/components/dashboard/steps/CompletedStep'
import { StepType, PortfolioTemplate } from '@/types/dashboard'

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

const portfolioTemplates: PortfolioTemplate[] = [
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
  const { generatePortfolio, result: portfolioResult, loading: portfolioLoading, error: portfolioError, clearResult } = usePortfolioGenerator()
  
  // Demo mode kontrolü
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  
  // Mock veriler veya gerçek veriler
  const repos = demoMode ? mockRepos : realRepos
  
  // Template ID'lerini şablon isimlerine çevir
  const templateIdToName = {
    1: 'modern-developer',
    2: 'creative-portfolio',
    3: 'professional-tech'
  }
  
  const [selectedRepos, setSelectedRepos] = useState<number[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [step, setStep] = useState<StepType>('repos')
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

  const handleGenerate = async () => {
    console.log('🎬 handleGenerate çağrıldı! Demo mode:', demoMode)
    // Demo mode'da da gerçek portfolio oluştur ama mock verilerle
    setStep('generate')
    clearResult()
    
    try {
      const templateName = templateIdToName[selectedTemplate as keyof typeof templateIdToName]
      console.log('📋 Seçilen template:', templateName)
      
      // Selected repo ID'lerini isimlere çevir
      const selectedRepoNames = selectedRepos
        .map(repoId => repos.find(repo => repo.id === repoId)?.name)
        .filter(Boolean) as string[]
      
      console.log('📋 Seçilen repo ID\'leri:', selectedRepos)
      console.log('📋 Seçilen repo isimleri:', selectedRepoNames)
      
      // CV URL'i oluştur (gelecekte file upload implementasyonu için)
      const cvUrl = cvFile ? URL.createObjectURL(cvFile) : undefined
      
      await generatePortfolio(templateName, selectedRepoNames, cvUrl)
      
      // Portfolyo başarıyla oluşturulduysa completed adımına geç
      setStep('completed')
    } catch (error) {
      console.error('Portfolio generation failed:', error)
      // Hata durumunda geri dön
      setStep('cv')
    }
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader demoMode={demoMode} />

      <div className="container mx-auto px-4 py-8">
        <ProgressSteps currentStep={step} />

        {/* Step 1: Repository Selection */}
        {step === 'repos' && (
          <RepositorySelection
            repos={repos}
            selectedRepos={selectedRepos}
            onToggleRepo={toggleRepo}
            onNext={() => setStep('template')}
            demoMode={demoMode}
            loading={reposLoading}
            error={reposError}
            onRefetch={refetch}
          />
        )}

        {/* Step 2: Template Selection */}
        {step === 'template' && (
          <TemplateSelection
            templates={portfolioTemplates}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            onNext={() => setStep('cv')}
            onBack={() => setStep('repos')}
            onPreview={(templateId) => setPreviewModal({ isOpen: true, templateId })}
          />
        )}

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

        {/* Step 3: CV Upload */}
        {step === 'cv' && (
          <CVUpload
            cvFile={cvFile}
            onFileUpload={handleCvUpload}
            onClearFile={() => setCvFile(null)}
            onNext={handleGenerate}
            onBack={() => setStep('template')}
          />
        )}

         {/* Step 4: Generate */}
         {step === 'generate' && (
           <GenerateStep
             selectedReposCount={selectedRepos.length}
             demoMode={demoMode}
             portfolioLoading={portfolioLoading}
             portfolioResult={portfolioResult}
             portfolioError={portfolioError}
             onBack={() => setStep('cv')}
           />
         )}

         {/* Step 5: Completed */}
         {step === 'completed' && (
           <CompletedStep
             demoMode={demoMode}
             portfolioResult={portfolioResult}
             portfolioError={portfolioError}
             userName={session?.user?.name || undefined}
             onNewPortfolio={() => {
               setStep('repos')
               clearResult()
               setSelectedRepos([])
               setSelectedTemplate(1)
               setCvFile(null)
             }}
           />
         )}
      </div>
    </div>
  )
} 
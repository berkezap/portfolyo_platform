'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useGitHubRepos } from '@/hooks/useGitHubRepos';
import { usePortfolioGenerator } from '@/hooks/usePortfolioGenerator';
import { usePortfolioList } from '@/hooks/usePortfolioList';
import { DashboardHeader } from '@/components/dashboard/DashboardHeaderNew';
import { ProgressSteps } from '@/components/dashboard/ProgressStepsNew';
import UpgradePrompt from '@/components/dashboard/UpgradePrompt';
import PortfolioLimitBanner from '@/components/dashboard/PortfolioLimitBanner';
import { useSubscription } from '@/hooks/useSubscription';
import { StepType, PortfolioTemplate } from '@/types/dashboard';
import ErrorBoundary, { DashboardErrorFallback } from '@/components/ErrorBoundary';
import Button from '@/components/ui/Button';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dinamik import'lar - sadece ihtiyaç anında yüklenecek
const RepositorySelection = dynamic(
  () =>
    import('@/components/dashboard/steps/RepositorySelection').then((mod) => ({
      default: mod.RepositorySelection,
    })),
  {
    loading: () => <div className="animate-pulse bg-transparent h-16 rounded-lg"></div>,
    ssr: false,
  },
);

const TemplateSelection = dynamic(
  () =>
    import('@/components/dashboard/steps/TemplateSelection').then((mod) => ({
      default: mod.TemplateSelection,
    })),
  {
    loading: () => <div className="animate-pulse bg-transparent h-16 rounded-lg"></div>,
    ssr: false,
  },
);

const CVUpload = dynamic(
  () => import('@/components/dashboard/steps/CVUpload').then((mod) => ({ default: mod.CVUpload })),
  {
    loading: () => <div className="animate-pulse bg-transparent h-16 rounded-lg"></div>,
    ssr: false,
  },
);

const GenerateStep = dynamic(
  () =>
    import('@/components/dashboard/steps/GenerateStep').then((mod) => ({
      default: mod.GenerateStep,
    })),
  {
    loading: () => <div className="animate-pulse bg-transparent h-16 rounded-lg"></div>,
    ssr: false,
  },
);

const CompletedStep = dynamic(
  () =>
    import('@/components/dashboard/steps/CompletedStep').then((mod) => ({
      default: mod.CompletedStep,
    })),
  {
    loading: () => <div className="animate-pulse bg-transparent h-16 rounded-lg"></div>,
    ssr: false,
  },
);

// Mock GitHub repositories data
const mockRepos = [
  {
    id: 1,
    name: 'e-commerce-app',
    description:
      'Modern React e-commerce application with Next.js, TypeScript and Stripe integration',
    html_url: 'https://github.com/user/e-commerce-app',
    language: 'TypeScript',
    stargazers_count: 42,
    forks_count: 12,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-12-20T15:45:00Z',
    topics: ['react', 'nextjs', 'ecommerce', 'typescript'],
    homepage: 'https://my-shop.vercel.app',
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
    homepage: null,
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
    homepage: 'https://johndoe.dev',
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
    homepage: 'https://dataviz-demo.netlify.app',
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
    homepage: null,
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
    homepage: 'https://ai-img-gen.herokuapp.com',
  },
];

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
        <div style="margin-top: 20px; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
          <h3 style="margin-bottom: 8px; font-size: 14px;">Modern E-commerce</h3>
          <p style="font-size: 12px; opacity: 0.8;">TypeScript, React, Next.js</p>
        </div>
      </div>
    `,
    features: ['Dark/Light Mode', 'Responsive Design', 'Project Showcase', 'CV Section'],
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
    features: ['Animations', 'Grid Layout', 'Image Gallery', 'Contact Form'],
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
    features: ['Timeline View', 'Skill Bars', 'Testimonials', 'Blog Section'],
  },
  // YENİ TEMPLATE'LER
  {
    id: 4,
    name: 'Minimalist Professional',
    description: 'Monokrom, grid tabanlı, tipografi odaklı minimalist portfolyo.',
    previewHtml: `
      <div style="background: #F1F1F1; color: #111; font-family: Inter, sans-serif; padding: 24px; border-radius: 12px; border: 1px solid #E5E5E5;">
        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">Minimalist Pro</h1>
        <p style="font-size: 13px; color: #555; margin-bottom: 12px;">Senior Backend Engineer</p>
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <span style="color: #2563eb;">GitHub</span>
          <span style="color: #2563eb;">LinkedIn</span>
        </div>
        <div style="background: #fff; border-radius: 8px; padding: 10px;">
          <h3 style="font-size: 14px; font-weight: 600;">Project Title</h3>
          <p style="font-size: 12px; color: #555;">Short project description.</p>
        </div>
      </div>
    `,
    features: ['Strict Grid', 'Monochrome', 'Minimal Accent', 'Professional'],
  },
  {
    id: 5,
    name: 'Creative Technologist',
    description: 'Koyu tema, neon vurgular, animasyonlu ve enerjik portfolyo.',
    previewHtml: `
      <div style="background: linear-gradient(90deg, #1A1A1A 60%, #F000B8 100%); color: #E0E0E0; font-family: Satoshi, sans-serif; padding: 24px; border-radius: 12px;">
        <h1 style="font-size: 22px; font-family: 'JetBrains Mono', monospace; background: linear-gradient(45deg, #F000B8, #32F5C8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Creative Tech</h1>
        <p style="font-size: 13px; color: #32F5C8; margin-bottom: 12px;">Frontend / Fullstack</p>
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <span style="color: #32F5C8;">GitHub</span>
          <span style="color: #F000B8;">LinkedIn</span>
        </div>
        <div style="background: #212121; border-radius: 8px; padding: 10px;">
          <h3 style="font-size: 14px; font-weight: 600;">Project Name</h3>
          <p style="font-size: 12px; color: #808080;">Energetic project card.</p>
        </div>
      </div>
    `,
    features: ['Dark Mode', 'Neon Accent', 'Micro-interactions', 'Animated'],
  },
  {
    id: 6,
    name: 'Storyteller',
    description: 'Dikey zaman çizgisi, anlatı odaklı, sıcak renkli portfolyo.',
    previewHtml: `
      <div style="background: #FFF7ED; color: #B24536; font-family: Lora, serif; padding: 24px; border-radius: 12px; border: 1px solid #F2994A;">
        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">Storyteller</h1>
        <p style="font-size: 13px; color: #B24536; margin-bottom: 12px;">A Narrative Journey</p>
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <span style="color: #B24536;">GitHub</span>
          <span style="color: #B24536;">LinkedIn</span>
        </div>
        <div style="background: #fff; border-radius: 8px; padding: 10px;">
          <h3 style="font-size: 14px; font-weight: 600;">Case Study</h3>
          <p style="font-size: 12px; color: #7C5E48;">Project as a story.</p>
        </div>
      </div>
    `,
    features: ['Timeline', 'Serif Headings', 'Case Study', 'Warm Colors'],
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { currentPlan, canCreatePortfolio, portfolioLimit } = useSubscription();
  const {
    data: realRepos,
    isLoading: reposLoading,
    error: _reposError,
    refetch,
  } = useGitHubRepos();
  const {
    generatePortfolio,
    result: portfolioResult,
    loading: portfolioLoading,
    error: portfolioError,
    clearResult,
  } = usePortfolioGenerator();

  // Portfolio listesini yenilemek için refetch fonksiyonu
  const {
    portfolios,
    isLoading: portfoliosLoading,
    refetch: refetchPortfolios,
  } = usePortfolioList(Boolean(session));

  // Demo mode kontrolü
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  const repos = demoMode ? mockRepos : realRepos || [];

  // Template ID'lerini şablon isimlerine çevir
  const templateIdToName = {
    1: 'modern-developer',
    2: 'creative-portfolio',
    3: 'professional-tech',
    4: 'minimalist-professional',
    5: 'creative-technologist',
    6: 'storyteller',
  };

  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [step, setStep] = useState<StepType>('repos');
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; templateId: number | null }>({
    isOpen: false,
    templateId: null,
  });
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);

  const toggleRepo = (repoId: number) => {
    setSelectedRepos((prev) =>
      prev.includes(repoId) ? prev.filter((id) => id !== repoId) : [...prev, repoId],
    );
  };

  const handleCvUpload = async (file: File) => {
    setCvUploading(true);
    setCvError(null);

    try {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      const ALLOWED_TYPES = ['application/pdf'];

      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Sadece PDF formatındaki dosyalar kabul edilmektedir.');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Dosya boyutu çok büyük. Maksimum 10MB olmalıdır.`);
      }

      // 1) Get signed URL
      const res = await fetch('/api/upload/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });

      if (!res.ok) throw new Error('Signed URL alınamadı');
      const { uploadUrl, publicUrl } = await res.json();

      // 2) Upload file
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'x-upsert': 'true',
        },
      });

      if (!putRes.ok) throw new Error('Dosya yüklenemedi');

      setCvUrl(publicUrl);
    } catch (err: unknown) {
      setCvError(err instanceof Error ? err.message : 'Dosya yüklenirken hata');
    } finally {
      setCvUploading(false);
    }
  };

  const handleGenerate = async () => {
    // Demo mode'da da gerçek portfolio oluştur ama mock verilerle
    setStep('generate');
    clearResult();

    try {
      const templateName = templateIdToName[selectedTemplate as keyof typeof templateIdToName];

      // Selected repo ID'lerini isimlere çevir
      const selectedRepoNames = selectedRepos
        .map((repoId) => repos.find((repo) => repo.id === repoId)?.name)
        .filter(Boolean) as string[];

      await generatePortfolio(templateName, selectedRepoNames, cvUrl || undefined);

      // Portfolio listesini yenile ve finished adımına geç
      await refetchPortfolios();
      setStep('completed');
    } catch (genError) {
      console.error('Portfolio generation failed:', genError);
      // Hata mesajını kullanıcıya göster
      setCvError(genError instanceof Error ? genError.message : 'Oluşturma başarısız oldu');
      setStep('cv');
    }
  }; // handleGoToDashboard kaldırıldı - kullanılmıyor

  const handlePreview = async (templateId: number) => {
    setPreviewModal({ isOpen: true, templateId });
    setPreviewLoading(true);

    try {
      const response = await fetch(`/api/templates/preview/${templateId}`);
      if (response.ok) {
        const html = await response.text();
        setPreviewHtml(html);
      } else {
        setPreviewHtml('<div class="p-8 text-center text-red-600">Template yüklenemedi</div>');
      }
    } catch {
      setPreviewHtml(
        '<div class="p-8 text-center text-red-600">Template yüklenirken hata oluştu</div>',
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <ErrorBoundary fallback={DashboardErrorFallback}>
      {/* Ana Konteynır - Header için yer bırak */}
      <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA', paddingTop: '64px' }}>
        <DashboardHeader demoMode={demoMode} />

        {/* Geniş sayfa konteyneri - cömert kenar boşlukları */}
        <div className="max-w-screen-2xl mx-auto px-8 lg:px-16 xl:px-24 py-16">
          {/* Progress Steps - Header'a daha yakın */}
          <div className="mt-4 mb-8">
            <ProgressSteps currentStep={step} />
          </div>

          {/* Subscription Status & Upgrade Prompts */}
          <div className="mb-8 space-y-4">
            {/* Portfolio Limit Banner */}
            <PortfolioLimitBanner
              currentCount={portfolios?.length || 0}
              maxAllowed={portfolioLimit}
              planType={currentPlan}
            />

            {/* Upgrade Prompt for Free Users */}
            {currentPlan === 'FREE' && <UpgradePrompt currentPlan={currentPlan} />}
          </div>

          {/* Ana içerik alanı - merkezde ama geniş */}
          <div className="max-w-6xl mx-auto">
            {/* Step 1: Repository Selection - Daha az iç padding */}
            {step === 'repos' && (
              <div className="px-120 py-8">
                <RepositorySelection
                  key={`repos-${repos.length}-${reposLoading}`}
                  repos={repos}
                  selectedRepos={selectedRepos}
                  onToggleRepo={toggleRepo}
                  onNext={() => setStep('template')}
                  demoMode={demoMode}
                  loading={reposLoading}
                  error={_reposError?.message || null}
                  onRefetch={refetch}
                />
              </div>
            )}

            {/* Step 2: Template Selection - Geniş iç padding */}
            {step === 'template' && (
              <div className="px-12 py-8">
                <TemplateSelection
                  templates={portfolioTemplates}
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={setSelectedTemplate}
                  onNext={() => setStep('cv')}
                  onBack={() => setStep('repos')}
                  onPreview={handlePreview}
                />
              </div>
            )}

            {/* Step 3: CV Upload - Geniş iç padding */}
            {step === 'cv' && (
              <div className="px-12 py-8">
                <CVUpload
                  cvUrl={cvUrl || undefined}
                  uploading={cvUploading}
                  error={cvError}
                  onUpload={handleCvUpload}
                  onNext={handleGenerate}
                  onBack={() => setStep('template')}
                />
              </div>
            )}

            {/* Step 4: Generate - Geniş iç padding */}
            {step === 'generate' && (
              <div className="px-12 py-8">
                <GenerateStep
                  loading={portfolioLoading}
                  error={portfolioError}
                  onGenerate={handleGenerate}
                  onBack={() => setStep('cv')}
                />
              </div>
            )}

            {/* Step 5: Completed - Geniş iç padding */}
            {step === 'completed' && (
              <div className="px-12 py-8">
                <CompletedStep
                  portfolioResult={portfolioResult}
                  demoMode={demoMode}
                  userName={session?.user?.name || undefined}
                  onNewPortfolio={() => {
                    setStep('repos');
                    clearResult();
                    setSelectedRepos([]);
                    setSelectedTemplate(1);
                    setCvUrl(null);
                    setCvError(null);
                  }}
                />
              </div>
            )}
          </div>

          {/* Template Preview Modal - Geniş padding ve boşluklar */}
          {previewModal.isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-8">
              <div className="bg-white rounded-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {portfolioTemplates.find((t) => t.id === previewModal.templateId)?.name} -
                    Önizleme
                  </h3>
                  <Button
                    onClick={() => {
                      setPreviewModal({ isOpen: false, templateId: null });
                      setPreviewHtml('');
                    }}
                    variant="ghost"
                    icon={X}
                    size="sm"
                  ></Button>
                </div>

                <div className="flex-1 p-8 overflow-auto">
                  {previewLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div
                      className="w-full h-full border border-gray-200 rounded-xl overflow-auto bg-white shadow-inner"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  )}
                </div>

                <div className="px-8 py-6 border-t border-gray-100 flex justify-end space-x-3">
                  <Button
                    onClick={() => {
                      setSelectedTemplate(previewModal.templateId!);
                      setPreviewModal({ isOpen: false, templateId: null });
                      setPreviewHtml('');
                    }}
                    variant="primary"
                    size="md"
                  >
                    Select Template
                  </Button>
                  <Button
                    onClick={() => {
                      setPreviewModal({ isOpen: false, templateId: null });
                      setPreviewHtml('');
                    }}
                    variant="secondary"
                    size="md"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

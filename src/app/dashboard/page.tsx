'use client';

import React, { useState, useEffect } from 'react';
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
import {
  X,
  Check,
  Eye,
  RefreshCw,
  Github,
  AlertCircle,
  Star,
  GitBranch,
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  ExternalLink,
  FolderOpen,
  Share2,
  Download,
} from 'lucide-react';

// Import step components normally
import { RepositorySelection } from '@/components/dashboard/steps/RepositorySelection';
import { CompletedStep } from '@/components/dashboard/steps/CompletedStep';

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
    name: 'Professional Tech',
    description: 'Modern, clean design with dark/light mode toggle - perfect for developers',
    previewHtml: `
      <div style="background: #1C1C1E; height: 100%; padding: 20px; color: #F2F2F7; font-family: Inter, sans-serif; border-radius: 8px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #2C2C2E;">
          <div style="display: flex; gap: 16px; font-size: 11px; color: #8E8E93;">
            <span>About</span>
            <span>Projects</span>
            <span>Contact</span>
          </div>
          <svg style="width: 14px; height: 14px; color: #8E8E93;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </div>
        <!-- Hero -->
        <div style="margin-bottom: 16px;">
          <h1 style="font-size: 20px; margin-bottom: 4px; font-weight: 600;">Alex Johnson</h1>
          <h2 style="font-size: 12px; color: #8E8E93; margin-bottom: 12px;">Senior Full Stack Developer</h2>
          <p style="font-size: 10px; color: #8E8E93; margin-bottom: 12px; line-height: 1.4;">Passionate developer with 5+ years of experience building scalable web applications.</p>
          <div style="display: flex; gap: 12px; font-size: 10px; color: #8E8E93;">
            <span>GitHub</span>
            <span>LinkedIn</span>
            <span style="color: #0A84FF;">View CV</span>
          </div>
        </div>
        <!-- Project Card -->
        <div style="background: #1C1C1E; border: 1px solid #2C2C2E; border-radius: 6px; padding: 12px;">
          <h3 style="font-size: 12px; font-weight: 600; margin-bottom: 4px;">AI Dashboard Platform</h3>
          <p style="font-size: 10px; color: #8E8E93; margin-bottom: 8px; line-height: 1.4;">Modern React dashboard with real-time analytics and AI-powered insights</p>
          <div style="display: flex; gap: 4px; margin-bottom: 8px;">
            <span style="background: rgba(142, 142, 147, 0.12); color: #8E8E93; padding: 2px 6px; border-radius: 8px; font-size: 8px;">React</span>
            <span style="background: rgba(142, 142, 147, 0.12); color: #8E8E93; padding: 2px 6px; border-radius: 8px; font-size: 8px;">TypeScript</span>
            <span style="background: rgba(142, 142, 147, 0.12); color: #8E8E93; padding: 2px 6px; border-radius: 8px; font-size: 8px;">Node.js</span>
          </div>
          <div style="display: flex; gap: 8px; font-size: 9px;">
            <span style="color: #0A84FF;">View Source</span>
            <span style="color: #0A84FF;">Live Demo</span>
          </div>
        </div>
      </div>
    `,
    features: ['Dark/Light Mode', 'Responsive Design', 'Professional', 'Modern CSS'],
  },
  {
    id: 2,
    name: 'Minimalist Professional',
    description: 'Clean, minimal design with perfect typography - ideal for all professions',
    previewHtml: `
      <div style="background: #F1F1F1; height: 100%; padding: 20px; color: #111; font-family: Inter, sans-serif; border-radius: 8px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #E5E5E5;">
          <div style="display: flex; gap: 16px; font-size: 11px; font-weight: 500;">
            <span style="color: #2563eb;">About</span>
            <span>Projects</span>
            <span>Contact</span>
          </div>
          <div style="width: 20px; height: 20px; border: 1px solid #E5E5E5; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg style="width: 12px; height: 12px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71"/>
            </svg>
          </div>
        </div>
        <!-- Hero -->
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 6px;">Sarah Chen</h1>
          <h2 style="font-size: 14px; color: #555; margin-bottom: 12px;">Product Designer & Developer</h2>
          <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 12px; font-size: 11px;">
            <span style="color: #2563eb;">GitHub</span>
            <span style="color: #2563eb;">LinkedIn</span>
            <span style="color: #2563eb;">CV</span>
          </div>
        </div>
        <!-- Project Card -->
        <div style="background: #fff; border-radius: 8px; padding: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 6px;">Design System Platform</h3>
          <p style="font-size: 11px; color: #555; margin-bottom: 8px; line-height: 1.4;">Comprehensive design system with component library and documentation</p>
          <div style="display: flex; gap: 6px;">
            <span style="background: #F1F1F1; color: #2563eb; padding: 2px 8px; border-radius: 12px; font-size: 9px; border: 1px solid #E5E5E5;">Figma</span>
            <span style="background: #F1F1F1; color: #2563eb; padding: 2px 8px; border-radius: 12px; font-size: 9px; border: 1px solid #E5E5E5;">React</span>
            <span style="background: #F1F1F1; color: #2563eb; padding: 2px 8px; border-radius: 12px; font-size: 9px; border: 1px solid #E5E5E5;">Storybook</span>
          </div>
        </div>
      </div>
    `,
    features: ['Dark/Light Mode', 'Minimal Design', 'Perfect Typography', 'Clean Layout'],
  },
  {
    id: 3,
    name: 'Creative Portfolio',
    description: 'Dark theme with electric accents - perfect for creative developers and designers',
    previewHtml: `
      <div style="background: #1A1A1A; height: 100%; padding: 20px; color: #E0E0E0; font-family: Satoshi, sans-serif; border-radius: 8px; position: relative;">
        <!-- Hero Section -->
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24px; font-family: 'JetBrains Mono', monospace; background: linear-gradient(45deg, #F000B8, #32F5C8); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; margin-bottom: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">MAYA DEV</h1>
          <p style="font-size: 11px; color: #32F5C8; margin-bottom: 12px;">Frontend • Designer • Creative Technologist</p>
          <div style="display: flex; justify-content: center; gap: 12px; font-size: 10px; color: #808080;">
            <span style="color: #32F5C8;">GitHub</span>
            <span style="color: #F000B8;">LinkedIn</span>
            <span style="color: #32F5C8;">Portfolio</span>
          </div>
        </div>
        <!-- Project Card with 3D Effect -->
        <div style="background: #212121; border: 1px solid #2A2A2A; border-radius: 12px; padding: 12px; transform: perspective(1000px) rotateX(2deg) rotateY(-2deg); transition: transform 0.3s ease;">
          <h3 style="font-size: 14px; font-family: 'JetBrains Mono', monospace; background: linear-gradient(45deg, #F000B8, #32F5C8); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; margin-bottom: 6px; font-weight: 700;">NEON UI KIT</h3>
          <p style="font-size: 10px; color: #808080; margin-bottom: 8px; line-height: 1.4;">Futuristic UI components with glowing effects and smooth animations</p>
          <div style="display: flex; gap: 4px; margin-bottom: 8px;">
            <span style="color: #808080; border: 1px solid #404040; border-radius: 12px; padding: 2px 6px; font-size: 8px;">React</span>
            <span style="color: #808080; border: 1px solid #404040; border-radius: 12px; padding: 2px 6px; font-size: 8px;">Framer</span>
            <span style="color: #808080; border: 1px solid #404040; border-radius: 12px; padding: 2px 6px; font-size: 8px;">CSS3</span>
          </div>
          <div style="display: flex; gap: 8px; font-size: 9px;">
            <span style="color: #32F5C8;">View Source</span>
            <span style="color: #32F5C8;">Live Demo</span>
          </div>
        </div>
        <!-- Subtle glow effect -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 50%, rgba(240, 0, 184, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(50, 245, 200, 0.05) 0%, transparent 50%); border-radius: 8px; pointer-events: none;"></div>
      </div>
    `,
    features: ['Dark Theme', 'Electric Accents', '3D Effects', 'Creative Design'],
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
    1: 'professional-tech',
    2: 'minimalist-professional',
    3: 'creative-portfolio',
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

// Inline Step Components
interface GenerateStepProps {
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
  onBack: () => void;
}

function GenerateStep({ loading, error, onGenerate, onBack }: GenerateStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-6 py-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
          <span className="text-2xl">🚀</span>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Portfolyo Oluştur</h2>
          <p className="text-sm text-gray-500 max-w-lg">
            Seçtiğiniz bilgilerle portfolyonuz oluşturulacak
          </p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center space-y-4 mt-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <span className="text-blue-700 font-medium text-sm">Portfolyo oluşturuluyor...</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2 mt-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        ) : (
          <Button variant="primary" size="md" onClick={onGenerate} className="px-6 py-3 text-base">
            Portfolyo Oluştur
          </Button>
        )}
      </div>
      <div className="flex justify-between mt-8 mb-8">
        <Button variant="primary" onClick={onBack} className="px-6 py-2">
          Geri
        </Button>
      </div>
    </div>
  );
}

interface TemplateSelectionProps {
  templates: PortfolioTemplate[];
  selectedTemplate: number;
  onSelectTemplate: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
  onPreview: (templateId: number) => void;
}

function TemplateSelection({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onNext,
  onBack,
  onPreview,
}: TemplateSelectionProps) {
  return (
    <div className="max-w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Şablonunuzu Seçin</h1>
        <p className="text-sm text-gray-500">Portfolyonuz için bir şablon seçin</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`
              relative p-6 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col h-full
              ${
                selectedTemplate === template.id
                  ? 'border-blue-300 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
            `}
            onClick={() => onSelectTemplate(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-4">
              <iframe
                srcDoc={template.previewHtml}
                className="w-full h-full border-0 pointer-events-none transform scale-75 origin-top-left"
                title={`${template.name} Preview`}
                style={{ width: '133.33%', height: '133.33%' }}
              />
            </div>

            <div className="space-y-3 flex-1 flex flex-col">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
              </div>

              <div className="h-16 flex flex-wrap gap-2 content-start">
                {template.features.slice(0, 3).map((feature) => (
                  <span
                    key={feature}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md h-fit"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-2 mt-auto">
                <Button
                  variant={selectedTemplate === template.id ? 'primary' : 'secondary'}
                  size="sm"
                  className="flex-1 text-sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onSelectTemplate(template.id);
                  }}
                >
                  {selectedTemplate === template.id ? 'Seçildi' : 'Seç'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onPreview(template.id);
                  }}
                  className="!px-3"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Button variant="secondary" size="md" onClick={onBack} className="px-6 py-2">
          Geri
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={!selectedTemplate}
          className="px-6 py-2"
        >
          Devam Et
        </Button>
      </div>
    </div>
  );
}

interface CVUploadProps {
  cvUrl?: string;
  uploading: boolean;
  error: string | null;
  onUpload: (file: File) => void;
  onNext: () => void;
  onBack: () => void;
}

function CVUpload({ cvUrl, uploading, error, onUpload, onNext, onBack }: CVUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && typeof onUpload === 'function') {
      onUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">CV Yükle (Opsiyonel)</h1>
        <p className="text-sm text-gray-500">
          CV dosyanızı yükleyerek portfolyonuza ekleyebilirsiniz
        </p>
      </div>

      <div className="flex flex-col items-center space-y-6 py-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-2">
          <UploadCloud className="w-6 h-6 text-white" />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />

        {cvUrl ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-green-700 text-sm font-medium">CV başarıyla yüklendi</span>
            </div>
            <Button
              variant="secondary"
              onClick={handleClick}
              disabled={uploading}
              className="px-6 py-2"
            >
              Başka CV Yükle
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={handleClick}
            disabled={uploading}
            className="px-6 py-2"
          >
            {uploading ? 'Yükleniyor...' : 'CV Yükle'}
          </Button>
        )}
        {error && (
          <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2 mt-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        )}
        <span className="text-gray-500 text-xs mt-2 max-w-lg leading-relaxed">
          CV dosyanız sadece sizin tarafınızdan görüntülenir ve asla üçüncü kişilerle paylaşılmaz.
          Dosya boyutu 5MB&apos;ı geçmemelidir.
        </span>
      </div>
      <div className="flex justify-between mt-8 mb-8">
        <Button variant="primary" onClick={onBack} className="px-6 py-2">
          Geri
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!cvUrl} className="px-6 py-2">
          Devam Et
        </Button>
      </div>
    </div>
  );
}

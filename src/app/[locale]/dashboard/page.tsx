'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
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
import { PublishStep } from '@/components/dashboard/steps/PublishStep';
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
import { TEMPLATES } from '@/config/templates';

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

// Generate templates from config
const portfolioTemplates: PortfolioTemplate[] = TEMPLATES.map((template, index) => ({
  id: index + 1,
  name: template.name,
  description: template.description,
  previewHtml: `<div style="padding: 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); color: white; border-radius: 8px; height: 100%; display: flex; flex-direction: column; justify-content: center;"><h3 style="font-size: 16px; margin-bottom: 8px; font-weight: 700;">${template.name}</h3><p style="font-size: 10px; margin-bottom: 12px; opacity: 0.9;">${template.description}</p><div style="display: flex; gap: 4px; justify-content: center; flex-wrap: wrap;">${template.features.map((f) => `<span style="font-size: 8px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">${f}</span>`).join('')}</div></div>`,
  features: template.features,
}));

export default function DashboardPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
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
    result,
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
  // Map template IDs to slugs from config
  const templateIdToName: { [key: number]: string } = {};
  TEMPLATES.forEach((template, index) => {
    templateIdToName[index + 1] = template.id;
  });

  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [step, setStep] = useState<StepType>('repos');
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [isDevelopment, setIsDevelopment] = useState<boolean>(false);
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
    // Portfolio oluştur ve publish step'ine geç
    console.log('🚀 handleGenerate başladı');
    setCvError(null);

    try {
      const templateName = templateIdToName[selectedTemplate as keyof typeof templateIdToName];

      if (!templateName) {
        console.error('❌ Template name bulunamadı:', selectedTemplate);
        setCvError('Template not found. Please select a valid template.');
        return;
      }

      // Selected repo ID'lerini isimlere çevir
      const selectedRepoNames = selectedRepos
        .map((repoId) => repos.find((repo) => repo.id === repoId)?.name)
        .filter(Boolean) as string[];

      console.log('📋 Portfolio generate çağrılacak:', { templateName, selectedRepoNames, cvUrl });
      const generatedPortfolioId = await generatePortfolio(
        templateName,
        selectedRepoNames,
        cvUrl || undefined,
      );

      console.log('✅ Portfolio generate tamamlandı, portfolioId:', generatedPortfolioId);
      console.log('✅ result state:', result);

      // Portfolio ID'yi set et
      if (generatedPortfolioId) {
        setPortfolioId(generatedPortfolioId);
        console.log('✅ PortfolioId state set edildi:', generatedPortfolioId);
      }

      // Publish step'ine geç - portfolio ID'yi result'tan alacağız
      setStep('publish');
    } catch (genError) {
      console.error('Portfolio generation failed:', genError);
      // Hata mesajını kullanıcıya göster
      setCvError(genError instanceof Error ? genError.message : 'Oluşturma başarısız oldu');
      setStep('cv');
    }
  }; // handleGoToDashboard kaldırıldı - kullanılmıyor

  const handlePublish = async (slug: string) => {
    console.log('🚀 handlePublish çağrıldı:', { slug });
    console.log('📋 portfolioId state:', portfolioId);
    console.log('📋 result state:', result);
    console.log('📋 portfolios listesi:', portfolios);

    // Portfolio ID'yi farklı kaynaklardan almaya çalış
    let currentPortfolioId = portfolioId || result?.portfolioId;

    // Eğer hala bulamazsa, portfolios listesinden en son olanını al
    if (!currentPortfolioId && portfolios && portfolios.length > 0) {
      // Portfolios listesini tarihe göre sırala ve en son olanını al
      const latestPortfolio = portfolios.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0];
      if (latestPortfolio) {
        currentPortfolioId = latestPortfolio.id;
        console.log('📋 En son portfolio listeden alındı:', currentPortfolioId);
      }
    }

    console.log('📋 currentPortfolioId:', currentPortfolioId);

    if (!currentPortfolioId) {
      console.log('❌ Portfolio ID bulunamadı!');
      setCvError('Portfolio ID bulunamadı - Lütfen önce portfolio oluşturun');
      return;
    }

    // Portfolio ID'yi state'e kaydet (eğer yoksa)
    if (!portfolioId) {
      setPortfolioId(currentPortfolioId);
    }

    setGenerating(true);
    setCvError(null);

    try {
      const response = await fetch('/api/portfolio/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId: currentPortfolioId,
          slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Yayınlama başarısız oldu');
      }

      console.log('✅ Portfolio yayınlandı:', data);

      // Published URL'i ve development mode'u kaydet
      if (data.url) {
        setPublishedUrl(data.url);
      }
      // Response'tan gelen portfolioId ile state'i güncelle
      if (data.portfolioId && data.portfolioId !== portfolioId) {
        setPortfolioId(data.portfolioId);
      }
      setIsDevelopment(data.isDevelopment || false);

      // Portfolio listesini yenile ve completed adımına geç
      await refetchPortfolios();
      setStep('completed');
    } catch (error) {
      console.error('❌ Portfolio yayınlama hatası:', error);
      setCvError(error instanceof Error ? error.message : 'Yayınlama başarısız oldu');
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = async (templateId: number) => {
    setPreviewModal({ isOpen: true, templateId });
    setPreviewLoading(true);

    try {
      // Template ID'yi slug'a çevir
      const templateSlug = templateIdToName[templateId];
      if (!templateSlug) {
        setPreviewHtml('<div class="p-8 text-center text-red-600">Template bulunamadı</div>');
        return;
      }

      const response = await fetch(`/api/templates/preview?template=${templateSlug}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.previewUrl) {
          // Preview URL'ini iframe olarak göster
          const iframeHtml = `
            <iframe 
              src="${data.previewUrl}" 
              style="width: 100%; height: 100%; border: none; background: white;" 
              title="Template Preview"
            ></iframe>
          `;
          setPreviewHtml(iframeHtml);
        } else {
          setPreviewHtml('<div class="p-8 text-center text-red-600">Template yüklenemedi</div>');
        }
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

            {/* Step 4: Publish - Portfolio oluştur ve yayınla */}
            {step === 'publish' && (
              <div className="px-12 py-8">
                <PublishStep
                  loading={generating}
                  error={cvError}
                  onPublish={handlePublish}
                  onBack={() => setStep('cv')}
                />
              </div>
            )}

            {/* Step 5: Completed - Geniş iç padding */}
            {step === 'completed' && (
              <div className="px-12 py-8">
                <CompletedStep
                  portfolioResult={result}
                  demoMode={demoMode}
                  userName={session?.user?.name || undefined}
                  publishedUrl={publishedUrl || undefined}
                  isDevelopment={isDevelopment}
                  portfolioId={portfolioId || undefined}
                  onNewPortfolio={() => {
                    setStep('repos');
                    clearResult();
                    setSelectedRepos([]);
                    setSelectedTemplate(1);
                    setCvUrl(null);
                    setCvError(null);
                    setIsDevelopment(false);
                    setPortfolioId(null);
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
                    {t('dashboard.preview')}
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
  const t = useTranslations();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-6 py-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
          <span className="text-2xl">🚀</span>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t('dashboard.createTitle')}
          </h2>
          <p className="text-sm text-gray-500 max-w-lg">{t('dashboard.createSubtitle')}</p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center space-y-4 mt-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <span className="text-blue-700 font-medium text-sm">{t('dashboard.creating')}</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2 mt-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        ) : (
          <Button variant="primary" size="md" onClick={onGenerate} className="px-6 py-3 text-base">
            {t('dashboard.createButton')}
          </Button>
        )}
      </div>
      <div className="flex justify-between mt-8 mb-8">
        <Button variant="primary" onClick={onBack} className="px-6 py-2">
          {t('common.back')}
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
  const t = useTranslations();
  const router = useRouter();
  const { currentPlan } = useSubscription();

  return (
    <div className="max-w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {t('dashboard.selectTemplate')}
        </h1>
        <p className="text-sm text-gray-500">{t('dashboard.selectTemplateDesc')}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {templates.map((template) => {
          const templateConfig = TEMPLATES.find((t) => t.name === template.name);
          const isPremium = templateConfig?.isPremium || false;
          const canUse = !isPremium || currentPlan === 'PRO';

          return (
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
              onClick={() => {
                // Preview için tıklama, button'dan handle ediliyor
              }}
            >
              {/* PRO Badge */}
              {isPremium && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-white">
                    PRO
                  </span>
                </div>
              )}

              {selectedTemplate === template.id && canUse && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center z-10">
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
                    className={`flex-1 text-sm ${isPremium && !canUse ? 'border-gray-300 text-gray-600 hover:bg-gray-50' : ''}`}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (!isPremium || canUse) {
                        onSelectTemplate(template.id);
                      } else {
                        router.push('/pricing');
                      }
                    }}
                  >
                    {selectedTemplate === template.id
                      ? t('dashboard.selected')
                      : isPremium && !canUse
                        ? 'Upgrade to PRO'
                        : t('dashboard.select')}
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
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <Button variant="secondary" size="md" onClick={onBack} className="px-6 py-2">
          {t('common.back')}
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={!selectedTemplate}
          className="px-6 py-2"
        >
          {t('dashboard.continue')}
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

  const t = useTranslations();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {t('dashboard.uploadCV')} {t('dashboard.optional')}
        </h1>
        <p className="text-sm text-gray-500">{t('dashboard.uploadCVDesc')}</p>
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
              <span className="text-green-700 text-sm font-medium">
                {t('dashboard.cvUploaded')}
              </span>
            </div>
            <Button
              variant="secondary"
              onClick={handleClick}
              disabled={uploading}
              className="px-6 py-2"
            >
              {t('dashboard.uploadAnother')}
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={handleClick}
            disabled={uploading}
            className="px-6 py-2"
          >
            {uploading ? t('dashboard.uploading') : t('dashboard.uploadCV')}
          </Button>
        )}
        {error && (
          <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2 mt-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        )}
        <span className="text-gray-500 text-xs mt-2 max-w-lg leading-relaxed">
          {t('dashboard.cvPrivacy')}
        </span>
      </div>
      <div className="flex justify-between mt-8 mb-8">
        <Button variant="primary" onClick={onBack} className="px-6 py-2">
          {t('common.back')}
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!cvUrl} className="px-6 py-2">
          {t('dashboard.continue')}
        </Button>
      </div>
    </div>
  );
}

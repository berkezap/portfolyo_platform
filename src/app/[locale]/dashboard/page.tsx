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
  previewHtml: '', // Will be loaded from preview URL
  features: template.features,
}));

export default function DashboardPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { data: session, status } = useSession();
  const { currentPlan, canCreatePortfolio, portfolioLimit, loading: subscriptionLoading } = useSubscription();
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

  const handleContinueToPublish = () => {
    // CV Upload'dan sonra direkt publish step'ine geç
    // Portfolio oluşturma işlemi publish butonuna basıldığında yapılacak
    console.log('🚀 Publish step\'ine geçiliyor');
    setCvError(null);
    setStep('publish');
  };

  const handlePublish = async (slug: string) => {
    console.log('🚀 handlePublish çağrıldı:', { slug });
    setGenerating(true);
    setCvError(null);

    try {
      // 1. Önce portfolio oluştur
      const templateName = templateIdToName[selectedTemplate as keyof typeof templateIdToName];

      if (!templateName) {
        console.error('❌ Template name bulunamadı:', selectedTemplate);
        throw new Error('Template not found. Please select a valid template.');
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

      if (!generatedPortfolioId) {
        throw new Error('Portfolio ID oluşturulamadı');
      }

      // Portfolio ID'yi set et
      setPortfolioId(generatedPortfolioId);

      // 2. Sonra portfolio'yu yayınla
      const response = await fetch('/api/portfolio/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId: generatedPortfolioId,
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
      const errorMessage = error instanceof Error ? error.message : 'Yayınlama başarısız oldu';
      setCvError(errorMessage);

      // Eğer limit hatası değilse, publish step'inde kal
      // Limit hatası ise zaten error mesajı gösterilecek
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = async (templateId: number) => {
    setPreviewModal({ isOpen: true, templateId });
    setPreviewLoading(true);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

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
              sandbox="allow-same-origin"
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

        {/* Geniş sayfa konteyneri */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-4">
          {/* Progress Steps - Responsive: Top on mobile, Left on desktop */}
          <div className="lg:hidden mb-6">
            <ProgressSteps currentStep={step} />
          </div>

          {/* Flex Layout: Sidebar + Content (Desktop only) */}
          <div className="flex gap-6">
            {/* Left Sidebar - Progress Steps (Desktop only) */}
            <div className="hidden lg:block w-40 flex-shrink-0 mt-[88px]">
              <ProgressSteps currentStep={step} />
            </div>

            {/* Right Content Area */}
            <div className="flex-1 min-w-0">

              {/* Ana içerik alanı */}
              <div className="max-w-6xl mx-auto">
                {/* Step 1: Repository Selection */}
                {step === 'repos' && (
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
                )}

                {/* Step 2: Template Selection */}
                {step === 'template' && (
                  <div>
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
                      onNext={handleContinueToPublish}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl w-full max-w-6xl h-[85vh] flex flex-col shadow-xl overflow-hidden">
                    {/* Browser-like Header */}
                    <div className="bg-gray-100 px-4 py-3 flex items-center gap-3 border-b border-gray-200">
                      {/* Traffic Lights */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setPreviewModal({ isOpen: false, templateId: null });
                            setPreviewHtml('');
                            document.body.style.overflow = 'auto';
                          }}
                          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                        />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>

                      {/* Address Bar */}
                      <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-sm text-gray-600 border border-gray-300 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-gray-800">alexthompson.portfolyo.tech</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                      {previewLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                        </div>
                      ) : (
                        <div
                          className="w-full h-full overflow-auto"
                          dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                      )}
                    </div>

                    <div className="absolute bottom-4 right-4 flex space-x-3 z-50">
                      <Button
                        onClick={() => {
                          setSelectedTemplate(previewModal.templateId!);
                          setPreviewModal({ isOpen: false, templateId: null });
                          setPreviewHtml('');
                          document.body.style.overflow = 'auto';
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
                          document.body.style.overflow = 'auto';
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
  const { currentPlan, loading: subscriptionLoading } = useSubscription();

  return (
    <div className="max-w-full mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {t('dashboard.selectTemplate')}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t('dashboard.selectTemplateDesc')}
          </p>
        </div>
      </div>

      {subscriptionLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 auto-rows-fr">
          {templates.map((template) => {
            const templateConfig = TEMPLATES.find((t) => t.name === template.name);
            const isPremium = templateConfig?.isPremium || false;
            const canUse = !isPremium || currentPlan === 'PRO';

            return (
              <div
                key={template.id}
                className={`
              relative p-6 rounded-xl border-2 transition-all duration-200 flex flex-col h-full
              ${selectedTemplate === template.id
                    ? 'border-gray-900 bg-white shadow-lg ring-2 ring-gray-900 ring-offset-2'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }
              ${isPremium && !canUse ? 'opacity-75' : 'cursor-pointer'}
            `}
                onClick={() => {
                  if (!isPremium || canUse) {
                    onSelectTemplate(template.id);
                  }
                  // PRO template'e tıklandığında hiçbir şey yapma
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
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center z-10 shadow-md">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-4">
                  <iframe
                    src={`/templates/preview/${templateConfig?.slug}`}
                    className="w-full h-full border-0 pointer-events-none transform scale-75 origin-top-left"
                    title={`${template.name} Preview`}
                    style={{ width: '133.33%', height: '133.33%' }}
                    sandbox="allow-same-origin"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {template.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md h-fit"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    {isPremium && !canUse ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 text-sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          router.push('/pricing');
                        }}
                      >
                        Upgrade to PRO
                      </Button>
                    ) : (
                      <Button
                        variant={selectedTemplate === template.id ? 'primary' : 'secondary'}
                        size="sm"
                        className="flex-1 text-sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onSelectTemplate(template.id);
                        }}
                      >
                        {selectedTemplate === template.id
                          ? t('dashboard.selected')
                          : t('dashboard.select')}
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onPreview(template.id);
                      }}
                      className="!px-3 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
    <div className="max-w-full mx-auto">
      {/* Header Section - Kompakt */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {t('dashboard.uploadCV')}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t('dashboard.uploadCVDesc')}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      <div className="mb-6">
        {cvUrl ? (
          // Success State
          <div
            className="relative p-8 rounded-xl border-2 border-green-200 bg-green-50 transition-all duration-200"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-1">
                  {t('dashboard.cvUploaded')}
                </h3>
                <p className="text-sm text-green-700">
                  Your CV has been uploaded successfully
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={handleClick}
                disabled={uploading}
                size="md"
                className="mt-2"
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                {t('dashboard.uploadAnother')}
              </Button>
            </div>
          </div>
        ) : (
          // Upload State
          <div
            onClick={handleClick}
            className="relative p-12 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-gray-600 group-hover:text-gray-900 transition-colors" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {uploading ? t('dashboard.uploading') : 'Click to upload your CV'}
                </h3>
                <p className="text-sm text-gray-600">
                  PDF only (Max 10MB)
                </p>
              </div>
              {!uploading && (
                <Button
                  variant="primary"
                  size="md"
                  className="mt-2 pointer-events-none"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {t('dashboard.uploadCV')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message - Sadece gerçek upload hataları için */}
      {error && !error.includes('FREE plan') && !error.includes('Upgrade to PRO') && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-red-900 mb-1">Upload Failed</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Privacy & Security</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              {t('dashboard.cvPrivacy')}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          variant="secondary"
          onClick={onBack}
          size="lg"
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          {t('common.back')}
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          size="lg"
          disabled={!cvUrl}
          className="w-full sm:flex-1 order-1 sm:order-2"
        >
          {t('dashboard.continue')}
        </Button>
      </div>
    </div>
  );
}

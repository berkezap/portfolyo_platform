'use client';

import { useState, useEffect, use, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useGitHubRepos } from '@/hooks/useGitHubRepos';
import { usePortfolioEditor } from '@/hooks/usePortfolioEditor';
import { DashboardHeader } from '@/components/dashboard/DashboardHeaderNew';
import ModernCard from '@/components/ui/ModernCard';
import ButtonNew from '@/components/ui/ButtonNew';
import {
  Eye,
  ArrowLeft,
  Save,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Star,
  GitBranch,
  Check,
  Github,
  Globe,
  Copy,
  Upload,
  Download,
  Search,
  ChevronUp,
} from 'lucide-react';
import { GitHubRepo } from '@/types/github';

interface EditPortfolioPageProps {
  params: Promise<{
    id: string;
  }>;
}

const templateNameToId: { [key: string]: number } = {
  'professional-tech': 1,
  'minimalist-professional': 2,
  'creative-portfolio': 3,
  // Legacy templates
  'modern-developer': 4,
  'creative-technologist': 5,
  storyteller: 6,
};

const templateIdToName: { [key: number]: string } = {
  1: 'professional-tech',
  2: 'minimalist-professional',
  3: 'creative-portfolio',
  // Legacy templates
  4: 'modern-developer',
  5: 'creative-technologist',
  6: 'storyteller',
};

const templateDisplayNames: { [key: number]: string } = {
  1: 'Professional Tech',
  2: 'Minimalist Professional',
  3: 'Creative Portfolio',
  // Legacy templates
  4: 'Modern Developer',
  5: 'Creative Technologist',
  6: 'Storyteller',
};

export default function EditPortfolioPage({ params }: EditPortfolioPageProps) {
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const resolvedParams = use(params);
  const portfolioId = resolvedParams.id;

  const { data: session } = useSession();
  const {
    portfolio,
    isLoading: portfolioLoading,
    error: portfolioError,
    isUpdating,
    isUpdateSuccess,
    updatePortfolio: updatePortfolioMutation,
  } = usePortfolioEditor(portfolioId);
  const { data: allRepos, isLoading: reposLoading } = useGitHubRepos();

  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [userBio, setUserBio] = useState('');
  const [repoSearch, setRepoSearch] = useState('');
  const [repoLanguage, setRepoLanguage] = useState('');

  // Publishing states
  const [publishSlug, setPublishSlug] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [canChangeSlug, setCanChangeSlug] = useState(true);
  const [nextSlugChangeDate, setNextSlugChangeDate] = useState<Date | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Templates array with translations
  const templates = useMemo(() => {
    return Object.entries(templateDisplayNames)
      .filter(([id]) => Number(id) <= 3) // Only show the top 3 quality templates
      .map(([id, name]) => ({
        id: Number(id),
        name,
        description: `${name} teması ile profesyonel portfolyo`,
        features: [
          t('templateFeatures.responsiveDesign'),
          t('templateFeatures.fastLoading'),
          t('templateFeatures.seoOptimization'),
        ],
        previewHtml: `
          <div style="padding: 20px; font-family: system-ui; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
            <div style="text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold;">${name}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Modern Portfolio Template</p>
            </div>
          </div>
        `,
      }));
  }, [t]);

  // Portfolio'dan mevcut publish bilgilerini al
  useEffect(() => {
    if (portfolio?.public_slug) {
      setPublishSlug(portfolio.public_slug);
    }

    // Slug değişiklik limitini kontrol et
    if (portfolio?.slug_last_changed_at) {
      const lastChangeDate = new Date(portfolio.slug_last_changed_at);
      const sixMonthsLater = new Date(lastChangeDate);
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

      const now = new Date();
      const canChange = now >= sixMonthsLater;

      setCanChangeSlug(canChange);
      if (!canChange) {
        setNextSlugChangeDate(sixMonthsLater);
      }
    }
  }, [portfolio]);

  // Publishing handlers
  const handlePublish = async () => {
    if (!publishSlug.trim()) {
      setPublishError('Slug gerekli');
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    try {
      const response = await fetch(`/api/portfolio/${portfolioId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: publishSlug.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Yayınlama başarısız');
      }

      // Portfolio state'ini güncelle
      if (result.portfolio) {
        // React Query cache'ini invalide et
        const queryClient = (window as any).__queryClient__;
        if (queryClient) {
          queryClient.invalidateQueries({ queryKey: ['portfolio', portfolioId] });
        }
      }
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setIsUnpublishing(true);
    setPublishError(null);

    try {
      const response = await fetch(`/api/portfolio/${portfolioId}/unpublish`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Yayından kaldırma başarısız');
      }

      // Portfolio state'ini güncelle
      const queryClient = (window as any).__queryClient__;
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ['portfolio', portfolioId] });
      }
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsUnpublishing(false);
    }
  };

  const normalizeSlug = (input: string) => {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\-]/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  };

  // Kullanıcı bilgilerini state'e al
  useEffect(() => {
    if (session?.user?.bio) {
      setUserBio(session.user.bio);
    }
  }, [session]);

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  // Auth kontrolü - sadece bir kez çalışsın
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/');
    }
  }, [sessionStatus, router]);

  // Portfolio ve repos verilerini işle - memoized
  const processedData = useMemo(() => {
    if (!portfolio || !allRepos) return null;

    const templateId = templateNameToId[portfolio.selected_template] || 1;
    const repoIds = (portfolio.selected_repos || [])
      .map((repoName) => allRepos.find((repo) => repo.name === repoName)?.id)
      .filter((id): id is number => !!id);

    return { templateId, repoIds };
  }, [portfolio, allRepos]);

  // Repo dilleri ve filtrelenmiş liste
  const repoLanguages = useMemo(() => {
    const set = new Set<string>();
    (allRepos || []).forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return Array.from(set).sort();
  }, [allRepos]);

  const filteredRepos = useMemo(() => {
    const term = repoSearch.trim().toLowerCase();
    return (allRepos || []).filter((r) => {
      const matchesSearch = term
        ? r.name.toLowerCase().includes(term) || (r.description || '').toLowerCase().includes(term)
        : true;
      const matchesLang = repoLanguage ? r.language === repoLanguage : true;
      return matchesSearch && matchesLang;
    });
  }, [allRepos, repoSearch, repoLanguage]);

  // State'leri güncelle - sadece processedData değiştiğinde
  useEffect(() => {
    if (processedData) {
      setSelectedTemplate(processedData.templateId);
      setSelectedRepos(processedData.repoIds);
    }
  }, [processedData]);

  // Güncelleme sonrası yönlendirme
  useEffect(() => {
    if (isUpdateSuccess) {
      setTimeout(() => {
        router.push('/my-portfolios');
      }, 2000);
    }
  }, [isUpdateSuccess, router]);

  // Memoized callback'ler
  const toggleRepo = useCallback((repoId: number) => {
    setSelectedRepos((prev) =>
      prev.includes(repoId) ? prev.filter((id) => id !== repoId) : [...prev, repoId],
    );
  }, []);

  const handleSave = useCallback(async () => {
    console.log('Kaydet tıklandı');
    console.log('📊 Portfolio mevcut durumu:', {
      id: portfolio?.id,
      status: portfolio?.status,
      is_published: portfolio?.is_published,
      public_slug: portfolio?.public_slug,
    });

    if (!allRepos || selectedRepos.length === 0) {
      console.error('Repo seçimi gerekli');
      return;
    }

    const selectedRepoNames = selectedRepos
      .map((repoId) => allRepos.find((repo) => repo.id === repoId)?.name)
      .filter((name): name is string => !!name);

    const updateData = {
      selected_template: templateIdToName[selectedTemplate],
      selected_repos: selectedRepoNames,
      // Bio'yu da kaydet
      user_bio: userBio,
    };

    console.log('Update data:', updateData);
    updatePortfolioMutation(updateData);
  }, [allRepos, selectedRepos, selectedTemplate, userBio, updatePortfolioMutation]);

  const handleViewPortfolio = useCallback(() => {
    if (portfolio?.is_published && portfolio?.public_slug) {
      // Published portfolio - SSR route with public slug
      window.open(`/portfolio/${portfolio.public_slug}`, '_blank');
    } else {
      // Draft portfolio - SSR preview with portfolio ID
      const previewSlug = `preview-${portfolioId.slice(0, 8)}`;
      window.open(`/portfolio/${previewSlug}?preview=true&portfolio_id=${portfolioId}`, '_blank');
    }
  }, [portfolioId, portfolio]);

  // Preview fonksiyonu - ZENGİN VERİ ile
  const handlePreview = useCallback(() => {
    console.log('🎯 handlePreview çağrıldı, portfolioId:', portfolioId);
    console.log('🔍 Portfolio data:', { id: portfolio?.id, public_slug: portfolio?.public_slug });
    
    if (!allRepos || !session) {
      console.warn('⚠️ Preview için repolar ve kullanıcı oturumu gerekli');
      return;
    }

    // SSR: Use legacy route with UUID, it will redirect to SSR
    const previewUrl = `/${locale}/portfolio/${portfolioId}?preview=true`;
    console.log('🔗 Legacy preview URL açılıyor (SSR redirect edilecek):', previewUrl);

    window.open(previewUrl, '_blank');
  }, [allRepos, portfolioId, session, portfolio, locale]);

  // Preview fonksiyonu kaldırıldı

  // Loading state - daha hızlı feedback
  if (portfolioLoading || reposLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <DashboardHeader demoMode={demoMode} variant="transparent" />
        <div className="container mx-auto px-4 py-8" style={{ paddingTop: '64px' }}>
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-600">{t('myPortfolios.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (portfolioError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <DashboardHeader demoMode={demoMode} variant="transparent" />
        <div className="container mx-auto px-4 py-8" style={{ paddingTop: '64px' }}>
          <ModernCard variant="elevated" className="max-w-md mx-auto">
            <ModernCard.Content>
              <div className="flex flex-col items-center text-center space-y-4 p-8">
                <AlertCircle className="w-12 h-12 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">{t('editPortfolio.error')}</h2>
                <p className="text-red-700">{portfolioError.message}</p>
                <ButtonNew
                  variant="primary"
                  onClick={() => router.push(`/${locale}/my-portfolios`)}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {t('myPortfolios.title')}
                </ButtonNew>
              </div>
            </ModernCard.Content>
          </ModernCard>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <DashboardHeader demoMode={demoMode} variant="transparent" />
        <div className="container mx-auto px-4 py-8" style={{ paddingTop: '64px' }}>
          <ModernCard variant="elevated" className="max-w-md mx-auto">
            <ModernCard.Content>
              <div className="flex flex-col items-center text-center space-y-4 p-8">
                <AlertCircle className="w-12 h-12 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('editPortfolio.portfolioNotFound')}
                </h2>
                <p className="text-gray-600">{t('editPortfolio.portfolioNotFoundDesc')}</p>
                <ButtonNew
                  variant="primary"
                  onClick={() => router.push(`/${locale}/my-portfolios`)}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {t('editPortfolio.goBack')}
                </ButtonNew>
              </div>
            </ModernCard.Content>
          </ModernCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader demoMode={demoMode} variant="transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ paddingTop: '80px' }}>
        {/* Sticky Header */}
        <div className="sticky top-16 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ButtonNew
                variant="ghost"
                onClick={() => router.push('/my-portfolios')}
                className="!p-2"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </ButtonNew>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{t('editPortfolio.title')}</h1>
                <p className="text-sm text-gray-500">{t('editPortfolio.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ButtonNew
                variant="ghost"
                onClick={handlePreview}
                disabled={selectedRepos.length === 0}
                className="hidden sm:flex items-center gap-2"
                size="sm"
              >
                <Eye className="w-4 h-4" /> {t('editPortfolio.preview')}
              </ButtonNew>
              <ButtonNew
                variant="primary"
                onClick={handleSave}
                disabled={isUpdating || selectedRepos.length === 0}
                className="flex items-center gap-2"
                size="sm"
                loading={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> {t('editPortfolio.saving')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> {t('editPortfolio.save')}
                  </>
                )}
              </ButtonNew>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {isUpdateSuccess && (
          <div className="mb-8 rounded-xl bg-white border border-green-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-green-900">
                  {t('editPortfolio.updateSuccess')}
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  {t('editPortfolio.updateSuccessDesc')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progressive Layout */}
        <div className="space-y-12">
          {/* Step 1: Template Selection */}
          <section className="relative">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
                  1
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('editPortfolio.templateSelection')}
                </h2>
              </div>
              <p className="text-gray-600 ml-11">{t('editPortfolio.templateSelectionDesc')}</p>
            </div>

            <div className="ml-11">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`group relative rounded-2xl cursor-pointer transition-all duration-300 ${
                      selectedTemplate === template.id
                        ? 'ring-2 ring-gray-400 shadow-lg scale-[1.02]'
                        : 'hover:shadow-md hover:scale-[1.01]'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="bg-white rounded-2xl p-4 border border-gray-200">
                      {/* Preview */}
                      <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 overflow-hidden relative">
                        <iframe
                          srcDoc={template.previewHtml}
                          className="w-full h-full border-0 pointer-events-none"
                          title={`${template.name} Preview`}
                        />
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-xs text-gray-500 mb-3">{template.description}</p>

                        <div className="flex flex-wrap gap-1 justify-center mb-4">
                          {template.features.slice(0, 2).map((feature) => (
                            <span
                              key={feature}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        <ButtonNew
                          variant={selectedTemplate === template.id ? 'primary' : 'outline'}
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setSelectedTemplate(template.id);
                          }}
                          className="w-full"
                        >
                          {selectedTemplate === template.id ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              {t('editPortfolio.selected')}
                            </>
                          ) : (
                            t('editPortfolio.select')
                          )}
                        </ButtonNew>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Step 2: Repository Selection */}
          <section className="relative">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
                  2
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('editPortfolio.projectSelection')}
                  </h2>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    {t('editPortfolio.projectsSelected', { count: selectedRepos.length })}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 ml-11">{t('editPortfolio.projectSelectionDesc')}</p>
            </div>

            <div className="ml-11">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Search Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={repoSearch}
                          onChange={(e) => setRepoSearch(e.target.value)}
                          placeholder={t('editPortfolio.searchPlaceholder')}
                          className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"
                          style={{ backgroundColor: 'white', color: '#111827' }}
                        />
                      </div>
                    </div>
                    <select
                      value={repoLanguage}
                      onChange={(e) => setRepoLanguage(e.target.value)}
                      className="px-4 py-3 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 min-w-[140px]"
                      style={{ backgroundColor: 'white', color: '#111827' }}
                    >
                      <option value="" className="bg-white text-gray-900">
                        {t('editPortfolio.allLanguages')}
                      </option>
                      {repoLanguages.map((lang) => (
                        <option key={lang} value={lang} className="bg-white text-gray-900">
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Repository Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {filteredRepos.map((repo: GitHubRepo) => (
                      <div
                        key={repo.id}
                        className={`group relative rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                          selectedRepos.includes(repo.id)
                            ? 'border-gray-400 bg-gray-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                        onClick={() => toggleRepo(repo.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={selectedRepos.includes(repo.id)}
                              readOnly
                              className="mt-1 h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-sm text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                                  {repo.name}
                                </h3>
                                {selectedRepos.includes(repo.id) && (
                                  <div className="flex-shrink-0 ml-2">
                                    <Check className="w-4 h-4 text-gray-600" />
                                  </div>
                                )}
                              </div>

                              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                {repo.description || t('editPortfolio.noDescription')}
                              </p>

                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                  {repo.language || 'Unknown'}
                                </span>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3" /> {repo.stargazers_count}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <GitBranch className="w-3 h-3" /> {repo.forks_count}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Error State */}
                  {selectedRepos.length === 0 && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-red-800 font-medium text-sm">
                            {t('editPortfolio.selectAtLeastOneProject')}
                          </p>
                          <p className="text-red-700 text-xs mt-1">
                            {t('editPortfolio.selectProjectsForPortfolio')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Minimal Floating Actions Panel */}
        <div className="fixed bottom-8 right-8 z-20 hidden xl:block">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 overflow-hidden min-w-[280px]">
            {/* Toggle Header - Always Visible */}
            <div
              className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsPanelOpen(!isPanelOpen)}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs font-medium text-gray-600">
                  {templateDisplayNames[selectedTemplate]}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">{selectedRepos.length}</span>
                <span className="text-xs text-gray-500">{t('editPortfolio.projects')}</span>
              </div>
              <div className="ml-auto">
                <ChevronUp
                  className={`w-4 h-4 text-gray-400 transition-transform ${isPanelOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {/* Collapsible Content */}
            {isPanelOpen && (
              <>
                {portfolio?.is_published && portfolio?.public_slug ? (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-medium text-gray-700">
                          {t('editPortfolio.live')}
                        </span>
                      </div>
                      <a
                        href={`http://${portfolio.public_slug}.portfolyo.tech`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-gray-600 hover:text-gray-800 hover:underline"
                      >
                        {portfolio.public_slug}.portfolyo.tech
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <ButtonNew
                        variant="outline"
                        onClick={() =>
                          window.open(`http://${portfolio.public_slug}.portfolyo.tech`, '_blank')
                        }
                        className="flex-1"
                        size="sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </ButtonNew>

                      <ButtonNew
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `http://${portfolio.public_slug}.portfolyo.tech`,
                          );
                        }}
                        className="flex-1"
                        size="sm"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </ButtonNew>
                    </div>

                    <ButtonNew
                      variant="ghost"
                      onClick={handleUnpublish}
                      disabled={isUnpublishing}
                      loading={isUnpublishing}
                      className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      size="sm"
                    >
                      {isUnpublishing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          <span className="text-xs">{t('myPortfolios.unpublish')}</span>
                        </>
                      )}
                    </ButtonNew>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">{t('myPortfolios.draftStatus')}</span>
                    </div>
                    <p className="text-xs text-gray-500">{t('myPortfolios.useMainDashboard')}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

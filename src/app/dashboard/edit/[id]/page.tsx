'use client';

import { useState, useEffect, use, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useGitHubRepos } from '@/hooks/useGitHubRepos';
import { usePortfolioEditor } from '@/hooks/usePortfolioEditor';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
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
} from 'lucide-react';
import { GitHubRepo } from '@/types/github';

interface EditPortfolioPageProps {
  params: Promise<{
    id: string;
  }>;
}

const templateNameToId: { [key: string]: number } = {
  'modern-developer': 1,
  'creative-portfolio': 2,
  'professional-tech': 3,
  'minimalist-professional': 4,
  'creative-technologist': 5,
  storyteller: 6,
};

const templateIdToName: { [key: number]: string } = {
  1: 'modern-developer',
  2: 'creative-portfolio',
  3: 'professional-tech',
  4: 'minimalist-professional',
  5: 'creative-technologist',
  6: 'storyteller',
};

const templateDisplayNames: { [key: number]: string } = {
  1: 'Modern Developer',
  2: 'Creative Portfolio',
  3: 'Professional Tech',
  4: 'Minimalist Professional',
  5: 'Creative Technologist',
  6: 'Storyteller',
};

const templates = Object.entries(templateDisplayNames).map(([id, name]) => ({
  id: Number(id),
  name,
  description: `${name} teması ile profesyonel portfolyo`,
  features: ['Responsive tasarım', 'Hızlı yükleme', 'SEO optimizasyonu'],
  previewHtml: `
    <div style="padding: 20px; font-family: system-ui; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
      <div style="text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">${name}</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Modern Portfolio Template</p>
      </div>
    </div>
  `,
}));

export default function EditPortfolioPage({ params }: EditPortfolioPageProps) {
  const { status: sessionStatus } = useSession();
  const router = useRouter();

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
    window.open(`/portfolio/${portfolioId}`, '_blank');
  }, [portfolioId]);

  // Preview fonksiyonu - ZENGİN VERİ ile
  const handlePreview = useCallback(() => {
    if (!allRepos || !session) {
      console.warn('⚠️ Preview için repolar ve kullanıcı oturumu gerekli');
      return;
    }

    // Seçilen repoların tüm verilerini al
    const selectedRepoDetails = selectedRepos
      .map((repoId) => allRepos.find((repo) => repo.id === repoId))
      .filter((repo): repo is GitHubRepo => !!repo);

    // Güvenli kullanıcı verisi oluşturma
    const userData = session.user
      ? {
          name: session.user.name || 'Kullanıcı Adı',
          bio: userBio || 'Harika bir bio burada yer alacak.',
          avatar_url: session.user.image || '',
          github_url: `https://github.com/${session.user.name}`,
          linkedin_url: '#',
          cv_url: portfolio?.cv_url || '#',
        }
      : {
          name: 'Demo Kullanıcı',
          bio: 'Bu bir demo bio açıklamasıdır.',
          avatar_url: '/portfolyo-logo.svg',
          github_url: '#',
          linkedin_url: '#',
          cv_url: '#',
        };

    // Preview için zengin veri objesi oluştur
    const previewData = {
      portfolioId,
      template: templateIdToName[selectedTemplate],
      user: userData,
      repos: selectedRepoDetails.map((repo) => ({
        name: repo.name,
        description: repo.description || 'Açıklama yok.',
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
      })),
      timestamp: Date.now(),
    };

    console.log("💾 Zengin preview verisi localStorage'a kaydediliyor:", previewData);
    localStorage.setItem('portfolio-preview', JSON.stringify(previewData));

    const cacheParam = `preview=true&t=${Date.now()}`;
    const previewUrl = `/portfolio/${portfolioId}?${cacheParam}`;
    console.log('🔗 Yeni preview URL açılıyor:', previewUrl);

    window.open(previewUrl, '_blank');
  }, [allRepos, selectedRepos, selectedTemplate, portfolioId, session, userBio, portfolio?.cv_url]);

  // Preview fonksiyonu kaldırıldı

  // Loading state - daha hızlı feedback
  if (portfolioLoading || reposLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <DashboardHeader demoMode={demoMode} variant="transparent" />
        <div className="container mx-auto px-4 py-8" style={{ paddingTop: '64px' }}>
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-600">Portfolyo yükleniyor...</p>
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
                <h2 className="text-2xl font-bold text-gray-900">Hata</h2>
                <p className="text-red-700">{portfolioError.message}</p>
                <ButtonNew variant="primary" onClick={() => router.push('/my-portfolios')}>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Portfolyolarıma Dön
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
                <h2 className="text-2xl font-bold text-gray-900">Portfolyo Bulunamadı</h2>
                <p className="text-gray-600">Bu ID ile bir portfolyo bulunamadı.</p>
                <ButtonNew variant="primary" onClick={() => router.push('/my-portfolios')}>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Geri Dön
                </ButtonNew>
              </div>
            </ModernCard.Content>
          </ModernCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <DashboardHeader demoMode={demoMode} variant="transparent" />

      <div className="container mx-auto px-6 py-8" style={{ paddingTop: '64px' }}>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Portfolyo Düzenle</h1>
              <p className="text-gray-600">Projelerinizi ve şablonunuzu güncelleyin</p>
            </div>
            <ButtonNew
              variant="secondary"
              onClick={() => router.push('/my-portfolios')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </ButtonNew>
          </div>
        </div>

        {/* Success Message */}
        {isUpdateSuccess && (
          <ModernCard variant="gradient" className="mb-8 border-green-200 bg-green-50">
            <ModernCard.Content>
              <div className="flex items-center space-x-3 py-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-green-800 font-semibold">Başarılı!</h3>
                  <p className="text-green-700">Portfolio güncellendi. Yönlendiriliyorsunuz...</p>
                </div>
              </div>
            </ModernCard.Content>
          </ModernCard>
        )}

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Template Selection */}
            <ModernCard variant="elevated">
              <ModernCard.Header>
                <h2 className="text-lg font-semibold text-gray-900">Şablon Seçimi</h2>
                <p className="text-sm text-gray-600 mt-1">Portfolyonuz için bir şablon seçin</p>
              </ModernCard.Header>
              <ModernCard.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'border-blue-300 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      {/* Selection Indicator */}
                      {selectedTemplate === template.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Template Preview */}
                      <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-3">
                        <iframe
                          srcDoc={template.previewHtml}
                          className="w-full h-full border-0 pointer-events-none"
                          title={`${template.name} Preview`}
                        />
                      </div>

                      {/* Template Info */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">{template.description}</p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.features.slice(0, 2).map((feature) => (
                            <span
                              key={feature}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <ButtonNew
                            variant={selectedTemplate === template.id ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              setSelectedTemplate(template.id);
                            }}
                            className="flex-1 text-xs"
                          >
                            {selectedTemplate === template.id ? 'Seçili' : 'Seç'}
                          </ButtonNew>

                          <ButtonNew
                            variant="secondary"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              setSelectedTemplate(template.id);
                              handlePreview();
                            }}
                            className="!px-3"
                            disabled={selectedRepos.length === 0}
                            title={selectedRepos.length === 0 ? 'Önce proje seçin' : 'Önizleme'}
                          >
                            <Eye className="w-3 h-3" />
                          </ButtonNew>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ModernCard.Content>
            </ModernCard>

            {/* Repository Selection */}
            <ModernCard variant="elevated">
              <ModernCard.Header>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Proje Seçimi</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Portfolyonuzda gösterilecek GitHub projelerini seçin
                    </p>
                  </div>
                  <span className="inline-block text-blue-600 bg-blue-50 rounded-full px-3 py-1 text-sm font-medium">
                    {selectedRepos.length} seçili
                  </span>
                </div>
              </ModernCard.Header>
              <ModernCard.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {(allRepos || []).map((repo: GitHubRepo) => (
                    <ModernCard
                      key={repo.id}
                      variant={selectedRepos.includes(repo.id) ? 'gradient' : 'default'}
                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        selectedRepos.includes(repo.id)
                          ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => toggleRepo(repo.id)}
                    >
                      <ModernCard.Header className="pb-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">
                            {repo.name}
                          </h3>
                          <input
                            type="checkbox"
                            checked={selectedRepos.includes(repo.id)}
                            readOnly
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                        </div>
                      </ModernCard.Header>

                      <ModernCard.Content className="pt-0">
                        <p className="text-xs text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                          {repo.description || 'No description available'}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
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
                      </ModernCard.Content>
                    </ModernCard>
                  ))}
                </div>

                {/* Error Message */}
                {selectedRepos.length === 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-red-600 text-sm">En az bir proje seçmelisiniz</p>
                    </div>
                  </div>
                )}
              </ModernCard.Content>
            </ModernCard>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Current Portfolio Info */}
            <ModernCard variant="glass">
              <ModernCard.Header icon={Github} iconColor="text-blue-600">
                <h3 className="text-lg font-semibold text-gray-900">Mevcut Portfolio</h3>
              </ModernCard.Header>
              <ModernCard.Content>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                      Şablon
                    </span>
                    <p className="text-gray-900 font-semibold mt-1">
                      {(() => {
                        const templateId =
                          portfolio.selected_template &&
                          templateNameToId[portfolio.selected_template];
                        return templateId && templateDisplayNames[templateId]
                          ? templateDisplayNames[templateId]
                          : 'Modern Developer';
                      })()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                      Proje Sayısı
                    </span>
                    <p className="text-gray-900 font-semibold text-lg mt-1">
                      {Array.isArray(portfolio.selected_repos)
                        ? portfolio.selected_repos.length
                        : 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                      Son Güncelleme
                    </span>
                    <p className="text-gray-900 text-sm mt-1">
                      {new Date(portfolio.updated_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              </ModernCard.Content>
            </ModernCard>

            {/* Actions */}
            <ModernCard variant="elevated">
              <ModernCard.Header>
                <h3 className="text-lg font-semibold text-gray-900">İşlemler</h3>
              </ModernCard.Header>
              <ModernCard.Content>
                <div className="space-y-3">
                  <ButtonNew
                    variant="secondary"
                    onClick={handleViewPortfolio}
                    className="w-full flex items-center justify-center gap-2"
                    size="md"
                  >
                    <Eye className="w-4 h-4" />
                    Mevcut Portfolyo
                  </ButtonNew>

                  <ButtonNew
                    variant="gradient"
                    onClick={handlePreview}
                    disabled={selectedRepos.length === 0}
                    className="w-full flex items-center justify-center gap-2"
                    size="md"
                  >
                    <Eye className="w-4 h-4" />
                    Değişiklikleri Önizle
                  </ButtonNew>

                  <ButtonNew
                    variant="primary"
                    onClick={handleSave}
                    disabled={isUpdating || selectedRepos.length === 0}
                    className="w-full flex items-center justify-center gap-2"
                    size="md"
                    loading={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Kaydet
                      </>
                    )}
                  </ButtonNew>
                </div>
              </ModernCard.Content>
            </ModernCard>
          </div>
        </div>
      </div>
    </div>
  );
}

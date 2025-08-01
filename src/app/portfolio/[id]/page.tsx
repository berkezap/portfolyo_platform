'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { AlertCircle, FileWarning, Loader2, CheckCircle2 } from 'lucide-react';

interface Portfolio {
  id: string;
  selected_template: string;
  selected_repos: string[];
  cv_url?: string;
  generated_html?: string;
  metadata?: {
    user?: string;
    repoCount?: number;
    user_bio?: string;
    user_avatar?: string;
    user_email?: string;
    github_url?: string;
    total_repos?: number;
    total_stars?: number;
    years_experience?: number;
    generated_at?: string;
  };
}

export default function PortfolioViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);
  const [mode, setMode] = useState<'loading' | 'preview' | 'normal'>('loading');

  // 1. Adım: Component ilk yüklendiğinde MOD'a karar ver. Sadece BİR KEZ çalışır.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const previewParam = urlParams.get('preview');
    console.log(`Component Mount: Preview modu kontrol ediliyor... Değer: ${previewParam}`);
    if (previewParam === 'true') {
      setMode('preview');
    } else {
      setMode('normal');
    }
  }, []); // Boş dependency array sayesinde sadece bir kez çalışır.

  // 2. Adım: MOD'a göre ilgili fonksiyonu çağır.
  useEffect(() => {
    if (mode === 'loading') {
      console.log('Bekleniyor: Mod henüz belirlenmedi.');
      return;
    }

    if (mode === 'preview') {
      console.log('Yönlendirme: handlePreviewMode() çağrılıyor.');
      handlePreviewMode();
    } else {
      console.log('Yönlendirme: handleNormalMode() çağrılıyor.');
      handleNormalMode();
    }
  }, [mode, id]); // mode veya id değiştiğinde çalışır.

  const handlePreviewMode = useCallback(async () => {
    console.log('🎯 handlePreviewMode çalıştı');
    try {
      setLoading(true);
      setError(null);

      const currentPreviewDataString = localStorage.getItem('portfolio-preview');

      if (currentPreviewDataString) {
        const parsed = JSON.parse(currentPreviewDataString);

        if (parsed.portfolioId === id) {
          console.log('✅ Template yükleniyor:', parsed.template);

          const templateResponse = await fetch(`/templates/${parsed.template}/index.html`);
          if (!templateResponse.ok) {
            throw new Error(
              `Template yüklenemedi: ${parsed.template} (${templateResponse.status})`,
            );
          }

          let templateHtml = await templateResponse.text();
          console.log('📄 Template HTML yüklendi:', parsed.template);

          // Replace user data
          templateHtml = templateHtml
            .replace(/\{\{USER_NAME\}\}/g, parsed.user?.name || 'Kullanıcı Adı')
            .replace(/\{\{USER_BIO\}\}/g, parsed.user?.bio || 'Bio bilgisi girilmemiş.')
            .replace(/\{\{USER_TITLE\}\}/g, 'Portfolio Preview')
            .replace(/\{\{USER_AVATAR_URL\}\}/g, parsed.user?.avatar_url || '/portfolyo-logo.svg')
            .replace(/\{\{GITHUB_URL\}\}/g, parsed.user?.github_url || '#')
            .replace(/\{\{LINKEDIN_URL\}\}/g, parsed.user?.linkedin_url || '#')
            .replace(/\{\{CV_URL\}\}/g, parsed.user?.cv_url || '#');

          // Generate projects HTML from rich data
          const projectsHtml = (parsed.repos || [])
            .map((repo: any) => {
              // Basic template structure, can be customized per template
              return `
              <div class="card rounded-xl p-6 scroll-animate" style="border: 1px solid #333;">
                <h3 class="font-display text-2xl font-bold mb-3 gradient-text">📦 ${repo.name}</h3>
                <p class="text-muted text-sm mb-4 leading-relaxed">
                  ${repo.description || 'Bu proje için bir açıklama eklenmemiş.'}
                </p>
                <div class="flex flex-wrap gap-2 mb-6">
                  ${repo.language ? `<span class="text-xs text-muted border border-gray-700 rounded-full px-3 py-1">${repo.language}</span>` : ''}
                  <span class="text-xs text-muted border border-gray-700 rounded-full px-3 py-1">⭐ ${repo.stargazers_count}</span>
                  <span class="text-xs text-muted border border-gray-700 rounded-full px-3 py-1">🍴 ${repo.forks_count}</span>
                </div>
                <div class="flex items-center space-x-4 mt-auto">
                  <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="text-sm text-cyan-400 hover:underline">View Source</a>
                </div>
              </div>
            `;
            })
            .join('');

          templateHtml = templateHtml.replace(
            /\{\{PROJECTS_START\}\}[\s\S]*?\{\{PROJECTS_END\}\}/g,
            projectsHtml,
          );

          // Clean up any remaining placeholders
          templateHtml = templateHtml.replace(/\{\{[^}]+\}\}/g, '');

          const previewIndicator = `
            <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(45deg, #00ff00, #00aaff); color: #000; padding: 12px 20px; border-radius: 8px; font-weight: bold; z-index: 9999; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: pulse 2s infinite;">
              🎯 ${parsed.template.toUpperCase()} PREVIEW
            </div>
            <style>
              @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
            </style>
          `;

          templateHtml = templateHtml.replace('</body>', `${previewIndicator}</body>`);

          const mockPortfolio: Portfolio = {
            id: parsed.portfolioId,
            selected_template: parsed.template,
            selected_repos: (parsed.repos || []).map((r: any) => r.name),
            generated_html: templateHtml,
            metadata: {
              user: parsed.user?.name,
              repoCount: parsed.repos?.length || 0,
              generated_at: new Date(parsed.timestamp).toISOString(),
            },
          };

          setPortfolio(mockPortfolio);
          setLoading(false);
          return;
        }
      }

      setError(
        'Preview verileri bulunamadı veya eşleşmiyor. Lütfen edit sayfasından tekrar önizleme yapın.',
      );
      setLoading(false);
    } catch (error) {
      console.error('❌ Preview hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setError(`Preview hatası: ${errorMessage}`);
      setLoading(false);
    }
  }, [id]);

  const handleNormalMode = useCallback(async () => {
    console.log('🌐 handleNormalMode çalıştı');
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/portfolio/${id}`);
      if (response.status === 404) {
        setNotFoundError(true);
        setLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success && data.portfolio?.generated_html) {
        setPortfolio(data.portfolio);
      } else {
        setError(data.error || 'Portfolio could not be loaded.');
      }
    } catch (err) {
      console.error('❌ Normal mode hata:', err);
      setError(err instanceof Error ? err.message : 'Portfolio yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (notFoundError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="flex items-center justify-center mb-6">
            <FileWarning className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Portfolyo Bulunamadı</h1>
          <p className="text-gray-600 mb-8">
            Aradığınız portfolyo mevcut değil veya kaldırılmış olabilir.
          </p>
          <div className="space-y-4">
            <Button onClick={() => router.push('/')} size="lg" className="w-full">
              Ana Sayfaya Dön
            </Button>
            <Button variant="secondary" onClick={() => router.back()} size="lg" className="w-full">
              Geri Dön
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="flex items-center justify-center mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bir Hata Oluştu</h1>
          <p className="text-red-600 mb-8">{error}</p>
          <div className="space-y-4">
            <Button
              onClick={() => (mode === 'preview' ? handlePreviewMode() : handleNormalMode())}
              size="lg"
              className="w-full"
            >
              Tekrar Dene
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/')}
              size="lg"
              className="w-full"
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <p className="text-gray-600">Portfolio yükleniyor...</p>
        </Card>
      </div>
    );
  }

  if (portfolio?.generated_html) {
    return (
      <div className="min-h-screen bg-white">
        <div
          className="w-full h-screen"
          dangerouslySetInnerHTML={{ __html: portfolio.generated_html }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md mx-auto text-center p-8">
        <div className="flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Hazırlanıyor</h1>
        <p className="text-gray-600 mb-8">
          Bu portfolio henüz hazırlanma aşamasında. Lütfen daha sonra tekrar deneyin.
        </p>
        <Button onClick={() => router.push('/')} size="lg" className="w-full">
          Ana Sayfaya Dön
        </Button>
      </Card>
    </div>
  );
}

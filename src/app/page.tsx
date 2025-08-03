'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense, lazy, useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Footer from '@/components/ui/Footer';
import { LiquidHeader } from '@/components/ui/LiquidHeader';
import { Github, Zap, Globe, Sparkles } from 'lucide-react';
import { usePortfolioList } from '@/hooks/usePortfolioList';

// Lazy load HeroSection
const HeroSection = lazy(() => import('@/components/ui/HeroSection'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const shouldFetchPortfolios = Boolean(session && status === 'authenticated');
  const { portfolios, isLoading: portfoliosLoading } = usePortfolioList(shouldFetchPortfolios);

  // Client-side hydration için
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Artık otomatik yönlendirme yapmıyoruz - kullanıcı landing page'de kalabilir

  // İlk yükleme sırasında minimal loading göster
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
        <LiquidHeader demoMode={demoMode} variant="transparent" />
        <div className="flex-1 flex items-center justify-center" style={{ paddingTop: '64px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Session loading durumu için daha hızlı geçiş
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
        <LiquidHeader demoMode={demoMode} variant="transparent" />
        <div className="flex-1 flex items-center justify-center" style={{ paddingTop: '64px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Hazırlanıyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Header */}
      <LiquidHeader demoMode={demoMode} variant="transparent" />

      {/* Hero Section */}
      <div style={{ paddingTop: '64px' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <HeroSection
            title="GitHub Projelerinizden 5 Dakikada Portfolyo"
            subtitle="Kod yazmadan, GitHub projelerinizi kullanarak profesyonel bir portfolyo sitesi oluşturun. Sadece projelerinizi seçin, şablonunuzu belirleyin ve hazır!"
            ctaText={demoMode ? "Demo'yu Dene" : session ? "Dashboard'a Git" : 'Ücretsiz Başla'}
            ctaAction={
              demoMode
                ? () => router.push('/dashboard')
                : session
                  ? () => router.push('/dashboard')
                  : () => signIn('github')
            }
            background="gradient"
          />
        </Suspense>
      </div>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sayılarla PortfolYO
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Binlerce geliştirici PortfolYO ile portfolyolarını oluşturuyor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card variant="glass" className="text-center p-8 hover-lift">
              <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
              <div className="text-gray-600">Oluşturulan Portfolyo</div>
            </Card>
            <Card variant="glass" className="text-center p-8 hover-lift">
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">İşlenen GitHub Projesi</div>
            </Card>
            <Card variant="glass" className="text-center p-8 hover-lift">
              <div className="text-4xl font-bold text-green-600 mb-2">%98</div>
              <div className="text-gray-600">Memnuniyet Oranı</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Neden PortfolYO?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              GitHub projelerinizi çekici portfolyo sitelerine dönüştürmenin en kolay yolu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 text-center hover-lift">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 inline-block mb-6">
                <Github className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">GitHub Entegrasyonu</h3>
              <p className="text-gray-600">
                GitHub hesabınızla giriş yapın, projelerinizi otomatik olarak çekelim.
              </p>
            </Card>

            <Card className="p-8 text-center hover-lift">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 inline-block mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hızlı ve Kolay</h3>
              <p className="text-gray-600">
                5 dakikada profesyonel portfolyo. Kod yazmanıza gerek yok.
              </p>
            </Card>

            <Card className="p-8 text-center hover-lift">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 inline-block mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Profesyonel Şablonlar</h3>
              <p className="text-gray-600">
                İhtiyacınıza uygun çok çeşitli modern ve responsive şablonlar.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nasıl Çalışır?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              3 basit adımda portfolyo siteniz hazır
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Projeleri Seç</h3>
                <p className="text-gray-600">
                  GitHub hesabınızdan göstermek istediğiniz projeleri seçin.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Şablon Belirle</h3>
                <p className="text-gray-600">
                  Kişiliğinize uygun profesyonel şablonlardan birini seçin.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Yayınla</h3>
                <p className="text-gray-600">
                  Portfolyo siteniz hazır! Paylaşın ve fırsatları yakalayın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Portfolyo Yolculuğunuza Başlayın
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
            GitHub projelerinizi birkaç tıkla etkileyici bir portfolyoya dönüştürün. Ücretsiz ve
            hızlı!
          </p>
          {session ? (
            <Button
              variant="glass"
              size="xl"
              icon={Github}
              onClick={() => router.push('/dashboard')}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-xl hover-lift"
            >
              Dashboard'a Git
            </Button>
          ) : (
            <Button
              variant="glass"
              size="xl"
              icon={Github}
              onClick={() => signIn('github')}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-xl hover-lift"
            >
              Ücretsiz Başla
            </Button>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

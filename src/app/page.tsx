'use client'

import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense, lazy, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Github, Zap, Globe, Code2, Sparkles, Plus, Star, CheckCircle } from 'lucide-react'
import { usePortfolioList } from '@/hooks/usePortfolioList'

// Lazy load HeroSection
const HeroSection = lazy(() => import('@/components/ui/HeroSection'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const shouldFetchPortfolios = Boolean(session && status === 'authenticated')
  const { portfolios, isLoading: portfoliosLoading } = usePortfolioList(shouldFetchPortfolios)

  // Client-side hydration için
  useEffect(() => {
    setIsClient(true)
  }, [])

  // İlk yükleme sırasında minimal loading göster
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
        <header className="glass border-b border-white/20 shadow-glass sticky top-0 z-50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 group focus:outline-none hover-lift">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-2.5 shadow-lg transition-all duration-300 group-hover:scale-105 group-active:scale-95">
                <Code2 className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                PortfolYO
              </span>
            </Link>
            <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse"></div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  // Session loading durumu için daha hızlı geçiş
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
        <header className="glass border-b border-white/20 shadow-glass sticky top-0 z-50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 group focus:outline-none hover-lift">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-2.5 shadow-lg transition-all duration-300 group-hover:scale-105 group-active:scale-95">
                <Code2 className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                PortfolYO
              </span>
            </Link>
            <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse"></div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Hazırlanıyor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/20 shadow-glass sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group focus:outline-none hover-lift">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-2.5 shadow-lg transition-all duration-300 group-hover:scale-105 group-active:scale-95">
              <Code2 className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              PortfolYO
            </span>
          </Link>
          {demoMode ? (
            <Link href="/dashboard">
              <Button variant="gradient" size="md" icon={Code2} className="shadow-lg hover-lift">
                Demo&apos;yu Dene
              </Button>
            </Link>
          ) : session ? (
            portfoliosLoading ? (
              <div className="h-10 w-40 bg-white/20 rounded-lg animate-pulse"></div>
            ) : portfolios.length === 0 ? (
              <Link href="/dashboard">
                <Button variant="gradient" size="md" icon={Plus} className="shadow-lg hover-lift">
                  İlk Portfolyonuzu Oluşturun
                </Button>
              </Link>
            ) : (
              <Link href="/my-portfolios">
                <Button variant="gradient" size="md" icon={Code2} className="shadow-lg hover-lift">
                  Portfolyolarım ({portfolios.length})
                </Button>
              </Link>
            )
          ) : (
            <Button variant="gradient" size="md" icon={Github} onClick={() => signIn('github')} className="shadow-lg hover-lift">
              GitHub ile Giriş
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection
          title="GitHub Projelerinizden 5 Dakikada Portfolyo"
          subtitle="Kod yazmadan, GitHub projelerinizi kullanarak profesyonel bir portfolyo sitesi oluşturun. Sadece projelerinizi seçin, şablonunuzu belirleyin ve hazır!"
          ctaText={demoMode ? "Demo'yu Dene" : session ? "Portfolyolarım" : "Ücretsiz Başla"}
          ctaAction={demoMode ? () => router.push('/dashboard') : session ? () => router.push('/my-portfolios') : () => signIn('github')}
          background="gradient"
        />
      </Suspense>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center smooth-fade animation-delay-200">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-6 mb-4 shadow-lg">
                <div className="text-3xl font-bold">5 dk</div>
                <div className="text-sm opacity-90">Oluşturma Süresi</div>
              </div>
            </div>
            <div className="text-center smooth-fade animation-delay-400">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl p-6 mb-4 shadow-lg">
                <div className="text-3xl font-bold">6+</div>
                <div className="text-sm opacity-90">Modern Şablon</div>
              </div>
            </div>
            <div className="text-center smooth-fade animation-delay-600">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-6 mb-4 shadow-lg">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm opacity-90">Ücretsiz</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Neden <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PortfolYO</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Yazılımcılar için özel olarak tasarlanmış, hızlı ve etkili portfolyo çözümü.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card variant="glass" className="text-center p-10 smooth-fade animation-delay-200">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Süper Hızlı</h3>
              <p className="text-gray-600 leading-relaxed">
                5 dakika içinde profesyonel portfolyo sitesine sahip olun. Kod yazmaya gerek yok, sadece projelerinizi seçin.
              </p>
            </Card>
            <Card variant="glass" className="text-center p-10 smooth-fade animation-delay-400">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                  <Github className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">GitHub Entegrasyonu</h3>
              <p className="text-gray-600 leading-relaxed">
                Projeleriniz otomatik olarak çekilir. README, dil, yıldız sayısı, commit geçmişi - her şey dahil.
              </p>
            </Card>
            <Card variant="glass" className="text-center p-10 smooth-fade animation-delay-600">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Globe className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Canlı & SEO Dostu</h3>
              <p className="text-gray-600 leading-relaxed">
                Statik siteler Google'da üst sıralarda. Portfolyonuz kolayca bulunabilir ve hızlı yüklenir.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-6 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              3 Adımda <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Hazır</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Basit, hızlı ve etkili. Sadece 3 adımda profesyonel portfolyonuzu oluşturun.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card variant="glass" className="text-center p-10 smooth-fade animation-delay-200">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">GitHub ile Giriş</h3>
              <p className="text-gray-600 leading-relaxed">Güvenli GitHub OAuth ile giriş yapın ve projelerinize erişim sağlayın</p>
            </Card>
            <Card variant="glass" className="text-center p-10 smooth-fade animation-delay-400">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Projelerinizi Seçin</h3>
              <p className="text-gray-600 leading-relaxed">Göstermek istediğiniz 4-6 projeyi seçin ve CV'nizi yükleyin</p>
            </Card>
            <Card variant="glass" className="text-center p-10 smooth-fade animation-delay-600">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Şablon Seçip Oluştur</h3>
              <p className="text-gray-600 leading-relaxed">Modern şablonlardan birini seçip portfolyonuzu oluşturun</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Portfolyonuzu <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Şimdi</span> Oluşturun
          </h2>
          <p className="text-blue-100 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Geliştiriciler için tasarlanmış, modern ve profesyonel portfolyo platformu. 
            <span className="font-semibold text-white"> Hemen başlayın ve kariyerinizi bir üst seviyeye taşıyın!</span>
          </p>
          {demoMode ? (
            <Link href="/dashboard">
              <Button variant="glass" size="xl" icon={Code2} className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-xl hover-lift">
                Demo&apos;yu Dene
              </Button>
            </Link>
          ) : session ? (
            <Link href="/my-portfolios">
              <Button variant="glass" size="xl" icon={Code2} className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-xl hover-lift">
                Portfolyolarım
              </Button>
            </Link>
          ) : (
            <Button variant="glass" size="xl" icon={Github} onClick={() => signIn('github')} className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-xl hover-lift">
              Ücretsiz Başla
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}

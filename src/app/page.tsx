'use client'

import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Github, Zap, Globe, Code2, Sparkles, User, Plus } from 'lucide-react'
import { usePortfolioList } from '@/hooks/usePortfolioList'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const { portfolios, isLoading: portfoliosLoading } = usePortfolioList()

  // Session kontrolü kaldırıldı - güvenli alanda logo artık /my-portfolios'a gidiyor
  // useEffect(() => {
  //   if (session && !demoMode) {
  //     router.push('/dashboard')
  //   }
  // }, [session, router, demoMode])

  // Session loading durumunda da içeriği göster, sadece GitHub butonunu loading yap
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200/50 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 group focus:outline-none">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2.5 shadow-lg transition-transform group-hover:scale-105 group-active:scale-95">
                <Code2 className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight group-hover:text-blue-700 transition-colors">PortfolYO</span>
            </Link>
            <Button size="md" icon={Code2} disabled className="shadow-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Yükleniyor...
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto text-center">
            <div className="max-w-5xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8 shadow-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Yeni: AI Destekli Portfolio Oluşturucu
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
                GitHub Projelerinizden
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">5 Dakikada Portfolyo</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Kod yazmadan, GitHub projelerinizi kullanarak profesyonel bir portfolyo sitesi oluşturun. 
                <span className="font-semibold text-gray-800"> Sadece projelerinizi seçin, şablonunuzu belirleyin ve hazır!</span>
              </p>
              
              {/* Stats */}
              <div className="flex justify-center items-center space-x-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">5 dk</div>
                  <div className="text-sm text-gray-500">Oluşturma Süresi</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">6+</div>
                  <div className="text-sm text-gray-500">Modern Şablon</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-500">Ücretsiz</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" icon={Code2} disabled className="shadow-xl transform hover:scale-105 transition-all">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Yükleniyor...
                </Button>
                <Link href="#features">
                  <Button variant="secondary" size="lg" className="shadow-lg">
                    Nasıl Çalışır?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group focus:outline-none">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2.5 shadow-lg transition-transform group-hover:scale-105 group-active:scale-95">
              <Code2 className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight group-hover:text-blue-700 transition-colors">PortfolYO</span>
          </Link>
          {demoMode ? (
            <Link href="/dashboard">
              <Button size="md" icon={Code2} className="shadow-lg">
                Demo&apos;yu Dene
              </Button>
            </Link>
          ) : session ? (
            portfoliosLoading ? (
              <Button size="md" icon={Code2} disabled className="shadow-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Yükleniyor...
              </Button>
            ) : portfolios.length === 0 ? (
              <Link href="/dashboard">
                <Button size="md" icon={Plus} className="shadow-lg">
                  İlk Portfolyonuzu Oluşturun
                </Button>
              </Link>
            ) : (
              <Link href="/my-portfolios">
                <Button size="md" icon={Code2} className="shadow-lg">
                  Portfolyolarım ({portfolios.length})
                </Button>
              </Link>
            )
          ) : (
            <Button size="md" icon={Github} onClick={() => signIn('github')} className="shadow-lg">
              GitHub ile Giriş
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8 shadow-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Yeni: AI Destekli Portfolio Oluşturucu
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
              GitHub Projelerinizden
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">5 Dakikada Portfolyo</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Kod yazmadan, GitHub projelerinizi kullanarak profesyonel bir portfolyo sitesi oluşturun. 
              <span className="font-semibold text-gray-800"> Sadece projelerinizi seçin, şablonunuzu belirleyin ve hazır!</span>
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">5 dk</div>
                <div className="text-sm text-gray-500">Oluşturma Süresi</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">6+</div>
                <div className="text-sm text-gray-500">Modern Şablon</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-500">Ücretsiz</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {demoMode ? (
                <Link href="/dashboard">
                  <Button size="lg" icon={Code2} className="shadow-xl transform hover:scale-105 transition-all">
                    Demo&apos;yu Dene
                  </Button>
                </Link>
              ) : session ? (
                portfoliosLoading ? (
                  <Button size="lg" icon={Code2} disabled className="shadow-xl transform hover:scale-105 transition-all">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Yükleniyor...
                  </Button>
                ) : portfolios.length === 0 ? (
                  <Link href="/dashboard">
                    <Button size="lg" icon={Plus} className="shadow-xl transform hover:scale-105 transition-all">
                      İlk Portfolyonuzu Oluşturun
                    </Button>
                  </Link>
                ) : (
                  <Link href="/my-portfolios">
                    <Button size="lg" icon={Code2} className="shadow-xl transform hover:scale-105 transition-all">
                      Portfolyolarım ({portfolios.length})
                    </Button>
                  </Link>
                )
              ) : (
                <Button size="lg" icon={Github} onClick={() => signIn('github')} className="shadow-xl transform hover:scale-105 transition-all">
                  Ücretsiz Başla
                </Button>
              )}
              <Link href="#features">
                <Button variant="secondary" size="lg" className="shadow-lg">
                  Nasıl Çalışır?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Neden <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PortfolYO</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Yazılımcılar için özel olarak tasarlanmış, hızlı ve etkili portfolyo çözümü.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-10 shadow-lg hover:shadow-xl border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
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
            <Card className="text-center p-10 shadow-lg hover:shadow-xl border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1">
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
            <Card className="text-center p-10 shadow-lg hover:shadow-xl border-gray-100 hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1">
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              3 Adımda <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Hazır</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Basit, hızlı ve etkili. Sadece 3 adımda profesyonel portfolyonuzu oluşturun.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-10 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">GitHub ile Giriş</h3>
              <p className="text-gray-600 leading-relaxed">Güvenli GitHub OAuth ile giriş yapın ve projelerinize erişim sağlayın</p>
            </Card>
            <Card className="text-center p-10 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Projelerinizi Seçin</h3>
              <p className="text-gray-600 leading-relaxed">Göstermek istediğiniz 4-6 projeyi seçin ve CV'nizi yükleyin</p>
            </Card>
            <Card className="text-center p-10 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Portfolyonuzu <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Şimdi</span> Oluşturun
          </h2>
          <p className="text-blue-100 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Geliştiriciler için tasarlanmış, modern ve profesyonel portfolyo platformu. 
            <span className="font-semibold text-white"> Hemen başlayın ve kariyerinizi bir üst seviyeye taşıyın!</span>
          </p>
          {demoMode ? (
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" icon={Code2} className="shadow-xl transform hover:scale-105 transition-all">
                Demo&apos;yu Dene
              </Button>
            </Link>
          ) : session ? (
            <Link href="/my-portfolios">
              <Button size="lg" variant="secondary" icon={Code2} className="shadow-xl transform hover:scale-105 transition-all">
                Portfolyolarım
              </Button>
            </Link>
          ) : (
            <Button size="lg" icon={Github} onClick={() => signIn('github')} className="shadow-xl transform hover:scale-105 transition-all">
              Ücretsiz Başla
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}

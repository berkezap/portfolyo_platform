'use client'

import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Github, Zap, Globe, Code2 } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading' || session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">PortfolYO</span>
          </div>
          {demoMode ? (
            <Link href="/dashboard">
              <Button size="md" icon={Code2}>
                Demo'yu Dene
              </Button>
            </Link>
          ) : (
            <Button size="md" icon={Github} onClick={() => signIn('github')}>
              GitHub ile Giriş
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              GitHub Projelerinizden
              <span className="text-blue-600 block">5 Dakikada Portfolyo</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Kod yazmadan, GitHub projelerinizi kullanarak profesyonel bir portfolyo sitesi oluşturun. Sadece projelerinizi seçin, şablonunuzu belirleyin ve hazır!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {demoMode ? (
                <Link href="/dashboard">
                  <Button size="lg" icon={Code2}>
                    Demo'yu Dene
                  </Button>
                </Link>
              ) : (
                <Button size="lg" icon={Github} onClick={() => signIn('github')}>
                  Ücretsiz Başla
                </Button>
              )}
              <Link href="#features">
                <Button variant="secondary" size="lg">
                  Nasıl Çalışır?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Neden PortfolYO?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Yazılımcılar için özel olarak tasarlanmış, hızlı ve etkili portfolyo çözümü.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 shadow-none border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Süper Hızlı</h3>
              <p className="text-gray-600">
                5 dakika içinde profesyonel portfolyo sitesine sahip olun. Kod yazmaya gerek yok.
              </p>
            </Card>
            <Card className="text-center p-8 shadow-none border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <Github className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">GitHub Entegrasyonu</h3>
              <p className="text-gray-600">
                Projeleriniz otomatik olarak çekilir. README, dil, yıldız sayısı - her şey dahil.
              </p>
            </Card>
            <Card className="text-center p-8 shadow-none border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Canlı & SEO Dostu</h3>
              <p className="text-gray-600">
                Statik siteler Google'da üst sıralarda. Portfolyonuz kolayca bulunabilir.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              3 Adımda Hazır
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-8 border-gray-100">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GitHub ile Giriş</h3>
              <p className="text-gray-600">Güvenli GitHub OAuth ile giriş yapın</p>
            </Card>
            <Card className="text-center p-8 border-gray-100">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Projelerinizi Seçin</h3>
              <p className="text-gray-600">Göstermek istediğiniz 4-6 projeyi seçin</p>
            </Card>
            <Card className="text-center p-8 border-gray-100">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Şablon Seçip Oluştur</h3>
              <p className="text-gray-600">Modern şablonlardan birini seçip portfolyonuzu oluşturun</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Portfolyonuzu Şimdi Oluşturun
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Geliştiriciler için tasarlanmış, modern ve profesyonel portfolyo platformu.
          </p>
          {demoMode ? (
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" icon={Code2}>
                Demo'yu Dene
              </Button>
            </Link>
          ) : (
            <Button size="lg" icon={Github} onClick={() => signIn('github')}>
              Ücretsiz Başla
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}

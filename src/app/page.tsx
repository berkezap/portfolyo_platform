'use client'

import { useSession, signIn } from 'next-auth/react'
import { Github, Zap, Globe, Code2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Giriş yapan kullanıcıyı direkt dashboard'a yönlendir
  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Demo mode - Environment'dan kontrol et
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PortfolYO</span>
          </div>
                     {demoMode ? (
             <Link
               href="/dashboard"
               className="inline-flex items-center px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
             >
               <Code2 className="mr-2 h-4 w-4" />
               Demo&apos;yu Dene
             </Link>
           ) : (
             <button
               onClick={() => signIn('github')}
               className="inline-flex items-center px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
             >
               <Github className="mr-2 h-4 w-4" />
               GitHub ile Giriş
             </button>
           )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              GitHub Projelerinizden
              <span className="text-blue-600 block">5 Dakikada Portfolyo</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Kod yazmadan, GitHub projelerinizi kullanarak profesyonel bir portfolyo sitesi oluşturun. 
              Sadece projelerinizi seçin, şablonunuzu belirleyin ve hazır!
            </p>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
               {demoMode ? (
                 <Link
                   href="/dashboard"
                   className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
                 >
                   <Code2 className="mr-3 h-5 w-5" />
                   Demo&apos;yu Dene
                 </Link>
               ) : (
                 <button
                   onClick={() => signIn('github')}
                   className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
                 >
                   <Github className="mr-3 h-5 w-5" />
                   Ücretsiz Başla
                 </button>
               )}
               <Link
                 href="#features"
                 className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors text-lg"
               >
                 Nasıl Çalışır?
               </Link>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden PortfolYO?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Yazılımcılar için özel olarak tasarlanmış, hızlı ve etkili portfolyo çözümü.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Süper Hızlı</h3>
              <p className="text-gray-600">
                5 dakika içinde profesyonel portfolyo sitesine sahip olun. Kod yazmaya gerek yok.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Github className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">GitHub Entegrasyonu</h3>
              <p className="text-gray-600">
                Projeleriniz otomatik olarak çekilir. README, dil, yıldız sayısı - her şey dahil.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Canlı &amp; SEO Dostu</h3>
              <p className="text-gray-600">
                Statik siteler Google'da üst sıralarda. Portfolyonuz kolayca bulunabilir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              3 Adımda Hazır
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GitHub ile Giriş</h3>
              <p className="text-gray-600">Güvenli GitHub OAuth ile giriş yapın</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Projelerinizi Seçin</h3>
              <p className="text-gray-600">Göstermek istediğiniz 4-6 projeyi seçin</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Şablon Seçip Oluştur</h3>
              <p className="text-gray-600">Modern şablonlardan birini seçip portfolyonuzu oluşturun</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Portfolyonuzu Şimdi Oluşturun
          </h2>
                     <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
             Hızlı, kolay ve profesyonel portfolyo oluşturmanın yeni yolu. Sıra sizde!
           </p>
                     {demoMode ? (
             <Link
               href="/dashboard"
               className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
             >
               <Code2 className="mr-3 h-5 w-5" />
               Demo&apos;yu Dene
             </Link>
           ) : (
             <button
               onClick={() => signIn('github')}
               className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
             >
               <Github className="mr-3 h-5 w-5" />
               Ücretsiz Başla
             </button>
           )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-blue-600 rounded-lg p-2">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">PortfolYO</span>
          </div>
          <p className="text-gray-400">
            Yazılımcılar için modern portfolyo çözümü
          </p>
        </div>
      </footer>
    </div>
  )
}

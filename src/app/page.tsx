'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Footer from '@/components/ui/Footer';
import { LiquidHeader } from '@/components/ui/LiquidHeader';
import { Github, Zap, LayoutTemplate, GitBranch, User, ChevronDown, ExternalLink, HelpCircle } from 'lucide-react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  // Client-side hydration için
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize expensive computations
  const authButtonConfig = {
    text: session ? "Dashboard'a Git" : 'GitHub ile Başla',
    action: session ? () => router.push('/dashboard') : () => signIn('github')
  };

  // Early return with minimal loading state
  if (!isClient || status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <LiquidHeader demoMode={demoMode} variant="transparent" />

      {/* Hero Section */}
      <main className="min-h-screen flex" style={{ paddingTop: '64px' }}>
        {/* Left Side - Hero Content */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-20">
          <div className="max-w-2xl">
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              GitHub'dan
              <br />
              portfolyoya
              <br />
              <span className="text-gray-600">5 dakikada</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Kod yazmadan GitHub projelerinizi profesyonel portfolyo 
              sitesine dönüştürün. Geliştiriciler için tasarlanmış, 
              tamamen kodsuz çözüm.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                variant="primary"
                size="xl"
                icon={Github}
                onClick={authButtonConfig.action}
                className="bg-black hover:bg-gray-800 text-white px-10 py-5 text-xl"
              >
                {authButtonConfig.text}
              </Button>
            </div>

            {/* Credit Card Note */}
            <p className="text-base text-gray-500">
              Kredi kartı gerekmiyor
            </p>
          </div>
        </div>

        {/* Right Side - Portfolio Preview */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8 py-20">
          <div className="relative w-full max-w-4xl">
            {/* Portfolio Preview Container with floating animation */}
            <div className="relative">
              {/* Floating background elements */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20"></div>
              <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20"></div>
              
              {/* Browser Window */}
              <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Browser Header */}
                <div className="bg-gray-50 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="bg-white rounded px-3 py-1 text-sm text-gray-600 inline-block">
                      ahmety.portfolyo.com
                    </div>
                  </div>
                </div>

                {/* Portfolio Content */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[420px] overflow-hidden">
                  {/* Profile Section */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                      AY
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Ahmet Yılmaz</h3>
                      <p className="text-blue-600">Full Stack Developer</p>
                      <p className="text-gray-600 text-sm">React & Node.js uzmanı</p>
                    </div>
                  </div>

                  {/* Scrolling Projects Container */}
                  <div className="relative h-72 overflow-hidden">
                    <div className="absolute inset-0 animate-scroll-up">
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm">E-Ticaret Platformu</h4>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500 text-sm">⭐</span>
                              <span className="text-xs text-gray-600">34</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">React</span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Node.js</span>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm">Task Management</h4>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500 text-sm">⭐</span>
                              <span className="text-xs text-gray-600">28</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">TypeScript</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Next.js</span>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm">API Gateway</h4>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500 text-sm">⭐</span>
                              <span className="text-xs text-gray-600">19</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Express</span>
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Docker</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Benefits / Faydalar */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
              Asıl güç
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              GitHub projelerinizi çekici portfolyo sitelerine dönüştürmenin gerçekten en kolay yolu. 
              Sadece yaptığımız ve iyi yaptığımız şeyler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm group hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <GitBranch className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">GitHub'dan otomatik içerik</h3>
              <p className="text-gray-600 leading-relaxed">
                Repo açıklamaları, README özetleri, teknoloji etiketleri ve yıldız sayıları otomatik çekilir. 
                İçeriği istediğiniz zaman kolayca yeniden oluşturabilirsiniz.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm group hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <LayoutTemplate className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Profesyonel şablonlar</h3>
              <p className="text-gray-600 leading-relaxed">
                Deneyimli tasarımcılar tarafından hazırlanmış, mobil uyumlu ve modern şablonlardan 
                birini seçerek anında profesyonel görünüme kavuşun.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm group hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Zap className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Anında yayınla ve yönet</h3>
              <p className="text-gray-600 leading-relaxed">
                Oluşturduktan sonra portfolyonuz paylaşılabilir bir link ile anında görüntülenir. 
                Daha sonra kolayca düzenleyebilir veya yeni taslaklar oluşturabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Nasıl Çalışır */}
      <section className="py-32 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
              Nasıl çalışır?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              3 basit adımda GitHub projelerinizi profesyonel portfolyoya dönüştürün
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gray-800 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:bg-gray-700 transition-colors">
                  01
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">GitHub'ı bağla</h3>
                <p className="text-gray-400 leading-relaxed">
                  GitHub hesabınızla giriş yapın ve göstermek istediğiniz 
                  projelerinizi seçin. Otomatik bilgi çekme ile zaman kazanın.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-gray-800 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:bg-gray-700 transition-colors">
                  02
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Şablonu seç</h3>
                <p className="text-gray-400 leading-relaxed">
                  Kişiliğinize ve sektörünüze uygun profesyonel şablonlardan 
                  birini seçin. Her şablon tamamen responsive ve modern.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-gray-800 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:bg-gray-700 transition-colors">
                  03
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Yayınla ve paylaş</h3>
                <p className="text-gray-400 leading-relaxed">
                  Portfolyonuz hazır! Paylaşılabilir bağlantınızla 
                  sosyal medyada paylaşın ve fırsatları yakalayın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Gallery - Şablon Galerisi */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Her tarza uygun bir şablon
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Projelerinizin nasıl görüneceğini görün. Tümü responsive ve modern tasarım.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Modern Developer Template */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <iframe
                  src="/templates/modern-developer/index.html"
                  className="w-full h-full border-0 pointer-events-none scale-50 origin-top-left"
                  title="Modern Developer Template"
                  style={{ width: '200%', height: '200%' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Developer</h3>
                <p className="text-gray-600 text-sm mb-4">Temiz ve minimal tasarım. Teknik projeler için ideal.</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    Şablonu Seç
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Creative Portfolio Template */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <iframe
                  src="/templates/creative-portfolio/index.html"
                  className="w-full h-full border-0 pointer-events-none scale-50 origin-top-left"
                  title="Creative Portfolio Template"
                  style={{ width: '200%', height: '200%' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Creative Portfolio</h3>
                <p className="text-gray-600 text-sm mb-4">Yaratıcı projeler için cesur ve dinamik tasarım.</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    Şablonu Seç
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Minimalist Professional Template */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <iframe
                  src="/templates/minimalist-professional/index.html"
                  className="w-full h-full border-0 pointer-events-none scale-50 origin-top-left"
                  title="Minimalist Professional Template"
                  style={{ width: '200%', height: '200%' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Minimalist Professional</h3>
                <p className="text-gray-600 text-sm mb-4">Kurumsal ve şık görünüm. İş başvuruları için mükemmel.</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    Şablonu Seç
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack - Üzerine İnşa Edildi */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Dünyanın en iyi araçlarıyla inşa edildi
            </h2>
            <p className="text-gray-600">
              Zaten güvendiğiniz sağlam teknolojiler üzerinde çalışıyor
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-70 max-w-4xl mx-auto">
            <div className="text-gray-500 font-semibold tracking-wide text-sm">NEXT.JS</div>
            <div className="text-gray-500 font-semibold tracking-wide text-sm">VERCEL</div>
            <div className="text-gray-500 font-semibold tracking-wide text-sm">SUPABASE</div>
            <div className="text-gray-500 font-semibold tracking-wide text-sm">GITHUB</div>
            <div className="text-gray-500 font-semibold tracking-wide text-sm">SENTRY</div>
            <div className="text-gray-500 font-semibold tracking-wide text-sm">TAILWIND</div>
          </div>
        </div>
      </section>

      {/* Founder Note - Kurucudan Not */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <User className="h-10 w-10 text-gray-600" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Geliştiriciler için, geliştiriciler tarafından
            </h2>
            <blockquote className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
              "Merhaba, ben Berke. PortfolYO'yu, harika projeleri olan ama sergilemekte zorlanan 
              geliştiriciler için tek başıma inşa ettim. Amacım, kariyerinizin başındaki en büyük 
              engellerden birini kaldırmak. Umarım size de hız kazandırır."
            </blockquote>
            <div className="text-gray-600">
              <div className="font-medium">Berke Zap</div>
              <div className="text-sm">Kurucu, PortfolYO</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - SSS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Sıkça sorulan sorular
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Merak ettiğiniz her şeyin cevabı burada
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "GitHub hesabı gerekli mi?",
                answer: "Evet, projelerinizi güvenle çekmek için GitHub hesabına ihtiyaç duyuyoruz. Sadece public repolarınıza erişiyoruz."
              },
              {
                question: "Otomatik güncelleniyor mu?",
                answer: "Hayır, otomatik senkronizasyon yok. İçeriği istediğiniz zaman dashboard'dan yeniden oluşturabilirsiniz."
              },
              {
                question: "Ücretsiz mi?",
                answer: "Şu anda evet, tamamen ücretsiz. İleride premium planlar gelirse şeffafça duyuracağız."
              },
              {
                question: "Veri güvenliği nasıl sağlanıyor?",
                answer: "Çerez tercihleri ve GDPR süreciyle veri kontrolü tamamen sizde. Sadece gerekli verileri işliyoruz."
              },
              {
                question: "Portfolyomu düzenleyebilir miyim?",
                answer: "Evet! Dashboard üzerinden projelerinizi değiştirebilir, şablon değiştirebilir ve yeni versiyonlar oluşturabilirsiniz."
              },
              {
                question: "Demo var mı?",
                answer: "Evet, demo modu açıksa örnek verilerle test edebilirsiniz. GitHub'a girmeden önce nasıl çalıştığını görebilirsiniz."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
            Portfolyo yolculuğunuza başlamaya hazır mısınız?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            GitHub projelerinizi birkaç tıkla etkileyici bir portfolyoya dönüştürün. 
            Ücretsiz, hızlı ve profesyonel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="primary"
              size="lg"
              icon={Github}
              onClick={authButtonConfig.action}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg"
            >
              {authButtonConfig.text}
            </Button>
            <p className="text-sm text-gray-500">
              Kredi kartı gerekmiyor • Dakikalar içinde hazır
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

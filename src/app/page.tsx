'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Footer from '@/components/ui/Footer';
import { LiquidHeader } from '@/components/ui/LiquidHeader';
import { Github, Zap, Globe, GitBranch, LayoutTemplate } from 'lucide-react';

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const from = 0;
    const to = value;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [value, duration]);
  return <>{display}</>;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  // Waitlist state
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Client-side hydration için
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Waitlist handler
  const handleWaitlistSubmit = async (email?: string) => {
    const emailToUse = email || waitlistEmail;
    if (!emailToUse) {
      // Email input modal açılacak
      const userEmail = prompt('E-posta adresinizi girin:');
      if (!userEmail) return;
      setWaitlistEmail(userEmail);
      return handleWaitlistSubmit(userEmail);
    }

    setWaitlistLoading(true);
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToUse,
          feature: 'pro',
          source: 'landing-page',
        }),
      });

      if (response.ok) {
        setWaitlistSuccess(true);
        setTimeout(() => setWaitlistSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Waitlist error:', error);
    } finally {
      setWaitlistLoading(false);
    }
  };

  // Memoize expensive computations
  const authButtonConfig = {
    text: session ? "Dashboard'a Git" : 'GitHub ile Başla',
    action: session ? () => router.push('/dashboard') : () => signIn('github'),
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <LiquidHeader demoMode={demoMode} variant="transparent" />

      {/* Main Hero Section */}
      <main className="min-h-screen flex" style={{ paddingTop: '64px' }}>
        {/* Left Side - Hero Content */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-20">
          <div className="max-w-2xl">
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              GitHub'dan
              <br />
              portfolYO'ya
              <br />
              <span className="text-gray-600">5 dakikada</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Kod yazmadan GitHub projelerinizi profesyonel portfolyo sitesine dönüştürün.
              Geliştiriciler, tasarımcılar ve kurumlar için tamamen özelleştirilebilir çözüm.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                variant="primary"
                size="lg"
                icon={Github}
                onClick={authButtonConfig.action}
                className="px-8 py-3"
              >
                {authButtonConfig.text}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => router.push('/pricing')}
                className="px-8 py-3"
              >
                Fiyatlandırma
              </Button>
            </div>

            {/* Credit Card Note */}
            <p className="text-base text-gray-500">Kredi kartı gerekmiyor</p>
          </div>
        </div>

        {/* Right Side - Portfolio Preview */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8 py-20">
          <div className="relative w-full max-w-4xl">
            {/* Aura glow behind window */}
            <div
              className="absolute -z-10 -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-40 blur-[120px]"
              style={{
                background:
                  'radial-gradient(closest-side, rgba(99,102,241,0.25), rgba(99,102,241,0.10), transparent 70%)',
              }}
            />
            {/* Portfolio Preview Container with floating animation */}
            <div
              className="relative group"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                const card = e.currentTarget.querySelector<HTMLDivElement>('.floating-window');
                if (card) {
                  const rotateY = (-10 * px).toFixed(2);
                  const rotateX = (6 * -py).toFixed(2);
                  card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
                }
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget.querySelector<HTMLDivElement>('.floating-window');
                if (card) card.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(2deg)';
              }}
            >
              {/* Floating background elements */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20"></div>
              <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20"></div>

              {/* Browser Window */}
              <div
                className="floating-window relative bg-white rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35),0_18px_36px_-18px_rgba(99,102,241,0.25)] ring-1 ring-indigo-100 border border-gray-200 overflow-hidden transform-gpu"
                style={{
                  perspective: '1000px',
                  transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                  transition: 'transform 400ms ease',
                }}
              >
                {/* Browser Header */}
                <div className="bg-gray-50 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="bg-white rounded px-3 py-1 text-sm text-gray-600 inline-block">
                      ahmetyilmaz.portfolyo.com
                    </div>
                  </div>
                </div>

                {/* Portfolio Content - Realistic site layout */}
                <div className="p-0 bg-white min-h-[420px]">
                  {/* App Navbar */}
                  <div className="px-5 py-3 border-b border-gray-200 bg-white/90 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">portfolYO</span>
                    </div>
                    <div className="hidden md:flex items-center gap-5 text-sm text-gray-600">
                      <span className="cursor-default">Ana Sayfa</span>
                      <span className="cursor-default">Projeler</span>
                      <span className="cursor-default">Hakkımda</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gray-200" />
                  </div>

                  {/* Hero banner */}
                  <div className="px-5 pt-5 pb-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                    <div className="text-sm text-indigo-700 font-medium">Merhaba, ben Ahmet</div>
                  </div>

                  {/* Main content */}
                  <div className="grid grid-cols-12 gap-5 p-5">
                    {/* Sidebar */}
                    <aside className="col-span-4 hidden md:block">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-900">Ahmet Yılmaz</div>
                          <div className="text-xs text-gray-500">Full‑stack Developer</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-[10px]">
                            React
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                            Node.js
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px]">
                            TypeScript
                          </span>
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px]">
                            Docker
                          </span>
                        </div>
                      </div>
                    </aside>

                    {/* Projects grid */}
                    <section className="col-span-12 md:col-span-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Card 1 */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                            <div className="absolute top-2 right-2 text-[11px] bg-white/80 rounded px-2 py-0.5 text-gray-700">
                              ⭐ <AnimatedNumber value={34} />
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="text-sm font-normal text-gray-900">
                              E‑Ticaret Platformu
                            </div>
                            <div className="mt-2 flex gap-1 flex-wrap">
                              <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-[10px]">
                                React
                              </span>
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                                Node.js
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                            <div className="absolute top-2 right-2 text-[11px] bg-white/80 rounded px-2 py-0.5 text-gray-700">
                              ⭐ <AnimatedNumber value={28} />
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="text-sm font-normal text-gray-900">Task Management</div>
                            <div className="mt-2 flex gap-1 flex-wrap">
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px]">
                                TypeScript
                              </span>
                              <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px]">
                                Next.js
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                            <div className="absolute top-2 right-2 text-[11px] bg-white/80 rounded px-2 py-0.5 text-gray-700">
                              ⭐ <AnimatedNumber value={19} />
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="text-sm font-normal text-gray-900">API Gateway</div>
                            <div className="mt-2 flex gap-1 flex-wrap">
                              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px]">
                                Express
                              </span>
                              <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px]">
                                Docker
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                            <div className="absolute top-2 right-2 text-[11px] bg-white/80 rounded px-2 py-0.5 text-gray-700">
                              ⭐ <AnimatedNumber value={42} />
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="text-sm font-normal text-gray-900">Mobile App</div>
                            <div className="mt-2 flex gap-1 flex-wrap">
                              <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-[10px]">
                                React Native
                              </span>
                              <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-[10px]">
                                Expo
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Built on / Üzerine inşa edildi */}
      <section className="relative py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 border-y border-gray-100 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-full opacity-40 blur-3xl" />
        <div className="container mx-auto px-6 relative">
          <p className="text-center text-sm md:text-base text-gray-500 mb-10">
            Üzerine inşa edildi: Güvendiğiniz modern teknolojiler
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-8 items-center justify-items-center">
            <img
              src="https://cdn.simpleicons.org/nextdotjs/4b5563"
              alt="Next.js"
              className="h-7 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://cdn.simpleicons.org/vercel/4b5563"
              alt="Vercel"
              className="h-7 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://cdn.simpleicons.org/supabase/4b5563"
              alt="Supabase"
              className="h-7 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://cdn.simpleicons.org/sentry/4b5563"
              alt="Sentry"
              className="h-7 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://cdn.simpleicons.org/tailwindcss/4b5563"
              alt="Tailwind CSS"
              className="h-7 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://cdn.simpleicons.org/redis/4b5563"
              alt="Redis"
              className="h-7 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://cdn.simpleicons.org/github/4b5563"
              alt="GitHub"
              className="h-7 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Benefits / Özellikler - Cal.com tarzı */}
      <section
        id="features"
        className="relative py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
      >
        <div className="absolute -top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 left-10 w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30 blur-3xl" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
              PortfolYO oluşturmak hiç bu kadar kolay olmamıştı
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              GitHub projelerinizi çekici portfolyo sitelerine dönüştürmenin en kolay yolu.
              Otomasyon, akıllı içerik ve profesyonel şablonlarla dakikalar içinde yayında olun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto relative">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm group hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <GitBranch className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                GitHub’dan otomatik içerik
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Repo açıklamaları, README özetleri, teknoloji etiketleri ve yıldız sayıları otomatik
                çekilir; içeriği istediğiniz zaman yeniden oluşturabilirsiniz.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm group hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <LayoutTemplate className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Profesyonel şablonlar</h3>
              <p className="text-gray-600 leading-relaxed">
                Modern ve mobil uyumlu şablonlardan birini seçerek dakikalar içinde profesyonel
                görünüme kavuşun.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm group hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Globe className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Anında paylaşın</h3>
              <p className="text-gray-600 leading-relaxed">
                Oluşturduğunuz portfolyo, paylaşılabilir bir bağlantıyla anında görüntülenir ve
                sonradan kolayca güncellenebilir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Features Coming Soon - Cal.com Style */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gray-300 rounded-full opacity-15 blur-3xl" />

        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            {/* Minimal badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 text-sm font-medium mb-8 shadow-sm">
              ✨ Pro özellikler çok yakında
              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">Q2 2025</span>
            </div>

            {/* Clean heading */}
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
              Bir üst seviye
              <br />
              <span className="text-gray-600">PortfolYO+</span>
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Premium şablonlar, özel alan adları, gelişmiş analitik ve öncelikli destek.
              <span className="font-medium text-gray-900"> Bekleme listesine özel %50 indirim</span>
            </p>

            {/* Simple pricing */}
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm">
                <div className="text-3xl font-semibold text-gray-900 mb-1">
                  <span className="line-through text-xl text-gray-400 mr-2">$10</span>
                  $5<span className="text-base text-gray-600">/ay</span>
                </div>
                <div className="text-sm text-green-600 font-medium">Bekleme listesi indirimi</div>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="px-8"
                onClick={() => handleWaitlistSubmit()}
                disabled={waitlistLoading}
              >
                {waitlistLoading
                  ? 'Ekleniyor...'
                  : waitlistSuccess
                    ? '✓ Eklendi!'
                    : 'Bekleme listesine katıl'}
              </Button>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <LayoutTemplate className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Premium Şablonlar</h3>
              <p className="text-sm text-gray-600">Profesyonelce tasarlanmış şablonlar</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Özel Alan Adı</h3>
              <p className="text-sm text-gray-600">Kendi alan adınızı kullanın</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Gelişmiş Analitik</h3>
              <p className="text-sm text-gray-600">Detaylı analizler ve metrikler</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-600 font-semibold text-sm">24/7</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Öncelikli Destek</h3>
              <p className="text-sm text-gray-600">E‑posta öncelikli destek</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Akış */}
      <section className="relative py-32 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
              Portfolyo yolculuğunuza başlamak için
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Sadece 3 basit adımda GitHub projelerinizi profesyonel portfolYO'ya dönüştürün
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
                  GitHub hesabınızla giriş yapın ve göstermek istediğiniz projelerinizi seçin.
                  Otomatik bilgi çekme ile zaman kazanın.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-gray-800 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:bg-gray-700 transition-colors">
                  02
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Şablonu seç</h3>
                <p className="text-gray-400 leading-relaxed">
                  Kişiliğinize ve sektörünüze uygun profesyonel şablonlardan birini seçin. Her
                  şablon tamamen responsive ve modern.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-gray-800 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:bg-gray-700 transition-colors">
                  03
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Yayınla ve paylaş</h3>
                <p className="text-gray-400 leading-relaxed">
                  Portfolyo siteniz hazır! Paylaşılabilir bağlantı ile anında görüntülenir ve
                  dilediğiniz zaman güncelleyebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Gallery / Şablon Galerisi */}
      <section className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gradient-to-b from-gray-100 to-transparent rounded-b-full opacity-70" />
        <div className="absolute -top-24 -left-10 w-72 h-72 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-25 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20 blur-3xl" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Her tarza uygun bir sahne
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Modern, minimalist ve yaratıcı şablonlarımızla projeleriniz hak ettiği sunumu bulur.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white transition-all hover:shadow-md hover:-translate-y-1 animate-fade-in">
              <iframe
                className="aspect-video w-full border-0 bg-white"
                srcDoc="<!DOCTYPE html><html><head><style>*{font-family:ui-sans-serif,system-ui}body{margin:0}</style></head><body><div style='padding:24px;border-bottom:1px solid #eee'><strong>Modern Developer</strong></div><div style='padding:24px;color:#6b7280'>Önizleme yakında.</div></body></html>"
              />
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Modern Developer</h3>
                <p className="text-sm text-gray-600">
                  Temiz tipografi, teknoloji rozetleri ve yıldız metrikleri için ideal.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white transition-all hover:shadow-md hover:-translate-y-1 animate-fade-in animation-delay-200">
              <iframe
                className="aspect-video w-full border-0 bg-white"
                srcDoc="<!DOCTYPE html><html><head><style>*{font-family:ui-sans-serif,system-ui}body{margin:0}</style></head><body><div style='padding:24px;border-bottom:1px solid #eee'><strong>Creative Technologist</strong></div><div style='padding:24px;color:#6b7280'>Önizleme yakında.</div></body></html>"
              />
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Creative Technologist</h3>
                <p className="text-sm text-gray-600">
                  Yaratıcı görsel hiyerarşi ve vitrin odaklı yapı.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white transition-all hover:shadow-md hover:-translate-y-1 animate-fade-in animation-delay-400">
              <iframe
                className="aspect-video w-full border-0 bg-white"
                srcDoc="<!DOCTYPE html><html><head><style>*{font-family:ui-sans-serif,system-ui}body{margin:0}</style></head><body><div style='padding:24px;border-bottom:1px solid #eee'><strong>Minimalist Professional</strong></div><div style='padding:24px;color:#6b7280'>Önizleme yakında.</div></body></html>"
              />
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Minimalist Professional</h3>
                <p className="text-sm text-gray-600">
                  Sade, hızlı ve iş görüşmelerine uygun sunum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Note / Kurucudan Not */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="absolute -top-24 right-0 w-72 h-72 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-40 blur-3xl" />
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                  B
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Geliştiriciler için, geliştiriciler tarafından
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Merhaba, ben Berke. PortfolYO’yu, harika projeleri olan ama sergilemekte
                    zorlanan geliştiriciler için tek başıma inşa ettim. Amacım, kariyerinizin
                    başındaki engellerden birini kaldırmak ve size hız kazandırmak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / SSS */}
      <section className="relative py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="absolute -top-24 left-0 w-72 h-72 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 right-0 w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20 blur-3xl" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kısa ve net cevaplar. Abartı yok.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-200 p-6 bg-white transition-colors hover:bg-gray-50 hover:border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-2">GitHub hesabı gerekli mi?</h3>
              <p className="text-gray-600 text-sm">
                Evet. Projelerinizi güvenle çekebilmek için GitHub ile giriş yapmanız gerekir.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 bg-white transition-colors hover:bg-gray-50 hover:border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-2">Otomatik güncelleniyor mu?</h3>
              <p className="text-gray-600 text-sm">
                İçeriği istediğiniz zaman yeniden oluşturabilirsiniz. Arka planda sürekli
                senkronizasyon yapmıyoruz.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 bg-white transition-colors hover:bg-gray-50 hover:border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-2">Ücretsiz mi?</h3>
              <p className="text-gray-600 text-sm">
                Şu an ücretsiz. Gelecekteki planları şeffafça duyuracağız.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 bg-white transition-colors hover:bg-gray-50 hover:border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-2">Veri güvenliği ve çerezler?</h3>
              <p className="text-gray-600 text-sm">
                Çerez tercihleri ve GDPR akışıyla kontrol sizde. Yalnızca izin verdiğiniz verileri
                işleriz.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 bg-white transition-colors hover:bg-gray-50 hover:border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-2">Düzenleme mümkün mü?</h3>
              <p className="text-gray-600 text-sm">
                Evet, oluşturduktan sonra portfolyonuzu tekrar güncelleyebilir ve yeni denemeler
                yapabilirsiniz.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 bg-white transition-colors hover:bg-gray-50 hover:border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-2">Demo var mı?</h3>
              <p className="text-gray-600 text-sm">
                Demo modu açıksa örnek verilerle dakikalar içinde deneme yapabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Softer tone */}
      <section className="relative py-12 md:py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
        <div className="absolute -top-20 left-1/3 w-72 h-72 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full opacity-25 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-gradient-to-br from-fuchsia-100 to-purple-100 rounded-full opacity-25 blur-3xl" />
        <div className="container mx-auto px-6 text-center relative">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
            PortfolYO yolculuğunuza başlayın
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto mb-6 leading-relaxed">
            GitHub projelerinizi birkaç tıkla etkileyici bir portfolYO'ya dönüştürün. Ücretsiz,
            hızlı ve profesyonel.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button variant="primary" size="lg" icon={Github} onClick={authButtonConfig.action}>
              {authButtonConfig.text}
            </Button>
            <p className="text-sm text-gray-500">Kredi kartı gerekmiyor • 2 dakikada kurulum</p>
          </div>
        </div>
      </section>
      <div style={{ height: '60px' }} />
      <Footer />
    </div>
  );
}

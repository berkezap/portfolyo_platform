'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Footer from '@/components/ui/Footer';
import { LiquidHeader } from '@/components/ui/LiquidHeader';
import { Github, Zap, Globe, LayoutTemplate, Smartphone, Search, Check } from 'lucide-react';
import ButtonNew from '@/components/ui/ButtonNew';
import { useTranslations, useLocale } from 'next-intl';

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
  const locale = useLocale();
  const t = useTranslations();
  // Waitlist state
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [_waitlistLoading, setWaitlistLoading] = useState(false);
  const [_waitlistSuccess, setWaitlistSuccess] = useState(false);

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
    text: session ? t('hero.ctaDashboard') : t('hero.ctaStart'),
    action: session ? () => router.push(`/${locale}/dashboard`) : () => signIn('github'),
  };

  // Early return with minimal loading state
  if (!isClient || status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <LiquidHeader demoMode={demoMode} variant="transparent" />
        <div className="flex-1 flex items-center justify-center" style={{ paddingTop: '64px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Header */}
      <LiquidHeader demoMode={demoMode} variant="transparent" />

      {/* Main Hero Section */}
      <main className="min-h-screen flex" style={{ paddingTop: '64px' }}>
        {/* Left Side - Hero Content */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-20">
          <div className="max-w-2xl">
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              {t('hero.title')}
              <br />
              {t('hero.titleBrand')}
              <br />
              <span className="text-gray-600">{t('hero.titleTime')}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">{t('hero.subtitle')}</p>

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
                onClick={() => router.push(`/${locale}/pricing`)}
                className="px-8 py-3"
              >
                {t('hero.ctaPricing')}
              </Button>
            </div>

            {/* Credit Card Note */}
            <p className="text-base text-gray-500">{t('hero.noCreditCard')}</p>
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
            {/* Portfolio Preview Container */}
            <div className="relative">
              {/* Floating background elements */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20"></div>
              <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20"></div>

              {/* Browser Window */}
              <div className="relative bg-white rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35),0_18px_36px_-18px_rgba(99,102,241,0.25)] ring-1 ring-indigo-100 border border-gray-200 overflow-hidden">
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

                {/* Portfolio Content - Modern Professional Layout */}
                <div className="p-0 bg-gray-50 min-h-[420px]">
                  {/* Clean Navigation */}
                  <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Ahmet Yılmaz</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                      <span className="hover:text-gray-900 transition-colors cursor-default">
                        Work
                      </span>
                      <span className="hover:text-gray-900 transition-colors cursor-default">
                        About
                      </span>
                      <span className="hover:text-gray-900 transition-colors cursor-default">
                        Contact
                      </span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>

                  {/* Hero Section */}
                  <div className="px-6 py-8 bg-white">
                    <div className="max-w-md">
                      <h1 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        Full-Stack Developer
                        <span className="ml-1 w-0.5 h-5 bg-gray-900 animate-pulse"></span>
                      </h1>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Building modern web applications with React, Node.js, and cloud
                        technologies. Passionate about clean code and user experience.
                      </p>
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div className="px-6 pb-6">
                    <div className="mb-6">
                      <h2 className="text-base font-semibold text-gray-900 mb-1">Selected Work</h2>
                      <p className="text-sm text-gray-600">
                        A collection of projects I've built and contributed to
                      </p>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 gap-3">
                      {/* Project 1 */}
                      <div className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                              E-Commerce Platform
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                              Full-stack marketplace with real-time features
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-yellow-500 transition-colors">
                            <span>⭐</span>
                            <AnimatedNumber value={34} />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs group-hover:bg-gray-200 transition-colors">
                            React
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs group-hover:bg-gray-200 transition-colors">
                            Node.js
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs group-hover:bg-gray-200 transition-colors">
                            PostgreSQL
                          </span>
                        </div>
                      </div>

                      {/* Project 2 */}
                      <div className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                              Task Management App
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                              Team collaboration tool with real-time sync
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-yellow-500 transition-colors">
                            <span>⭐</span>
                            <AnimatedNumber value={28} />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs group-hover:bg-gray-200 transition-colors">
                            TypeScript
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs group-hover:bg-gray-200 transition-colors">
                            Next.js
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs group-hover:bg-gray-200 transition-colors">
                            Prisma
                          </span>
                        </div>
                      </div>

                      {/* Project 3 */}
                      <div className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                              API Gateway
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                              Microservices orchestration layer
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-yellow-500 transition-colors">
                            <span>⭐</span>
                            <AnimatedNumber value={19} />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs group-hover:bg-gray-200 transition-colors">
                            Express
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs group-hover:bg-gray-200 transition-colors">
                            Docker
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs group-hover:bg-gray-200 transition-colors">
                            Redis
                          </span>
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

      {/* Built on / Üzerine inşa edildi */}
      <section className="relative py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 border-y border-gray-100 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-full opacity-40 blur-3xl" />
        <div className="container mx-auto px-6 relative">
          <p className="text-center text-sm md:text-base text-gray-500 mb-10">
            {t('builtOn.title')}
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

      {/* Features Section - Enhanced Cal.com Style */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('howItWorks.subtitle')}</p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Left: Steps */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('howItWorks.step1Title')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{t('howItWorks.step1Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('howItWorks.step2Title')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{t('howItWorks.step2Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('howItWorks.step3Title')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{t('howItWorks.step3Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('howItWorks.step4Title')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{t('howItWorks.step4Desc')}</p>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="lg:pl-8">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">E-Commerce Platform</div>
                      <div className="text-xs text-gray-500">React, Node.js • ⭐ 34</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Task Management</div>
                      <div className="text-xs text-gray-500">Next.js, TypeScript • ⭐ 28</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg border border-gray-200 opacity-50">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">○</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Personal Blog</div>
                      <div className="text-xs text-gray-400">Gatsby, MDX • ⭐ 12</div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200 border-dashed">
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-900 mb-1">
                        Professional Tech
                      </div>
                      <div className="text-xs text-blue-700">Şablon seçildi</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Section Divider */}
      <section className="relative py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 border-y border-gray-100 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-full opacity-40 blur-3xl" />
        <div className="max-w-7xl mx-auto px-8 lg:px-16 relative">
          <div className="text-center mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('stats.trustTitle')}</h3>
            <p className="text-gray-600">{t('stats.trustSubtitle')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{t('stats.setupTime')}</div>
              <div className="text-sm text-gray-600">{t('stats.setupLabel')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{t('stats.cost')}</div>
              <div className="text-sm text-gray-600">{t('stats.costLabel')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {t('stats.activePortfolios')}
              </div>
              <div className="text-sm text-gray-600">{t('stats.activeLabel')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {t('stats.mobileCompatible')}
              </div>
              <div className="text-sm text-gray-600">{t('stats.mobileLabel')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase Section - Cal.com Style */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('templates.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('templates.subtitle')}</p>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Template 1 */}
            <div className="group">
              <div className="bg-gray-100 rounded-2xl p-8 mb-6 aspect-[4/3] flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold">MT</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-300 rounded w-24 mx-auto"></div>
                    <div className="h-2 bg-gray-300 rounded w-16 mx-auto"></div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('templates.minimalTech')}
                </h3>
                <p className="text-sm text-gray-600">{t('templates.minimalTechDesc')}</p>
              </div>
            </div>

            {/* Template 2 */}
            <div className="group">
              <div className="bg-gray-100 rounded-2xl p-8 mb-6 aspect-[4/3] flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold">PT</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-blue-200 rounded w-24 mx-auto"></div>
                    <div className="h-2 bg-blue-200 rounded w-16 mx-auto"></div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('templates.professionalTech')}
                </h3>
                <p className="text-sm text-gray-600">{t('templates.professionalTechDesc')}</p>
              </div>
            </div>

            {/* Template 3 */}
            <div className="group">
              <div className="bg-gray-100 rounded-2xl p-8 mb-6 aspect-[4/3] flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold">CT</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-purple-200 rounded w-24 mx-auto"></div>
                    <div className="h-2 bg-purple-200 rounded w-16 mx-auto"></div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('templates.creativeTech')}
                </h3>
                <p className="text-sm text-gray-600">{t('templates.creativeTechDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Features Section - Section Divider */}
      <section className="relative py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 border-y border-gray-100 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-full opacity-40 blur-3xl" />
        <div className="max-w-7xl mx-auto px-8 lg:px-16 relative">
          <div className="text-center mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('templates.allInclude')}
            </h3>
            <p className="text-gray-600">{t('templates.allIncludeDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('templates.mobileResponsive')}
              </h4>
              <p className="text-sm text-gray-600">{t('templates.mobileResponsiveDesc')}</p>
            </div>

            <div>
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('templates.fastLoading')}</h4>
              <p className="text-sm text-gray-600">{t('templates.fastLoadingDesc')}</p>
            </div>

            <div>
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <LayoutTemplate className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('templates.customizable')}</h4>
              <p className="text-sm text-gray-600">{t('templates.customizableDesc')}</p>
            </div>

            <div>
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('templates.seoOptimized')}</h4>
              <p className="text-sm text-gray-600">{t('templates.seoOptimizedDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Features Coming Soon - Cal.com Style */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium mb-6">
              ✨ {t('proFeatures.comingSoon')}
              <span className="bg-white px-2 py-0.5 rounded text-xs">
                {t('proFeatures.quarter')}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('proFeatures.title')}
              <span className="text-blue-600">+</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('proFeatures.subtitle')}</p>
          </div>

          {/* Feature Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="relative group p-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg hover:border-blue-300 transition-all duration-300">
              <div className="absolute top-6 right-6 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutTemplate className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('proFeatures.customThemeTitle')}
              </h3>
              <p className="text-gray-600 mb-4">{t('proFeatures.customThemeDesc')}</p>
              <div className="text-sm text-blue-600 font-medium">
                {t('proFeatures.beta')}: {t('proFeatures.quarter')}
              </div>
            </div>

            <div className="relative group p-8 rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg hover:border-green-300 transition-all duration-300">
              <div className="absolute top-6 right-6 w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('proFeatures.customDomainTitle')}
              </h3>
              <p className="text-gray-600 mb-4">{t('proFeatures.customDomainDesc')}</p>
              <div className="text-sm text-green-600 font-medium">
                {t('proFeatures.beta')}: {t('proFeatures.quarter')}
              </div>
            </div>

            <div className="relative group p-8 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg hover:border-purple-300 transition-all duration-300">
              <div className="absolute top-6 right-6 w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('proFeatures.analyticsTitle')}
              </h3>
              <p className="text-gray-600 mb-4">{t('proFeatures.analyticsDesc')}</p>
              <div className="text-sm text-purple-600 font-medium">
                {t('proFeatures.beta')}: {t('proFeatures.quarter')}
              </div>
            </div>

            <div className="relative group p-8 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg hover:border-orange-300 transition-all duration-300">
              <div className="absolute top-6 right-6 w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">24</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('proFeatures.supportTitle')}
              </h3>
              <p className="text-gray-600 mb-4">{t('proFeatures.supportDesc')}</p>
              <div className="text-sm text-orange-600 font-medium">
                {t('proFeatures.beta')}: {t('proFeatures.quarter')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Section Divider */}
      <section className="relative py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 border-y border-gray-100 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-full opacity-40 blur-3xl" />
        <div className="max-w-7xl mx-auto px-8 lg:px-16 relative">
          <div className="text-center mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('pricing.devTitle')}</h3>
            <p className="text-gray-600">{t('pricing.devSubtitle')}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="text-center">
              <div className="bg-white border border-gray-200 rounded-xl px-8 py-4 shadow-sm">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  <span className="line-through text-xl text-gray-400 mr-3">₺50</span>
                  ₺25<span className="text-lg text-gray-600">{t('pricing.perMonth')}</span>
                </div>
                <div className="text-sm text-green-600 font-medium">{t('pricing.discount')}</div>
              </div>
            </div>

            <div className="text-center">
              <ButtonNew
                variant="primary"
                size="lg"
                className="px-8 py-3"
                onClick={() => router.push(`/${locale}/pricing`)}
              >
                {t('pricing.joinWaitlist')}
              </ButtonNew>
              <p className="text-xs text-gray-500 mt-2">{t('hero.noCreditCard')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Story / Geliştirici Hikayesi */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium mb-6">
                <div className="w-4 h-4 bg-gray-600 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">&lt;/&gt;</span>
                </div>
                {t('developer.badge')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('developer.title')} <br className="hidden md:block" />
                <span className="text-blue-600">{t('developer.titleHighlight')}</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('developer.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Story */}
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    B
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {t('developer.greetingTitle')}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{t('developer.greetingDesc')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t('developer.realNeedTitle')}
                    </h4>
                    <p className="text-sm text-gray-600">{t('developer.realNeedDesc')}</p>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t('developer.quickSolutionTitle')}
                    </h4>
                    <p className="text-sm text-gray-600">{t('developer.quickSolutionDesc')}</p>
                  </div>
                </div>
              </div>

              {/* Right: Code Preview */}
              <div className="relative">
                <div className="bg-gray-900 rounded-xl p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm ml-2">portfolyo.config.js</span>
                  </div>
                  <div className="text-sm font-mono text-gray-300 space-y-2">
                    <div>
                      <span className="text-blue-400">const</span>{' '}
                      <span className="text-white">portfolyo</span> = {`{`}
                    </div>
                    <div className="ml-4">
                      <span className="text-green-400">"github"</span>:{' '}
                      <span className="text-yellow-400">"berkezap"</span>,
                    </div>
                    <div className="ml-4">
                      <span className="text-green-400">"template"</span>:{' '}
                      <span className="text-yellow-400">"modern-developer"</span>,
                    </div>
                    <div className="ml-4">
                      <span className="text-green-400">"deploy"</span>:{' '}
                      <span className="text-blue-400">true</span>
                    </div>
                    <div>{`}`}</div>
                    <div className="pt-2 text-gray-500">{`// That's it!`}</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Check className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / SSS */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium mb-6">
                <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">?</span>
                </div>
                {t('faq.badge')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('faq.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('faq.subtitle')}</p>
            </div>

            <div className="space-y-4">
              <div className="group border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('faq.q1')}</h3>
                      <p className="text-gray-600 leading-relaxed">{t('faq.a1')}</p>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center ml-4">
                      <Github className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('faq.q2')}</h3>
                      <p className="text-gray-600 leading-relaxed">{t('faq.a2')}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center ml-4">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('faq.q3')}</h3>
                      <p className="text-gray-600 leading-relaxed">{t('faq.a3')}</p>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center ml-4">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('faq.q4')}</h3>
                      <p className="text-gray-600 leading-relaxed">{t('faq.a4')}</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center ml-4">
                      <Search className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('faq.q5')}</h3>
                      <p className="text-gray-600 leading-relaxed">{t('faq.a5')}</p>
                    </div>
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center ml-4">
                      <LayoutTemplate className="w-4 h-4 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('faq.q6')}</h3>
                      <p className="text-gray-600 leading-relaxed">{t('faq.a6')}</p>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center ml-4">
                      <Globe className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Section Divider */}
      <section className="relative pt-16 pb-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 border-t border-gray-100">
        <div className="absolute -top-16 -left-16 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-12 -right-24 w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20 blur-3xl" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-gray-700 text-sm font-medium mb-6 shadow-sm border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {t('finalCta.badge')}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {t('finalCta.title')}
              <br className="hidden md:block" />
              <span className="text-blue-600">{t('finalCta.titleHighlight')}</span>
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              {t('finalCta.subtitle')}
            </p>

            <div className="flex justify-center items-center mb-6">
              <ButtonNew
                variant="primary"
                size="md"
                className="px-6 py-3"
                onClick={authButtonConfig.action}
              >
                <Github className="w-4 h-4 mr-2" />
                {authButtonConfig.text}
              </ButtonNew>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-500 mb-16">
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                {t('hero.noCreditCard')}
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                {t('stats.setupTime')} {t('stats.setupLabel').toLowerCase()}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

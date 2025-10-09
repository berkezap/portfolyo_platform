'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeaderNew';
import { LiquidHeader } from '@/components/ui/LiquidHeader';
import { Check } from 'lucide-react';

// Plans configuration (inline to avoid dependencies)
const PLANS = {
  FREE: {
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    maxPortfolios: 1,
    features: [
      '1 PortfolYO',
      'Temel Şablonlar',
      'portfolyo.tech alt alan adı',
      'Topluluk Desteği',
      'Özelleştirme',
    ],
  },
  PRO: {
    name: 'Pro',
    description: 'For professionals and creators',
    price: 5.0,
    maxPortfolios: 5,
    popular: true,
    features: [
      '5 PortfolYO',
      'Premium Şablonlar',
      'Özel Domain',
      'Analitik Raporlar',
      'Email Destek',
      'Gelişmiş Özelleştirme',
      'SEO Optimizasyonu',
    ],
  },
};

function PricingPlans() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="py-24 px-4 max-w-4xl mx-auto">
      {/* Simple Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
          Herkes için basit fiyatlandırma
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
          <strong>Ücretsiz</strong> başlayın, hazır olduğunuzda yükseltin. PortfolYO+ özellikleri
          çok yakında!
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          PortfolYO+ Plan: 2025 Q2 • 100+ geliştirici bekleme listesinde
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Free Plan */}
        <div className="relative">
          <div className="border border-gray-200 rounded-xl p-8 bg-white">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hobi</h3>
              <p className="text-sm text-gray-600 mb-4">Kişisel projeler için mükemmel</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-semibold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">/ay</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {PLANS.FREE.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (!session) {
                  router.push('/');
                }
              }}
              className="w-full py-2.5 px-4 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {session ? 'Mevcut plan' : 'Başlayın'}
            </button>
          </div>
        </div>

        {/* Pro Plan - Coming Soon */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl opacity-10"></div>
          <div className="relative border border-gray-900 rounded-xl p-8 bg-white">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                Yakında
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">PortfolYO+</h3>
              <p className="text-sm text-gray-600 mb-4">Profesyonel geliştiriciler için ideal</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-semibold text-gray-900">${PLANS.PRO.price}</span>
                <span className="text-gray-600 ml-2">/ay</span>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Bekleme Listesine Katıl: İlk 3 ay %50 indirim!
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {PLANS.PRO.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Coming Soon Button with Email Collection */}
            <div className="space-y-3">
              <button
                onClick={async () => {
                  // Email collection modal or redirect to waitlist
                  const email = prompt('Pro lansmanından haberdar olun! E-postanızı girin:');
                  if (email && email.includes('@')) {
                    try {
                      const response = await fetch('/api/waitlist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, feature: 'pro', source: 'pricing_page' }),
                      });
                      if (response.ok) {
                        alert(
                          '🎉 Teşekkürler! Pro hazır olduğunda erken kuş indiriminizle birlikte size haber vereceğiz!',
                        );
                      } else {
                        alert('⚠️ Bir sorun oluştu, lütfen daha sonra tekrar deneyin.');
                      }
                    } catch (error) {
                      alert('⚠️ Bir sorun oluştu, lütfen daha sonra tekrar deneyin.');
                    }
                  }
                }}
                className="w-full py-2.5 px-4 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Bekleme Listesine Katıl - %50 İndirim
              </button>
              <p className="text-xs text-center text-gray-500">
                PortfolYO+ 2025 Q2'de lansman • İlk öğrenen siz olun!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Feature List */}
      <div className="border-t border-gray-200 pt-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Harika bir portfolYO oluşturmak için ihtiyacınız olan her şey
          </h2>
          <p className="text-gray-600">
            Çalışmalarınızı güzel bir şekilde sergilemek için profesyonel araçlar ve özellikler.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Hız</h3>
            <p className="text-sm text-gray-600">
              Portfolyonuzu saatlerde değil, dakikalarda yayınlayın.
            </p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Farklı temalar</h3>
            <p className="text-sm text-gray-600">
              Profesyonelce tasarlanmış şablonlar arasından seçin.
            </p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Güncel</h3>
            <p className="text-sm text-gray-600">GitHub projelerinizi ekleyip çıkarabilirsiniz.</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Mobil optimizasyonlu</h3>
            <p className="text-sm text-gray-600">Her cihaz ve ekran boyutunda mükemmel görünür.</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Analitik ve Raporlama</h3>
            <p className="text-sm text-gray-600">
              Detaylı analitiklerle ziyaretleri ve etkileşimi takip edin.
            </p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Özel domain'ler</h3>
            <p className="text-sm text-gray-600">
              Profesyonel görünüm için kendi domain'inizi kullanın.
            </p>
          </div>
        </div>
      </div>

      {/* Simple FAQ */}
      <div className="border-t border-gray-200 pt-16 mt-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sıkça sorulan sorular</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Plan değiştirilebilir mi?</h3>
            <p className="text-gray-600">
              Evet, planınızı istediğiniz zaman değiştirebilirsiniz. Değişiklikler hemen yansır.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Plan değiştirirsem mevcut portfolyolarım ne olur?
            </h3>
            <p className="text-gray-600">
              Hobi planına geri dönerseniz belirlediğiniz 1 portfolYO aktif kalabilir.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">İade garantisi var mı?</h3>
            <p className="text-gray-600">
              Evet, 14 günlük iade garantisi var. Herhangi bir sorunuz olursa lütfen bize ulaşın.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Faturalandırma nasıl çalışır?</h3>
            <p className="text-gray-600">
              Aylık faturalandırma yapılır. Fatura ödeme tarihi ile aynı gün yapılır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {session ? (
        <DashboardHeader demoMode={false} variant="transparent" />
      ) : (
        <LiquidHeader demoMode={false} variant="transparent" />
      )}

      {/* Pricing Content */}
      <div className={session ? 'pt-16' : 'pt-16'}>
        <PricingPlans />
      </div>
    </div>
  );
}

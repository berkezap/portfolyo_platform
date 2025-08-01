'use client';

import React, { useState, useEffect } from 'react';
import { useConsent } from '@/hooks/useConsent';
import Card from '@/components/ui/Card';
import { trackEvent, trackPageView } from '@/lib/analytics';

export default function ConsentTestPage() {
  const { consent, isLoading, hasConsent } = useConsent();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isLoading && consent) {
      setTestResults({
        analytics: consent.analytics || false,
        feedback: consent.feedback || false,
        marketing: consent.marketing || false,
        thirdParty: consent.thirdParty || false,
      });
    }
  }, [consent, isLoading]);

  const _testAnalytics = () => {
    if (hasConsent('analytics')) {
      console.log('✅ Analytics tracking aktif - test event gönderiliyor');
      if (typeof window !== 'undefined') {
        if (window.gtag) {
          window.gtag('event', 'consent_test', {
            event_category: 'consent',
            event_label: 'analytics_test',
          });
        }
        trackEvent('consent_test', {
          category: 'consent',
          action: 'analytics_test',
          consent_given: true,
        });
        trackPageView();
      }
    } else {
      console.log('❌ Analytics consent yok - tracking devre dışı');
    }
  };

  const _testFeedback = () => {
    if (hasConsent('feedback')) {
      const feedbackButton = document.querySelector('[data-feedback-widget]');
      if (feedbackButton) {
        feedbackButton.dispatchEvent(new Event('click'));
      }
      console.log('✅ Feedback widget aktif');
    } else {
      console.log('❌ Feedback consent yok - widget gizli');
    }
  };

  const _testThirdParty = () => {
    if (hasConsent('thirdParty')) {
      console.log('✅ Third party servisler aktif (Sentry, GitHub OAuth)');
    } else {
      console.log('❌ Third party consent yok - servisler devre dışı');
    }
  };

  const _testMarketing = () => {
    if (hasConsent('marketing')) {
      console.log('✅ Marketing consent var - e-posta gönderimi aktif');
    } else {
      console.log('❌ Marketing consent yok - e-posta gönderimi devre dışı');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🍪 Cookie Consent Test Sayfası</h1>
          <p className="text-gray-600">Cookie consent ayarlarının nasıl çalıştığını test edin.</p>
        </div>
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Mevcut Consent Durumu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testResults).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="font-medium capitalize">{key}</span>
                  <p className="text-sm text-gray-600">
                    {key === 'analytics' && 'Kullanım istatistikleri'}
                    {key === 'feedback' && "Geri bildirim widget'ı"}
                    {key === 'marketing' && 'E-posta bildirimleri'}
                    {key === 'thirdParty' && 'Harici servisler'}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {value ? '✅ Aktif' : '❌ Pasif'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

'use client'

import React, { useState, useEffect } from 'react'
import { useConsent } from '@/hooks/useConsent'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { trackEvent, trackPageView } from '@/lib/analytics'
import FeedbackWidget from '@/components/ui/FeedbackWidget'

export default function ConsentTestPage() {
  const { consent, isLoading, hasConsent, resetConsent } = useConsent()
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Test sonuçlarını güncelle
    if (!isLoading && consent) {
      setTestResults({
        analytics: consent.analytics,
        feedback: consent.feedback,
        marketing: consent.marketing,
        thirdParty: consent.thirdParty
      })
    }
  }, [consent, isLoading])

  const testAnalytics = () => {
    if (hasConsent('analytics')) {
      console.log('✅ Analytics tracking aktif - test event gönderiliyor')
      // Analytics test event'i
      if (typeof window !== 'undefined') {
        // Google Analytics gtag fonksiyonu
        if (window.gtag) {
          window.gtag('event', 'consent_test', {
            event_category: 'consent',
            event_label: 'analytics_test'
          })
          console.log('📊 Google Analytics event gönderildi')
        } else {
          console.log('ℹ️ Google Analytics yüklü değil, sadece consent kontrolü yapıldı')
        }
        
        // Kendi analytics sistemimizi test et
        console.log('📈 Kendi analytics sistemi test ediliyor...')
        trackEvent('consent_test', {
          category: 'consent',
          action: 'analytics_test',
          consent_given: true
        })
        trackPageView()
      }
    } else {
      console.log('❌ Analytics consent yok - tracking devre dışı')
    }
  }

  const testFeedback = () => {
    if (hasConsent('feedback')) {
      console.log('✅ Feedback widget aktif')
      // Feedback widget'ı göster
      const feedbackButton = document.querySelector('[data-feedback-widget]')
      if (feedbackButton) {
        feedbackButton.dispatchEvent(new Event('click'))
      }
    } else {
      console.log('❌ Feedback consent yok - widget gizli')
    }
  }

  const testThirdParty = () => {
    if (hasConsent('thirdParty')) {
      console.log('✅ Third party servisler aktif (Sentry, GitHub OAuth)')
    } else {
      console.log('❌ Third party consent yok - servisler devre dışı')
    }
  }

  const testMarketing = () => {
    if (hasConsent('marketing')) {
      console.log('✅ Marketing consent var - e-posta gönderimi aktif')
    } else {
      console.log('❌ Marketing consent yok - e-posta gönderimi devre dışı')
    }
  }

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
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🍪 Cookie Consent Test Sayfası
          </h1>
          <p className="text-gray-600">
            Cookie consent ayarlarının nasıl çalıştığını test edin. 
            Tarayıcı konsolunu açık tutun ve test butonlarına tıklayın.
          </p>
        </div>

        {/* Mevcut Consent Durumu */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Mevcut Consent Durumu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testResults).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium capitalize">{key}</span>
                  <p className="text-sm text-gray-600">
                    {key === 'analytics' && 'Kullanım istatistikleri'}
                    {key === 'feedback' && 'Geri bildirim widget\'ı'}
                    {key === 'marketing' && 'E-posta bildirimleri'}
                    {key === 'thirdParty' && 'Harici servisler (Sentry, GitHub)'}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  value 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {value ? '✅ Aktif' : '❌ Pasif'}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Test Butonları */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">🧪 Test Butonları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={testAnalytics}
              variant={hasConsent('analytics') ? 'primary' : 'secondary'}
              className="w-full"
            >
              {hasConsent('analytics') ? '📊 Analytics Test Et' : '❌ Analytics Devre Dışı'}
            </Button>
            
            <Button
              onClick={testFeedback}
              variant={hasConsent('feedback') ? 'primary' : 'secondary'}
              className="w-full"
            >
              {hasConsent('feedback') ? '💬 Feedback Widget Test Et' : '❌ Feedback Devre Dışı'}
            </Button>
            
            <Button
              onClick={testThirdParty}
              variant={hasConsent('thirdParty') ? 'primary' : 'secondary'}
              className="w-full"
            >
              {hasConsent('thirdParty') ? '🔗 Third Party Test Et' : '❌ Third Party Devre Dışı'}
            </Button>
            
            <Button
              onClick={testMarketing}
              variant={hasConsent('marketing') ? 'primary' : 'secondary'}
              className="w-full"
            >
              {hasConsent('marketing') ? '📧 Marketing Test Et' : '❌ Marketing Devre Dışı'}
            </Button>
          </div>
        </Card>

        {/* Consent Yönetimi */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">⚙️ Consent Yönetimi</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => {
                  localStorage.setItem('cookie-consent', JSON.stringify({
                    analytics: true,
                    feedback: true,
                    marketing: true,
                    thirdParty: true
                  }))
                  window.location.reload()
                }}
                variant="primary"
              >
                🟢 Tümünü Kabul Et
              </Button>
              
              <Button
                onClick={() => {
                  localStorage.setItem('cookie-consent', JSON.stringify({
                    analytics: false,
                    feedback: true,
                    marketing: false,
                    thirdParty: false
                  }))
                  window.location.reload()
                }}
                variant="secondary"
              >
                💬 Sadece Feedback
              </Button>
              
              <Button
                onClick={() => {
                  localStorage.setItem('cookie-consent', JSON.stringify({
                    analytics: false,
                    feedback: false,
                    marketing: false,
                    thirdParty: false
                  }))
                  window.location.reload()
                }}
                variant="destructive"
              >
                🔴 Tümünü Reddet
              </Button>
              
              <Button
                onClick={() => {
                  resetConsent()
                  window.location.reload()
                }}
                variant="secondary"
              >
                🔄 Consent'i Sıfırla
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p><strong>Not:</strong> Consent'i değiştirdikten sonra sayfa yeniden yüklenir.</p>
              <p>Tarayıcı konsolunu açık tutun ve test sonuçlarını kontrol edin.</p>
            </div>
          </div>
        </Card>

        {/* Raw Consent Data */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">📄 Ham Consent Verisi</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(consent, null, 2)}
          </pre>
        </Card>
      </div>

      {/* Feedback Widget - Consent'e göre görünür/gizli */}
      <div className="mb-8">
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔍 Feedback Widget Debug</h3>
          <div className="text-sm text-yellow-700">
            <p><strong>Feedback Consent:</strong> {hasConsent('feedback') ? '✅ Var' : '❌ Yok'}</p>
            <p><strong>Local Storage:</strong> {typeof window !== 'undefined' ? localStorage.getItem('cookie-consent') || 'Boş' : 'SSR'}</p>
            <p><strong>Widget Görünürlüğü:</strong> {hasConsent('feedback') ? 'Görünür olmalı' : 'Gizli olmalı'}</p>
          </div>
        </Card>
      </div>
      
      <FeedbackWidget />
    </div>
  )
} 
'use client'

import React, { useState, useEffect } from 'react'
import { Shield, X, Settings, Check } from 'lucide-react'
import Button from './Button'
import Card from './Card'

interface CookieConsentProps {
  onAccept: (consent: ConsentData) => void
  onDecline: () => void
}

export interface ConsentData {
  analytics: boolean
  feedback: boolean
  marketing: boolean
  thirdParty: boolean
}

export default function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<ConsentData>({
    analytics: true,
    feedback: true,
    marketing: false,
    thirdParty: true
  })

  useEffect(() => {
    // Local storage'dan consent durumunu kontrol et
    const hasConsent = localStorage.getItem('cookie-consent')
    if (!hasConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allConsent: ConsentData = {
      analytics: true,
      feedback: true,
      marketing: true,
      thirdParty: true
    }
    localStorage.setItem('cookie-consent', JSON.stringify(allConsent))
    setShowBanner(false)
    onAccept(allConsent)
  }

  const handleAcceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(consent))
    setShowBanner(false)
    setShowSettings(false)
    onAccept(consent)
  }

  const handleDecline = () => {
    const noConsent: ConsentData = {
      analytics: false,
      feedback: false,
      marketing: false,
      thirdParty: false
    }
    localStorage.setItem('cookie-consent', JSON.stringify(noConsent))
    setShowBanner(false)
    onDecline()
  }

  const updateConsent = (type: keyof ConsentData, value: boolean) => {
    setConsent(prev => ({ ...prev, [type]: value }))
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-4xl mx-auto">
        {!showSettings ? (
          // Ana banner
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Çerez ve Gizlilik Ayarları
                </h3>
                <p className="text-gray-600 mb-4">
                  Deneyiminizi iyileştirmek için çerezler kullanıyoruz. Hangi çerezleri kabul etmek istediğinizi seçebilirsiniz.
                  <a href="/gdpr-settings" className="text-blue-600 hover:underline ml-1">
                    Daha fazla bilgi
                  </a>
                  {' '}ve{' '}
                  <a href="/privacy-policy" className="text-blue-600 hover:underline">
                    Gizlilik Politikası
                  </a>
                  'nı inceleyebilirsiniz.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Tümünü Kabul Et
                  </Button>
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="secondary"
                    size="sm"
                    icon={Settings}
                  >
                    Ayarları Özelleştir
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="secondary"
                    size="sm"
                  >
                    Sadece Gerekli
                  </Button>
                </div>
              </div>
              <button
                onClick={handleDecline}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        ) : (
          // Detaylı ayarlar
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Çerez Ayarları
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Gerekli Çerezler</h4>
                  <p className="text-sm text-gray-600">Sitenin temel işlevleri için gerekli</p>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-500">Her zaman aktif</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Analitik Çerezler</h4>
                  <p className="text-sm text-gray-600">Kullanım istatistikleri ve performans verileri</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.analytics}
                    onChange={(e) => updateConsent('analytics', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Geri Bildirim Çerezleri</h4>
                  <p className="text-sm text-gray-600">Kullanıcı geri bildirimleri ve anketler</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.feedback}
                    onChange={(e) => updateConsent('feedback', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Pazarlama Çerezleri</h4>
                  <p className="text-sm text-gray-600">E-posta bildirimleri ve güncellemeler</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.marketing}
                    onChange={(e) => updateConsent('marketing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Üçüncü Taraf Çerezler</h4>
                  <p className="text-sm text-gray-600">GitHub, Sentry gibi harici servisler</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.thirdParty}
                    onChange={(e) => updateConsent('thirdParty', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAcceptSelected}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Seçilenleri Kabul Et
              </Button>
              <Button
                onClick={handleDecline}
                variant="secondary"
              >
                Sadece Gerekli
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
} 
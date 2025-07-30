'use client'

import { useState, useEffect, useCallback } from 'react'

export interface ConsentData {
  analytics: boolean
  feedback: boolean
  marketing: boolean
  thirdParty: boolean
}

export function useConsent() {
  const [consent, setConsent] = useState<ConsentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Local storage'dan consent'i yükle
    const loadConsent = () => {
      try {
        const stored = localStorage.getItem('cookie-consent')
        if (stored) {
          const parsed = JSON.parse(stored)
          setConsent(parsed)
        } else {
          // Varsayılan değerler (tümü kapalı)
          setConsent({
            analytics: false,
            feedback: false,
            marketing: false,
            thirdParty: false
          })
        }
      } catch (error) {
        console.error('Error loading consent:', error)
        setConsent({
          analytics: false,
          feedback: false,
          marketing: false,
          thirdParty: false
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadConsent()
  }, [])

  // Consent'i güncelle
  const updateConsent = (newConsent: ConsentData) => {
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent))
    setConsent(newConsent)
  }

  // Belirli bir consent tipini kontrol et
  const hasConsent = useCallback((type: keyof ConsentData): boolean => {
    if (!consent) return false
    return consent[type]
  }, [consent])

  // Consent'i sıfırla (test için)
  const resetConsent = () => {
    localStorage.removeItem('cookie-consent')
    setConsent(null)
    setIsLoading(true)
  }

  return {
    consent,
    isLoading,
    updateConsent,
    hasConsent,
    resetConsent
  }
} 
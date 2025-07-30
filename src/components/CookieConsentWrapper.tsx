'use client'

import React from 'react'
import CookieConsent, { ConsentData } from '@/components/ui/CookieConsent'

export default function CookieConsentWrapper() {
  const handleAccept = (consent: ConsentData) => {
    // Consent'i API'ye gönder
    if (typeof window !== 'undefined') {
      fetch('/api/gdpr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'consent',
          data: consent
        })
      }).catch(console.error)
    }
  }

  const handleDecline = () => {
    // Sadece gerekli çerezler
    console.log('Only essential cookies accepted')
  }

  return <CookieConsent onAccept={handleAccept} onDecline={handleDecline} />
} 
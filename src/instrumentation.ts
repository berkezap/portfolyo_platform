import * as Sentry from '@sentry/nextjs';

export function register() {
  // Sadece gerekli environment variable'lar varsa Sentry'yi başlat
  if (!process.env.SENTRY_DSN) {
    console.log('⚠️ Sentry DSN bulunamadı, monitoring devre dışı');
    return;
  }

  // Third party consent kontrolü (server-side'da varsayılan olarak kapalı)
  const hasThirdPartyConsent = process.env.NODE_ENV === 'development' || 
    (typeof window !== 'undefined' && (() => {
      try {
        const consent = localStorage.getItem('cookie-consent')
        return consent ? JSON.parse(consent).thirdParty : false
      } catch {
        return false
      }
    })())

  if (!hasThirdPartyConsent) {
    console.log('⚠️ Third party consent yok, Sentry devre dışı');
    return;
  }

  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      release: 'portfolyo-platform@0.1.0',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.05, // Development'ta çok düşük sampling
      environment: process.env.NODE_ENV || 'development',
      debug: false, // Production'da debug kapalı
      // Rate limiting ayarları
      maxBreadcrumbs: 5, // Breadcrumb sayısını sınırla
      attachStacktrace: false, // Stack trace'i sadece gerektiğinde ekle
      beforeSend(event) {
        // Production'da gereksiz eventleri filtrele
        if (process.env.NODE_ENV === 'production') {
          if (event.level === 'info' || event.level === 'debug') {
            return null;
          }
          // Hassas bilgileri temizle
          if (event.request?.headers) {
            delete event.request.headers.authorization;
            delete event.request.headers.cookie;
          }
        }
        return event;
      },
      beforeSendTransaction(event) {
        // Performance data'yı temizle
        if (process.env.NODE_ENV === 'production') {
          if (event.contexts?.trace) {
            delete event.contexts.trace.data;
          }
        }
        return event;
      },
    });
    
    console.log('🔧 Server Instrumentation: Sentry enabled');
  } catch (error) {
    console.warn('⚠️ Sentry initialization failed:', error);
  }
}

export const onRequestError = (error: Error | unknown) => {
  Sentry.captureException(error);
  console.error('🔴 Request Error:', error);
};

import * as Sentry from '@sentry/nextjs';

export function register() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: 'portfolyo-platform@0.1.0',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.1, // Development'ta da düşük sampling
    environment: process.env.NODE_ENV || 'development',
    debug: false, // Production'da debug kapalı
    // Rate limiting ayarları
    maxBreadcrumbs: 10, // Breadcrumb sayısını sınırla
    attachStacktrace: false, // Stack trace'i sadece gerektiğinde ekle
    // Transport ayarları
    transport: process.env.NODE_ENV === 'development' ? undefined : Sentry.makeNodeTransport({
      url: process.env.SENTRY_DSN,
      headers: {
        'X-Sentry-Rate-Limit': '100:1', // 1 saniyede max 100 event
      },
    }),
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
  
  console.log('🔧 Instrumentation: Sentry enabled');
}

export const onRequestError = (error: Error | unknown) => {
  Sentry.captureException(error);
  console.error('🔴 Request Error:', error);
};

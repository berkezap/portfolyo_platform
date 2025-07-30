import * as Sentry from '@sentry/nextjs';

// Client-side Sentry initialization
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: 'portfolyo-platform@0.1.0',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.05, // Development'ta çok düşük sampling
  environment: process.env.NODE_ENV || 'development',
  debug: false, // Production'da debug kapalı
  // Rate limiting ayarları
  maxBreadcrumbs: 5, // Breadcrumb sayısını sınırla
  attachStacktrace: false, // Stack trace'i sadece gerektiğinde ekle
  // Transport ayarları
  transport: process.env.NODE_ENV === 'development' ? undefined : Sentry.makeBrowserTransport({
    url: process.env.NEXT_PUBLIC_SENTRY_DSN,
    headers: {
      'X-Sentry-Rate-Limit': '50:1', // 1 saniyede max 50 event
    },
  }),
  beforeSend(event) {
    // Production'da hassas bilgileri temizle
    if (process.env.NODE_ENV === 'production') {
      if (event.level === 'info' || event.level === 'debug') {
        return null;
      }
      // URL'leri temizle
      if (event.request?.url) {
        const url = new URL(event.request.url);
        if (url.pathname.includes('/api/auth/')) {
          return null; // Auth endpoint'lerini gizle
        }
      }
    }
    return event;
  },
});

console.log('🔧 Client Instrumentation: Sentry enabled');

export const onRouterTransitionStart = () => {
  console.log('🔄 Router transition started');
};
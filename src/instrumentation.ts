import * as Sentry from '@sentry/nextjs';

export function register() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: 'portfolyo-platform@0.1.0',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    environment: process.env.NODE_ENV || 'development',
    debug: false, // Production'da debug kapalı
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

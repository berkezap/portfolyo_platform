import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay for debugging
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  
  // Filter out non-critical errors
  beforeSend(event) {
    // Skip Next.js hydration errors
    if (event.exception?.values?.[0]?.value?.includes('Hydration')) {
      return null;
    }
    
    // Skip React Query aborted errors (they're normal)
    if (event.exception?.values?.[0]?.value?.includes('AbortError')) {
      return null;
    }
    
    return event;
  },
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
}); 
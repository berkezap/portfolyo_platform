import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Performance monitoring 
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Filter server-side errors
  beforeSend(event) {
    // Skip expected GitHub API errors
    if (event.exception?.values?.[0]?.value?.includes('GitHub API')) {
      return null;
    }
    
    // Skip auth-related errors that are handled
    if (event.exception?.values?.[0]?.value?.includes('Unauthorized')) {
      return null;
    }
    
    return event;
  },
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
}); 
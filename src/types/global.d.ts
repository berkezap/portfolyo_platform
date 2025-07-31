// Global type definitions

// Google Analytics gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}

// Google Tag Manager
declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

// Facebook Pixel
declare global {
  interface Window {
    fbq?: (
      command: 'init' | 'track' | 'trackCustom',
      eventName?: string,
      parameters?: Record<string, unknown>
    ) => void
  }
}

// Hotjar
declare global {
  interface Window {
    hj?: (command: string, ...args: unknown[]) => void
  }
}

// Sentry
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error) => void
      captureMessage: (message: string) => void
      setUser: (user: { id?: string; email?: string }) => void
    }
  }
}

export {}
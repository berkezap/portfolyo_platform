// Global type definitions

// Google Analytics gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}

// Google Tag Manager
declare global {
  interface Window {
    dataLayer?: any[]
  }
}

// Facebook Pixel
declare global {
  interface Window {
    fbq?: (
      command: 'init' | 'track' | 'trackCustom',
      eventName?: string,
      parameters?: Record<string, any>
    ) => void
  }
}

// Hotjar
declare global {
  interface Window {
    hj?: (command: string, ...args: any[]) => void
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
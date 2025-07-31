// User Behavior Analytics System
export interface UserEvent {
  event: string
  userId?: string
  sessionId: string
  timestamp: number
  properties: Record<string, unknown>
  page: string
  userAgent: string
}

export interface UserSession {
  sessionId: string
  userId?: string
  startTime: number
  lastActivity: number
  pageViews: number
  events: UserEvent[]
  userAgent: string
  referrer?: string
}

export interface AnalyticsConfig {
  enabled: boolean
  sampleRate: number
  endpoint?: string
}

class Analytics {
  private config: AnalyticsConfig
  private sessionId: string
  private userId?: string
  private events: UserEvent[] = []
  private sessionStartTime: number

  constructor(config: AnalyticsConfig = { enabled: true, sampleRate: 1.0 }) {
    this.config = config
    this.sessionId = this.generateSessionId()
    this.sessionStartTime = Date.now()
    
    // Session tracking
    this.trackPageView()
    this.setupEventListeners()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupEventListeners() {
    if (typeof window === 'undefined') return

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.track('session_pause', { duration: Date.now() - this.sessionStartTime })
      } else {
        this.track('session_resume')
      }
    })

    // Before unload
    window.addEventListener('beforeunload', () => {
      this.track('session_end', { 
        duration: Date.now() - this.sessionStartTime,
        totalEvents: this.events.length 
      })
      this.flush()
    })

    // Click tracking (delegated)
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button') as HTMLButtonElement
        this.track('button_click', {
          buttonText: button.textContent?.trim(),
          buttonType: (button as HTMLButtonElement).type || 'button',
          buttonVariant: button.className.includes('primary') ? 'primary' : 
                        button.className.includes('secondary') ? 'secondary' : 'default'
        })
      }
    })
  }

  setUserId(userId: string) {
    this.userId = userId
    this.track('user_identified', { userId })
  }

  track(event: string, properties: Record<string, unknown> = {}) {
    // Consent kontrolü
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent')
      if (consent) {
        const consentData = JSON.parse(consent)
        if (!consentData.analytics) {
          // Analytics consent yoksa sadece kritik olayları takip et
          if (!this.isCriticalEvent(event)) {
            return
          }
        }
      }
    }
    
    if (!this.config.enabled || Math.random() > this.config.sampleRate) return

    const userEvent: UserEvent = {
      event,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      properties,
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    }

    this.events.push(userEvent)
    
    // Real-time tracking for critical events
    if (this.isCriticalEvent(event)) {
      this.sendEvent(userEvent)
    }
  }

  private isCriticalEvent(event: string): boolean {
    const criticalEvents = [
      'portfolio_created',
      'portfolio_generation_started',
      'portfolio_generation_completed',
      'template_selected',
      'repo_selected',
      'cv_uploaded',
      'error_occurred',
      'user_signup',
      'user_login'
    ]
    return criticalEvents.includes(event)
  }

  trackPageView() {
    this.track('page_view', {
      url: typeof window !== 'undefined' ? window.location.href : '/',
      referrer: typeof document !== 'undefined' ? document.referrer : ''
    })
  }

  trackError(error: Error, context?: Record<string, unknown>) {
    this.track('error_occurred', {
      errorMessage: error.message,
      errorStack: error.stack,
      context
    })
  }

  trackPortfolioCreation(template: string, repoCount: number, hasCv: boolean) {
    this.track('portfolio_created', {
      template,
      repoCount,
      hasCv,
      timestamp: Date.now()
    })
  }

  trackTemplateSelection(template: string, templateIndex: number) {
    this.track('template_selected', {
      template,
      templateIndex,
      timestamp: Date.now()
    })
  }

  trackRepoSelection(repoName: string, isSelected: boolean, totalSelected: number) {
    this.track('repo_selected', {
      repoName,
      isSelected,
      totalSelected,
      timestamp: Date.now()
    })
  }

  trackCvUpload(success: boolean, fileSize?: number, error?: string) {
    this.track('cv_uploaded', {
      success,
      fileSize,
      error,
      timestamp: Date.now()
    })
  }

  trackUserJourney(step: string, duration?: number) {
    this.track('journey_step', {
      step,
      duration,
      timestamp: Date.now()
    })
  }

  private async sendEvent(event: UserEvent) {
    if (!this.config.endpoint) return

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.warn('Analytics event failed to send:', error)
    }
  }

  private async flush() {
    if (this.events.length === 0) return

    try {
      // Send all events to backend
      if (this.config.endpoint) {
        await fetch(this.config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: this.sessionId,
            userId: this.userId,
            events: this.events
          })
        })
      }
    } catch (error) {
      console.warn('Analytics flush failed:', error)
    } finally {
      this.events = []
    }
  }

  // Get analytics data for dashboard
  getSessionData(): UserSession {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      startTime: this.sessionStartTime,
      lastActivity: Date.now(),
      pageViews: this.events.filter(e => e.event === 'page_view').length,
      events: this.events,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      referrer: typeof document !== 'undefined' ? document.referrer : undefined
    }
  }
}

// Global analytics instance
let analyticsInstance: Analytics | null = null

export function initAnalytics(config?: AnalyticsConfig): Analytics {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics(config)
  }
  return analyticsInstance
}

export function getAnalytics(): Analytics | null {
  return analyticsInstance
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  analyticsInstance?.track(event, properties)
}

export function trackPageView() {
  analyticsInstance?.trackPageView()
}

export function trackError(error: Error, context?: Record<string, unknown>) {
  analyticsInstance?.trackError(error, context)
}

export function trackPortfolioCreation(template: string, repoCount: number, hasCv: boolean) {
  analyticsInstance?.trackPortfolioCreation(template, repoCount, hasCv)
}

export function trackTemplateSelection(template: string, templateIndex: number) {
  analyticsInstance?.trackTemplateSelection(template, templateIndex)
}

export function trackRepoSelection(repoName: string, isSelected: boolean, totalSelected: number) {
  analyticsInstance?.trackRepoSelection(repoName, isSelected, totalSelected)
}

export function trackCvUpload(success: boolean, fileSize?: number, error?: string) {
  analyticsInstance?.trackCvUpload(success, fileSize, error)
}

export function trackUserJourney(step: string, duration?: number) {
  analyticsInstance?.trackUserJourney(step, duration)
}
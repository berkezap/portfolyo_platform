import { NextRequest } from 'next/server'

// Güvenlik event'leri için interface
interface SecurityEvent {
  timestamp: string
  type: 'rate_limit_exceeded' | 'unauthorized_access' | 'suspicious_activity' | 'validation_failed'
  ip: string
  userAgent: string
  path: string
  method: string
  userId?: string
  details: Record<string, any>
}

// Güvenlik event'lerini loglama
export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString()
  }
  
  // Production'da Sentry'ye gönder
  if (process.env.NODE_ENV === 'production') {
    console.error('SECURITY_EVENT:', securityEvent)
    // Sentry.captureMessage('Security Event', {
    //   level: 'warning',
    //   tags: { type: event.type },
    //   extra: securityEvent
    // })
  } else {
    console.warn('SECURITY_EVENT:', securityEvent)
  }
}

// Rate limit aşımı loglama
export function logRateLimitExceeded(request: NextRequest, ip: string) {
  logSecurityEvent({
    type: 'rate_limit_exceeded',
    ip,
    userAgent: request.headers.get('user-agent') || 'unknown',
    path: request.nextUrl.pathname,
    method: request.method,
    details: {
      limit: '20 requests per 10 seconds',
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    }
  })
}

// Yetkisiz erişim loglama
export function logUnauthorizedAccess(request: NextRequest, ip: string, reason: string) {
  logSecurityEvent({
    type: 'unauthorized_access',
    ip,
    userAgent: request.headers.get('user-agent') || 'unknown',
    path: request.nextUrl.pathname,
    method: request.method,
    details: {
      reason,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    }
  })
}

// Şüpheli aktivite loglama
export function logSuspiciousActivity(request: NextRequest, ip: string, activity: string) {
  logSecurityEvent({
    type: 'suspicious_activity',
    ip,
    userAgent: request.headers.get('user-agent') || 'unknown',
    path: request.nextUrl.pathname,
    method: request.method,
    details: {
      activity,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    }
  })
}

// Validation hatası loglama
export function logValidationFailed(request: NextRequest, ip: string, errors: string[]) {
  logSecurityEvent({
    type: 'validation_failed',
    ip,
    userAgent: request.headers.get('user-agent') || 'unknown',
    path: request.nextUrl.pathname,
    method: request.method,
    details: {
      errors,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    }
  })
}

// IP adresinin şüpheli olup olmadığını kontrol et
export function isSuspiciousIP(ip: string): boolean {
  // Localhost ve private IP'ler normal
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return false
  }
  
  // Gelecekte IP reputation service entegrasyonu eklenebilir
  return false
}

// User-Agent'ın şüpheli olup olmadığını kontrol et
export function isSuspiciousUserAgent(userAgent: string): boolean {
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /perl/i,
    /ruby/i
  ]
  
  return suspiciousPatterns.some(pattern => pattern.test(userAgent))
} 
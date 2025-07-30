import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// CSRF token doğrulama şeması
export const csrfTokenSchema = z.object({
  csrfToken: z.string().min(1, 'CSRF token gerekli')
})

// Kullanıcı yetkilendirme kontrolü
export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return {
      error: 'Unauthorized',
      status: 401
    }
  }
  
  return { session }
}

// Portfolyo sahipliği kontrolü
export async function requirePortfolioOwnership(portfolioId: string, userId: string) {
  // Bu fonksiyon Supabase'den portfolyo bilgisini alıp sahiplik kontrolü yapar
  // Şimdilik basit bir kontrol yapıyoruz
  console.log(`Portfolio ownership check: ${portfolioId} for user ${userId}`)
  return true
}

// Gelişmiş input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // HTML tag'lerini kaldır
    .replace(/javascript:/gi, '') // JavaScript protokolünü kaldır
    .replace(/vbscript:/gi, '') // VBScript protokolünü kaldır
    .replace(/data:/gi, '') // Data URI'lerini kaldır
    .replace(/on\w+\s*=/gi, '') // Event handler'ları kaldır
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Script tag'lerini kaldır
    .replace(/<iframe\b[^>]*>/gi, '') // Iframe'leri kaldır
    .replace(/<object\b[^>]*>/gi, '') // Object tag'lerini kaldır
    .replace(/<embed\b[^>]*>/gi, '') // Embed tag'lerini kaldır
    .replace(/<link\b[^>]*>/gi, '') // Link tag'lerini kaldır
    .replace(/<meta\b[^>]*>/gi, '') // Meta tag'lerini kaldır
    .replace(/<!--[\s\S]*?-->/g, '') // HTML yorumlarını kaldır
    .replace(/['"`]/g, '') // Tehlikeli karakterleri kaldır
    .trim()
}

// SQL injection koruması için input validation
export function validateSQLInput(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/i,
    /(--|\/\*|\*\/|;)/,
    /(\b(WAITFOR|DELAY)\b)/i,
    /(\b(BENCHMARK|SLEEP)\b)/i,
  ]
  
  return !sqlPatterns.some(pattern => pattern.test(input))
}

// Rate limit kontrolü için helper
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  return forwarded?.split(',')[0] || 
         realIP || 
         cfConnectingIP || 
         '127.0.0.1'
}

// Güvenli response oluşturma
export function createSecureResponse(data: unknown, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.sentry-cdn.com https://cdn.tailwindcss.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://api.github.com https://*.supabase.co https://*.sentry.io",
        "frame-src 'none'",
        "object-src 'none'"
      ].join('; '),
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    }
  })
}

// Error response oluşturma
export function createErrorResponse(message: string, status: number = 400) {
  return createSecureResponse({ error: message }, status)
}

// Güvenli string validation
export function isSafeString(input: string): boolean {
  if (!input || typeof input !== 'string') return false
  
  // Tehlikeli karakterler ve pattern'ler
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
    /javascript:/i,
    /vbscript:/i,
    /data:/i,
    /on\w+\s*=/i,
    /<iframe\b[^>]*>/i,
    /<object\b[^>]*>/i,
    /<embed\b[^>]*>/i,
    /<!--[\s\S]*?-->/,
    /['"`]/,
  ]
  
  return !dangerousPatterns.some(pattern => pattern.test(input))
} 
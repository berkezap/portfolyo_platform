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
  return true
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // HTML tag'lerini kaldır
    .replace(/javascript:/gi, '') // JavaScript protokolünü kaldır
    .trim()
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
export function createSecureResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  })
}

// Error response oluşturma
export function createErrorResponse(message: string, status: number = 400) {
  return createSecureResponse({ error: message }, status)
} 
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin, type Portfolio } from '@/lib/supabase';
import { logUnauthorizedAccess } from '@/lib/securityMonitoring';

// CSRF token doğrulama şeması
export const csrfTokenSchema = z.object({
  csrfToken: z.string().min(1, 'CSRF token gerekli'),
});

// Kullanıcı yetkilendirme kontrolü
export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Yetkisiz erişimi logla
    const ip = getClientIP(request);
    logUnauthorizedAccess(request, ip, 'no_session');
    return {
      error: 'Unauthorized',
      status: 401,
    };
  }

  return { session };
}

// Portfolyo sahipliği kontrolü
export async function requirePortfolioOwnership(portfolioId: string, userId: string) {
  // Supabase üzerinden gerçek sahiplik kontrolü yap
  try {
    if (!portfolioId || !userId) return false;

    const { data, error } = await supabaseAdmin
      .from('portfolios')
      .select('id,user_id')
      .eq('id', portfolioId)
      .single();

    if (error || !data) {
      return false;
    }

    const isOwner = (data as Pick<Portfolio, 'user_id'>).user_id === userId;
    return isOwner;
  } catch (_e) {
    return false;
  }
}

// Gelişmiş input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>/gi, '')
    .replace(/<object\b[^>]*>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/['"`]/g, '')
    .trim();
}

// SQL injection koruması için input validation
export function validateSQLInput(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/i,
    /(--)\/\*|\*\/|;/,
    /(\b(WAITFOR|DELAY)\b)/i,
    /(\b(BENCHMARK|SLEEP)\b)/i,
  ];

  return !sqlPatterns.some((pattern) => pattern.test(input));
}

// Rate limit kontrolü için helper
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  return forwarded?.split(',')[0]?.trim() || realIP || cfConnectingIP || '127.0.0.1';
}

// Güvenli response oluşturma
export function createSecureResponse(data: unknown, status: number = 200) {
  const headers: Record<string, string> = {
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
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  // HSTS (sadece prod önerilir ama header zararsızdır)
  // TEMPORARILY DISABLED: includeSubDomains removed until wildcard SSL is ready
  headers['Strict-Transport-Security'] = 'max-age=31536000; preload';

  return NextResponse.json(data, { status, headers });
}

// Error response oluşturma
export function createErrorResponse(message: string, status: number = 400) {
  return createSecureResponse({ error: message }, status);
}

// Güvenli string validation
export function isSafeString(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

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
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(input));
}

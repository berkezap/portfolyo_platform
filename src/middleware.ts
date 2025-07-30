import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Cache optimization for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static/') || 
      request.nextUrl.pathname.startsWith('/static/') ||
      request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // API routes caching
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Short cache for API responses
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300')
  }

  // HTML pages caching
  if (request.nextUrl.pathname === '/' || 
      request.nextUrl.pathname.startsWith('/portfolio/') ||
      request.nextUrl.pathname.startsWith('/dashboard/')) {
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600')
  }

  // Compression headers
  response.headers.set('Accept-Encoding', 'gzip, deflate, br')

  // Security headers for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.github.com https://supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
    
    response.headers.set('Content-Security-Policy', csp)
  }

  // Performance monitoring
  const start = Date.now()
  
  // Add performance header
  response.headers.set('Server-Timing', `total;dur=${Date.now() - start}`)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 
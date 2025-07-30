import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { rateLimitMiddleware } from '@/lib/rateLimit'

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl
    
    // API rotaları için rate limiting uygula (sadece Redis varsa)
    if (pathname.startsWith('/api/') && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const rateLimitResponse = await rateLimitMiddleware(req)
        
        if (rateLimitResponse) {
          return rateLimitResponse
        }
      } catch (error) {
        console.error('Rate limiting error:', error)
        // Rate limiting hatası durumunda isteği geçir
        return NextResponse.next()
      }
    }
    
    // Middleware runs after auth check
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Protect these routes - require authentication
        const protectedRoutes = [
          '/dashboard',
          '/my-portfolios',
          '/dashboard/edit'
        ]
        
        // Check if current path is protected
        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.startsWith(route)
        )
        
        // Demo mode'da tüm route'lara erişim ver
        if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
          return true
        }
        
        // Ana sayfa her zaman erişilebilir olmalı
        if (pathname === '/') {
          return true
        }
        
        // Allow access if not a protected route OR if user has valid token
        return !isProtectedRoute || !!token
      },
    },
    pages: {
      signIn: '/',  // Redirect unauthorized users to home page
    },
  }
)

export const config = {
  matcher: [
    // Match all request paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
    // API rotaları için de matcher ekle
    '/api/:path*'
  ],
} 
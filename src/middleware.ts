import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

// Create i18n middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Don't prefix default locale
  localeDetection: false, // Disable automatic locale detection from browser
});

export function middleware(request: NextRequest) {
  const host: string = request.headers.get('host') ?? '';
  const pathname: string = request.nextUrl.pathname ?? '';

  // Subdomain-based publishing: rewrite *.portfolyo.tech to internal public route
  try {
    if (host.endsWith('portfolyo.tech') && host.split('.').length >= 3) {
      const sub: string = host.split('.')[0] || '';
      const reserved: string[] = ['www', 'api', 'app', 'admin', 'static', 'cdn'];
      if (!reserved.includes(sub)) {
        const url = request.nextUrl.clone();
        url.pathname = '/pub';
        url.searchParams.set('slug', sub);
        return NextResponse.rewrite(url);
      }
    }
  } catch (_) {}

  // Apply i18n routing
  const i18nResponse = intlMiddleware(request);
  const response = i18nResponse || NextResponse.next();

  // Performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Cache optimization for static assets
  const staticAssetRegex = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/;
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/static/') ||
    staticAssetRegex.test(pathname)
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // API routes caching
  if (pathname.startsWith('/api/')) {
    // Short cache for API responses
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300');
  }

  // HTML pages caching
  if (
    pathname === '/' ||
    pathname.startsWith('/portfolio/') ||
    pathname.startsWith('/dashboard/')
  ) {
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  }

  // Compression headers
  response.headers.set('Accept-Encoding', 'gzip, deflate, br');

  // Security headers for production
  if (process.env.NODE_ENV === 'production') {
    // TEMPORARILY DISABLED: includeSubDomains removed until wildcard SSL is ready
    response.headers.set('Strict-Transport-Security', 'max-age=31536000');

    // Content Security Policy - Updated to allow Supabase storage and Vercel Live
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://browser.sentry-cdn.com https://vercel.live",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.github.com https://*.supabase.co https://srgvpcwbcjsuostcexmn.supabase.co https://api.stripe.com https://*.sentry.io https://*.ingest.de.sentry.io https://vercel.live",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);
  }

  // Performance monitoring
  const start = Date.now();

  // Add performance header
  response.headers.set('Server-Timing', `total;dur=${Date.now() - start}`);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - pub (public portfolio routes - no i18n)
     * - sw.js, manifest.json, workbox files (PWA files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|pub|sw.js|manifest.json|workbox-.*\\.js).*)',
  ],
};

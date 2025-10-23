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

  // Subdomain-based publishing: rewrite *.portfolyo.tech to dynamic portfolio route
  try {
    if (host.endsWith('portfolyo.tech') && host.split('.').length >= 3) {
      const sub: string = host.split('.')[0] || '';
      const reserved: string[] = ['www', 'api', 'app', 'admin', 'static', 'cdn', 'portfolyo'];
      if (!reserved.includes(sub)) {
        const url = request.nextUrl.clone();
        // Rewrite to SSR portfolio route: subdomain.portfolyo.tech -> /portfolio/subdomain
        url.pathname = `/portfolio/${sub}${pathname === '/' ? '' : pathname}`;
        console.log(`[Middleware] Subdomain rewrite: ${host} -> ${url.pathname}`);
        return NextResponse.rewrite(url);
      }
    }
  } catch (error) {
    console.error('[Middleware] Subdomain error:', error);
  }

  // Skip i18n routing for portfolio routes (SSR routes)
  if (pathname.startsWith('/portfolio/')) {
    return NextResponse.next();
  }

  // Skip i18n routing for static assets (images, icons, etc.)
  if (
    pathname.includes('.png') ||
    pathname.includes('.jpg') ||
    pathname.includes('.jpeg') ||
    pathname.includes('.gif') ||
    pathname.includes('.ico') ||
    pathname.includes('.svg') ||
    pathname.includes('.css') ||
    pathname.includes('.js')
  ) {
    return NextResponse.next();
  }

  // Skip i18n routing for template preview routes and allow framing
  if (pathname.startsWith('/templates/preview/')) {
    const response = NextResponse.next();
    // Allow framing for template previews
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // Set CSP to allow same-origin framing for template previews
    const previewCSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://api.github.com https://*.supabase.co",
      "frame-src 'self'", // Allow same-origin framing for template previews
      "frame-ancestors 'self'", // Allow same-origin framing
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
    response.headers.set('Content-Security-Policy', previewCSP);

    return response;
  }

  // Apply i18n routing for other routes
  const i18nResponse = intlMiddleware(request);
  const response = i18nResponse || NextResponse.next();

  // Performance headers for all other routes
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
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://api.github.com https://*.supabase.co https://srgvpcwbcjsuostcexmn.supabase.co https://api.stripe.com https://*.sentry.io https://*.ingest.de.sentry.io https://vercel.live",
      "frame-src 'self' https://vercel.live", // Allow same-origin frames and Vercel Live
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
     * - sw.js, manifest.json, workbox files (PWA files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json|workbox-.*\\.js).*)',
  ],
};

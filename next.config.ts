import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Basit konfigürasyon
  compress: true,
  poweredByHeader: false,
  
  // Output file tracing root to fix workspace warnings
  output: 'standalone',
  outputFileTracingRoot: __dirname,

  // Güvenlik headers'ları
  async headers() {
    return [
      // Template preview routes - allow framing for previews
      {
        source: '/templates/preview/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://browser.sentry-cdn.com https://vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.github.com https://*.supabase.co https://srgvpcwbcjsuostcexmn.supabase.co https://api.stripe.com https://*.sentry.io https://*.ingest.de.sentry.io https://vercel.live",
              "frame-ancestors 'self'", // Allow same-origin framing for previews
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      // All other routes - strict security
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://browser.sentry-cdn.com https://vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.github.com https://*.supabase.co https://srgvpcwbcjsuostcexmn.supabase.co https://api.stripe.com https://*.sentry.io https://*.ingest.de.sentry.io https://vercel.live",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Webpack optimizasyonları - minimal
  webpack: (config, { dev, isServer }) => {
    // Critical dependency uyarılarını azalt
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve 'encoding'/,
      /Module not found: Can't resolve 'fs'/,
      /Module not found: Can't resolve 'path'/,
      /Module not found: Can't resolve 'os'/,
    ]

    // Webpack resolve ayarları - sadece tarayıcı tarafında polyfill'leri kapat
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          os: false,
          crypto: false,
          stream: false,
          util: false,
          buffer: false,
          process: false,
        },
      }
    }

    return config
  },

  // Experimental features
  experimental: {
    // React 19 uyumluluğu
    reactCompiler: false,
  },

  // TypeScript ayarları
  typescript: {
    // Build sırasında type check'i atla (zaten IDE'de yapılıyor)
    ignoreBuildErrors: false,
  },

  // ESLint ayarları
  eslint: {
    // Build sırasında ESLint'i atla (zaten IDE'de yapılıyor)
    ignoreDuringBuilds: false,
  },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
})

// PWA'yı yalnızca production'da etkinleştir (dev'de bazı asset 404 sorunlarına yol açabiliyor)
const isProd = process.env.NODE_ENV === 'production'

module.exports = isProd
  ? withNextIntl(withPWA(withBundleAnalyzer(nextConfig)))
  : withNextIntl(withBundleAnalyzer(nextConfig))


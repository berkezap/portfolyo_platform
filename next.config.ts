import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Basit konfigürasyon
  compress: true,
  poweredByHeader: false,

  // Güvenlik headers'ları
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'

    const commonSecurityHeaders = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ] as { key: string; value: string }[]

    // Production ortamında daha sıkı CSP + HSTS uygula (CSP temporarily disabled for testing)
    if (isProd) {
      commonSecurityHeaders.push(
        // {
        //   key: 'Content-Security-Policy',
        //   value: [
        //     "default-src 'self'",
        //     "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.sentry-cdn.com https://cdn.jsdelivr.net https://cdn.tailwindcss.com",
        //     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        //     "font-src 'self' https://fonts.gstatic.com",
        //     "img-src 'self' data: https: blob:",
        //     "connect-src 'self' https://api.github.com https://*.supabase.co https://srgvpcwbcjsuostcexmn.supabase.co https://*.ingest.de.sentry.io https://*.sentry.io",
        //     "frame-src 'none'",
        //     "object-src 'none'",
        //     "base-uri 'self'",
        //     "form-action 'self'",
        //     'upgrade-insecure-requests',
        //   ].join('; '),
        // },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      )
    }

    return [
      {
        source: '/(.*)',
        headers: commonSecurityHeaders,
      },
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
  ? withPWA(withBundleAnalyzer(nextConfig))
  : withBundleAnalyzer(nextConfig)


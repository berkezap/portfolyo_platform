import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Basit konfigürasyon
  compress: true,
  poweredByHeader: false,

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
    ];

    // Webpack resolve ayarları - minimal
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
    };

    return config;
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

  // Bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer'))({
          enabled: true,
        })
      );
      return config;
    },
  }),
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

module.exports = withPWA(withBundleAnalyzer(nextConfig))


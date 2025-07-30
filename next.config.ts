import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Basit konfigürasyon
  compress: true,
  poweredByHeader: false,
  
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

    // Development'ta daha basit konfigürasyon
    if (dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
        minimize: false,
      }
    }
    
    return config
  },
  
  // Image optimizasyonu
  images: {
    domains: ['avatars.githubusercontent.com'],
    dangerouslyAllowSVG: true,
  },

  // Experimental özellikler - minimal
  experimental: {
    reactCompiler: false,
  },

  // TypeScript ayarları
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint ayarları
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { QueryProvider } from '@/components/query-provider'
import ErrorBoundary from '@/components/ErrorBoundary'

// Font optimizasyonu - display swap ve preload
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PortfolYO - GitHub Portfolio Oluşturucu',
  description: 'GitHub projelerinizden otomatik portfolio website\'i oluşturun',
  keywords: ['portfolio', 'github', 'developer', 'website', 'projects'],
  authors: [{ name: 'PortfolYO Team' }],
  openGraph: {
    title: 'PortfolYO - GitHub Portfolio Oluşturucu',
    description: 'GitHub projelerinizden otomatik portfolio website\'i oluşturun',
    type: 'website',
    locale: 'tr_TR',
  },
  // Performance metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // PWA metadata
  manifest: '/manifest.json',
  icons: {
    icon: '/portfolyo-icon.svg',
    apple: '/portfolyo-icon.svg',
  },
  // Preload critical resources
  other: {
    'theme-color': '#2563EB',
    'color-scheme': 'light dark',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'PortfolYO',
    'mobile-web-app-capable': 'yes',
  },
  // Performance optimizasyonları
  alternates: {
    canonical: 'https://portfolyo.com',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        {/* Critical resource preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://supabase.co" />
        
        {/* Resource hints for external domains */}
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://supabase.co" />
        
        {/* Critical inline CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for initial render */
            body { 
              margin: 0; 
              font-family: 'Inter', 'Inter Fallback', system-ui, arial, system-ui, sans-serif;
              background: #f9fafb;
              color: #111827;
            }
          `
        }} />
      </head>
            <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased min-h-screen`}>
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

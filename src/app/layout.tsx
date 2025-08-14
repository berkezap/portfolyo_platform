import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { QueryProvider } from '@/components/query-provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import CookieConsentWrapper from '@/components/CookieConsentWrapper';

// Font optimizasyonu - display swap ve preload
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PortfolYO - GitHub Portfolio Oluşturucu',
  description: "GitHub projelerinizden otomatik portfolio website'i oluşturun",
  keywords: ['portfolio', 'github', 'developer', 'website', 'projects'],
  authors: [{ name: 'PortfolYO Team' }],
  openGraph: {
    title: 'PortfolYO - GitHub Portfolio Oluşturucu',
    description: "GitHub projelerinizden otomatik portfolio website'i oluşturun",
    type: 'website',
    locale: 'tr_TR',
  },
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
  manifest: '/manifest.json',
  icons: {
    icon: '/portfolyo-logo.svg',
    apple: '/portfolyo-logo.svg',
  },
  other: {
    'theme-color': '#2563EB',
    'color-scheme': 'light dark',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'PortfolYO',
    // TEMP: Override CSP for Supabase Storage
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://*.ingest.de.sentry.io; img-src 'self' data: https:; font-src 'self' data:;",
    'mobile-web-app-capable': 'yes',
  },
  alternates: {
    canonical: 'https://portfolyo.com',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://supabase.co" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body { 
              margin: 0; 
              font-family: ${inter.style.fontFamily}, system-ui, sans-serif;
              background: #f9fafb;
              color: #111827;
            }
          `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased min-h-screen`}>
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              {children}
              <CookieConsentWrapper />
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

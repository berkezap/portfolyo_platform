import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { QueryProvider } from '@/components/query-provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import CookieConsentWrapper from '@/components/CookieConsentWrapper';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, isRtlLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';

// Font optimizasyonu - display swap ve preload
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PortfolYO - GitHub Portfolio Creator',
  description: 'Create professional portfolio websites automatically from your GitHub projects',
  keywords: ['portfolio', 'github', 'developer', 'website', 'projects'],
  authors: [{ name: 'PortfolYO Team' }],
  openGraph: {
    title: 'PortfolYO - GitHub Portfolio Creator',
    description: 'Create professional portfolio websites automatically from your GitHub projects',
    type: 'website',
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
  other: {
    'color-scheme': 'light dark',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'PortfolYO',
    // TEMP: Override CSP for Supabase Storage
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://*.ingest.de.sentry.io; img-src 'self' data: https:; font-src 'self' data:;",
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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages({ locale });

  // Check if locale is RTL
  const dir = isRtlLocale(locale as Locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ErrorBoundary>
            <QueryProvider>
              <AuthProvider>
                {children}
                <CookieConsentWrapper />
              </AuthProvider>
            </QueryProvider>
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

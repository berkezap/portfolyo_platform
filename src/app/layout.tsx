import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

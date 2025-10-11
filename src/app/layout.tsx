import type { Metadata } from 'next';
import { locales } from '@/i18n/config';

export const metadata: Metadata = {
  manifest: '/manifest.json',
  icons: {
    icon: '/portfolyo-logo.svg',
    apple: '/portfolyo-logo.svg',
  },
  other: {
    'theme-color': '#2563EB',
    'mobile-web-app-capable': 'yes',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { Globe } from 'lucide-react';

type Props = {
  currentLocale: Locale;
  className?: string;
};

export default function LanguageSwitcher({ currentLocale, className = '' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const changeLocale = (newLocale: Locale) => {
    startTransition(() => {
      // Remove current locale from pathname
      const segments = pathname.split('/').filter(Boolean);
      const currentLocaleInPath = locales.includes(segments[0] as Locale);

      let newPathname = pathname;
      if (currentLocaleInPath) {
        // Replace locale in path
        segments[0] = newLocale;
        newPathname = '/' + segments.join('/');
      } else {
        // Add locale to path (for default locale)
        newPathname = `/${newLocale}${pathname}`;
      }

      router.push(newPathname);
      setIsOpen(false);
    });
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{localeNames[currentLocale]}</span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => changeLocale(locale)}
                disabled={isPending}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  locale === currentLocale
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700'
                }`}
              >
                {localeNames[locale]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

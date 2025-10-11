import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  // Note: This validation is also done in layout.tsx
  const isValidLocale = locale && locales.includes(locale as Locale);
  const resolvedLocale: string = isValidLocale ? (locale as string) : 'en';

  return {
    locale: resolvedLocale,
    messages: (await import(`@/locales/${resolvedLocale}/common.json`)).default,
  };
});

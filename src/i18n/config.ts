export const locales = [
  'en', // English
  'tr', // Türkçe
  'es', // Español
  'fr', // Français
  'de', // Deutsch
  'it', // Italiano
  'pt-BR', // Português (Brasil)
  'ru', // Русский
  'ja', // 日本語
  'ko', // 한국어
  'zh-CN', // 简体中文
  'hi', // हिन्दी
  'pl', // Polski
  'nl', // Nederlands
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Language names in their native language
export const localeNames: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  'pt-BR': 'Português (BR)',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  'zh-CN': '简体中文',
  hi: 'हिन्दी',
  pl: 'Polski',
  nl: 'Nederlands',
};

// RTL languages (none currently - removed Arabic)
export const rtlLocales: Locale[] = [];

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

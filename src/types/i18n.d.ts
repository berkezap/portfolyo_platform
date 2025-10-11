import type { Locale } from '@/i18n/config';

type Messages = typeof import('@/locales/en/common.json');

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}

export type { Locale };

/**
 * Merkezi sabitler ve magic string'ler
 * Tüm projede tekrar eden sabitler burada tutulur.
 */

// Status sabitleri
export const STATUS = {
  PASS: 'pass',
  WARNING: 'warning',
  FAIL: 'fail',
} as const;

export type StatusType = typeof STATUS[keyof typeof STATUS];

// Renk sabitleri
export const COLORS = {
  PRIMARY: '#2563eb',
  SECONDARY: '#1d4ed8',
  ACCENT: '#3b82f6',
  ERROR: '#ef4444',
  WARNING: '#f59e42',
  SUCCESS: '#22c55e',
  GRAY_50: '#F9FAFB',
  GRAY_900: '#111827',
};

// Font sabitleri
export const FONT_FAMILY = "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// API endpoint sabitleri
export const API_ENDPOINTS = {
  FEEDBACK: '/api/feedback',
  PORTFOLIO: '/api/portfolio',
  ANALYTICS: '/api/analytics',
};

// Hata mesajları
export const ERROR_MESSAGES = {
  NOT_FOUND: 'Aradığınız içerik bulunamadı.',
  GENERIC: 'Bir hata oluştu. Lütfen tekrar deneyin.',
  UNAUTHORIZED: 'Yetkisiz erişim.',
};

// PortfolYO Design System Tokens
// Bu dosya, design system'deki tüm renk, spacing ve typography değerlerini içerir

export const colors = {
  // Primary Colors
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB', // Ana marka rengi
    700: '#1D4ED8', // Hover state
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Purple (Accent)
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA', // Accent rengi
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87',
  },

  // Neutral Colors
  gray: {
    50: '#F9FAFB',   // Arka plan
    100: '#F3F4F6',  // Kart arka planı, secondary buttons
    200: '#E5E7EB',  // Border
    300: '#D1D5DB',  // Hover border
    400: '#9CA3AF',  // Muted
    500: '#6B7280',  // Secondary text
    600: '#4B5563',  // Primary text
    700: '#374151',  // Metadata text
    800: '#1F2937',
    900: '#111827',  // Headings
  },

  // Semantic Colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A', // Success text
    700: '#15803D',
  },

  error: {
    50: '#FEF2F2',   // Error background
    100: '#FEE2E2',
    200: '#FECACA',  // Error border
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',  // Destructive action
    700: '#B91C1C',  // Error text
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
}

export const gradients = {
  hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  brand: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  accent: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  blue: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  purple: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
}

export const spacing = {
  // Base unit: 4px (0.25rem)
  1: '0.25rem',   // 4px - Minimal spacing
  2: '0.5rem',    // 8px - Button padding
  3: '0.75rem',   // 12px - Card padding
  4: '1rem',      // 16px - Section spacing
  6: '1.5rem',    // 24px - Component spacing
  8: '2rem',      // 32px - Page spacing
  12: '3rem',     // 48px - Major section spacing
  16: '4rem',     // 64px - Page margins
  20: '5rem',     // 80px - Hero spacing
  24: '6rem',     // 96px - Large spacing
}

export const typography = {
  fontSizes: {
    xs: '0.75rem',    // 12px - Labels, captions
    sm: '0.875rem',   // 14px - Metadata, buttons
    base: '1rem',     // 16px - Body text
    lg: '1.125rem',   // 18px - Card titles
    xl: '1.25rem',    // 20px - Section titles
    '2xl': '1.5rem',  // 24px - Subheadings
    '3xl': '1.875rem', // 30px - Page titles
    '4xl': '2.25rem',  // 36px - Hero titles
    '5xl': '3rem',     // 48px - Large titles
  },

  fontWeights: {
    normal: '400',    // Body text
    medium: '500',    // Button text, labels
    semibold: '600',  // Section titles, important text
    bold: '700',      // Page titles, card titles
  },

  lineHeights: {
    tight: '1.25',     // Headings
    normal: '1.5',     // Body text
    relaxed: '1.625',  // Long paragraphs
  },
}

export const borderRadius = {
  sm: '0.25rem',   // 4px - Small elements
  md: '0.375rem',  // 6px - Input fields
  lg: '0.5rem',    // 8px - Cards, containers
  xl: '0.75rem',   // 12px - Primary card radius
  '2xl': '1rem',   // 16px - Large containers
  '3xl': '1.5rem', // 24px - Hero elements
  full: '9999px',  // Pills, avatars
}

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
  glassDark: '0 8px 32px rgba(0, 0, 0, 0.3)',
}

export const transitions = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  easing: {
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
  },
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '7xl': '80rem', // Primary container
}

// Glass morphism effects
export const glassEffects = {
  light: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: shadows.glass,
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: shadows.glassDark,
  },
  warm: {
    background: 'rgba(254, 254, 254, 0.15)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(254, 254, 254, 0.25)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  },
}

// Animation delays
export const animationDelays = {
  200: '200ms',
  400: '400ms',
  600: '600ms',
  800: '800ms',
  1000: '1000ms',
}

// Icon sizes
export const iconSizes = {
  xs: '0.75rem',  // 12px - Small labels
  sm: '1rem',     // 16px - Button icons
  md: '1.25rem',  // 20px - Card icons
  lg: '1.5rem',   // 24px - Section icons
  xl: '2rem',     // 32px - Page icons
}

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}

// Design system theme object
export const theme = {
  colors,
  gradients,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  containers,
  glassEffects,
  animationDelays,
  iconSizes,
  zIndex,
}

export default theme 
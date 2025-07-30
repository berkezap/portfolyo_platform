import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Performance optimizations
  mode: 'jit',
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      // Font optimizations
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Color optimizations
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      // Animation optimizations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      // Transition optimizations
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Spacing optimizations
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Container optimizations
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      // Backdrop blur optimizations
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  // Performance plugins
  plugins: [
    // Custom utilities for performance
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        '.will-change-auto': {
          'will-change': 'auto',
        },
        '.will-change-scroll': {
          'will-change': 'scroll-position',
        },
        '.will-change-contents': {
          'will-change': 'contents',
        },
        '.will-change-transform': {
          'will-change': 'transform',
        },
        '.will-change-opacity': {
          'will-change': 'opacity',
        },
        '.will-change-colors': {
          'will-change': 'color, background-color, border-color',
        },
        '.contain-layout': {
          'contain': 'layout',
        },
        '.contain-style': {
          'contain': 'style',
        },
        '.contain-paint': {
          'contain': 'paint',
        },
        '.contain-size': {
          'contain': 'size',
        },
        '.contain-strict': {
          'contain': 'strict',
        },
        '.content-visibility-auto': {
          'content-visibility': 'auto',
        },
        '.content-visibility-hidden': {
          'content-visibility': 'hidden',
        },
        '.content-visibility-visible': {
          'content-visibility': 'visible',
        },
      }
      addUtilities(newUtilities)
    },
  ],
  // Purge optimizations for production
  ...(process.env.NODE_ENV === 'production' && {
    purge: {
      enabled: true,
      content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './public/**/*.html',
      ],
      options: {
        safelist: [
          'loading',
          'loaded',
          'glass',
          'glass-dark',
          'gradient-hero',
          'gradient-brand',
          'gradient-accent',
          'float-card',
          'hover-lift',
          'smooth-fade',
        ],
      },
    },
  }),
}

export default config 
import type { Config } from 'tailwindcss'
import { colors, spacing, typography, borderRadius, shadows, transitions, breakpoints, containers, animationDelays } from './src/lib/design-tokens'

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
      // Design System Colors
      colors: {
        ...colors,
        // Legacy support
        secondary: colors.gray,
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
      // Design System Spacing
      spacing: {
        ...spacing,
        // Additional spacing
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Design System Typography
      fontSize: typography.fontSizes,
      fontWeight: typography.fontWeights,
      lineHeight: typography.lineHeights,
      
      // Design System Border Radius
      borderRadius: borderRadius,
      
      // Design System Shadows
      boxShadow: shadows,
      
      // Design System Transitions
      transitionDuration: {
        fast: transitions.fast,
        normal: transitions.normal,
        slow: transitions.slow,
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': transitions.easing.inOut,
        'out': transitions.easing.out,
      },
      
      // Design System Breakpoints
      screens: breakpoints,
      
      // Design System Containers
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          ...containers,
          '7xl': '90rem', // 1440px - daha geniş
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
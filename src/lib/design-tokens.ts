// Design Tokens - PortfolYO Design System
export const designTokens = {
  // Color System
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb', // Ana marka rengi
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
    accent: {
      purple: '#9333ea',
      pink: '#ec4899',
      orange: '#f97316',
      green: '#10b981',
      yellow: '#f59e0b',
      red: '#ef4444',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b', 
      error: '#ef4444',
      info: '#3b82f6',
    }
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
      display: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    }
  },

  // Spacing System (4px base)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    '4xl': '2rem',    // 32px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
    'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
    float: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },

  // Transitions
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Container Max Widths
  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '7xl': '80rem', // 1280px
  },

  // Z-Index Scale
  zIndex: {
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
}

// Utility functions
export const getColor = (color: string) => {
  const [category, shade] = color.split('.')
  const colors = designTokens.colors as Record<string, any>
  if (category && category in colors) {
    const group = colors[category]
    if (typeof group === 'object' && shade && shade in group) {
      return group[shade]
    }
    // Tek renkli accent/semantic gibi gruplar
    if (shade && group && typeof group === 'object' && Object.values(group).includes(group[shade])) {
      return group[shade]
    }
    // Eğer shade yoksa direkt grup döndür
    if (!shade) return group
  }
  return undefined
}

export const getSpacing = (size: keyof typeof designTokens.spacing) => {
  return designTokens.spacing[size]
}

export const getTypography = (type: keyof typeof designTokens.typography.fontSize) => {
  return designTokens.typography.fontSize[type]
}

// CSS Custom Properties
export const cssVariables = {
  '--color-primary-600': designTokens.colors.primary[600],
  '--color-primary-700': designTokens.colors.primary[700],
  '--color-secondary-200': designTokens.colors.secondary[200],
  '--color-secondary-600': designTokens.colors.secondary[600],
  '--color-secondary-900': designTokens.colors.secondary[900],
  '--font-family-sans': designTokens.typography.fontFamily.sans.join(', '),
  '--font-family-mono': designTokens.typography.fontFamily.mono.join(', '),
  '--spacing-4': designTokens.spacing[4],
  '--spacing-6': designTokens.spacing[6],
  '--spacing-8': designTokens.spacing[8],
  '--spacing-12': designTokens.spacing[12],
  '--border-radius-lg': designTokens.borderRadius.lg,
  '--border-radius-xl': designTokens.borderRadius.xl,
  '--border-radius-2xl': designTokens.borderRadius['2xl'],
  '--shadow-lg': designTokens.shadows.lg,
  '--shadow-xl': designTokens.shadows.xl,
  '--shadow-glass': designTokens.shadows.glass,
  '--transition-normal': designTokens.transitions.normal,
  '--transition-slow': designTokens.transitions.slow,
}

export default designTokens 
// Color Theme System for Templates
export interface ColorTheme {
  id: string;
  name: string;
  isPro: boolean;
  colors: {
    // Base colors
    background: string;
    foreground: string;
    
    // Content colors
    primary: string;
    secondary: string;
    accent: string;
    
    // UI colors
    card: string;
    border: string;
    muted: string;
    
    // Status colors
    success: string;
    warning: string;
    error: string;
    
    // Dark mode variants (for PRO templates)
    dark?: {
      background: string;
      foreground: string;
      primary: string;
      secondary: string;
      accent: string;
      card: string;
      border: string;
      muted: string;
    };
  };
}

export const COLOR_THEMES: ColorTheme[] = [
  // FREE THEMES
  {
    id: 'github-clean',
    name: 'GitHub Clean',
    isPro: false,
    colors: {
      background: '#ffffff',
      foreground: '#24292f',
      primary: '#0969da',
      secondary: '#656d76',
      accent: '#218bff',
      card: '#f6f8fa',
      border: '#d1d9e0',
      muted: '#8b949e',
      success: '#1a7f37',
      warning: '#d97706',
      error: '#dc2626',
    },
  },
  
  // PRO THEMES
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    isPro: true,
    colors: {
      background: '#0f172a',
      foreground: '#f8fafc',
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#06b6d4',
      card: '#1e293b',
      border: '#334155',
      muted: '#475569',
      success: '#22c55e',
      warning: '#eab308',
      error: '#dc2626',
      dark: {
        background: '#020617',
        foreground: '#f1f5f9',
        primary: '#60a5fa',
        secondary: '#94a3b8',
        accent: '#22d3ee',
        card: '#0f172a',
        border: '#1e293b',
        muted: '#64748b',
      },
    },
  },
  {
    id: 'emerald-pro',
    name: 'Emerald Pro',
    isPro: true,
    colors: {
      background: '#f0fdf4',
      foreground: '#052e16',
      primary: '#059669',
      secondary: '#65a30d',
      accent: '#10b981',
      card: '#dcfce7',
      border: '#bbf7d0',
      muted: '#65a30d',
      success: '#22c55e',
      warning: '#eab308',
      error: '#dc2626',
      dark: {
        background: '#052e16',
        foreground: '#f0fdf4',
        primary: '#4ade80',
        secondary: '#84cc16',
        accent: '#10b981',
        card: '#14532d',
        border: '#166534',
        muted: '#84cc16',
      },
    },
  },
  {
    id: 'purple-haze',
    name: 'Purple Haze',
    isPro: true,
    colors: {
      background: '#faf5ff',
      foreground: '#3b0764',
      primary: '#9333ea',
      secondary: '#7c3aed',
      accent: '#c084fc',
      card: '#e9d5ff',
      border: '#d8b4fe',
      muted: '#7c3aed',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      dark: {
        background: '#3b0764',
        foreground: '#faf5ff',
        primary: '#a855f7',
        secondary: '#8b5cf6',
        accent: '#c084fc',
        card: '#581c87',
        border: '#6b21a8',
        muted: '#8b5cf6',
      },
    },
  },
];

// Theme utilities
export const getThemeById = (id: string): ColorTheme | undefined =>
  COLOR_THEMES.find(theme => theme.id === id);

export const getTheme = (themeId: string): ColorTheme => {
  const theme = COLOR_THEMES.find(t => t.id === themeId);
  if (!theme) {
    console.warn(`Theme "${themeId}" not found, falling back to default theme`);
    return COLOR_THEMES[0]!;
  }
  return theme;
};

export const getFreeThemes = (): ColorTheme[] =>
  COLOR_THEMES.filter(theme => !theme.isPro);

export const getProThemes = (): ColorTheme[] =>
  COLOR_THEMES.filter(theme => theme.isPro);

export const generateCSSVariables = (theme: ColorTheme, darkMode = false): React.CSSProperties => {
  const colors = darkMode && theme.colors.dark ? theme.colors.dark : theme.colors;
  
  return {
    '--color-background': colors.background,
    '--color-foreground': colors.foreground,
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-card': colors.card,
    '--color-border': colors.border,
    '--color-muted': colors.muted,
    '--color-link': colors.primary,
    '--color-shadow': darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-error': theme.colors.error,
  } as React.CSSProperties;
};

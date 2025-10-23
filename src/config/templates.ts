/**
 * Template Configuration System
 *
 * Centralized template metadata and configuration for the portfolio platform.
 * Defines all available templates with their capabilities and requirements.
 */

export type TemplateCategory = 'minimal' | 'techy' | 'creative';
export type CustomizationLevel = 'basic' | 'advanced';

export interface TemplateCapabilities {
  darkMode: boolean;
  animations: boolean;
  seo: boolean;
  accessibility: boolean;
  customization: CustomizationLevel;
}

export interface TemplateConfig {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: TemplateCategory;
  isPremium: boolean;
  features: string[];
  capabilities: TemplateCapabilities;
  previewImage?: string;
  demoUrl?: string;
}

/**
 * All available portfolio templates
 * FREE templates: Basic features, limited customization
 * PRO templates: Advanced features, full customization, premium design
 */
export const TEMPLATES: TemplateConfig[] = [
  // ==================== FREE TIER ====================
  {
    id: 'github-native',
    slug: 'github-native',
    name: 'GitHub Native',
    description: 'README-style portfolio that feels like home. Clean, minimal, GitHub aesthetic.',
    category: 'minimal',
    isPremium: false,
    features: ['GitHub Aesthetic', 'Markdown Style', 'Fast Loading', 'Mobile-First', 'Accessible'],
    capabilities: {
      darkMode: false,
      animations: false,
      seo: false,
      accessibility: true,
      customization: 'basic',
    },
  },

  // ==================== PRO TIER ====================
  {
    id: 'bento-grid-pro',
    slug: 'bento-grid-pro',
    name: 'Bento Grid Pro',
    description: 'Apple-inspired card layout with smooth animations. Modern, elegant, premium.',
    category: 'minimal',
    isPremium: true,
    features: [
      'Bento Box Layout',
      'Glassmorphism',
      'Spring Animations',
      'Dark/Light Mode',
      'iOS Aesthetic',
    ],
    capabilities: {
      darkMode: true,
      animations: true,
      seo: true,
      accessibility: true,
      customization: 'advanced',
    },
  },
  {
    id: 'terminal-master',
    slug: 'terminal-master',
    name: 'Terminal Master',
    description:
      'Authentic terminal experience with typing animations. Unforgettable hacker aesthetic.',
    category: 'techy',
    isPremium: true,
    features: [
      'Terminal UI',
      'Typing Animation',
      'Command Navigation',
      'CRT Effects',
      'Monospace Beauty',
    ],
    capabilities: {
      darkMode: true,
      animations: true,
      seo: true,
      accessibility: true,
      customization: 'advanced',
    },
  },
];

/**
 * Get template config by slug
 */
export function getTemplateBySlug(slug: string): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

/**
 * Get all free templates
 */
export function getFreeTemplates(): TemplateConfig[] {
  return TEMPLATES.filter((t) => !t.isPremium);
}

/**
 * Get all premium templates
 */
export function getPremiumTemplates(): TemplateConfig[] {
  return TEMPLATES.filter((t) => t.isPremium);
}

/**
 * Check if a template is premium
 */
export function isTemplatePremium(slug: string): boolean {
  const template = getTemplateBySlug(slug);
  return template?.isPremium ?? false;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: TemplateCategory): TemplateConfig[] {
  return TEMPLATES.filter((t) => t.category === category);
}

/**
 * Validate template slug exists
 */
export function isValidTemplateSlug(slug: string): boolean {
  return TEMPLATES.some((t) => t.slug === slug);
}

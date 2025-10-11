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
    id: 'developer-minimal-free',
    slug: 'developer-minimal',
    name: 'Developer Minimal',
    description:
      'Clean, professional portfolio perfect for developers. GitHub-focused with project showcase.',
    category: 'minimal',
    isPremium: false,
    features: ['Responsive Design', 'GitHub Integration', 'Project Showcase', 'Contact Section'],
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
    id: 'tech-minimalist-pro',
    slug: 'tech-minimalist',
    name: 'Tech Minimalist Pro',
    description:
      'Ultra-clean design with elegant typography. Perfect for professionals seeking sophistication.',
    category: 'minimal',
    isPremium: true,
    features: [
      'Dark/Light Mode',
      'Smooth Animations',
      'SEO Optimized',
      'Performance Tuned',
      'Full Customization',
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
    id: 'cyberpunk-developer-pro',
    slug: 'cyberpunk-developer',
    name: 'Cyberpunk Developer',
    description:
      'Futuristic design with neon aesthetics. Stand out with terminal-inspired visuals.',
    category: 'techy',
    isPremium: true,
    features: [
      'Neon Theme',
      'Terminal Aesthetic',
      'Glitch Effects',
      'Matrix Animation',
      'Custom Scrollbar',
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
    id: 'creative-coder-pro',
    slug: 'creative-coder',
    name: 'Creative Coder',
    description:
      'Bold and vibrant design for creative developers. Modern glassmorphism and gradient effects.',
    category: 'creative',
    isPremium: true,
    features: [
      'Vibrant Gradients',
      '3D Hover Effects',
      'Glassmorphism',
      'Smooth Transitions',
      'Modern Aesthetics',
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

/**
 * Check if template is premium
 */
export function isTemplatePremium(templateId: string): boolean {
  const template = TEMPLATES.find((t) => t.id === templateId || t.slug === templateId);
  return template?.isPremium ?? false;
}

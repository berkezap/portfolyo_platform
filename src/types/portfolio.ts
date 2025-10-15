import { TemplateData } from './templates';

/**
 * Portfolio database record interface
 * Represents a portfolio entry in the Supabase database
 */
export interface PortfolioData {
  id: string;
  user_id: string;
  selected_template: string;
  selected_repos: string[];
  cv_url?: string;
  metadata: TemplateData;
  public_slug: string | null;
  is_published: boolean;
  published_at: string | null;
  status: 'draft' | 'published';
  visibility?: 'public' | 'private';
  created_at: string;
  updated_at: string;
}

/**
 * Public portfolio response for SSR rendering
 * Only includes data needed for public display
 */
export interface PublicPortfolioResponse {
  template_id: string;
  data: TemplateData;
  user_id: string;
  slug: string;
  published_at: string | null;
}

/**
 * Portfolio query params for dynamic routes
 */
export interface PortfolioPageParams {
  slug: string;
}


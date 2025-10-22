import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import type { PortfolioData, PortfolioPageParams } from '@/types/portfolio';
import type { TemplateProps } from '@/types/templates';
import { Metadata } from 'next';
import React from 'react';

// Dynamic imports for templates
import dynamic from 'next/dynamic';

// Template mapping - lazy load for performance
const GitHubNative = dynamic(() => import('@/components/templates/GitHubNative'));
const BentoGridPro = dynamic(() => import('@/components/templates/BentoGridPro'));
const TerminalMaster = dynamic(() => import('@/components/templates/TerminalMaster'));
const ModernDeveloper = dynamic(() => import('@/components/templates/ModernDeveloper'));

// Template ID to component mapping
const TEMPLATE_MAP: Record<string, React.ComponentType<TemplateProps>> = {
  // Legacy templates (by ID)
  '1': GitHubNative, // professional-tech -> github-native
  '2': BentoGridPro, // minimalist-professional -> bento-grid-pro
  '3': TerminalMaster, // creative-portfolio -> terminal-master
  '4': ModernDeveloper, // modern-developer
  '5': GitHubNative, // creative-technologist -> github-native
  '6': BentoGridPro, // storyteller -> bento-grid-pro

  // New template names (if any)
  'github-native': GitHubNative,
  'bento-grid-pro': BentoGridPro,
  'terminal-master': TerminalMaster,
  'modern-developer': ModernDeveloper,
};

/**
 * Fetch portfolio data from Supabase by slug or ID (for preview)
 */
async function getPortfolioBySlug(
  slug: string,
  portfolioId?: string,
): Promise<PortfolioData | null> {
  try {
    console.log('[PortfolioPage] getPortfolioBySlug called with:', { slug, portfolioId });
    console.log('[PortfolioPage] Environment check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nodeEnv: process.env.NODE_ENV,
    });

    // Preview mode: Fetch by ID regardless of publish status
    if (portfolioId) {
      console.log('[PortfolioPage] Fetching by ID:', portfolioId);
      const { data, error } = await supabaseAdmin
        .from('portfolios')
        .select('*')
        .eq('id', portfolioId)
        .maybeSingle();

      if (error) {
        console.error('[PortfolioPage] Error fetching portfolio by ID:', error);
        return null;
      }

      console.log('[PortfolioPage] Found portfolio by ID:', data ? 'YES' : 'NO');
      return data as PortfolioData | null;
    }

    console.log('[PortfolioPage] Fetching published portfolio by slug:', slug);

    // Normal mode: Fetch by slug and check if published
    const { data, error } = await supabaseAdmin
      .from('portfolios')
      .select('*')
      .eq('public_slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      console.error('[PortfolioPage] Error fetching portfolio:', error);
      console.error('[PortfolioPage] Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return null;
    }

    console.log('[PortfolioPage] Database query result:', {
      found: !!data,
      slug: slug,
      hasMetadata: data?.metadata ? 'YES' : 'NO',
      isPublished: data?.is_published ? 'YES' : 'NO',
    });

    return data as PortfolioData | null;
  } catch (error) {
    console.error('[PortfolioPage] Unexpected error:', error);
    return null;
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PortfolioPageParams>;
  searchParams: Promise<{ preview?: string; portfolio_id?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { preview, portfolio_id } = await searchParams;
  const isPreview = preview === 'true';

  const portfolio = await getPortfolioBySlug(slug, isPreview ? portfolio_id : undefined);

  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
    };
  }

  const data = portfolio.metadata;
  const titleSuffix = isPreview ? ' - Preview' : ' - Portfolio';

  return {
    title: `${data.USER_NAME}${titleSuffix}`,
    description: data.USER_BIO || 'Developer Portfolio',
    robots: isPreview ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: `${data.USER_NAME}${titleSuffix}`,
      description: data.USER_BIO || 'Developer Portfolio',
      images: data.USER_AVATAR ? [data.USER_AVATAR] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.USER_NAME}${titleSuffix}`,
      description: data.USER_BIO || 'Developer Portfolio',
      images: data.USER_AVATAR ? [data.USER_AVATAR] : [],
    },
  };
}

/**
 * Dynamic portfolio page - SSR rendered
 */
export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<PortfolioPageParams>;
  searchParams: Promise<{ preview?: string; portfolio_id?: string }>;
}) {
  const { slug } = await params;
  const { preview, portfolio_id } = await searchParams;

  const isPreview = preview === 'true';
  console.log('[PortfolioPage] Rendering portfolio:', { slug, isPreview, portfolio_id });
  console.log('[PortfolioPage] Search params:', await searchParams);
  console.log('[PortfolioPage] Params:', await params);

  // Fetch portfolio data from database (by ID for preview, by slug for published)
  const portfolio = await getPortfolioBySlug(slug, isPreview ? portfolio_id : undefined);

  // Handle not found
  if (!portfolio) {
    console.log('[PortfolioPage] Portfolio not found:', slug);
    notFound();
  }

  // Check if metadata exists (SSR requirement)
  if (!portfolio.metadata) {
    console.error('[PortfolioPage] Portfolio metadata missing:', slug);
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'system-ui, sans-serif',
          background: '#f3f4f6',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '32px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>
            Portfolio Data Missing
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            This portfolio needs to be regenerated with the new system.
          </p>
          <button
            onClick={() => (window.location.href = '/dashboard')}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#fff',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check if published (skip for preview mode)
  if (!isPreview && !portfolio.is_published) {
    console.log('[PortfolioPage] Portfolio not published:', slug);
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1>Portfolio Not Available</h1>
          <p>This portfolio is not published yet.</p>
        </div>
      </div>
    );
  }

  console.log('[PortfolioPage] Portfolio data:', {
    id: portfolio.id,
    template: portfolio.selected_template,
    hasMetadata: !!portfolio.metadata,
    metadataKeys: portfolio.metadata ? Object.keys(portfolio.metadata) : [],
  });

  // Get the template component
  const TemplateComponent = TEMPLATE_MAP[portfolio.selected_template];

  // Handle unknown template
  if (!TemplateComponent) {
    console.error('[PortfolioPage] Unknown template:', portfolio.selected_template);
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1>Template Error</h1>
          <p>The selected template is not available.</p>
        </div>
      </div>
    );
  }

  console.log('[PortfolioPage] Rendering template:', portfolio.selected_template);

  // Render the selected template with portfolio data
  // Add preview indicator if in preview mode
  return (
    <>
      {isPreview && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(45deg, #00ff00, #00aaff)',
            color: '#000',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            zIndex: 9999,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            animation: 'pulse 2s infinite',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          🎯 PREVIEW MODE
        </div>
      )}

      <TemplateComponent data={portfolio.metadata} />
    </>
  );
}

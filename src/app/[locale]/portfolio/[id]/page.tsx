'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Legacy portfolio preview route
 * Redirects to new SSR portfolio route
 */
export default function LegacyPortfolioPage({ 
  params 
}: { 
  params: Promise<{ id: string; locale: string }> 
}) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    console.log('🔄 Legacy route detected, redirecting to SSR route:', id);
    
    // Check if this is a preview request
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'true';
    
    // Check if ID is already a preview slug (starts with 'preview-')
    if (id.startsWith('preview-')) {
      // Extract the actual UUID from the preview slug or from URL params
      const actualPortfolioId = urlParams.get('portfolio_id');
      
      if (actualPortfolioId) {
        // We have the full UUID from params, use that for SSR
        const previewSlug = `preview-${actualPortfolioId.slice(0, 8)}`;
        const redirectUrl = `/portfolio/${previewSlug}?preview=true&portfolio_id=${actualPortfolioId}`;
        console.log('🎯 Preview slug with full UUID, redirecting:', redirectUrl);
        console.log('🔍 Portfolio ID being passed:', actualPortfolioId);
        window.location.href = redirectUrl;
      } else {
        console.error('❌ Preview slug without portfolio_id param, redirecting to dashboard');
        window.location.href = '/dashboard';
      }
      return;
    }
    
    if (isPreview) {
      // Preview mode: redirect to SSR preview with temporary slug
      const previewSlug = `preview-${id.slice(0, 8)}`;
      const redirectUrl = `/portfolio/${previewSlug}?preview=true&portfolio_id=${id}`;
      console.log('🎯 Redirecting to preview:', redirectUrl);
      window.location.href = redirectUrl;
    } else {
      // Normal mode: try to fetch portfolio and redirect to its public URL
      const fetchAndRedirect = async () => {
        try {
          const response = await fetch(`/api/portfolio/${id}`);
          const data = await response.json();
          
          if (data.success && data.portfolio) {
            if (data.portfolio.is_published && data.portfolio.public_slug) {
              // Published: redirect to public slug
              window.location.href = `/portfolio/${data.portfolio.public_slug}`;
            } else {
              // Draft: redirect to preview
              const previewSlug = `preview-${id.slice(0, 8)}`;
              window.location.href = `/portfolio/${previewSlug}?preview=true&portfolio_id=${id}`;
            }
          } else {
            // Not found: redirect to dashboard
            window.location.href = '/dashboard';
          }
        } catch (error) {
          console.error('Error fetching portfolio:', error);
          window.location.href = '/dashboard';
        }
      };
      
      fetchAndRedirect();
    }
  }, [id, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to portfolio...</p>
      </div>
    </div>
  );
}

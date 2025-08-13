import { useState } from 'react';

interface PortfolioGenerationResult {
  success: boolean;
  html?: string;
  portfolioId?: string;
  metadata?: {
    user: string;
    repoCount: number;
    totalStars: number;
    template: string;
  };
  error?: string;
}

interface UsePortfolioGeneratorReturn {
  generatePortfolio: (
    templateName: string,
    selectedRepos?: string[],
    cvUrl?: string,
  ) => Promise<string | null>;
  result: PortfolioGenerationResult | null;
  loading: boolean;
  error: string | null;
  clearResult: () => void;
}

export function usePortfolioGenerator(): UsePortfolioGeneratorReturn {
  const [result, setResult] = useState<PortfolioGenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePortfolio = async (
    templateName: string,
    selectedRepos?: string[],
    cvUrl?: string,
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/portfolio/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateName,
          selectedRepos,
          cvUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 403 ise limit mesajını surface et
        const message = data?.error || 'Failed to generate portfolio';
        throw new Error(message);
      }

      setResult(data);
      return data.portfolioId || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Portfolio generation error:', err);
      // Propagate to caller so UI akışı doğru yönetilsin
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    generatePortfolio,
    result,
    loading,
    error,
    clearResult,
  };
}

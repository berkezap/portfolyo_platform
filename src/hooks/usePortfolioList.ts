import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Portfolio {
  id: string;
  created_at: string;
  selected_template: string;
  selected_repos: string[];
  template: string;
  selectedRepos: string[];
  createdAt: string;
  // Publishing fields
  is_published?: boolean;
  public_slug?: string;
  slug?: string;
  status?: 'draft' | 'published';
  published_at?: string;
  visibility?: 'private' | 'unlisted' | 'public';
  // Add other portfolio fields as necessary
}

const fetchPortfolios = async (): Promise<Portfolio[]> => {
  const response = await fetch('/api/portfolio/list');
  if (!response.ok) {
    throw new Error('Failed to fetch portfolios');
  }
  const data = await response.json();
  return data.portfolios || []; // Extract the 'portfolios' array
};

const deletePortfolio = async (id: string): Promise<void> => {
  const response = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete portfolio');
  }
};

export function usePortfolioList(enabled: boolean = true) {
  const queryClient = useQueryClient();

  const {
    data: portfolios,
    isLoading,
    error,
  } = useQuery<Portfolio[], Error>({
    queryKey: ['portfolios'],
    queryFn: fetchPortfolios,
    enabled: enabled, // Sadece enabled true ise çalışsın
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deletePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });

  return {
    portfolios: portfolios || [],
    isLoading,
    error: error?.message || null,
    deletePortfolio: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['portfolios'] }),
  };
}

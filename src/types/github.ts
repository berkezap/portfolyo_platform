export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string | null;
  updated_at: string | null;
  topics: string[];
  homepage: string | null;
} 
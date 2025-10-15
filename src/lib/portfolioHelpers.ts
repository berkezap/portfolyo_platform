import { TemplateData } from '@/types/templates';

interface GitHubUser {
  name?: string | null;
  login: string;
  bio?: string | null;
  avatar_url: string;
  email?: string | null;
  html_url: string;
  public_repos: number;
}

interface GitHubRepository {
  name: string;
  description?: string | null;
  html_url: string;
  language?: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string | null;
  topics?: string[];
  homepage?: string | null;
}

/**
 * Format GitHub user and repository data into TemplateData structure
 * Used for portfolio generation (SSR)
 */
export function formatUserDataForTemplate(
  userData: GitHubUser,
  repos: GitHubRepository[],
  selectedRepos: string[],
  cvUrl?: string,
): TemplateData {
  const selectedRepoObjects = repos.filter((repo) => selectedRepos.includes(repo.name));
  const totalStars = selectedRepoObjects.reduce((sum, repo) => sum + repo.stargazers_count, 0);

  // created_at null olabileceği için güvenli bir şekilde işle
  const reposWithValidDates = selectedRepoObjects.filter((repo) => repo.created_at !== null);
  const oldestRepo =
    reposWithValidDates.length > 0
      ? reposWithValidDates.reduce((oldest, repo) => {
          const repoDate = new Date(repo.created_at!);
          const oldestDate = new Date(oldest.created_at!);
          return repoDate < oldestDate ? repo : oldest;
        })
      : null;
  const yearsExperience = oldestRepo
    ? Math.max(1, new Date().getFullYear() - new Date(oldestRepo.created_at!).getFullYear())
    : 1;

  return {
    USER_NAME: userData.name || userData.login,
    USER_TITLE: 'Software Engineer', // Placeholder
    USER_BIO: userData.bio || 'A passionate developer building modern web applications.',
    USER_MISSION_STATEMENT: 'Crafting elegant solutions to complex problems.', // Placeholder
    USER_AVATAR: userData.avatar_url,
    USER_EMAIL: userData.email || '',
    GITHUB_URL: userData.html_url,
    LINKEDIN_URL: '#', // Placeholder
    TWITTER_URL: '#', // Placeholder
    CV_URL: cvUrl || '',
    TOTAL_REPOS: userData.public_repos,
    TOTAL_STARS: totalStars,
    YEARS_EXPERIENCE: yearsExperience,
    projects: selectedRepoObjects.map((repo, index) => ({
      PROJECT_INDEX: index,
      PROJECT_NAME: repo.name,
      PROJECT_DESCRIPTION: repo.description || 'No description provided.',
      PROJECT_URL: repo.html_url,
      PROJECT_DEMO: repo.homepage || '',
      PROJECT_LANGUAGE: repo.language || 'N/A',
      PROJECT_STARS: repo.stargazers_count,
      PROJECT_FORKS: repo.forks_count,
      topics: repo.topics || [],
    })),
  };
}


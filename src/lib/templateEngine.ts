import fs from 'fs';
import path from 'path';
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

export function renderTemplate(templateName: string, data: TemplateData): string {
  try {
    // Template dosyasını oku
    const templatePath = path.join(
      process.cwd(),
      'public',
      'templates',
      templateName,
      'index.html',
    );
    console.log(`[TemplateEngine] Template dosyası okunuyor: ${templatePath}`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    const template = fs.readFileSync(templatePath, 'utf-8');
    console.log(`[TemplateEngine] Template dosyası okundu, uzunluk: ${template.length}`);

    // Process conditional blocks: {{#KEY}}...{{/KEY}}
    let output = template.replace(
      /{{#(\w+)}}([\s\S]*?){{\/\1}}/g,
      (match: string, key: keyof TemplateData, content: string) => {
        return data[key] ? content : '';
      },
    );

    // Process project loops: {{PROJECTS_START}}...{{PROJECTS_END}}
    const projectLoopRegex = /{{PROJECTS_START}}([\s\S]*?){{PROJECTS_END}}/g;
    output = output.replace(projectLoopRegex, (match: string, projectTemplate: string) => {
      if (!data.projects || data.projects.length === 0) {
        console.warn('[TemplateEngine] No projects found in data');
        return '';
      }

      return data.projects
        .map((project) => {
          let projectHtml = projectTemplate;

          const techLoopRegex = /{{TECH_TAGS_START}}([\s\S]*?){{TECH_TAGS_END}}/g;
          projectHtml = projectHtml.replace(
            techLoopRegex,
            (techMatch: string, techTemplate: string) => {
              if (!project.topics || project.topics.length === 0) return '';
              return project.topics
                .map((topic) => techTemplate.replace(/{{TECH_NAME}}/g, topic))
                .join('');
            },
          );

          return projectHtml
            .replace(/{{PROJECT_NAME}}/g, project.PROJECT_NAME)
            .replace(/{{PROJECT_DESCRIPTION}}/g, project.PROJECT_DESCRIPTION)
            .replace(/{{PROJECT_URL}}/g, project.PROJECT_URL)
            .replace(/{{PROJECT_DEMO}}/g, project.PROJECT_DEMO || '')
            .replace(/{{PROJECT_LANGUAGE}}/g, project.PROJECT_LANGUAGE)
            .replace(/{{PROJECT_STARS}}/g, String(project.PROJECT_STARS))
            .replace(/{{PROJECT_FORKS}}/g, String(project.PROJECT_FORKS))
            .replace(/{{PROJECT_INDEX}}/g, String(project.PROJECT_INDEX));
        })
        .join('');
    });

    // Process simple placeholders
    const currentYear = new Date().getFullYear();
    output = output
      .replace(/{{USER_NAME}}/g, data.USER_NAME || '')
      .replace(/{{USER_TITLE}}/g, data.USER_TITLE || '')
      .replace(/{{USER_BIO}}/g, data.USER_BIO || '')
      .replace(/{{USER_MISSION_STATEMENT}}/g, data.USER_MISSION_STATEMENT || '')
      .replace(/{{USER_AVATAR}}/g, data.USER_AVATAR || '')
      .replace(/{{USER_EMAIL}}/g, data.USER_EMAIL || '')
      .replace(/{{GITHUB_URL}}/g, data.GITHUB_URL || '')
      .replace(/{{LINKEDIN_URL}}/g, data.LINKEDIN_URL || '')
      .replace(/{{CV_URL}}/g, data.CV_URL || '')
      .replace(/{{TWITTER_URL}}/g, data.TWITTER_URL || '')
      .replace(/{{TOTAL_REPOS}}/g, String(data.TOTAL_REPOS || 0))
      .replace(/{{TOTAL_STARS}}/g, String(data.TOTAL_STARS || 0))
      .replace(/{{YEARS_EXPERIENCE}}/g, String(data.YEARS_EXPERIENCE || 1))
      .replace(/{{CURRENT_YEAR}}/g, String(currentYear))
      .replace(/{{YEAR}}/g, String(currentYear));

    console.log(`[TemplateEngine] Template başarıyla render edildi, uzunluk: ${output.length}`);

    if (!output) {
      throw new Error('Generated HTML is empty after rendering');
    }

    return output;
  } catch (error) {
    console.error('[TemplateEngine] Render hatası:', error);
    throw error;
  }
}

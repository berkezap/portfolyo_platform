import fs from 'fs'
import path from 'path'
import { TemplateData } from '@/types/templates'

export function formatUserDataForTemplate(userData: any, repos: any[], selectedRepos: string[]): TemplateData {
  const selectedRepoObjects = repos.filter(repo => selectedRepos.includes(repo.name));
  const totalStars = selectedRepoObjects.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const oldestRepo = selectedRepoObjects.length > 0
    ? selectedRepoObjects.reduce((oldest, repo) => new Date(repo.created_at) < new Date(oldest.created_at) ? repo : oldest)
    : null;
  const yearsExperience = oldestRepo ? Math.max(1, new Date().getFullYear() - new Date(oldestRepo.created_at).getFullYear()) : 1;

  return {
    USER_NAME: userData.name || userData.login,
    USER_TITLE: "Software Engineer", // Placeholder
    USER_BIO: userData.bio || 'A passionate developer building modern web applications.',
    USER_MISSION_STATEMENT: 'Crafting elegant solutions to complex problems.', // Placeholder
    USER_AVATAR: userData.avatar_url,
    USER_EMAIL: userData.email,
    GITHUB_URL: userData.html_url,
    LINKEDIN_URL: '#', // Placeholder
    TWITTER_URL: '#', // Placeholder
    CV_URL: '',
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
  // NOTE: Cache is disabled for development to ensure fresh templates.
  const templatePath = path.join(process.cwd(), 'public', 'templates', templateName, 'index.html');
  console.log(`[TemplateEngine] Force reading from: ${templatePath}`);
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Process conditional blocks: {{#KEY}}...{{/KEY}}
  let output = template.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (match: string, key: keyof TemplateData, content: string) => {
    return data[key] ? content : '';
  });

  // Process project loops: {{PROJECTS_START}}...{{PROJECTS_END}}
  const projectLoopRegex = /{{PROJECTS_START}}([\s\S]*?){{PROJECTS_END}}/g;
  output = output.replace(projectLoopRegex, (match: string, projectTemplate: string) => {
    return data.projects.map(project => {
      let projectHtml = projectTemplate;
      
      const techLoopRegex = /{{TECH_TAGS_START}}([\s\S]*?){{TECH_TAGS_END}}/g;
      projectHtml = projectHtml.replace(techLoopRegex, (techMatch: string, techTemplate: string) => {
        return project.topics.map(topic => techTemplate.replace(/{{TECH_NAME}}/g, topic)).join('');
      });

      return projectHtml
        .replace(/{{PROJECT_NAME}}/g, project.PROJECT_NAME)
        .replace(/{{PROJECT_DESCRIPTION}}/g, project.PROJECT_DESCRIPTION)
        .replace(/{{PROJECT_URL}}/g, project.PROJECT_URL)
        .replace(/{{PROJECT_DEMO}}/g, project.PROJECT_DEMO || '')
        .replace(/{{PROJECT_LANGUAGE}}/g, project.PROJECT_LANGUAGE)
        .replace(/{{PROJECT_STARS}}/g, String(project.PROJECT_STARS))
        .replace(/{{PROJECT_FORKS}}/g, String(project.PROJECT_FORKS))
        .replace(/{{PROJECT_INDEX}}/g, String(project.PROJECT_INDEX));
    }).join('');
  });
  
  // Process simple placeholders
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
    .replace(/{{TOTAL_STARS}}/g, String(data.TOTAL_STARS || 0));

  return output;
} 
export interface TemplateProject {
  PROJECT_INDEX: number;
  PROJECT_NAME: string;
  PROJECT_URL: string;
  PROJECT_DEMO?: string;
  PROJECT_DESCRIPTION: string;
  PROJECT_STARS: number;
  PROJECT_FORKS: number;
  PROJECT_LANGUAGE: string;
  topics: string[];
}

export interface TemplateData {
  USER_NAME: string;
  USER_TITLE: string;
  USER_BIO: string;
  USER_MISSION_STATEMENT: string;
  USER_AVATAR: string;
  USER_EMAIL: string;
  GITHUB_URL: string;
  LINKEDIN_URL: string;
  TWITTER_URL: string;
  CV_URL: string;
  TOTAL_REPOS: number;
  TOTAL_STARS: number;
  YEARS_EXPERIENCE?: number;
  projects: TemplateProject[];
}

export interface TemplateProps {
  data: TemplateData;
  themeId?: string;
  darkMode?: boolean;
} 
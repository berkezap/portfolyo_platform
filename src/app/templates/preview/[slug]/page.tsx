import React from 'react';
import { notFound } from 'next/navigation';
import { isValidTemplateSlug } from '@/config/templates';
import GitHubNative from '@/components/templates/GitHubNative';
import BentoGridPro from '@/components/templates/BentoGridPro';
import TerminalMaster from '@/components/templates/TerminalMaster';
import ModernDeveloper from '@/components/templates/ModernDeveloper';
import { TemplateData } from '@/types/templates';

// Template components mapping
const TEMPLATE_COMPONENTS = {
  'github-native': GitHubNative,
  'bento-grid-pro': BentoGridPro,
  'terminal-master': TerminalMaster,
  'modern-developer': ModernDeveloper,
} as const;

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate demo data for template preview
 */
function generatePreviewData(templateSlug: string): TemplateData {
  const baseData = {
    USER_NAME: 'Demo User',
    USER_TITLE: 'Full Stack Developer',
    USER_BIO:
      'This is a preview of how your portfolio will look with real data from your GitHub profile.',
    USER_MISSION_STATEMENT: 'Building amazing web applications that make a difference.',
    USER_AVATAR: 'https://avatars.githubusercontent.com/u/1?v=4', // Demo GitHub avatar
    USER_EMAIL: 'demo@example.com',
    GITHUB_URL: 'https://github.com/demouser',
    LINKEDIN_URL: 'https://linkedin.com/in/demouser',
    TWITTER_URL: 'https://twitter.com/demouser',
    CV_URL: '/sample-cv.pdf',
    TOTAL_REPOS: 25,
    TOTAL_STARS: 150,
    YEARS_EXPERIENCE: 5,
    projects: [
      {
        PROJECT_INDEX: 1,
        PROJECT_NAME: 'awesome-project',
        PROJECT_URL: 'https://github.com/demouser/awesome-project',
        PROJECT_DEMO: 'https://awesome-project.vercel.app',
        PROJECT_DESCRIPTION: 'A really cool project built with modern technologies',
        PROJECT_STARS: 42,
        PROJECT_FORKS: 8,
        PROJECT_LANGUAGE: 'TypeScript',
        topics: ['react', 'nextjs', 'typescript'],
      },
      {
        PROJECT_INDEX: 2,
        PROJECT_NAME: 'portfolio-website',
        PROJECT_URL: 'https://github.com/demouser/portfolio-website',
        PROJECT_DEMO: 'https://portfolio-demo.vercel.app',
        PROJECT_DESCRIPTION: 'My personal portfolio built with Next.js and React',
        PROJECT_STARS: 15,
        PROJECT_FORKS: 3,
        PROJECT_LANGUAGE: 'JavaScript',
        topics: ['react', 'portfolio', 'nextjs'],
      },
      {
        PROJECT_INDEX: 3,
        PROJECT_NAME: 'api-service',
        PROJECT_URL: 'https://github.com/demouser/api-service',
        PROJECT_DESCRIPTION: 'RESTful API built with Node.js and Express',
        PROJECT_STARS: 28,
        PROJECT_FORKS: 5,
        PROJECT_LANGUAGE: 'JavaScript',
        topics: ['nodejs', 'express', 'api'],
      },
    ],
  };

  // Customize data based on template
  switch (templateSlug) {
    case 'github-native':
      return {
        ...baseData,
        USER_NAME: 'Alex Thompson',
        USER_TITLE: 'Open Source Contributor',
        USER_BIO:
          'Clean and minimal portfolio inspired by GitHub README files. I love contributing to open source projects and building developer tools.',
        USER_AVATAR: 'https://avatars.githubusercontent.com/u/2?v=4', // Different avatar for GitHub theme
      };

    case 'bento-grid-pro':
      return {
        ...baseData,
        USER_NAME: 'Sarah Chen',
        USER_TITLE: 'Creative Developer',
        USER_BIO:
          'Apple-inspired design with smooth animations and glassmorphism effects. Creating beautiful user experiences with modern web technologies.',
        USER_AVATAR: 'https://avatars.githubusercontent.com/u/3?v=4', // Different avatar for Bento theme
      };

    case 'terminal-master':
      return {
        ...baseData,
        USER_NAME: 'Marcus Rodriguez',
        USER_TITLE: 'Backend Engineer',
        USER_BIO:
          'Authentic terminal experience with typing animations and CRT effects. I live in the command line and love system programming.',
        USER_AVATAR: 'https://avatars.githubusercontent.com/u/4?v=4', // Different avatar for Terminal theme
      };

    case 'modern-developer':
      return {
        ...baseData,
        USER_NAME: 'Emma Johnson',
        USER_TITLE: 'Full Stack Engineer',
        USER_BIO:
          'Modern portfolio with 3D effects and interactive animations. Pushing the boundaries of web development with cutting-edge technologies.',
        USER_AVATAR: 'https://avatars.githubusercontent.com/u/5?v=4', // Different avatar for Modern theme
      };

    default:
      return baseData;
  }
}

export default async function TemplatePreviewPage({ params }: PreviewPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Validate template slug
  if (!isValidTemplateSlug(slug)) {
    notFound();
  }

  // Get template component
  const TemplateComponent = TEMPLATE_COMPONENTS[slug as keyof typeof TEMPLATE_COMPONENTS];

  if (!TemplateComponent) {
    notFound();
  }

  // Generate preview data
  const demoData = generatePreviewData(slug);

  return (
    <div className="template-preview">
      <TemplateComponent data={demoData} />
    </div>
  );
}

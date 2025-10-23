import { NextRequest, NextResponse } from 'next/server';
import { isValidTemplateSlug, getTemplateBySlug } from '@/config/templates';

/**
 * Template Preview API
 * Returns template metadata and preview URL
 * Used by dashboard to show template information
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateSlug = searchParams.get('template');

    if (!templateSlug) {
      return NextResponse.json({ error: 'Template parameter is required' }, { status: 400 });
    }

    // Validate template exists
    if (!isValidTemplateSlug(templateSlug)) {
      return NextResponse.json({ error: 'Invalid template slug' }, { status: 404 });
    }

    // Get template config
    const template = getTemplateBySlug(templateSlug);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Return preview URL for iframe
    const previewUrl = `/templates/preview/${templateSlug}`;

    return NextResponse.json({
      template: templateSlug,
      success: true,
      previewUrl,
      config: template,
    });
  } catch (error) {
    console.error('Template preview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Generate demo data for template preview
 */
function generatePreviewData(templateSlug: string) {
  const baseData = {
    USER_NAME: 'Demo User',
    USER_TITLE: 'Full Stack Developer',
    USER_BIO:
      'This is a preview of how your portfolio will look with real data from your GitHub profile.',
    USER_MISSION_STATEMENT: 'Building amazing web applications that make a difference.',
    USER_AVATAR: '/YO.svg',
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
        USER_NAME: 'GitHub Developer',
        USER_TITLE: 'Open Source Contributor',
        USER_BIO:
          'Clean and minimal portfolio inspired by GitHub README files. I love contributing to open source projects.',
      };

    case 'bento-grid-pro':
      return {
        ...baseData,
        USER_NAME: 'Modern Designer',
        USER_TITLE: 'Creative Developer',
        USER_BIO:
          'Apple-inspired design with smooth animations and glassmorphism effects. Creating beautiful user experiences.',
      };

    case 'terminal-master':
      return {
        ...baseData,
        USER_NAME: 'Terminal Hacker',
        USER_TITLE: 'Backend Engineer',
        USER_BIO:
          'Authentic terminal experience with typing animations and CRT effects. I live in the command line.',
      };

    case 'modern-developer':
      return {
        ...baseData,
        USER_NAME: 'Creative Developer',
        USER_TITLE: 'Full Stack Engineer',
        USER_BIO:
          'Modern portfolio with 3D effects and interactive animations. Pushing the boundaries of web development.',
      };

    default:
      return baseData;
  }
}

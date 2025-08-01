import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { GitHubService } from '@/lib/github';
import * as Sentry from '@sentry/nextjs';
import { Session } from 'next-auth';
import type { SessionUser } from '@/types/auth';

export async function GET() {
  let session: Session | null = null;

  try {
    // Demo mode kontrolü
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    if (demoMode) {
      // Demo mode - mock repos döndür
      const mockRepos = [
        {
          id: 1,
          name: 'e-commerce-app',
          description: 'Modern React e-commerce application',
          html_url: 'https://github.com/testuser/e-commerce-app',
          language: 'TypeScript',
          stargazers_count: 42,
          forks_count: 12,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-12-20T15:45:00Z',
          topics: ['react', 'nextjs', 'ecommerce'],
          homepage: 'https://my-shop.vercel.app',
        },
        {
          id: 2,
          name: 'task-manager-api',
          description: 'RESTful API for task management',
          html_url: 'https://github.com/testuser/task-manager-api',
          language: 'JavaScript',
          stargazers_count: 18,
          forks_count: 5,
          created_at: '2024-02-10T08:20:00Z',
          updated_at: '2024-11-30T12:15:00Z',
          topics: ['nodejs', 'express', 'mongodb'],
          homepage: null,
        },
      ];

      return NextResponse.json({
        repos: mockRepos,
        success: true,
        count: mockRepos.length,
      });
    }

    // Gerçek mode - session kontrolü
    session = await getServerSession(authOptions);

    const user = session?.user as SessionUser | undefined;
    if (!session || !user?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in again' }, { status: 401 });
    }

    const githubService = new GitHubService(user.accessToken);
    const repos = await githubService.getUserRepos();

    return NextResponse.json({
      repos,
      success: true,
      count: repos.length,
    });
  } catch (error) {
    // Capture error in Sentry with context
    Sentry.captureException(error, {
      tags: {
        api: 'github-repos',
        endpoint: '/api/github/repos',
      },
      extra: {
        userEmail: (session?.user as SessionUser)?.email,
        hasAccessToken: !!(session?.user as SessionUser)?.accessToken,
        timestamp: new Date().toISOString(),
      },
    });

    // Handle specific GitHub API errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('401') || errorMessage.includes('authentication failed')) {
        return NextResponse.json(
          {
            error: 'GitHub token expired - Please sign out and sign in again',
            code: 'AUTH_EXPIRED',
          },
          { status: 401 },
        );
      } else if (errorMessage.includes('403') || errorMessage.includes('rate limit')) {
        return NextResponse.json(
          {
            error: 'GitHub API rate limit exceeded - Please wait a few minutes and try again',
            code: 'RATE_LIMIT',
            retryAfter: 300, // 5 dakika
          },
          { status: 429 }, // 429 Too Many Requests
        );
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return NextResponse.json(
          {
            error: 'Network error - Please check your connection',
            code: 'NETWORK_ERROR',
          },
          { status: 503 },
        );
      } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        return NextResponse.json(
          {
            error: 'GitHub user not found or no access to repositories',
            code: 'NOT_FOUND',
          },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch repositories from GitHub',
        code: 'UNKNOWN_ERROR',
      },
      { status: 500 },
    );
  }
}

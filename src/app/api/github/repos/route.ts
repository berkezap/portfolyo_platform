import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { GitHubService } from '@/lib/github'
import * as Sentry from '@sentry/nextjs'

export async function GET() {
  let session: any = null
  
  try {
    session = await getServerSession(authOptions)
    
    if (!session || !session.user?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in again' }, 
        { status: 401 }
      )
    }

    const githubService = new GitHubService(session.user.accessToken)
    const repos = await githubService.getUserRepos()
    
    return NextResponse.json({ 
      repos,
      success: true,
      count: repos.length 
    })
    
  } catch (error) {
    // Capture error in Sentry with context
    Sentry.captureException(error, {
      tags: {
        api: 'github-repos',
        endpoint: '/api/github/repos'
      },
      extra: {
        userEmail: session?.user?.email,
        hasAccessToken: !!session?.user?.accessToken,
        timestamp: new Date().toISOString()
      }
    })
    
    // Handle specific GitHub API errors
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        return NextResponse.json(
          { error: 'GitHub token expired - Please sign out and sign in again' },
          { status: 401 }
        )
      } else if (error.message.includes('403')) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded - Please try again later' },
          { status: 403 }
        )
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Network error - Please check your connection' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch repositories from GitHub' }, 
      { status: 500 }
    )
  }
} 
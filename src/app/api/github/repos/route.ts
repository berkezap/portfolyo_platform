import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { GitHubService } from '@/lib/github'
import * as Sentry from '@sentry/nextjs'

export async function GET() {
  let session: any = null // TODO: Proper type from next-auth
  
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
      const errorMessage = error.message.toLowerCase()
      
      if (errorMessage.includes('401') || errorMessage.includes('authentication failed')) {
        return NextResponse.json(
          { 
            error: 'GitHub token expired - Please sign out and sign in again',
            code: 'AUTH_EXPIRED'
          },
          { status: 401 }
        )
      } else if (errorMessage.includes('403') || errorMessage.includes('rate limit')) {
        return NextResponse.json(
          { 
            error: 'GitHub API rate limit exceeded - Please wait a few minutes and try again',
            code: 'RATE_LIMIT',
            retryAfter: 300 // 5 dakika
          },
          { status: 429 } // 429 Too Many Requests
        )
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return NextResponse.json(
          { 
            error: 'Network error - Please check your connection',
            code: 'NETWORK_ERROR'
          },
          { status: 503 }
        )
      } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        return NextResponse.json(
          { 
            error: 'GitHub user not found or no access to repositories',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch repositories from GitHub',
        code: 'UNKNOWN_ERROR'
      }, 
      { status: 500 }
    )
  }
} 
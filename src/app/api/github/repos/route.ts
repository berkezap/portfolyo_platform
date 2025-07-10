import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { GitHubService } from '@/lib/github'
import * as Sentry from '@sentry/nextjs'

export async function GET() {
  console.log('🔗 GitHub Repos API endpoint hit')
  
  let session: any = null
  
  try {
    session = await getServerSession(authOptions)
    console.log('📋 Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      hasAccessToken: !!session?.user?.accessToken
    })
    
    if (!session || !session.user?.accessToken) {
      console.log('❌ No session or access token')
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in again' }, 
        { status: 401 }
      )
    }

    console.log('🔑 Creating GitHub service with access token')
    const githubService = new GitHubService(session.user.accessToken)
    
    console.log('📡 Fetching repos from GitHub API...')
    const repos = await githubService.getUserRepos()
    
    console.log('✅ GitHub API response:', {
      repoCount: repos.length,
      firstRepo: repos[0]?.name || 'none',
      sampleRepos: repos.slice(0, 3).map(r => ({ name: r.name, language: r.language }))
    })
    
    return NextResponse.json({ 
      repos,
      success: true,
      count: repos.length 
    })
    
  } catch (error) {
    console.error('💥 GitHub API Error:', error)
    
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
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3)
      })
      
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
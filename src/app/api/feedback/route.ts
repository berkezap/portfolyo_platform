import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    const { rating, feedback, type, page } = body

    // Validate feedback data
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
    }

    // Store feedback in Supabase
    const { data, error } = await supabase
      .from('user_feedback')
      .insert({
        user_id: session?.user?.email || 'anonymous',
        session_id: body.sessionId || 'unknown',
        feedback_type: type || 'general',
        rating: rating,
        feedback_text: feedback || '',
        page_url: page || '/',
        user_agent: request.headers.get('user-agent') || ''
      })

    if (error) {
      console.error('Feedback storage error:', error)
      Sentry.captureException(error)
      return NextResponse.json({ error: 'Failed to store feedback' }, { status: 500 })
    }

    // Track feedback event
    Sentry.addBreadcrumb({
      category: 'feedback',
      message: `User feedback submitted: ${rating}/5 stars`,
      level: 'info',
      data: {
        rating,
        type,
        page,
        hasFeedback: !!feedback
      }
    })

    return NextResponse.json({ success: true, stored: data })
  } catch (error) {
    console.error('Feedback API error:', error)
    Sentry.captureException(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const type = searchParams.get('type')

    let query = supabase
      .from('user_feedback')
      .select('*')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .eq('user_id', session.user?.email)
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('feedback_type', type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Feedback fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Feedback GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
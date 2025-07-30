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
    const body = await request.json()
    const { sessionId, userId, events } = body

    // Store analytics data in Supabase
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        session_id: sessionId,
        user_id: userId,
        events: events,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Analytics storage error:', error)
      Sentry.captureException(error)
      return NextResponse.json({ error: 'Failed to store analytics' }, { status: 500 })
    }

    return NextResponse.json({ success: true, stored: data })
  } catch (error) {
    console.error('Analytics API error:', error)
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
    const days = parseInt(searchParams.get('days') || '7')
    const userId = searchParams.get('userId')

    // Get analytics data
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .eq('user_id', userId || session.user?.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Analytics fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
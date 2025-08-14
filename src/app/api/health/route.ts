import { NextResponse } from 'next/server'
import { cacheService } from '@/lib/redis'
import { createClient } from '@supabase/supabase-js'

// Node runtime (DB ping uses server key if present). Keep lightweight.
export const runtime = 'nodejs'

export async function GET() {
  const startTime = Date.now()
  const checks: Record<string, string> = {}

  // Database health check
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )
    
    const { error } = await supabase
      .from('portfolios')
      .select('id')
      .limit(1)
    
    checks.db = error ? 'fail' : 'ok'
  } catch (error) {
    console.error('Health check DB error:', error)
    checks.db = 'fail'
  }

  // Cache health check
  try {
    const result = await cacheService.healthCheck()
    checks.cache = result ? 'ok' : 'fail'
  } catch (error) {
    console.error('Health check cache error:', error)
    checks.cache = 'fail'
  }

  // Redis specific check (if available)
  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      // Simple ping to Redis
      const testKey = `health:${Date.now()}`
      await cacheService.set(testKey, 'ping', 5) // 5 second TTL
      const value = await cacheService.get(testKey)
      checks.redis = value === 'ping' ? 'ok' : 'fail'
      await cacheService.delete(testKey)
    } else {
      checks.redis = 'not_configured'
    }
  } catch (error) {
    console.error('Health check Redis error:', error)
    checks.redis = 'fail'
  }

  const healthData = {
    status: Object.values(checks).every(status => status === 'ok' || status === 'not_configured') ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? 'unknown',
    uptime: {
      seconds: Math.floor(process.uptime()),
      human: formatUptime(process.uptime())
    },
    checks,
    responseTime: Date.now() - startTime,
    environment: process.env.NODE_ENV ?? 'unknown',
  }

  const httpStatus = healthData.status === 'ok' ? 200 : 503
  
  return NextResponse.json(healthData, { 
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  })
}

function formatUptime(uptimeSeconds: number): string {
  const days = Math.floor(uptimeSeconds / 86400)
  const hours = Math.floor((uptimeSeconds % 86400) / 3600)
  const minutes = Math.floor((uptimeSeconds % 3600) / 60)
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

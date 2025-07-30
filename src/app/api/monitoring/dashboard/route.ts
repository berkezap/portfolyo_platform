import { NextRequest, NextResponse } from 'next/server'
import { monitoringService } from '@/lib/monitoring'
import { cacheService } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    
    // Get all monitoring data
    const [performanceStats, errorStats, healthCheck, cacheStats] = await Promise.all([
      monitoringService.getPerformanceStats(date),
      monitoringService.getErrorStats(date),
      monitoringService.healthCheck(),
      cacheService.getStats()
    ])

    return NextResponse.json({
      success: true,
      data: {
        performance: performanceStats,
        errors: errorStats,
        health: healthCheck,
        cache: cacheStats,
        timestamp: new Date().toISOString(),
        date: date
      }
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    )
  }
} 
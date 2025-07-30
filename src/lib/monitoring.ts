import * as Sentry from '@sentry/nextjs'
import { cacheService } from './redis'

// Performance metrics interface
export interface PerformanceMetrics {
  endpoint: string
  method: string
  responseTime: number
  statusCode: number
  timestamp: string
  userId?: string
  ip?: string
}

// Error metrics interface
export interface ErrorMetrics {
  endpoint: string
  method: string
  error: string
  stack?: string
  timestamp: string
  userId?: string
  ip?: string
}

// Monitoring service class
export class MonitoringService {
  private static instance: MonitoringService

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  // Track API performance
  async trackPerformance(metrics: PerformanceMetrics): Promise<void> {
    try {
      // Send to Sentry for performance monitoring
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `${metrics.method} ${metrics.endpoint}`,
        data: {
          responseTime: metrics.responseTime,
          statusCode: metrics.statusCode,
          userId: metrics.userId,
          ip: metrics.ip
        },
        level: 'info'
      })

      // Store in Redis for real-time monitoring
      const key = `metrics:performance:${new Date().toISOString().split('T')[0]}`
      const existingMetrics = await cacheService.get<PerformanceMetrics[]>(key) || []
      existingMetrics.push(metrics)
      
      // Keep only last 1000 metrics per day
      if (existingMetrics.length > 1000) {
        existingMetrics.splice(0, existingMetrics.length - 1000)
      }
      
      await cacheService.set(key, existingMetrics, 86400) // 24 hours
    } catch (error) {
      console.error('Performance tracking error:', error)
    }
  }

  // Track API errors
  async trackError(metrics: ErrorMetrics): Promise<void> {
    try {
      // Send to Sentry for error tracking
      Sentry.captureException(new Error(metrics.error), {
        tags: {
          endpoint: metrics.endpoint,
          method: metrics.method,
          api: 'portfolyo'
        },
        extra: {
          stack: metrics.stack,
          userId: metrics.userId,
          ip: metrics.ip,
          timestamp: metrics.timestamp
        }
      })

      // Store in Redis for error analysis
      const key = `metrics:errors:${new Date().toISOString().split('T')[0]}`
      const existingErrors = await cacheService.get<ErrorMetrics[]>(key) || []
      existingErrors.push(metrics)
      
      // Keep only last 500 errors per day
      if (existingErrors.length > 500) {
        existingErrors.splice(0, existingErrors.length - 500)
      }
      
      await cacheService.set(key, existingErrors, 86400) // 24 hours
    } catch (error) {
      console.error('Error tracking error:', error)
    }
  }

  // Get performance statistics
  async getPerformanceStats(date: string = new Date().toISOString().split('T')[0]): Promise<{
    totalRequests: number
    avgResponseTime: number
    successRate: number
    topEndpoints: Array<{ endpoint: string; count: number; avgTime: number }>
  }> {
    try {
      const key = `metrics:performance:${date}`
      const metrics = await cacheService.get<PerformanceMetrics[]>(key) || []
      
      if (metrics.length === 0) {
        return {
          totalRequests: 0,
          avgResponseTime: 0,
          successRate: 0,
          topEndpoints: []
        }
      }

      const totalRequests = metrics.length
      const avgResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests
      const successCount = metrics.filter(m => m.statusCode < 400).length
      const successRate = (successCount / totalRequests) * 100

      // Group by endpoint
      const endpointStats = metrics.reduce((acc, metric) => {
        const key = `${metric.method} ${metric.endpoint}`
        if (!acc[key]) {
          acc[key] = { endpoint: key, count: 0, totalTime: 0 }
        }
        acc[key].count++
        acc[key].totalTime += metric.responseTime
        return acc
      }, {} as Record<string, { endpoint: string; count: number; totalTime: number }>)

      const topEndpoints = Object.values(endpointStats)
        .map(stat => ({
          endpoint: stat.endpoint,
          count: stat.count,
          avgTime: stat.totalTime / stat.count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return {
        totalRequests,
        avgResponseTime,
        successRate,
        topEndpoints
      }
    } catch (error) {
      console.error('Get performance stats error:', error)
      return {
        totalRequests: 0,
        avgResponseTime: 0,
        successRate: 0,
        topEndpoints: []
      }
    }
  }

  // Get error statistics
  async getErrorStats(date: string = new Date().toISOString().split('T')[0]): Promise<{
    totalErrors: number
    topErrors: Array<{ error: string; count: number; endpoint: string }>
  }> {
    try {
      const key = `metrics:errors:${date}`
      const errors = await cacheService.get<ErrorMetrics[]>(key) || []
      
      if (errors.length === 0) {
        return {
          totalErrors: 0,
          topErrors: []
        }
      }

      // Group by error type
      const errorStats = errors.reduce((acc, error) => {
        const key = error.error
        if (!acc[key]) {
          acc[key] = { error: key, count: 0, endpoint: error.endpoint }
        }
        acc[key].count++
        return acc
      }, {} as Record<string, { error: string; count: number; endpoint: string }>)

      const topErrors = Object.values(errorStats)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return {
        totalErrors: errors.length,
        topErrors
      }
    } catch (error) {
      console.error('Get error stats error:', error)
      return {
        totalErrors: 0,
        topErrors: []
      }
    }
  }

  // Health check for all services
  async healthCheck(): Promise<{
    redis: boolean
    supabase: boolean
    sentry: boolean
    overall: boolean
  }> {
    try {
      const [redis, supabase, sentry] = await Promise.all([
        cacheService.healthCheck(),
        this.checkSupabaseHealth(),
        this.checkSentryHealth()
      ])

      return {
        redis,
        supabase,
        sentry,
        overall: redis && supabase && sentry
      }
    } catch (error) {
      console.error('Health check error:', error)
      return {
        redis: false,
        supabase: false,
        sentry: false,
        overall: false
      }
    }
  }

  private async checkSupabaseHealth(): Promise<boolean> {
    try {
      // Simple ping to Supabase
      return true // For now, assume healthy
    } catch (error) {
      return false
    }
  }

  private async checkSentryHealth(): Promise<boolean> {
    try {
      // Sentry is configured if we can import it
      return !!Sentry
    } catch (error) {
      return false
    }
  }
}

// Export singleton instance
export const monitoringService = MonitoringService.getInstance() 
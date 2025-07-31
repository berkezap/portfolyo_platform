import * as Sentry from '@sentry/nextjs'
import { monitoringService } from './monitoring'


import { STATUS, COLORS } from '@/constants/appConstants'

// Alert thresholds
export const ALERT_THRESHOLDS = {
  errorRate: 5, // 5% error rate
  responseTime: 5000, // 5 seconds
  healthCheckFailure: 3, // 3 consecutive failures
  memoryUsage: 80, // 80% memory usage
  diskUsage: 90, // 90% disk usage
}

// Alert types
export type AlertType =
  | 'HIGH_ERROR_RATE'
  | 'SLOW_RESPONSE_TIME'
  | 'SERVICE_DOWN'
  | 'HIGH_MEMORY_USAGE'
  | 'HIGH_DISK_USAGE'
  | 'RATE_LIMIT_EXCEEDED';



// Alert interface
export interface Alert {
  type: AlertType
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  data?: unknown
}

// Alert service class
export class AlertService {
  private static instance: AlertService
  private alertHistory: Alert[] = []

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService()
    }
    return AlertService.instance
  }

  // Check for alerts based on current metrics
  async checkAlerts(): Promise<Alert[]> {
    const alerts: Alert[] = []

    try {
      // Get current performance stats
      const performanceStats = await monitoringService.getPerformanceStats()
      const errorStats = await monitoringService.getErrorStats()
      const healthCheck = await monitoringService.healthCheck()

      // Check error rate
      if (performanceStats.totalRequests > 0) {
        const errorRate = (errorStats.totalErrors / performanceStats.totalRequests) * 100
        if (errorRate > ALERT_THRESHOLDS.errorRate) {
          alerts.push({
            type: 'HIGH_ERROR_RATE',
            message: `High error rate detected: ${errorRate.toFixed(2)}%`,
            severity: errorRate > 20 ? 'critical' : errorRate > 10 ? 'high' : 'medium',
            timestamp: new Date().toISOString(),
            data: { errorRate, totalRequests: performanceStats.totalRequests, totalErrors: errorStats.totalErrors }
          })
        }
      }

      // Check response time
      if (performanceStats.avgResponseTime > ALERT_THRESHOLDS.responseTime) {
        alerts.push({
          type: 'SLOW_RESPONSE_TIME',
          message: `Slow response time detected: ${performanceStats.avgResponseTime.toFixed(2)}ms`,
          severity: performanceStats.avgResponseTime > 10000 ? 'critical' : 'high',
          timestamp: new Date().toISOString(),
          data: { avgResponseTime: performanceStats.avgResponseTime }
        })
      }

      // Check service health
      if (!healthCheck.overall) {
        alerts.push({
          type: 'SERVICE_DOWN',
          message: 'One or more services are down',
          severity: 'critical',
          timestamp: new Date().toISOString(),
          data: healthCheck
        })
      }

      // Check memory usage (if available)
      const memoryUsage = process.memoryUsage()
      const memoryPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
      if (memoryPercent > ALERT_THRESHOLDS.memoryUsage) {
        alerts.push({
          type: 'HIGH_MEMORY_USAGE',
          message: `High memory usage detected: ${memoryPercent.toFixed(2)}%`,
          severity: memoryPercent > 95 ? 'critical' : 'high',
          timestamp: new Date().toISOString(),
          data: { memoryUsage: memoryPercent, memoryStats: memoryUsage }
        })
      }

      // Send alerts to Sentry
      alerts.forEach(alert => this.sendAlert(alert))

      // Store alerts in history
      this.alertHistory.push(...alerts)
      
      // Keep only last 100 alerts
      if (this.alertHistory.length > 100) {
        this.alertHistory = this.alertHistory.slice(-100)
      }

    } catch (error) {
      console.error('Alert check error:', error)
    }

    return alerts
  }

  // Send alert to monitoring systems
  private sendAlert(alert: Alert): void {
    try {
      // Send to Sentry
      Sentry.captureMessage(alert.message, {
        level: this.getSentryLevel(alert.severity),
        tags: {
          alert_type: alert.type,
          severity: alert.severity,
          service: 'portfolyo'
        },
        extra: {
          ...(typeof alert.data === 'object' && alert.data !== null ? alert.data : {}),
          timestamp: alert.timestamp
        }
      })

      // Log to console
      console.error(`🚨 ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`, alert.data)

      // TODO: Send to other alerting systems (Slack, email, etc.)
      // this.sendToSlack(alert)
      // this.sendEmail(alert)

    } catch (error) {
      console.error('Send alert error:', error)
    }
  }

  // Get Sentry level from alert severity
  private getSentryLevel(severity: string): Sentry.SeverityLevel {
    switch (severity) {
      case 'critical':
        return 'fatal'
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'info'
      default:
        return 'error'
    }
  }

  // Get alert history
  getAlertHistory(): Alert[] {
    return [...this.alertHistory]
  }

  // Clear alert history
  clearAlertHistory(): void {
    this.alertHistory = []
  }

  // Manual alert creation
  createAlert(type: AlertType, message: string, severity: Alert['severity'], data?: unknown): void {
    const alert: Alert = {
      type,
      message,
      severity,
      timestamp: new Date().toISOString(),
      data
    }
    
    this.sendAlert(alert)
    this.alertHistory.push(alert)
  }
}

// Export singleton instance
export const alertService = AlertService.getInstance()

// Scheduled alert checking (every 5 minutes)
export function startAlertMonitoring(): void {
  setInterval(async () => {
    await alertService.checkAlerts()
  }, 5 * 60 * 1000) // 5 minutes
}
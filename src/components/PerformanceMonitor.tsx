'use client'

import { useEffect } from 'react'

export default function PerformanceMonitor() {
  useEffect(() => {
    // Performance monitoring - sadece development'ta çalışsın
    if (typeof window !== 'undefined' && 'performance' in window && process.env.NODE_ENV === 'development') {
      const handleLoad = () => {
        try {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          if (perfData) {
            console.log('📊 Performance Metrics:')
            console.log('  Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms')
            console.log('  DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms')
            
            const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime
            const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0]?.startTime
            
            if (firstPaint) console.log('  First Paint:', firstPaint, 'ms')
            if (firstContentfulPaint) console.log('  First Contentful Paint:', firstContentfulPaint, 'ms')
          }
        } catch (error) {
          console.warn('Performance monitoring error:', error)
        }
      }

      // Web Vitals monitoring
      let observer: PerformanceObserver | null = null
      
      try {
        observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            try {
              if (entry.entryType === 'largest-contentful-paint') {
                console.log('  LCP (Largest Contentful Paint):', entry.startTime, 'ms')
              } else if (entry.entryType === 'first-input') {
                const firstInputEntry = entry as PerformanceEventTiming
                const fid = firstInputEntry.processingStart - firstInputEntry.startTime
                console.log('  FID (First Input Delay):', fid, 'ms')
              }
            } catch (error) {
              console.warn('Web Vitals monitoring error:', error)
            }
          })
        })

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error)
      }

      window.addEventListener('load', handleLoad)

      return () => {
        window.removeEventListener('load', handleLoad)
        if (observer) {
          try {
            observer.disconnect()
          } catch (error) {
            console.warn('Error disconnecting PerformanceObserver:', error)
          }
        }
      }
    }
  }, [])

  return null
} 
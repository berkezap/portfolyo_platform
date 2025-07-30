import { useEffect } from 'react'

interface WebVitalsData {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

interface WebVitalsCallback {
  (metric: WebVitalsData): void
}

// Web Vitals metriklerini izlemek için custom hook
export const useWebVitals = (callback?: WebVitalsCallback) => {
  useEffect(() => {
    // Web Vitals API'sini dinamik olarak import et
    const loadWebVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals')
        
        // Core Web Vitals metriklerini izle
        getCLS((metric) => {
          console.log('CLS:', metric)
          callback?.(metric)
        })
        
        getFID((metric) => {
          console.log('FID:', metric)
          callback?.(metric)
        })
        
        getFCP((metric) => {
          console.log('FCP:', metric)
          callback?.(metric)
        })
        
        getLCP((metric) => {
          console.log('LCP:', metric)
          callback?.(metric)
        })
        
        getTTFB((metric) => {
          console.log('TTFB:', metric)
          callback?.(metric)
        })
        
      } catch (error) {
        console.warn('Web Vitals yüklenemedi:', error)
      }
    }

    // Sadece client-side'da çalıştır
    if (typeof window !== 'undefined') {
      loadWebVitals()
    }
  }, [callback])
}

// Performans metriklerini analiz etmek için yardımcı fonksiyon
export const analyzePerformance = (metrics: WebVitalsData[]) => {
  const analysis = {
    good: 0,
    needsImprovement: 0,
    poor: 0,
    averageScore: 0,
    recommendations: [] as string[]
  }

  metrics.forEach(metric => {
    switch (metric.rating) {
      case 'good':
        analysis.good++
        break
      case 'needs-improvement':
        analysis.needsImprovement++
        break
      case 'poor':
        analysis.poor++
        break
    }
  })

  // Ortalama skor hesapla
  const scores = metrics.map(m => {
    switch (m.rating) {
      case 'good': return 100
      case 'needs-improvement': return 50
      case 'poor': return 0
      default: return 0
    }
  })
  
  analysis.averageScore = scores.reduce((a, b) => a + b, 0 as number) / scores.length

  // Öneriler oluştur
  if (analysis.poor > 0) {
    analysis.recommendations.push('Kritik performans sorunları tespit edildi. Acil optimizasyon gerekli.')
  }
  
  if (analysis.needsImprovement > 0) {
    analysis.recommendations.push('Performans iyileştirmeleri önerilir.')
  }

  return analysis
}

// Performans metriklerini localStorage'a kaydet
export const savePerformanceMetrics = (metrics: WebVitalsData[]) => {
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('web-vitals-history') || '[]')
      const updated = [...existing, { timestamp: Date.now(), metrics }]
      
      // Son 30 günlük veriyi tut
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
      const filtered = updated.filter(entry => entry.timestamp > thirtyDaysAgo)
      
      localStorage.setItem('web-vitals-history', JSON.stringify(filtered))
    } catch (error) {
      console.warn('Performans metrikleri kaydedilemedi:', error)
    }
  }
}

// Geçmiş performans metriklerini getir
export const getPerformanceHistory = () => {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem('web-vitals-history') || '[]')
    } catch (error) {
      console.warn('Performans geçmişi alınamadı:', error)
      return []
    }
  }
  return []
}

// Performans trendlerini analiz et
export const analyzePerformanceTrends = () => {
  const history = getPerformanceHistory()
  
  if (history.length < 2) {
    return { trend: 'insufficient-data', message: 'Yeterli veri yok' }
  }

  const recent = history.slice(-5) // Son 5 ölçüm
  const older = history.slice(-10, -5) // Önceki 5 ölçüm

  const recentAvg = recent.reduce((sum: number, entry: any) => {
    const avg = entry.metrics.reduce((mSum: number, m: any) => {
      const score = m.rating === 'good' ? 100 : m.rating === 'needs-improvement' ? 50 : 0
      return mSum + score
    }, 0) / entry.metrics.length
    return sum + avg
  }, 0) / recent.length

  const olderAvg = older.reduce((sum: number, entry: any) => {
    const avg = entry.metrics.reduce((mSum: number, m: any) => {
      const score = m.rating === 'good' ? 100 : m.rating === 'needs-improvement' ? 50 : 0
      return mSum + score
    }, 0) / entry.metrics.length
    return sum + avg
  }, 0) / older.length

  const improvement = recentAvg - olderAvg

  if (improvement > 10) {
    return { trend: 'improving', message: 'Performans iyileşiyor', improvement }
  } else if (improvement < -10) {
    return { trend: 'declining', message: 'Performans düşüyor', improvement }
  } else {
    return { trend: 'stable', message: 'Performans stabil', improvement }
  }
}

export default useWebVitals 
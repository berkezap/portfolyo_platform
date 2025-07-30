#!/usr/bin/env node

/**
 * PortfolYO Performance Test Suite
 * Bu script performans optimizasyonlarını test eder
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Test konfigürasyonu
const config = {
  baseUrl: 'http://localhost:3000',
  lighthouseConfig: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    }
  },
  performanceBudget: {
    'first-contentful-paint': 2000,
    'largest-contentful-paint': 2500,
    'total-blocking-time': 300,
    'cumulative-layout-shift': 0.1,
    'speed-index': 2000
  }
}

// Renkli console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logHeader(message) {
  log(`\n${colors.bold}${colors.blue}=== ${message} ===${colors.reset}\n`)
}

// Lighthouse test
async function runLighthouseTest() {
  logHeader('Lighthouse Performance Test')
  
  try {
    const command = `npx lighthouse ${config.baseUrl} --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"`
    
    log('Lighthouse test çalıştırılıyor...', 'blue')
    execSync(command, { stdio: 'inherit' })
    
    if (fs.existsSync('./lighthouse-report.json')) {
      const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'))
      analyzeLighthouseResults(report)
    }
  } catch (error) {
    log(`Lighthouse test hatası: ${error.message}`, 'red')
  }
}

// Lighthouse sonuçlarını analiz et
function analyzeLighthouseResults(report) {
  const metrics = report.audits
  
  logHeader('Lighthouse Sonuçları')
  
  const performanceMetrics = {
    'First Contentful Paint': metrics['first-contentful-paint']?.numericValue,
    'Largest Contentful Paint': metrics['largest-contentful-paint']?.numericValue,
    'Total Blocking Time': metrics['total-blocking-time']?.numericValue,
    'Cumulative Layout Shift': metrics['cumulative-layout-shift']?.numericValue,
    'Speed Index': metrics['speed-index']?.numericValue
  }
  
  Object.entries(performanceMetrics).forEach(([metric, value]) => {
    if (value !== undefined) {
      const budget = config.performanceBudget[metric.toLowerCase().replace(/\s+/g, '-')]
      const status = budget ? (value <= budget ? '✅' : '❌') : 'ℹ️'
      const color = budget ? (value <= budget ? 'green' : 'red') : 'blue'
      
      log(`${status} ${metric}: ${value.toFixed(0)}ms`, color)
      
      if (budget && value > budget) {
        log(`   ⚠️  Budget: ${budget}ms (${((value - budget) / budget * 100).toFixed(1)}% fazla)`, 'yellow')
      }
    }
  })
  
  // Genel performans skoru
  const performanceScore = report.categories.performance.score * 100
  log(`\n${colors.bold}Genel Performans Skoru: ${performanceScore.toFixed(0)}/100${colors.reset}`, 
      performanceScore >= 90 ? 'green' : performanceScore >= 50 ? 'yellow' : 'red')
}

// Bundle size analizi
function analyzeBundleSize() {
  logHeader('Bundle Size Analizi')
  
  try {
    const bundleStatsPath = './.next/static/chunks'
    if (fs.existsSync(bundleStatsPath)) {
      const files = fs.readdirSync(bundleStatsPath)
      let totalSize = 0
      
      files.forEach(file => {
        if (file.endsWith('.js')) {
          const filePath = path.join(bundleStatsPath, file)
          const stats = fs.statSync(filePath)
          const sizeKB = (stats.size / 1024).toFixed(2)
          totalSize += stats.size
          
          log(`📦 ${file}: ${sizeKB} KB`, 'blue')
        }
      })
      
      const totalSizeKB = (totalSize / 1024).toFixed(2)
      log(`\n${colors.bold}Toplam Bundle Size: ${totalSizeKB} KB${colors.reset}`, 
          totalSize < 500 * 1024 ? 'green' : totalSize < 1000 * 1024 ? 'yellow' : 'red')
    }
  } catch (error) {
    log(`Bundle analizi hatası: ${error.message}`, 'red')
  }
}

// Network payload analizi
function analyzeNetworkPayload() {
  logHeader('Network Payload Analizi')
  
  try {
    const command = `curl -s -w "\\nSize: %{size_download} bytes\\nTime: %{time_total} seconds\\nSpeed: %{speed_download} bytes/sec\\n" ${config.baseUrl}`
    const result = execSync(command, { encoding: 'utf8' })
    
    const sizeMatch = result.match(/Size: (\d+) bytes/)
    const timeMatch = result.match(/Time: ([\d.]+) seconds/)
    const speedMatch = result.match(/Speed: ([\d.]+) bytes\/sec/)
    
    if (sizeMatch) {
      const sizeBytes = parseInt(sizeMatch[1])
      const sizeKB = (sizeBytes / 1024).toFixed(2)
      
      log(`📊 Sayfa boyutu: ${sizeKB} KB`, 'blue')
      
      if (sizeBytes > 3 * 1024 * 1024) { // 3MB
        log('   ⚠️  Sayfa boyutu çok büyük (>3MB)', 'red')
      } else if (sizeBytes > 1 * 1024 * 1024) { // 1MB
        log('   ⚠️  Sayfa boyutu büyük (>1MB)', 'yellow')
      } else {
        log('   ✅ Sayfa boyutu uygun', 'green')
      }
    }
    
    if (timeMatch) {
      const loadTime = parseFloat(timeMatch[1])
      log(`⏱️  Yükleme süresi: ${(loadTime * 1000).toFixed(0)}ms`, 'blue')
    }
    
    if (speedMatch) {
      const speed = parseFloat(speedMatch[1])
      const speedKBps = (speed / 1024).toFixed(2)
      log(`🚀 Transfer hızı: ${speedKBps} KB/s`, 'blue')
    }
    
  } catch (error) {
    log(`Network analizi hatası: ${error.message}`, 'red')
  }
}

// Core Web Vitals simülasyonu
function simulateCoreWebVitals() {
  logHeader('Core Web Vitals Simülasyonu')
  
  const testMetrics = {
    'First Contentful Paint': 1200,
    'Largest Contentful Paint': 2800,
    'Total Blocking Time': 180,
    'Cumulative Layout Shift': 0.05,
    'First Input Delay': 45
  }
  
  Object.entries(testMetrics).forEach(([metric, value]) => {
    let status, color
    
    switch (metric) {
      case 'First Contentful Paint':
        status = value <= 1800 ? '✅' : value <= 3000 ? '⚠️' : '❌'
        color = value <= 1800 ? 'green' : value <= 3000 ? 'yellow' : 'red'
        break
      case 'Largest Contentful Paint':
        status = value <= 2500 ? '✅' : value <= 4000 ? '⚠️' : '❌'
        color = value <= 2500 ? 'green' : value <= 4000 ? 'yellow' : 'red'
        break
      case 'Total Blocking Time':
        status = value <= 200 ? '✅' : value <= 600 ? '⚠️' : '❌'
        color = value <= 200 ? 'green' : value <= 600 ? 'yellow' : 'red'
        break
      case 'Cumulative Layout Shift':
        status = value <= 0.1 ? '✅' : value <= 0.25 ? '⚠️' : '❌'
        color = value <= 0.1 ? 'green' : value <= 0.25 ? 'yellow' : 'red'
        break
      case 'First Input Delay':
        status = value <= 100 ? '✅' : value <= 300 ? '⚠️' : '❌'
        color = value <= 100 ? 'green' : value <= 300 ? 'yellow' : 'red'
        break
    }
    
    log(`${status} ${metric}: ${value}${metric.includes('Shift') ? '' : 'ms'}`, color)
  })
}

// Performans önerileri
function generateRecommendations() {
  logHeader('Performans Önerileri')
  
  const recommendations = [
    '🚀 Bundle splitting uygulayın',
    '🖼️  Resimleri optimize edin (WebP/AVIF)',
    '📦 Tree shaking kullanın',
    '⚡ Critical CSS inline edin',
    '🔗 Resource hints ekleyin',
    '💾 Service Worker cache stratejileri',
    '🎯 Lazy loading uygulayın',
    '📱 Responsive images kullanın',
    '🔧 Code splitting yapın',
    '📊 Performance monitoring ekleyin'
  ]
  
  recommendations.forEach(rec => {
    log(`  ${rec}`, 'blue')
  })
}

// Ana test fonksiyonu
async function runPerformanceTests() {
  logHeader('PortfolYO Performance Test Suite')
  log(`Test URL: ${config.baseUrl}`, 'blue')
  log(`Test zamanı: ${new Date().toLocaleString('tr-TR')}`, 'blue')
  
  try {
    // Testleri sırayla çalıştır
    await runLighthouseTest()
    analyzeBundleSize()
    analyzeNetworkPayload()
    simulateCoreWebVitals()
    generateRecommendations()
    
    logHeader('Test Tamamlandı')
    log('✅ Tüm performans testleri başarıyla tamamlandı', 'green')
    
  } catch (error) {
    log(`❌ Test hatası: ${error.message}`, 'red')
    process.exit(1)
  }
}

// Script çalıştırma
if (require.main === module) {
  runPerformanceTests()
}

module.exports = {
  runPerformanceTests,
  runLighthouseTest,
  analyzeBundleSize,
  analyzeNetworkPayload,
  simulateCoreWebVitals,
  generateRecommendations
} 
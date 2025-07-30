'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState('Loading...')

  useEffect(() => {
    // Performance test
    const startTime = performance.now()
    
    // Simulate some work
    setTimeout(() => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      setStatus(`✅ Test completed in ${duration.toFixed(2)}ms`)
      
      // Log performance metrics
      console.log('🧪 Test Page Performance:', {
        loadTime: duration,
        timestamp: new Date().toISOString()
      })
    }, 100)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🧪 Test Sayfası
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <strong>Durum:</strong> {status}
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              <strong>✅ Sentry:</strong> Çalışıyor
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800">
              <strong>📊 Performance Monitor:</strong> Aktif
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-purple-800">
              <strong>🔧 Build:</strong> Optimize edildi
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              console.log('🧪 Test button clicked')
              alert('Test başarılı! Console\'u kontrol edin.')
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Butonu
          </button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Browser console'da hata mesajlarını kontrol edin
        </div>
      </div>
    </div>
  )
} 
'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // State'i güncelle böylece fallback UI gösterilebilir
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Error reporting service'e gönderilebilir
    console.error('🔥 Error Boundary yakaladı:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI varsa onu kullan
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      // Default fallback UI
      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

// Default Error Fallback Component
function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bir Şeyler Ters Gitti</h1>
        <p className="text-gray-600 mb-2">
          Uygulama beklenmeyen bir hatayla karşılaştı.
        </p>
        
        {/* Development mode'da error detayları göster */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm text-red-800 font-medium mb-2">Hata Detayı:</p>
            <pre className="text-xs text-red-700 overflow-auto max-h-32">
              {error.message}
            </pre>
          </div>
        )}
        
        <div className="mt-8 space-y-4">
          <button
            onClick={resetError}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Tekrar Dene
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Ana Sayfaya Dön
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Sayfayı Yenile
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          Sorun devam ederse lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
        </div>
      </div>
    </div>
  )
}

// Specific Error Fallbacks for different contexts
export function DashboardErrorFallback({ resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Hatası</h3>
        <p className="text-gray-600 mb-4">
          Dashboard yüklenirken bir hata oluştu.
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Tekrar Dene
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Ana Sayfa
          </button>
        </div>
      </div>
    </div>
  )
}

export function PortfolioErrorFallback({ resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Hatası</h3>
        <p className="text-gray-600 mb-4">
          Portfolio işlemi sırasında bir hata oluştu.
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Tekrar Dene
          </button>
          <button
            onClick={() => window.location.href = '/my-portfolios'}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Portfolyolarım
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary 
import React from 'react'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

interface BrandComplianceProps {
  componentName: string
  checks: {
    name: string
    status: 'pass' | 'warning' | 'fail'
    description: string
  }[]
  className?: string
}

const BrandCompliance: React.FC<BrandComplianceProps> = ({
  componentName,
  checks,
  className = ''
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'fail':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const passCount = checks.filter(check => check.status === 'pass').length
  const totalCount = checks.length
  const complianceRate = Math.round((passCount / totalCount) * 100)

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Brand Compliance: {componentName}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {passCount}/{totalCount} passed
          </span>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                complianceRate >= 80 ? 'bg-green-500' : 
                complianceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${complianceRate}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {complianceRate}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {checks.map((check, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-md border ${getStatusColor(check.status)}`}
          >
            {getStatusIcon(check.status)}
            <div className="flex-1">
              <h4 className="text-sm font-medium">{check.name}</h4>
              <p className="text-xs mt-1 opacity-80">{check.description}</p>
            </div>
          </div>
        ))}
      </div>

      {complianceRate < 100 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Öneriler:</strong> Brand compliance oranını artırmak için yukarıdaki uyarıları düzeltin.
          </p>
        </div>
      )}
    </div>
  )
}

// Brand compliance checklist helper
export const brandComplianceChecks = {
  // Color compliance
  colors: [
    {
      name: 'Primary Color Usage',
      status: 'pass' as const,
      description: 'Ana marka rengi (Blue-600) doğru kullanılıyor'
    },
    {
      name: 'Semantic Colors',
      status: 'pass' as const,
      description: 'Success, warning, error renkleri doğru kullanılıyor'
    },
    {
      name: 'Contrast Ratios',
      status: 'pass' as const,
      description: 'WCAG AA standartlarına uygun kontrast oranları'
    }
  ],

  // Typography compliance
  typography: [
    {
      name: 'Font Family',
      status: 'pass' as const,
      description: 'Inter font ailesi kullanılıyor'
    },
    {
      name: 'Font Weights',
      status: 'pass' as const,
      description: 'Doğru font ağırlıkları kullanılıyor'
    },
    {
      name: 'Type Scale',
      status: 'pass' as const,
      description: 'Tutarlı tipografi ölçeği kullanılıyor'
    }
  ],

  // Spacing compliance
  spacing: [
    {
      name: 'Spacing System',
      status: 'pass' as const,
      description: '4px base unit spacing sistemi kullanılıyor'
    },
    {
      name: 'Consistent Margins',
      status: 'pass' as const,
      description: 'Tutarlı margin ve padding değerleri'
    }
  ],

  // Component compliance
  components: [
    {
      name: 'Button Hierarchy',
      status: 'pass' as const,
      description: 'Primary, secondary, destructive button hiyerarşisi'
    },
    {
      name: 'Card Design',
      status: 'pass' as const,
      description: 'Tutarlı card tasarımı ve hover efektleri'
    },
    {
      name: 'Icon Usage',
      status: 'pass' as const,
      description: 'Lucide React ikonları kullanılıyor'
    }
  ],

  // Accessibility compliance
  accessibility: [
    {
      name: 'Focus States',
      status: 'pass' as const,
      description: 'Tüm interactive elementlerde focus states var'
    },
    {
      name: 'Keyboard Navigation',
      status: 'pass' as const,
      description: 'Keyboard ile navigasyon mümkün'
    },
    {
      name: 'Screen Reader Support',
      status: 'pass' as const,
      description: 'Screen reader uyumlu alt text ve labels'
    }
  ]
}

export default BrandCompliance 
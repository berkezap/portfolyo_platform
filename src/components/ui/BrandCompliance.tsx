import React from 'react'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { STATUS, StatusType, STATUS_COLORS } from '../../constants/brandCompliance'

/**
 * BrandComplianceProps arayüzü
 */
interface BrandComplianceProps {
  componentName: string
  checks: {
    name: string
    status: StatusType
    description: string
  }[]
  className?: string
}

/**
 * BrandCompliance componenti, bir bileşenin marka uyumluluğu checklistini gösterir.
 * @param componentName - Bileşen adı
 * @param checks - Kontrol listesi
 * @param className - Ekstra stil sınıfı
 */
const BrandCompliance: React.FC<BrandComplianceProps> = ({
  componentName,
  checks,
  className = ''
}) => {
  /**
   * Duruma göre uygun ikonu döndürür.
   * @param status - Kontrol durumu
   */
  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case STATUS.PASS:
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case STATUS.WARNING:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case STATUS.FAIL:
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  /**
   * Duruma göre uygun renk sınıflarını döndürür.
   * @param status - Kontrol durumu
   */
  const getStatusColor = (status: StatusType) => {
    const color = STATUS_COLORS[status] || STATUS_COLORS.default
    return `${color.text} ${color.bg} ${color.border}`
  }

  const passCount = checks.filter(check => check.status === STATUS.PASS).length
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
                complianceRate >= 80
                  ? STATUS_COLORS[STATUS.PASS].bar
                  : complianceRate >= 60
                  ? STATUS_COLORS[STATUS.WARNING].bar
                  : STATUS_COLORS[STATUS.FAIL].bar
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
      status: STATUS.PASS,
      description: 'Ana marka rengi (Blue-600) doğru kullanılıyor'
    },
    {
      name: 'Semantic Colors',
      status: STATUS.PASS,
      description: 'Success, warning, error renkleri doğru kullanılıyor'
    },
    {
      name: 'Contrast Ratios',
      status: STATUS.PASS,
      description: 'WCAG AA standartlarına uygun kontrast oranları'
    }
  ],

  // Typography compliance
  typography: [
    {
      name: 'Font Family',
      status: STATUS.PASS,
      description: 'Inter font ailesi kullanılıyor'
    },
    {
      name: 'Font Weights',
      status: STATUS.PASS,
      description: 'Doğru font ağırlıkları kullanılıyor'
    },
    {
      name: 'Type Scale',
      status: STATUS.PASS,
      description: 'Tutarlı tipografi ölçeği kullanılıyor'
    }
  ],

  // Spacing compliance
  spacing: [
    {
      name: 'Spacing System',
      status: STATUS.PASS,
      description: '4px base unit spacing sistemi kullanılıyor'
    },
    {
      name: 'Consistent Margins',
      status: STATUS.PASS,
      description: 'Tutarlı margin ve padding değerleri'
    }
  ],

  // Component compliance
  components: [
    {
      name: 'Button Hierarchy',
      status: STATUS.PASS,
      description: 'Primary, secondary, destructive button hiyerarşisi'
    },
    {
      name: 'Card Design',
      status: STATUS.PASS,
      description: 'Tutarlı card tasarımı ve hover efektleri'
    },
    {
      name: 'Icon Usage',
      status: STATUS.PASS,
      description: 'Lucide React ikonları kullanılıyor'
    }
  ],

  // Accessibility compliance
  accessibility: [
    {
      name: 'Focus States',
      status: STATUS.PASS,
      description: 'Tüm interactive elementlerde focus states var'
    },
    {
      name: 'Keyboard Navigation',
      status: STATUS.PASS,
      description: 'Keyboard ile navigasyon mümkün'
    },
    {
      name: 'Screen Reader Support',
      status: STATUS.PASS,
      description: 'Screen reader uyumlu alt text ve labels'
    }
  ]
}

export default BrandCompliance
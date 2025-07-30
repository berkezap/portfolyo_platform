import React from 'react'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  actions?: React.ReactNode
  variant?: 'default' | 'hero' | 'minimal'
  className?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  actions,
  variant = 'default',
  className = ''
}) => {
  const baseClasses = 'mb-12'
  
  const variantClasses = {
    default: 'text-center',
    hero: 'text-center py-20',
    minimal: 'text-left'
  }

  const titleClasses = {
    default: 'text-3xl font-bold text-gray-900 tracking-tight mb-4',
    hero: 'text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6',
    minimal: 'text-2xl font-bold text-gray-900 tracking-tight mb-2'
  }

  const subtitleClasses = {
    default: 'text-gray-600 text-lg max-w-2xl mx-auto',
    hero: 'text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-12 leading-relaxed',
    minimal: 'text-gray-600 text-base'
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].join(' ')

  return (
    <div className={classes}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${variant === 'minimal' ? 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6' : ''}`}>
          <div className="space-y-2">
            {Icon && (
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-4 shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}
            <h1 className={titleClasses[variant]}>
              {title}
            </h1>
            {subtitle && (
              <p className={subtitleClasses[variant]}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageHeader 
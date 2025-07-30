import React from 'react'
import Image from 'next/image'

interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'dark'
  className?: string
  href?: string
}

const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  color = 'primary',
  className = '',
  href
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto',
  }

  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white',
    dark: 'text-gray-900',
  }

  const logoContent = () => {
    switch (variant) {
      case 'icon':
        return (
          <div className={`flex items-center gap-2 ${colorClasses[color]} ${className}`}>
            <div className={`${sizeClasses[size]} relative`}>
              <Image
                src="/docs/brand-identity/brand-assets/logos/portfolyo-icon.svg"
                alt="PortfolYO Icon"
                width={48}
                height={48}
                className="h-full w-full"
              />
            </div>
          </div>
        )
      
      case 'text':
        return (
          <div className={`flex items-center ${colorClasses[color]} ${className}`}>
            <span className={`font-bold tracking-tight ${sizeClasses[size]}`}>
              PortfolYO
            </span>
          </div>
        )
      
      case 'full':
      default:
        return (
          <div className={`flex items-center gap-2 ${colorClasses[color]} ${className}`}>
            <div className={`${sizeClasses[size]} relative`}>
              <Image
                src="/docs/brand-identity/brand-assets/logos/portfolyo-logo.svg"
                alt="PortfolYO Logo"
                width={200}
                height={48}
                className="h-full w-full"
              />
            </div>
          </div>
        )
    }
  }

  if (href) {
    return (
      <a href={href} className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded">
        {logoContent()}
      </a>
    )
  }

  return logoContent()
}

export default Logo 
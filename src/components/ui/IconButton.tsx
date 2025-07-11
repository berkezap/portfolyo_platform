import React from 'react'
import { LucideIcon } from 'lucide-react'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  variant?: 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  title?: string
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  variant = 'secondary',
  size = 'md',
  loading = false,
  title,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    destructive: 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600 focus:ring-red-500'
  }
  
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3'
  }
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].join(' ')
  
  const iconClasses = iconSizeClasses[size]
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      title={title}
      {...props}
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconClasses}`} />
      ) : (
        <Icon className={iconClasses} />
      )}
    </button>
  )
}

export default IconButton 
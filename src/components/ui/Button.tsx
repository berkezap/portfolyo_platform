import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'gradient' | 'gradient-blue' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl hover-lift',
    secondary: 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-500 shadow-sm hover:shadow-md hover-lift',
    destructive: 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600 focus:ring-red-500',
    gradient: 'gradient-brand text-white shadow-lg hover:shadow-xl focus:ring-blue-500 hover-lift',
    'gradient-blue': 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 hover-lift',
    glass: 'glass-button text-gray-900 hover:bg-white/20 focus:ring-blue-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
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
      {...props}
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconClasses} mr-2`} />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={`${iconClasses} mr-2`} />
      ) : null}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading ? (
        <Icon className={`${iconClasses} ml-2`} />
      ) : null}
    </button>
  )
}

export default Button 
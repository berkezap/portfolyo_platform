import React from 'react'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'portfolio' | 'glass' | 'gradient'
  className?: string
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick
}) => {
  const baseClasses = 'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
  
  const variantClasses = {
    default: 'bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md',
    portfolio: 'bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-xl cursor-pointer float-card',
    glass: 'glass rounded-2xl p-6 cursor-pointer float-card',
    gradient: 'gradient-brand text-white rounded-2xl p-6 shadow-xl float-card'
  }
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].join(' ')
  
  return (
    <div 
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

export default Card 
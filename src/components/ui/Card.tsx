import React from 'react'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'portfolio'
  className?: string
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick
}) => {
  const baseClasses = 'bg-white border border-gray-200 rounded-lg transition-all duration-200'
  
  const variantClasses = {
    default: 'p-6 shadow-sm',
    portfolio: 'p-6 rounded-xl hover:border-gray-300 hover:shadow-lg cursor-pointer'
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
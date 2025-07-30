import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
  as: Component = 'div'
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl', 
    lg: 'max-w-7xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  }

  const classes = [
    'mx-auto px-4 sm:px-6 lg:px-8',
    sizeClasses[size],
    className
  ].join(' ')

  return (
    <Component className={classes}>
      {children}
    </Component>
  )
}

export default Container 
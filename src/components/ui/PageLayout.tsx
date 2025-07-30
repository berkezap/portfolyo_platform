import React from 'react'
import AppHeader from './AppHeader'

interface PageLayoutProps {
  children: React.ReactNode
  headerVariant?: 'home' | 'dashboard' | 'portfolio'
  demoMode?: boolean
  showAuth?: boolean
  background?: 'gradient' | 'solid' | 'glass'
  className?: string
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  headerVariant = 'home',
  demoMode = false,
  showAuth = true,
  background = 'gradient',
  className = ''
}) => {
  const backgroundClasses = {
    gradient: 'bg-gradient-to-br from-gray-50 via-white to-blue-50',
    solid: 'bg-white',
    glass: 'bg-gray-50'
  }

  return (
    <div className={`min-h-screen flex flex-col ${backgroundClasses[background]} ${className}`}>
      <AppHeader 
        variant={headerVariant}
        demoMode={demoMode}
        showAuth={showAuth}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

export default PageLayout 
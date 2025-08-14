import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from './ButtonNew'

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText?: string
  ctaAction?: () => void
  background?: 'gradient' | 'glass' | 'solid'
  className?: string
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText = "Başlayın",
  ctaAction,
  background = 'gradient',
  className = ''
}) => {
  const backgroundClasses = {
    gradient: 'gradient-hero text-white',
    glass: 'glass text-gray-900',
    solid: 'bg-blue-600 text-white'
  }

  return (
    <section className={`relative overflow-hidden pt-20 pb-16 mt-8 ${backgroundClasses[background]} ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center">
          {/* Sparkle Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 smooth-fade">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8 leading-relaxed smooth-fade animation-delay-200">
            {subtitle}
          </p>

          {/* CTA Button */}
          {ctaAction && (
            <div className="smooth-fade animation-delay-400">
              <Button
                variant="glass"
                size="xl"
                icon={ArrowRight}
                iconPosition="right"
                onClick={ctaAction}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {ctaText}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-white rounded-full animate-bounce"></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-white/50 rounded-full animate-bounce animation-delay-1000"></div>
      <div className="absolute bottom-1/4 left-20 w-1 h-1 bg-white/70 rounded-full animate-pulse"></div>
    </section>
  )
}

export default HeroSection 
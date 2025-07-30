import React from 'react'
import { Check, Eye, Star } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { PortfolioTemplate } from '@/types/dashboard'

interface TemplateSelectionProps {
  templates: PortfolioTemplate[]
  selectedTemplate: number
  onSelectTemplate: (id: number) => void
  onNext: () => void
  onBack: () => void
  onPreview: (templateId: number) => void
}

export function TemplateSelection({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onNext,
  onBack
}: TemplateSelectionProps) {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Şablonunuzu Seçin
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Portfolyonuz için modern ve profesyonel şablonlardan birini seçin. Her şablon özenle tasarlanmış ve optimize edilmiştir.
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {templates.map((template, index) => (
          <Card
            key={template.id}
            variant={selectedTemplate === template.id ? 'gradient' : 'glass'}
            className={`transition-all duration-500 smooth-fade animation-delay-${index * 200} ${
              selectedTemplate === template.id 
                ? 'ring-4 ring-blue-500/30 scale-105' 
                : 'hover:scale-102'
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            {/* Template Preview */}
            <div className="relative mb-6">
              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200/50 shadow-sm">
                <iframe
                  srcDoc={template.previewHtml}
                  className="w-full h-full border-0"
                  title={`${template.name} Preview`}
                />
              </div>
              
              {/* Selection Indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="space-y-4">
              <div>
                <h3 className={`font-bold text-xl mb-2 ${
                  selectedTemplate === template.id ? 'text-white' : 'text-gray-900'
                }`}>
                  {template.name}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  selectedTemplate === template.id ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {template.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {template.features.map((feature, _featureIndex) => (
                  <div key={feature} className="flex items-center text-sm">
                    <Check className={`h-4 w-4 mr-3 ${
                      selectedTemplate === template.id ? 'text-white' : 'text-green-500'
                    }`} />
                    <span className={
                      selectedTemplate === template.id ? 'text-white/90' : 'text-gray-600'
                    }>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant={selectedTemplate === template.id ? 'glass' : 'secondary'}
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectTemplate(template.id)
                  }}
                >
                  {selectedTemplate === template.id ? 'Seçildi' : 'Seç'}
                </Button>
                
                <Button
                  variant="glass"
                  size="sm"
                  icon={Eye}
                  onClick={(e) => {
                    e.stopPropagation()
                    // Preview functionality
                  }}
                  className="bg-white/20 hover:bg-white/30"
                >
                  Önizle
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-16 mb-8">
        <Button
          variant="gradient-blue"
          size="lg"
          onClick={onBack}
          className="hover-lift"
        >
          Geri
        </Button>

        <Button
          variant="gradient-blue"
          size="lg"
          onClick={onNext}
          disabled={!selectedTemplate}
          className="hover-lift shadow-xl"
        >
          Devam Et
        </Button>
      </div>
    </div>
  )
} 
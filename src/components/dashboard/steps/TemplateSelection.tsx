import { Check, Globe } from 'lucide-react'
import { PortfolioTemplate } from '@/types/dashboard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface TemplateSelectionProps {
  templates: PortfolioTemplate[]
  selectedTemplate: number
  onSelectTemplate: (templateId: number) => void
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
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Şablonunuzu Seçin</h1>
        <p className="text-gray-500 text-base">Portfolyonuz için modern ve profesyonel şablonlardan birini seçin.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {templates.map((template) => (
          <Card
            key={template.id}
            variant="portfolio"
            className={`transition-all duration-200 border-none shadow-sm hover:shadow-lg rounded-2xl p-6 bg-white flex flex-col gap-4 ${selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div 
              className="cursor-pointer"
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="aspect-video bg-gray-50 rounded-xl mb-4 border overflow-hidden flex items-center justify-center">
                <iframe
                  srcDoc={template.previewHtml}
                  className="w-full h-full border-0"
                  title={`${template.name} Preview`}
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{template.description}</p>
              <div className="space-y-1 mb-2">
                {template.features.map((feature) => (
                  <div key={feature} className="flex items-center text-xs text-gray-500">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button
                variant={selectedTemplate === template.id ? 'primary' : 'secondary'}
                size="sm"
                className="flex-1"
                onClick={() => onSelectTemplate(template.id)}
              >
                {selectedTemplate === template.id ? 'Seçili' : 'Seç'}
              </Button>
              {/* Önizleme butonu geçici olarak devre dışı - güvenlik nedeniyle */}
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 opacity-50 cursor-not-allowed"
                disabled
                title="Önizleme özelliği geçici olarak devre dışı"
              >
                <Globe className="h-4 w-4 mr-1 inline text-gray-400" /> Önizleme
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <Button variant="secondary" onClick={onBack} size="lg">
          Geri
        </Button>
        <Button onClick={onNext} size="lg">
          Devam Et
        </Button>
      </div>
    </div>
  )
} 
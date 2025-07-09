import { Check, Globe } from 'lucide-react'
import { PortfolioTemplate } from '@/types/dashboard'

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
  onBack,
  onPreview
}: TemplateSelectionProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Şablonunuzu Seçin
        </h1>
        <p className="text-gray-600">
          Portfolyonuz için modern ve profesyonel şablonlardan birini seçin.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="aspect-video bg-white rounded-lg mb-4 border overflow-hidden">
              <iframe
                srcDoc={template.previewHtml}
                className="w-full h-full border-0"
                title={`${template.name} Preview`}
              />
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            
            <div className="space-y-1 mb-4">
              {template.features.map((feature) => (
                <div key={feature} className="flex items-center text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  {feature}
                </div>
              ))}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPreview(template.id)
              }}
              className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Globe className="h-4 w-4 mr-1 inline" />
              Büyük Önizleme
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Geri
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Devam Et
        </button>
      </div>
    </div>
  )
} 
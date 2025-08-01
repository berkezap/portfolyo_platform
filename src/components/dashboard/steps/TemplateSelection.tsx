import React from 'react';
import { Check, Eye } from 'lucide-react';
import Button from '@/components/ui/Button';
import { PortfolioTemplate } from '@/types/dashboard';

interface TemplateSelectionProps {
  templates: PortfolioTemplate[];
  selectedTemplate: number;
  onSelectTemplate: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
  onPreview: (templateId: number) => void;
}

export function TemplateSelection({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onNext,
  onBack,
  onPreview,
}: TemplateSelectionProps) {
  return (
    <div className="max-w-full mx-auto">
      {/* Hero Section - Minimalist başlık */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Şablonunuzu Seçin</h1>
        <p className="text-sm text-gray-500">Portfolyonuz için bir şablon seçin</p>
      </div>

      {/* Template Grid - Repo kartları gibi minimalist */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`
              relative p-6 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col h-full
              ${
                selectedTemplate === template.id
                  ? 'border-blue-300 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
            `}
            onClick={() => onSelectTemplate(template.id)}
          >
            {/* Selection Indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Template Preview */}
            <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-4">
              <iframe
                srcDoc={template.previewHtml}
                className="w-full h-full border-0 pointer-events-none"
                title={`${template.name} Preview`}
              />
            </div>

            {/* Template Info */}
            <div className="space-y-3 flex-1 flex flex-col">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
              </div>

              {/* Features - Sabit yükseklik */}
              <div className="h-16 flex flex-wrap gap-2 content-start">
                {template.features.slice(0, 3).map((feature) => (
                  <span
                    key={feature}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md h-fit"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Action Buttons - En alta sabitlenmiş */}
              <div className="flex gap-2 pt-2 mt-auto">
                <Button
                  variant={selectedTemplate === template.id ? 'primary' : 'secondary'}
                  size="sm"
                  className="flex-1 text-sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onSelectTemplate(template.id);
                  }}
                >
                  {selectedTemplate === template.id ? 'Seçildi' : 'Seç'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onPreview(template.id);
                  }}
                  className="!px-3"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="secondary" size="md" onClick={onBack} className="px-6 py-2">
          Geri
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={!selectedTemplate}
          className="px-6 py-2"
        >
          Devam Et
        </Button>
      </div>
    </div>
  );
}

import React from 'react';
import { Check, Eye } from 'lucide-react';
import Button from '@/components/ui/Button';
import { PortfolioTemplate } from '@/types/dashboard';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import { TEMPLATES } from '@/config/templates';

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
  const t = useTranslations();
  const router = useRouter();
  const { currentPlan, hasFeature } = useSubscription();

  // Check if template is premium and user has access
  const canSelectTemplate = (templateId: number) => {
    const template = TEMPLATES.find((t, index) => index + 1 === templateId);
    if (!template) return false;
    return !template.isPremium || hasFeature('premiumTemplates');
  };

  const handleTemplateSelect = (templateId: number) => {
    if (canSelectTemplate(templateId)) {
      onSelectTemplate(templateId);
    } else {
      // Redirect to pricing for premium templates
      router.push('/pricing');
    }
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Hero Section - Minimalist başlık */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {t('dashboard.selectTemplate')}
        </h1>
        <p className="text-sm text-gray-500">{t('dashboard.selectTemplateDescAlt')}</p>
      </div>

      {/* Template Grid - Repo kartları gibi minimalist */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {templates.map((template) => {
          const canSelect = canSelectTemplate(template.id);
          const templateConfig = TEMPLATES.find((t, index) => index + 1 === template.id);
          const isPremium = templateConfig?.isPremium || false;

          console.log(`Template ${template.id}:`, { isPremium, canSelect, templateConfig });

          return (
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
              onClick={() => {
                // Preview için tıklama, select button'dan handle ediliyor
              }}
            >
              {/* Premium Badge */}
              {isPremium && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    PRO
                  </span>
                </div>
              )}

              {/* Selection Indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Template Preview */}
              <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-4">
                <iframe
                  srcDoc={template.previewHtml}
                  className="w-full h-full border-0 pointer-events-none transform scale-75 origin-top-left"
                  title={`${template.name} Preview`}
                  style={{ width: '133.33%', height: '133.33%' }}
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
                    variant={
                      selectedTemplate === template.id
                        ? 'primary'
                        : isPremium && !canSelect
                          ? 'secondary'
                          : 'secondary'
                    }
                    size="sm"
                    className={`flex-1 text-sm ${isPremium && !canSelect ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700' : ''}`}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleTemplateSelect(template.id);
                    }}
                  >
                    {selectedTemplate === template.id
                      ? t('dashboard.selected')
                      : isPremium && !canSelect
                        ? 'Upgrade to PRO'
                        : t('dashboard.select')}
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
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="secondary" size="md" onClick={onBack} className="px-6 py-2">
          {t('common.back')}
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={!selectedTemplate}
          className="px-6 py-2"
        >
          {t('dashboard.continue')}
        </Button>
      </div>
    </div>
  );
}

'use client';

import { StepType } from '@/types/dashboard';
import { useTranslations } from 'next-intl';

interface ProgressStepsProps {
  currentStep: StepType;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const t = useTranslations('dashboard');

  const steps = [
    { id: 'repos', label: t('stepRepos'), number: 1 },
    { id: 'template', label: t('stepTemplate'), number: 2 },
    { id: 'cv', label: t('stepCV'), number: 3 },
    { id: 'publish', label: t('stepPublish'), number: 4 },
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    const currentIndex = steps.findIndex((s) => s.id === currentStep);

    if (stepIndex < currentIndex || currentStep === 'completed') {
      return 'completed';
    } else if (stepIndex === currentIndex) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  return (
    <div className="py-2 mt-2" style={{ backgroundColor: '#F7F8FA' }}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';
            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCurrent || isCompleted
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    <span className="font-semibold text-sm">{step.number}</span>
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      isCurrent || isCompleted ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="w-24 h-px bg-gray-200 mx-8 mt-[-12px]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

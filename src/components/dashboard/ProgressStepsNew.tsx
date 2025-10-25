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
    <div className="flex lg:flex-col items-center lg:space-y-4 space-x-4 lg:space-x-0 py-2 lg:pt-0 lg:pb-4 overflow-x-auto lg:overflow-x-visible">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const isCompleted = status === 'completed';
        const isCurrent = status === 'current';
        return (
          <div key={step.id} className="flex flex-col items-center">
            {/* Step Circle */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-out flex-shrink-0 ${
                isCurrent || isCompleted
                  ? 'bg-gray-900 border-gray-900 text-white shadow-lg scale-110'
                  : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
              }`}
              style={{
                transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {isCompleted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="font-semibold text-sm">{step.number}</span>
              )}
            </div>
            
            {/* Step Label */}
            <p
              className={`text-xs font-medium mt-2 transition-all duration-300 text-center ${
                isCurrent || isCompleted ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {step.label}
            </p>
            
            {/* Connector Line - Horizontal on mobile, Vertical on desktop */}
            {index < steps.length - 1 && (
              <div 
                className={`lg:w-px lg:h-8 w-8 h-px my-0 lg:my-3 mx-3 lg:mx-0 transition-all duration-500 ${
                  isCompleted ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

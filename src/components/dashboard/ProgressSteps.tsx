import { Check } from 'lucide-react';
import { StepType } from '@/types/dashboard';

interface ProgressStepsProps {
  currentStep: StepType;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = [
    { id: 'repos', label: 'Repo Seçimi', number: 1 },
    { id: 'template', label: 'Şablon', number: 2 },
    { id: 'cv', label: 'CV Yükleme', number: 3 },
    { id: 'generate', label: 'Oluştur', number: 4 },
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
    <div className="py-8">
      {/* Geniş ve havadar progress container */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-12 py-10">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const isCompleted = status === 'completed';
              const isCurrent = status === 'current';

              return (
                <div key={step.id} className="flex items-center">
                  {/* Step Circle - Daha büyük ve havadar */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center border-3 transition-all duration-300 ${
                        isCurrent || isCompleted
                          ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <span className="font-bold text-lg">{step.number}</span>
                      )}
                    </div>

                    {/* Step Label - Daha büyük margin */}
                    <p
                      className={`mt-4 text-base font-semibold ${
                        isCurrent || isCompleted ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>

                  {/* Connector Line - Daha geniş */}
                  {index < steps.length - 1 && (
                    <div className="w-24 h-px bg-gray-300 mx-8 mt-[-24px]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

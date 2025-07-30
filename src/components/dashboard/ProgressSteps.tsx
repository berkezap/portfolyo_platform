import { Check } from 'lucide-react'
import { StepType } from '@/types/dashboard'

interface ProgressStepsProps {
  currentStep: StepType
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = [
    { id: 'repos', label: 'Repo Seçimi', number: 1 },
    { id: 'template', label: 'Şablon', number: 2 },
    { id: 'cv', label: 'CV Yükleme', number: 3 },
    { id: 'generate', label: 'Oluştur', number: 4 }
  ]

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId)
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    
    if (stepIndex < currentIndex || currentStep === 'completed') {
      return 'completed'
    } else if (stepIndex === currentIndex) {
      return 'current'
    } else {
      return 'pending'
    }
  }

  return (
    <div className="mb-4 pt-4">
      <div className="flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto px-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const isCompleted = status === 'completed'
          const isCurrent = status === 'current'
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center space-x-2 ${
                isCurrent ? 'text-blue-600' : 
                isCompleted ? 'text-green-600' : 
                'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCurrent ? 'border-blue-600 bg-blue-50' : 
                  isCompleted ? 'border-green-600 bg-green-50' : 
                  'border-gray-300'
                }`}>
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="font-medium text-sm md:text-base">
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-16 h-px bg-gray-300 mx-2 md:mx-4"></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 
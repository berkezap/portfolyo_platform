import { Loader2, AlertCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface GenerateStepProps {
  loading: boolean
  error: string | null
  onGenerate: () => void
  onBack: () => void
}

export function GenerateStep({ loading, error, onGenerate, onBack }: GenerateStepProps) {
  return (
    <div className="max-w-xl mx-auto">
      <Card variant="portfolio" className="mb-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Portfolyo Oluştur</h2>
          <p className="text-gray-600 text-base mb-2">Seçtiğiniz projeler ve şablon ile portfolyonuzu oluşturun.</p>
          {loading ? (
            <div className="flex flex-col items-center space-y-2 mt-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <span className="text-blue-700 font-medium">Portfolyo oluşturuluyor...</span>
            </div>
          ) : error ? (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mt-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          ) : (
            <Button variant="gradient-blue" size="lg" onClick={onGenerate}>
              Portfolyo Oluştur
            </Button>
          )}
        </div>
      </Card>
      <div className="flex justify-between mt-12 mb-8">
        <Button variant="gradient-blue" onClick={onBack}>Geri</Button>
      </div>
    </div>
  )
} 
import { Loader2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface GenerateStepProps {
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
  onBack: () => void;
}

export function GenerateStep({ loading, error, onGenerate, onBack }: GenerateStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-6 py-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
          <span className="text-2xl">🚀</span>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Portfolyo Oluştur</h2>
          <p className="text-sm text-gray-500 max-w-lg">
            Seçtiğiniz bilgilerle portfolyonuz oluşturulacak
          </p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center space-y-4 mt-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <span className="text-blue-700 font-medium text-sm">Portfolyo oluşturuluyor...</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2 mt-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        ) : (
          <Button variant="primary" size="md" onClick={onGenerate} className="px-6 py-3 text-base">
            Portfolyo Oluştur
          </Button>
        )}
      </div>
      <div className="flex justify-between mt-8 mb-8">
        <Button variant="primary" onClick={onBack} className="px-6 py-2">
          Geri
        </Button>
      </div>
    </div>
  );
}

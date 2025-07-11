import { UploadCloud, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useRef } from 'react'

interface CVUploadProps {
  cvUrl?: string
  uploading: boolean
  error: string | null
  onUpload: (file: File) => void
  onNext: () => void
  onBack: () => void
}

export function CVUpload({
  cvUrl,
  uploading,
  error,
  onUpload,
  onNext,
  onBack
}: CVUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && typeof onUpload === 'function') {
      onUpload(file)
    }
  }

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card variant="portfolio" className="mb-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <UploadCloud className="w-10 h-10 text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-900">CV Yükle</h2>
          <p className="text-gray-600 text-sm mb-2">Portfolyonuza eklemek için PDF formatında bir özgeçmiş yükleyin.</p>
          
          {cvUrl ? (
            <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-green-800 font-medium underline">CV'yi Görüntüle</a>
            </div>
          ) : (
            <>
              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <Button
                variant="primary"
                size="lg"
                onClick={handleFileButtonClick}
                disabled={uploading}
              >
                <FileText className="w-5 h-5 mr-2" />
                {uploading ? 'Yükleniyor...' : 'CV Yükle'}
              </Button>
            </>
          )}
          
          {error && (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mt-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          )}
        </div>
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button variant="secondary" onClick={onBack}>Geri</Button>
        <Button variant="primary" onClick={onNext} disabled={!cvUrl}>Devam Et</Button>
      </div>
    </div>
  )
} 
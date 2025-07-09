import { Upload, FileText, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface CVUploadProps {
  cvFile: File | null
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClearFile: () => void
  onNext: () => void
  onBack: () => void
}

export function CVUpload({ cvFile, onFileUpload, onClearFile, onNext, onBack }: CVUploadProps) {
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes
  const ALLOWED_TYPES = ['application/pdf']

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setUploadError(null)
    
    if (!file) return

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Sadece PDF formatındaki dosyalar kabul edilmektedir.')
      event.target.value = '' // Clear the input
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`Dosya boyutu çok büyük. Maksimum ${MAX_FILE_SIZE / (1024 * 1024)}MB olmalıdır.`)
      event.target.value = '' // Clear the input
      return
    }

    // Validate file is not corrupted (basic check)
    try {
      setIsUploading(true)
      
      // Create a FileReader to check if file is readable
      const reader = new FileReader()
      reader.onload = () => {
        onFileUpload(event)
        setIsUploading(false)
      }
      reader.onerror = () => {
        setUploadError('Dosya okunamadı. Lütfen geçerli bir PDF dosyası seçin.')
        setIsUploading(false)
        event.target.value = ''
      }
      reader.readAsArrayBuffer(file.slice(0, 1024)) // Read first 1KB to check if file is readable
    } catch (error) {
      setUploadError('Dosya yüklenirken bir hata oluştu.')
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const clearFile = () => {
    onClearFile()
    setUploadError(null)
    // Clear the file input
    const fileInput = document.getElementById('cv-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          CV'nizi Yükleyin (Opsiyonel)
        </h1>
        <p className="text-gray-600">
          Portfolio sitenizde CV'nizi de göstermek istiyorsanız PDF formatında yükleyebilirsiniz.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Maksimum dosya boyutu: 10MB • Desteklenen format: PDF
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          cvFile ? 'border-green-500 bg-green-50' : 
          uploadError ? 'border-red-500 bg-red-50' :
          'border-gray-300 hover:border-gray-400'
        }`}>
          {isUploading ? (
            <div>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">CV dosyanız kontrol ediliyor...</p>
            </div>
          ) : cvFile ? (
            <div>
              <FileText className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-green-700 font-medium mb-2">{cvFile.name}</p>
              <p className="text-sm text-green-600 mb-2">
                Boyut: {(cvFile.size / (1024 * 1024)).toFixed(2)}MB
              </p>
              <p className="text-sm text-green-600">CV başarıyla yüklendi!</p>
              <button
                onClick={clearFile}
                className="mt-2 text-sm text-green-600 hover:text-green-700 underline"
              >
                Değiştir
              </button>
            </div>
          ) : uploadError ? (
            <div>
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium mb-4">{uploadError}</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="cv-upload"
              />
              <label
                htmlFor="cv-upload"
                className="inline-flex items-center px-4 py-2 bg-white border border-red-300 rounded-lg cursor-pointer hover:bg-red-50 text-red-600"
              >
                <Upload className="h-4 w-4 mr-2" />
                Tekrar Dene
              </label>
            </div>
          ) : (
            <div>
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">CV'nizi buraya sürükleyin</p>
              <p className="text-sm text-gray-500 mb-4">veya dosya seçmek için tıklayın</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="cv-upload"
              />
              <label
                htmlFor="cv-upload"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                PDF Seç
              </label>
            </div>
          )}
        </div>

        {/* Additional validation info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">CV Yükleme Kuralları:</p>
              <ul className="space-y-1">
                <li>• Sadece PDF formatı kabul edilir</li>
                <li>• Maksimum dosya boyutu 10MB</li>
                <li>• Dosya okunaklı ve bozuk olmamalı</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={onBack}
          disabled={isUploading}
          className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Geri
        </button>
        <button
          onClick={onNext}
          disabled={isUploading}
          className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          CV Olmadan Devam Et
        </button>
        <button
          onClick={onNext}
          disabled={isUploading}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Kontrol Ediliyor...' : 'Portfolyomu Oluştur'}
        </button>
      </div>
    </div>
  )
} 
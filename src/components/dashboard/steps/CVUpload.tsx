import { Upload, FileText, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface CVUploadProps {
  cvUrl: string | null
  onFileUpload: (url: string) => void
  onClearFile: () => void
  onNext: () => void
  onBack: () => void
}

export function CVUpload({ cvUrl, onFileUpload, onClearFile, onNext, onBack }: CVUploadProps) {
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes
  const ALLOWED_TYPES = ['application/pdf']

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setUploadError(null)
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Sadece PDF formatındaki dosyalar kabul edilmektedir.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`Dosya boyutu çok büyük. Maksimum ${MAX_FILE_SIZE / (1024 * 1024)}MB olmalıdır.`)
      event.target.value = ''
      return
    }

    try {
      setIsUploading(true)
      // 1) Get signed URL
      const res = await fetch('/api/upload/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type })
      })
      if (!res.ok) throw new Error('Signed URL alınamadı')
      const { uploadUrl, publicUrl } = await res.json()

      // 2) Upload file
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'x-upsert': 'true'
        }
      })
      if (!putRes.ok) throw new Error('Dosya yüklenemedi')

      setFileName(file.name)
      onFileUpload(publicUrl)
    } catch (err: any) {
      setUploadError(err.message || 'Dosya yüklenirken hata')
    } finally {
      setIsUploading(false)
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
          cvUrl ? 'border-green-500 bg-green-50' : 
          uploadError ? 'border-red-500 bg-red-50' :
          'border-gray-300 hover:border-gray-400'
        }`}>
          {isUploading ? (
            <div>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">CV dosyanız kontrol ediliyor...</p>
            </div>
          ) : cvUrl ? (
            <div>
              <FileText className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-green-700 font-medium mb-2">{fileName}</p>
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
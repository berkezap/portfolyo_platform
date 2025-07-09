import { Upload, FileText } from 'lucide-react'

interface CVUploadProps {
  cvFile: File | null
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClearFile: () => void
  onNext: () => void
  onBack: () => void
}

export function CVUpload({ cvFile, onFileUpload, onClearFile, onNext, onBack }: CVUploadProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          CV'nizi Yükleyin (Opsiyonel)
        </h1>
        <p className="text-gray-600">
          Portfolio sitenizde CV'nizi de göstermek istiyorsanız PDF formatında yükleyebilirsiniz.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          cvFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}>
          {cvFile ? (
            <div>
              <FileText className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-green-700 font-medium mb-2">{cvFile.name}</p>
              <p className="text-sm text-green-600">CV başarıyla yüklendi!</p>
              <button
                onClick={onClearFile}
                className="mt-2 text-sm text-green-600 hover:text-green-700 underline"
              >
                Değiştir
              </button>
            </div>
          ) : (
            <div>
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">CV'nizi buraya sürükleyin</p>
              <p className="text-sm text-gray-500 mb-4">veya dosya seçmek için tıklayın</p>
              <input
                type="file"
                accept=".pdf"
                onChange={onFileUpload}
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
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Geri
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          CV Olmadan Devam Et
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Portfolyomu Oluştur
        </button>
      </div>
    </div>
  )
} 
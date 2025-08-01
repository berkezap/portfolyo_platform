import { UploadCloud, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRef } from 'react';

interface CVUploadProps {
  cvUrl?: string;
  uploading: boolean;
  error: string | null;
  onUpload: (file: File) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CVUpload({ cvUrl, uploading, error, onUpload, onNext, onBack }: CVUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && typeof onUpload === 'function') {
      onUpload(file);
    }
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-6 py-6">
        <UploadCloud className="w-12 h-12 text-blue-600 mb-2" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">CV Yükle</h2>
          <p className="text-sm text-gray-500 max-w-lg">
            Portfolyonuza eklemek için PDF formatında CV&apos;nizi yükleyin
          </p>
        </div>
        {cvUrl ? (
          <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-800 font-medium underline text-sm"
            >
              CV&apos;yi Görüntüle
            </a>
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
              size="md"
              onClick={handleFileButtonClick}
              disabled={uploading}
              className="px-6 py-3 text-base"
            >
              <FileText className="w-5 h-5 mr-2" />
              {uploading ? 'Yükleniyor...' : 'CV Yükle'}
            </Button>
          </>
        )}
        {error && (
          <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2 mt-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        )}
        <span className="text-gray-500 text-xs mt-2 max-w-lg leading-relaxed">
          CV dosyanız sadece sizin tarafınızdan görüntülenir ve asla üçüncü kişilerle paylaşılmaz.
          Dosya boyutu 5MB&apos;ı geçmemelidir.
        </span>
      </div>
      <div className="flex justify-between mt-8 mb-8">
        <Button variant="primary" onClick={onBack} className="px-6 py-2">
          Geri
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!cvUrl} className="px-6 py-2">
          Devam Et
        </Button>
      </div>
    </div>
  );
}

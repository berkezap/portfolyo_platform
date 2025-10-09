import React, { useState, useCallback } from 'react';
import { Loader2, AlertCircle, Check, Globe, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';
import ModernCard from '@/components/ui/ModernCard';

interface PublishStepProps {
  loading: boolean;
  error: string | null;
  onPublish: (slug: string) => void;
  onBack: () => void;
}

export function PublishStep({ loading, error, onPublish, onBack }: PublishStepProps) {
  const [slug, setSlug] = useState('');
  const [slugError, setSlugError] = useState('');
  const [checkingSlug, setCheckingSlug] = useState(false);

  const normalizeSlug = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30);
  };

  const validateSlug = (slug: string): boolean => {
    if (!slug || slug.length < 3) {
      setSlugError('En az 3 karakter olmalıdır');
      return false;
    }
    if (slug.length > 30) {
      setSlugError('En fazla 30 karakter olabilir');
      return false;
    }
    const reserved = ['www', 'api', 'app', 'admin', 'static', 'cdn', 'mail', 'blog'];
    if (reserved.includes(slug)) {
      setSlugError('Bu isim rezerve edilmiştir');
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugError('Sadece küçük harf, rakam ve tire (-) kullanılabilir');
      return false;
    }
    setSlugError('');
    return true;
  };

  const checkSlugAvailability = useCallback(async (slug: string) => {
    if (!validateSlug(slug)) return;

    setCheckingSlug(true);
    try {
      const response = await fetch(`/api/portfolio/check-slug?slug=${slug}`);
      const data = await response.json();

      if (!data.available) {
        setSlugError('Bu isim zaten kullanılıyor');
      } else {
        setSlugError('');
      }
    } catch (err) {
      console.error('Slug kontrolü başarısız:', err);
    }
    setCheckingSlug(false);
  }, []);

  const handleSlugChange = (value: string) => {
    const normalized = normalizeSlug(value);
    setSlug(normalized);

    if (normalized.length >= 3) {
      checkSlugAvailability(normalized);
    } else {
      setSlugError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSlug(slug) && !slugError && !checkingSlug) {
      onPublish(slug);
    }
  };

  const isValid = slug.length >= 3 && !slugError && !checkingSlug;
  const isDevelopment = process.env.NODE_ENV === 'development';
  const previewUrl = isDevelopment
    ? `http://localhost:3000/portfolio/${slug}`
    : `https://${slug}.portfolyo.tech`;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Portfolyonuzu Yayınlayın</h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Portfolyonuz için bir web adresi seçin ve canlıya alın
        </p>
      </div>

      {/* Slug Selection Form */}
      <ModernCard variant="elevated" className="mb-6">
        <ModernCard.Content className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Preview */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Web Adresiniz
                {isDevelopment && (
                  <span className="text-orange-600 text-xs ml-2">(Development Mode)</span>
                )}
              </label>
              <div className="flex items-center text-lg">
                <span className="text-gray-600">
                  {isDevelopment ? 'http://localhost:3000/portfolio/' : 'https://'}
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="isminiz"
                  className="bg-transparent border-none outline-none text-blue-600 font-medium placeholder-gray-400 min-w-0 flex-1"
                  maxLength={30}
                  disabled={loading}
                />
                <span className="text-gray-600">{isDevelopment ? '' : '.portfolyo.tech'}</span>
              </div>
            </div>

            {/* Validation State */}
            <div className="min-h-[24px]">
              {checkingSlug && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Kontrol ediliyor...</span>
                </div>
              )}

              {slugError && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{slugError}</span>
                </div>
              )}

              {isValid && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Bu isim kullanılabilir!</span>
                </div>
              )}
            </div>

            {/* Preview URL */}
            {isValid && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Portfolio URL'iniz:</p>
                    <p className="text-blue-600 font-mono">{previewUrl}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onBack}
                disabled={loading}
                className="flex-1"
              >
                Geri
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!isValid || loading}
                className="flex-1 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Yayınlanıyor...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    Canlıya Al
                  </>
                )}
              </Button>
            </div>
          </form>
        </ModernCard.Content>
      </ModernCard>

      {/* Info */}
      <div className="text-center text-sm text-gray-500">
        <p>✨ Portfolyonuz hemen canlıya alınacak ve herkesle paylaşabileceksiniz!</p>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function PrivacyPolicyTR() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🛡️ PortfolYO Privacy Policy</h1>
        <p className="text-lg text-gray-600">Son Güncelleme: 20 Aralık 2024 | Versiyon: 1.0</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📋 Genel Bakış</h2>
          <p className="text-gray-700 mb-4">
            PortfolYO (&quot;biz&quot;, &quot;bizim&quot;, &quot;platform&quot;), kullanıcılarımızın
            gizliliğini korumayı taahhüt eder. Bu Privacy Policy, kişisel verilerinizin nasıl
            toplandığını, kullanıldığını ve korunduğunu açıklar.
          </p>
          <p className="text-gray-700">
            Bu politika, GDPR (Genel Veri Koruma Yönetmeliği) ve diğer geçerli veri koruma
            yasalarına uygun olarak hazırlanmıştır.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🎯 Veri Toplama</h2>

          <h3 className="text-xl font-medium text-gray-800 mb-3">1. Doğrudan Toplanan Veriler</h3>

          <h4 className="text-lg font-medium text-gray-700 mb-2">Hesap Bilgileri</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>E-posta adresi (GitHub OAuth ile)</li>
            <li>GitHub kullanıcı adı</li>
            <li>GitHub profil bilgileri (avatar, bio, vb.)</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-700 mb-2">Portfolio Verileri</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Portfolio içerikleri</li>
            <li>Proje bilgileri</li>
            <li>CV dosyaları</li>
            <li>Özelleştirme ayarları</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-700 mb-2">Kullanıcı Etkileşimleri</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Feedback ve değerlendirmeler</li>
            <li>Kullanım istatistikleri</li>
            <li>Sayfa ziyaretleri</li>
            <li>Buton tıklamaları</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-800 mb-3">2. Otomatik Toplanan Veriler</h3>

          <h4 className="text-lg font-medium text-gray-700 mb-2">Teknik Veriler</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>IP adresi</li>
            <li>Tarayıcı bilgileri</li>
            <li>İşletim sistemi</li>
            <li>Cihaz türü</li>
            <li>Sayfa yükleme süreleri</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-700 mb-2">Kullanım Verileri</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Ziyaret edilen sayfalar</li>
            <li>Kullanım süreleri</li>
            <li>Hata raporları</li>
            <li>Performans metrikleri</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🍪 Çerez Politikası</h2>

          <h3 className="text-xl font-medium text-gray-800 mb-3">1. Çerez Türleri</h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Gerekli Çerezler</h4>
              <p className="text-sm text-gray-600 mb-2">Platformun temel işlevleri için gerekli</p>
              <p className="text-xs text-gray-500">Süre: Oturum süresince | Kontrol: Kapatılamaz</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Analitik Çerezler</h4>
              <p className="text-sm text-gray-600 mb-2">
                Kullanım istatistikleri ve performans analizi
              </p>
              <p className="text-xs text-gray-500">Süre: 3 ay | Kontrol: Kullanıcı onayı gerekli</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Feedback Çerezler</h4>
              <p className="text-sm text-gray-600 mb-2">Kullanıcı geri bildirimleri ve anketler</p>
              <p className="text-xs text-gray-500">Süre: 6 ay | Kontrol: Kullanıcı onayı gerekli</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Üçüncü Taraf Çerezler</h4>
              <p className="text-sm text-gray-600 mb-2">GitHub OAuth, Sentry error tracking</p>
              <p className="text-xs text-gray-500">
                Süre: 1 yıl | Kontrol: Kullanıcı onayı gerekli
              </p>
            </div>
          </div>

          <h3 className="text-xl font-medium text-gray-800 mb-3">2. Çerez Yönetimi</h3>
          <p className="text-gray-700 mb-4">
            Kullanıcılar çerez ayarlarını şu şekilde yönetebilir:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Cookie consent banner&apos;ından ayarları değiştirme</li>
            <li>
              <Link href="/gdpr-settings" className="text-blue-600 hover:underline">
                GDPR Ayarları
              </Link>{' '}
              sayfasından detaylı yönetim
            </li>
            <li>Tarayıcı ayarlarından çerezleri silme</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🎯 Kullanıcı Hakları (GDPR)</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">1. Bilgi Alma Hakkı</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hangi verilerin toplandığını öğrenme</li>
                <li>• Veri işleme amacını öğrenme</li>
                <li>• Veri paylaşımını öğrenme</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">2. Erişim Hakkı</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Kişisel verilerinize erişim</li>
                <li>• Veri kopyası alma</li>
                <li>• İşleme detaylarını öğrenme</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">3. Düzeltme Hakkı</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Yanlış verileri düzeltme</li>
                <li>• Eksik verileri tamamlama</li>
                <li>• Güncel bilgileri güncelleme</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">4. Silme Hakkı</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Verilerinizi tamamen silme</li>
                <li>• Hesabınızı kapatma</li>
                <li>• Tüm verilerinizi kaldırma</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">5. Veri Taşınabilirliği</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Verilerinizi dışa aktarma</li>
                <li>• Başka platforma aktarma</li>
                <li>• Standart formatta alma</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">6. İşlemeye İtiraz</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Veri işlemeye itiraz etme</li>
                <li>• Pazarlama e-postalarını durdurma</li>
                <li>• Otomatik karar vermeye itiraz</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📞 İletişim</h2>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Veri Koruma Sorumlusu</h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>E-posta:</strong> privacy@portfolyo.com
              </p>
              <p>
                <strong>Adres:</strong> [Şirket Adresi]
              </p>
              <p>
                <strong>Telefon:</strong> [Telefon Numarası]
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-medium text-gray-800 mb-3">GDPR Talepleri</h3>
            <p className="text-gray-700 mb-4">GDPR haklarınızı kullanmak için:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Platform üzerinden:</strong>{' '}
                <Link href="/gdpr-settings" className="text-blue-600 hover:underline">
                  GDPR Ayarları
                </Link>{' '}
                sayfasını kullanın
              </li>
              <li>
                <strong>E-posta ile:</strong> privacy@portfolyo.com adresine yazın
              </li>
              <li>
                <strong>API ile:</strong> /api/gdpr endpoint&apos;ini kullanın
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-gray-600">
            Bu Privacy Policy, PortfolYO platformunun veri koruma uygulamalarını açıklar ve
            kullanıcı haklarını korur.
          </p>
          <p className="text-sm text-gray-500 mt-2">Son güncelleme: 20 Aralık 2024</p>
        </div>
      </div>
    </>
  );
}

'use client'

import PageLayout from '@/components/ui/PageLayout'
import Card from '@/components/ui/Card'
import Container from '@/components/ui/Container'

export default function TermsOfServicePage() {
  return (
    <PageLayout>
      <Container>
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📜 PortfolYO Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Son Güncelleme: 20 Aralık 2024 | Versiyon: 1.0
            </p>
          </div>

          <Card className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  📋 Genel Şartlar
                </h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  1. Kabul ve Onay
                </h3>
                <p className="text-gray-700 mb-4">
                  PortfolYO platformunu ("Platform", "Hizmet") kullanarak, bu Terms of Service'i ("Şartlar") kabul etmiş sayılırsınız. 
                  Bu şartları kabul etmiyorsanız, platformu kullanmayınız.
                </p>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  2. Hizmet Tanımı
                </h3>
                <p className="text-gray-700 mb-4">
                  PortfolYO, GitHub projelerinizden otomatik olarak portfolio website'leri oluşturmanızı sağlayan bir platformdur. 
                  Hizmet şunları içerir:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>GitHub entegrasyonu</li>
                  <li>Portfolio template'leri</li>
                  <li>Otomatik içerik oluşturma</li>
                  <li>Hosting ve yayınlama</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  3. Değişiklikler
                </h3>
                <p className="text-gray-700 mb-4">
                  Bu şartlar, önceden haber verilmeksizin değiştirilebilir. Önemli değişiklikler:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Platform üzerinde duyurulur</li>
                  <li>E-posta ile bildirilir</li>
                  <li>Güncelleme tarihi belirtilir</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  👤 Kullanıcı Sorumlulukları
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Hesap Güvenliği</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• GitHub hesabınızın güvenliğinden siz sorumlusunuz</li>
                      <li>• Şüpheli aktiviteleri hemen bildirin</li>
                      <li>• Güçlü şifreler kullanın</li>
                      <li>• İki faktörlü kimlik doğrulama önerilir</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">İçerik Sorumluluğu</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Yüklediğiniz içeriklerden siz sorumlusunuz</li>
                      <li>• Telif hakkı ihlali yapmayın</li>
                      <li>• Uygunsuz içerik yüklemeyin</li>
                      <li>• Yasalara uygun içerik oluşturun</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Platform Kullanımı</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Hizmeti kötüye kullanmayın</li>
                      <li>• Diğer kullanıcıları rahatsız etmeyin</li>
                      <li>• Sistem güvenliğini tehdit etmeyin</li>
                      <li>• Spam veya zararlı içerik göndermeyin</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Yasal Uyumluluk</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Yerel ve uluslararası yasalara uyun</li>
                      <li>• Telif haklarına saygı gösterin</li>
                      <li>• Veri koruma yasalarına uyun</li>
                      <li>• İş ahlakı kurallarına uyun</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  🚫 Yasaklı Kullanımlar
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">Yasadışı Faaliyetler</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Yasadışı içerik oluşturma</li>
                      <li>• Telif hakkı ihlali</li>
                      <li>• Dolandırıcılık faaliyetleri</li>
                      <li>• Zararlı yazılım yayma</li>
                    </ul>
                  </div>
                  
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">Platform Kötüye Kullanımı</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Otomatik bot kullanımı</li>
                      <li>• Rate limiting ihlali</li>
                      <li>• Sistem kaynaklarını kötüye kullanma</li>
                      <li>• Diğer kullanıcıları engelleme</li>
                    </ul>
                  </div>
                  
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">İçerik Kısıtlamaları</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Nefret söylemi</li>
                      <li>• Şiddet içerikli materyal</li>
                      <li>• Pornografik içerik</li>
                      <li>• Spam veya reklam içeriği</li>
                    </ul>
                  </div>
                  
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">Güvenlik İhlalleri</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Sistem güvenliğini tehdit etme</li>
                      <li>• Diğer kullanıcı hesaplarına erişim</li>
                      <li>• Veri sızıntısına neden olma</li>
                      <li>• Hizmet kesintisine neden olma</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  💼 Hizmet Şartları
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Hizmet Kullanılabilirliği</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Platform 7/24 erişilebilir olmaya çalışır</li>
                      <li>• Bakım ve güncellemeler önceden duyurulur</li>
                      <li>• Kesintiler minimum düzeyde tutulur</li>
                      <li>• Yedekleme sistemleri aktif</li>
                    </ul>
                  </div>
                  
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Hizmet Sınırlamaları</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Kullanım kotası uygulanabilir</li>
                      <li>• Rate limiting aktif</li>
                      <li>• Dosya boyutu sınırları</li>
                      <li>• API kullanım limitleri</li>
                    </ul>
                  </div>
                  
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Hizmet Değişiklikleri</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Özellikler eklenebilir/çıkarılabilir</li>
                      <li>• Fiyatlandırma değişebilir</li>
                      <li>• Hizmet koşulları güncellenebilir</li>
                      <li>• Önceden haber verilir</li>
                    </ul>
                  </div>
                  
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Hizmet Sonlandırma</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Kullanım şartları ihlali</li>
                      <li>• Uzun süreli inaktivite</li>
                      <li>• Yasal zorunluluklar</li>
                      <li>• Platform kapatma kararı</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  💰 Fiyatlandırma ve Ödeme
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-green-800 mb-4">Ücretsiz Hizmet</h3>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li>• Temel portfolio oluşturma</li>
                      <li>• Sınırlı template seçimi</li>
                      <li>• Temel GitHub entegrasyonu</li>
                      <li>• Standart hosting</li>
                    </ul>
                  </div>
                  
                  <div className="border border-purple-200 bg-purple-50 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-purple-800 mb-4">Premium Hizmet</h3>
                    <ul className="text-sm text-purple-700 space-y-2">
                      <li>• Gelişmiş özellikler</li>
                      <li>• Özel template'ler</li>
                      <li>• Gelişmiş analitik</li>
                      <li>• Öncelikli destek</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-medium text-gray-800 mb-3">
                    Ödeme Şartları
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Aylık/yıllık abonelik</li>
                    <li>Otomatik yenileme</li>
                    <li>İptal hakkı</li>
                    <li>Para iade garantisi</li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  🔧 Teknik Destek
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Destek Kapsamı</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Platform kullanım desteği</li>
                      <li>• Teknik sorun çözümü</li>
                      <li>• Özellik açıklamaları</li>
                      <li>• Best practice önerileri</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Destek Kanalları</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• E-posta desteği</li>
                      <li>• Platform içi destek</li>
                      <li>• Dokümantasyon</li>
                      <li>• FAQ bölümü</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Destek Süreleri</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• İş günleri 9:00-18:00</li>
                      <li>• Acil durumlar 7/24</li>
                      <li>• Yanıt süreleri</li>
                      <li>• Öncelik sıralaması</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Destek Sınırlamaları</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Platform dışı sorunlar</li>
                      <li>• Üçüncü taraf hizmetler</li>
                      <li>• Özel geliştirme talepleri</li>
                      <li>• Eğitim hizmetleri</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  📞 İletişim ve Uyuşmazlık Çözümü
                </h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-medium text-gray-800 mb-4">
                    İletişim Bilgileri
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>E-posta:</strong> support@portfolyo.com</p>
                    <p><strong>Adres:</strong> [Şirket Adresi]</p>
                    <p><strong>Telefon:</strong> [Telefon Numarası]</p>
                    <p><strong>Web:</strong> https://portfolyo.com</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-medium text-gray-800 mb-3">
                    Uyuşmazlık Çözümü
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Önce doğrudan iletişim</li>
                    <li>Resmi şikayet süreci</li>
                    <li>Tahkim seçeneği</li>
                    <li>Yasal yollara başvuru</li>
                  </ul>
                </div>
              </div>

              <div className="text-center py-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Bu Terms of Service, PortfolYO platformunun kullanım şartlarını belirler ve kullanıcı haklarını korur.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Son güncelleme: 20 Aralık 2024
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </PageLayout>
  )
} 
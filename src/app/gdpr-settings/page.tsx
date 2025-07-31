'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Shield, Download, Trash2, Edit3, Eye, Settings, AlertTriangle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface ConsentData {
  userId: string
  analytics: boolean
  feedback: boolean
  marketing: boolean
  thirdParty: boolean
  timestamp: string
}

interface GDPRRights {
  rightToAccess: boolean
  rightToRectification: boolean
  rightToErasure: boolean
  rightToPortability: boolean
  rightToRestrictProcessing: boolean
  rightToObject: boolean
}

export default function GDPRSettingsPage() {
  const { data: session } = useSession()
  const [consent, setConsent] = useState<ConsentData | null>(null)
  const [rights, setRights] = useState<GDPRRights | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      loadGDPRData()
    }
  }, [session])

  const loadGDPRData = async () => {
    try {
      setLoading(true)
      
      // Consent bilgilerini al
      const consentResponse = await fetch('/api/gdpr?action=consent')
      const consentData = await consentResponse.json()
      
      if (consentData.success) {
        setConsent(consentData.consent)
      }
      
      // GDPR haklarını al
      const rightsResponse = await fetch('/api/gdpr?action=rights')
      const rightsData = await rightsResponse.json()
      
      if (rightsData.success) {
        setRights(rightsData.rights)
      }
    } catch (error) {
      console.error('GDPR data loading error:', error)
      setMessage({ type: 'error', text: 'Veriler yüklenirken hata oluştu' })
    } finally {
      setLoading(false)
    }
  }

  const updateConsent = async (type: keyof ConsentData, value: boolean) => {
    if (!consent) return
    
    try {
      setActionLoading('consent')
      
      const updatedConsent = { ...consent, [type]: value }
      
      const response = await fetch('/api/gdpr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'consent',
          data: {
            analytics: updatedConsent.analytics,
            feedback: updatedConsent.feedback,
            marketing: updatedConsent.marketing,
            thirdParty: updatedConsent.thirdParty
          }
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setConsent(updatedConsent)
        setMessage({ type: 'success', text: 'İzin ayarları güncellendi' })
      } else {
        setMessage({ type: 'error', text: 'İzin ayarları güncellenemedi' })
      }
    } catch (error) {
      console.error('Consent update error:', error)
      setMessage({ type: 'error', text: 'Bir hata oluştu' })
    } finally {
      setActionLoading(null)
    }
  }

  const exportUserData = async () => {
    try {
      setActionLoading('export')
      
      const response = await fetch('/api/gdpr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export' })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // JSON dosyasını indir
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        setMessage({ type: 'success', text: 'Verileriniz başarıyla indirildi' })
      } else {
        setMessage({ type: 'error', text: 'Veri export işlemi başarısız' })
      }
    } catch (error) {
      console.error('Export error:', error)
      setMessage({ type: 'error', text: 'Export işlemi sırasında hata oluştu' })
    } finally {
      setActionLoading(null)
    }
  }

  const deleteUserData = async () => {
    if (!confirm('Tüm verileriniz kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?')) {
      return
    }
    
    try {
      setActionLoading('delete')
      
      const response = await fetch('/api/gdpr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete' })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: `${result.deletedRecords} kayıt başarıyla silindi` })
        // Kullanıcıyı logout yap
        window.location.href = '/'
      } else {
        setMessage({ type: 'error', text: 'Veri silme işlemi başarısız' })
      }
    } catch (error) {
      console.error('Delete error:', error)
      setMessage({ type: 'error', text: 'Silme işlemi sırasında hata oluştu' })
    } finally {
      setActionLoading(null)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h1>
          <p className="text-gray-600">Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.</p>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">GDPR & Veri Gizliliği</h1>
            </div>
            <p className="text-gray-600">
              Verilerinizi kontrol edin, izinlerinizi yönetin ve GDPR haklarınızı kullanın.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Consent Management */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">İzin Ayarları</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Analitik Veriler</h3>
                    <p className="text-sm text-gray-600">Kullanım istatistikleri ve performans verileri</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent?.analytics || false}
                      onChange={(e) => updateConsent('analytics', e.target.checked)}
                      disabled={actionLoading === 'consent'}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Geri Bildirim</h3>
                    <p className="text-sm text-gray-600">Kullanıcı geri bildirimleri ve anketler</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent?.feedback || false}
                      onChange={(e) => updateConsent('feedback', e.target.checked)}
                      disabled={actionLoading === 'consent'}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Pazarlama</h3>
                    <p className="text-sm text-gray-600">E-posta bildirimleri ve güncellemeler</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent?.marketing || false}
                      onChange={(e) => updateConsent('marketing', e.target.checked)}
                      disabled={actionLoading === 'consent'}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Üçüncü Taraf Servisler</h3>
                    <p className="text-sm text-gray-600">GitHub, Sentry gibi harici servisler</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent?.thirdParty || false}
                      onChange={(e) => updateConsent('thirdParty', e.target.checked)}
                      disabled={actionLoading === 'consent'}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </Card>

            {/* GDPR Rights */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Eye className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold">GDPR Haklarınız</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Veri erişim hakkı</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Veri düzeltme hakkı</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Unutulma hakkı</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Veri taşınabilirlik hakkı</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">İşleme kısıtlama hakkı</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">İtiraz hakkı</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Veri Saklama Süreleri</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Portfolio verileri: 2 yıl</li>
                  <li>• Analitik verileri: 3 ay</li>
                  <li>• Geri bildirim verileri: 6 ay</li>
                  <li>• Oturum verileri: 1 ay</li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Data Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Download className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Verilerinizi İndirin</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Tüm verilerinizi JSON formatında indirin ve başka bir platforma taşıyın.
              </p>
              <Button
                onClick={exportUserData}
                disabled={actionLoading === 'export'}
                className="w-full"
                icon={Download}
              >
                {actionLoading === 'export' ? 'İndiriliyor...' : 'Verileri İndir'}
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold">Hesabınızı Silin</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Tüm verilerinizi kalıcı olarak silin. Bu işlem geri alınamaz.
              </p>
              <Button
                onClick={deleteUserData}
                disabled={actionLoading === 'delete'}
                variant="destructive"
                className="w-full"
                icon={Trash2}
              >
                {actionLoading === 'delete' ? 'Siliniyor...' : 'Hesabı Sil'}
              </Button>
            </Card>
          </div>

          {/* Warning */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Önemli Bilgi</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  Hesabınızı sildiğinizde tüm portfolyolarınız, geri bildirimleriniz ve kullanım verileriniz kalıcı olarak silinir. 
                  Bu işlem geri alınamaz. Silme işleminden önce verilerinizi indirmenizi öneririz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
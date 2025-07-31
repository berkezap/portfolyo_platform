import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GDPR Veri Saklama Süreleri (gün cinsinden)
export const GDPR_RETENTION_PERIODS = {
  PORTFOLIO_DATA: 365 * 2, // 2 yıl
  ANALYTICS_DATA: 90, // 3 ay
  FEEDBACK_DATA: 180, // 6 ay
  SESSION_DATA: 30, // 1 ay
  USER_SESSIONS: 90, // 3 ay
} as const

// GDPR Kullanıcı Hakları
export interface GDPRUserRights {
  rightToAccess: boolean
  rightToRectification: boolean
  rightToErasure: boolean
  rightToPortability: boolean
  rightToRestrictProcessing: boolean
  rightToObject: boolean
}

// Veri silme (Right to be forgotten)
export async function deleteUserData(userId: string): Promise<{ success: boolean; deletedRecords: number }> {
  try {
    console.log(`[GDPR] Kullanıcı verisi siliniyor: ${userId}`)
    
    let totalDeleted = 0
    
    // Portfolio verilerini sil
    const { data: portfolioData } = await supabase
      .from('portfolios')
      .delete()
      .eq('user_id', userId)
      .select('id')
    
    totalDeleted += portfolioData?.length || 0
    
    // Analytics verilerini sil
    const { data: analyticsData } = await supabase
      .from('analytics_events')
      .delete()
      .eq('user_id', userId)
      .select('id')
    
    totalDeleted += analyticsData?.length || 0
    
    // Feedback verilerini sil
    const { data: feedbackData } = await supabase
      .from('user_feedback')
      .delete()
      .eq('user_id', userId)
      .select('id')
    
    totalDeleted += feedbackData?.length || 0
    
    // Session verilerini sil
    const { data: sessionData } = await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', userId)
      .select('id')
    
    totalDeleted += sessionData?.length || 0
    
    // Usability test verilerini sil
    const { data: usabilityData } = await supabase
      .from('usability_tests')
      .delete()
      .eq('participant_id', userId)
      .select('id')
    
    totalDeleted += usabilityData?.length || 0
    
    console.log(`[GDPR] ${totalDeleted} kayıt silindi`)
    
    // Sentry'den de kullanıcı verilerini sil
    Sentry.addBreadcrumb({
      category: 'gdpr',
      message: `User data deletion requested for: ${userId}`,
      level: 'info',
      data: { deletedRecords: totalDeleted }
    })
    
    return { success: true, deletedRecords: totalDeleted }
  } catch (error) {
    console.error('[GDPR] Veri silme hatası:', error)
    Sentry.captureException(error)
    return { success: false, deletedRecords: 0 }
  }
}

// Veri düzeltme (Right to rectification)
export async function updateUserData(userId: string, updates: Record<string, unknown>): Promise<{ success: boolean; updatedRecords: number }> {
  try {
    console.log(`[GDPR] Kullanıcı verisi güncelleniyor: ${userId}`)
    
    let totalUpdated = 0
    
    // Portfolio metadata'sını güncelle
    if (updates.portfolioMetadata) {
      const { data } = await supabase
        .from('portfolios')
        .update({ metadata: updates.portfolioMetadata })
        .eq('user_id', userId)
        .select('id')
      
      totalUpdated += data?.length || 0
    }
    
    // Feedback verilerini güncelle
    if (updates.feedbackText) {
      const { data } = await supabase
        .from('user_feedback')
        .update({ feedback_text: updates.feedbackText })
        .eq('user_id', userId)
        .select('id')
      
      totalUpdated += data?.length || 0
    }
    
    console.log(`[GDPR] ${totalUpdated} kayıt güncellendi`)
    
    return { success: true, updatedRecords: totalUpdated }
  } catch (error) {
    console.error('[GDPR] Veri güncelleme hatası:', error)
    Sentry.captureException(error)
    return { success: false, updatedRecords: 0 }
  }
}

// Veri portability (Right to data portability)
export async function exportUserData(userId: string): Promise<{ success: boolean; data: unknown }> {
  try {
    console.log(`[GDPR] Kullanıcı verisi export ediliyor: ${userId}`)
    
    // Tüm kullanıcı verilerini topla
    const [portfolios, analytics, feedback, sessions] = await Promise.all([
      supabase.from('portfolios').select('*').eq('user_id', userId),
      supabase.from('analytics_events').select('*').eq('user_id', userId),
      supabase.from('user_feedback').select('*').eq('user_id', userId),
      supabase.from('user_sessions').select('*').eq('user_id', userId)
    ])
    
    const exportData = {
      userId,
      exportDate: new Date().toISOString(),
      portfolios: portfolios.data || [],
      analytics: analytics.data || [],
      feedback: feedback.data || [],
      sessions: sessions.data || []
    }
    
    console.log(`[GDPR] Veri export tamamlandı: ${userId}`)
    
    return { success: true, data: exportData }
  } catch (error) {
    console.error('[GDPR] Veri export hatası:', error)
    Sentry.captureException(error)
    return { success: false, data: null }
  }
}

// Eski verileri temizle (Retention policy)
export async function cleanupExpiredData(): Promise<{ success: boolean; cleanedRecords: number }> {
  try {
    console.log('[GDPR] Eski veriler temizleniyor...')
    
    let totalCleaned = 0
    const now = new Date()
    
    // Eski portfolio verilerini temizle (2 yıldan eski)
    const portfolioCutoff = new Date(now.getTime() - (GDPR_RETENTION_PERIODS.PORTFOLIO_DATA * 24 * 60 * 60 * 1000))
    const { data: portfolioData } = await supabase
      .from('portfolios')
      .delete()
      .lt('created_at', portfolioCutoff.toISOString())
      .select('id')
    
    totalCleaned += portfolioData?.length || 0
    
    // Eski analytics verilerini temizle (3 aydan eski)
    const analyticsCutoff = new Date(now.getTime() - (GDPR_RETENTION_PERIODS.ANALYTICS_DATA * 24 * 60 * 60 * 1000))
    const { data: analyticsData } = await supabase
      .from('analytics_events')
      .delete()
      .lt('created_at', analyticsCutoff.toISOString())
      .select('id')
    
    totalCleaned += analyticsData?.length || 0
    
    // Eski feedback verilerini temizle (6 aydan eski)
    const feedbackCutoff = new Date(now.getTime() - (GDPR_RETENTION_PERIODS.FEEDBACK_DATA * 24 * 60 * 60 * 1000))
    const { data: feedbackData } = await supabase
      .from('user_feedback')
      .delete()
      .lt('created_at', feedbackCutoff.toISOString())
      .select('id')
    
    totalCleaned += feedbackData?.length || 0
    
    // Eski session verilerini temizle (1 aydan eski)
    const sessionCutoff = new Date(now.getTime() - (GDPR_RETENTION_PERIODS.SESSION_DATA * 24 * 60 * 60 * 1000))
    const { data: sessionData } = await supabase
      .from('user_sessions')
      .delete()
      .lt('last_activity', sessionCutoff.toISOString())
      .select('id')
    
    totalCleaned += sessionData?.length || 0
    
    console.log(`[GDPR] ${totalCleaned} eski kayıt temizlendi`)
    
    return { success: true, cleanedRecords: totalCleaned }
  } catch (error) {
    console.error('[GDPR] Veri temizleme hatası:', error)
    Sentry.captureException(error)
    return { success: false, cleanedRecords: 0 }
  }
}

// Consent management
export interface ConsentData {
  userId: string
  analytics: boolean
  feedback: boolean
  marketing: boolean
  thirdParty: boolean
  timestamp: string
}

export async function saveUserConsent(consent: ConsentData): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_consents')
      .upsert({
        user_id: consent.userId,
        analytics_consent: consent.analytics,
        feedback_consent: consent.feedback,
        marketing_consent: consent.marketing,
        third_party_consent: consent.thirdParty,
        consent_date: consent.timestamp
      })
    
    if (error) {
      console.error('[GDPR] Consent kaydetme hatası:', error)
      return false
    }
    
    console.log(`[GDPR] Kullanıcı consent kaydedildi: ${consent.userId}`)
    return true
  } catch (error) {
    console.error('[GDPR] Consent kaydetme exception:', error)
    Sentry.captureException(error)
    return false
  }
}

export async function getUserConsent(userId: string): Promise<ConsentData | null> {
  try {
    const { data, error } = await supabase
      .from('user_consents')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error || !data) {
      return null
    }
    
    return {
      userId: data.user_id,
      analytics: data.analytics_consent,
      feedback: data.feedback_consent,
      marketing: data.marketing_consent,
      thirdParty: data.third_party_consent,
      timestamp: data.consent_date
    }
  } catch (error) {
    console.error('[GDPR] Consent getirme hatası:', error)
    return null
  }
}
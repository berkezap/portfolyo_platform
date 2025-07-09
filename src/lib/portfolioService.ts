import { supabaseAdmin, Portfolio } from './supabase'
import { TemplateData } from '../types/templates'

// Portfolio oluşturma verisi
export interface CreatePortfolioData {
  user_id: string
  selected_template: string
  selected_repos: string[]
  cv_url?: string
  metadata?: Record<string, any>
}

// Portfolio servisi - Database CRUD operasyonları
export class PortfolioService {
  
  /**
   * Yeni portfolio kaydı oluştur
   */
  static async createPortfolio(data: CreatePortfolioData): Promise<Portfolio | null> {
    try {
      const { data: portfolio, error } = await supabaseAdmin
        .from('portfolios')
        .insert({
          user_id: data.user_id,
          selected_template: data.selected_template,
          selected_repos: data.selected_repos,
          cv_url: data.cv_url,
          metadata: data.metadata || {}
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Portfolio oluşturma hatası:', error)
        return null
      }

      console.log('✅ Portfolio başarıyla oluşturuldu:', portfolio.id)
      return portfolio
    } catch (error) {
      console.error('❌ Portfolio oluşturma exception:', error)
      return null
    }
  }

  /**
   * Portfolio'yu generated_url ile güncelle
   */
  static async updatePortfolioUrl(id: string, generated_url: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('portfolios')
        .update({ generated_url })
        .eq('id', id)

      if (error) {
        console.error('❌ Portfolio URL güncelleme hatası:', error)
        return false
      }

      console.log('✅ Portfolio URL güncellendi:', generated_url)
      return true
    } catch (error) {
      console.error('❌ Portfolio URL güncelleme exception:', error)
      return false
    }
  }

  /**
   * Kullanıcının portfolyolarını listele
   */
  static async getUserPortfolios(user_id: string): Promise<Portfolio[]> {
    try {
      const { data: portfolios, error } = await supabaseAdmin
        .from('portfolios')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Portfolio listeleme hatası:', error)
        return []
      }

      return portfolios || []
    } catch (error) {
      console.error('❌ Portfolio listeleme exception:', error)
      return []
    }
  }

  /**
   * Portfolio detayını getir
   */
  static async getPortfolio(id: string): Promise<Portfolio | null> {
    try {
      const { data: portfolio, error } = await supabaseAdmin
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ Portfolio getirme hatası:', error)
        return null
      }

      return portfolio
    } catch (error) {
      console.error('❌ Portfolio getirme exception:', error)
      return null
    }
  }

  /**
   * Portfolio sil
   */
  static async deletePortfolio(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('portfolios')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Portfolio silme hatası:', error)
        return false
      }

      console.log('✅ Portfolio başarıyla silindi:', id)
      return true
    } catch (error) {
      console.error('❌ Portfolio silme exception:', error)
      return false
    }
  }

  /**
   * Template data'sından metadata oluştur
   */
  static createMetadataFromTemplateData(templateData: TemplateData, templateName: string): Record<string, any> {
    return {
      user: templateData.USER_NAME,
      repoCount: templateData.projects.length,
      totalStars: templateData.TOTAL_STARS,
      template: templateName,
      user_bio: templateData.USER_BIO,
      user_avatar: templateData.USER_AVATAR,
      user_email: templateData.USER_EMAIL,
      github_url: templateData.GITHUB_URL,
      total_repos: templateData.TOTAL_REPOS,
      years_experience: templateData.YEARS_EXPERIENCE,
      generated_at: new Date().toISOString()
    }
  }
} 
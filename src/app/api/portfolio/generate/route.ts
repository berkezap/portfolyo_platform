import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GitHubService } from '@/lib/github'
import { renderTemplate, formatUserDataForTemplate } from '@/lib/templateEngine'
import { PortfolioService } from '@/lib/portfolioService'

export async function POST(request: NextRequest) {
  console.log('🚀 Portfolio Generate API çağrıldı!')
  try {
    const session = await getServerSession(authOptions)
    console.log('🔐 Session var mı?', !!session)
    
    if (!session || !session.accessToken) {
      console.log('❌ Session veya accessToken yok!')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { templateName, selectedRepos, cvUrl } = await request.json()
    console.log('📂 Template name:', templateName)
    console.log('📋 Selected repos:', selectedRepos)
    console.log('📄 CV URL:', cvUrl)
    
    if (!templateName) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 })
    }

    // GitHub servisini kullanarak kullanıcı verilerini al
    const githubService = new GitHubService(session.accessToken)
    const [userData, repos] = await Promise.all([
      githubService.getUserData(),
      githubService.getUserRepos()
    ])

    // 🗃️ 1. ADIM: Portfolio kaydını database'e kaydet
    console.log('🗃️ Portfolio database\'e kaydediliyor...')
    const portfolioData = {
      user_id: session.user?.email || userData.login,
      selected_template: templateName,
      selected_repos: selectedRepos || [],
      cv_url: cvUrl
    }
    
    const savedPortfolio = await PortfolioService.createPortfolio(portfolioData)
    if (!savedPortfolio) {
      console.log('❌ Portfolio database\'e kaydedilemedi!')
      return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 })
    }
    console.log('✅ Portfolio başarıyla kaydedildi:', savedPortfolio.id)

    // 🎨 2. ADIM: Template data formatla ve HTML oluştur
    console.log('🔄 formatUserDataForTemplate çağrılıyor...')
    const templateData = formatUserDataForTemplate(userData, repos, selectedRepos)
    
    // CV URL'i template data'ya ekle
    if (cvUrl) {
      templateData.CV_URL = cvUrl
    }
    
    console.log('📊 Template data oluşturuldu:', {
      projectCount: templateData.projects?.length || 0,
      totalStars: templateData.TOTAL_STARS,
      userName: templateData.USER_NAME
    })

    // HTML render et
    console.log('🎨 renderTemplate çağrılıyor...')
    console.log('🧪 Template data keys:', Object.keys(templateData))
    
    const generatedHTML = renderTemplate(templateName, templateData)
    console.log('✅ Template render tamamlandı, HTML uzunluğu:', generatedHTML.length)
    console.log('🧪 Render sonrası ilk 500 karakter:', generatedHTML.substring(0, 500))

    // 🔗 3. ADIM: Metadata oluştur ve database'i güncelle
    const metadata = PortfolioService.createMetadataFromTemplateData(templateData, templateName)
    await PortfolioService.updatePortfolioUrl(savedPortfolio.id, `#generated-${savedPortfolio.id}`)

    return NextResponse.json({ 
      success: true,
      html: generatedHTML,
      portfolio: {
        id: savedPortfolio.id,
        user: userData.name || userData.login,
        template: templateName,
        selectedRepos: selectedRepos || [],
        repoCount: repos.length,
        totalStars: templateData.TOTAL_STARS,
        createdAt: savedPortfolio.created_at
      },
      metadata
    })
  } catch (error) {
    console.error('Portfolio generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate portfolio' }, 
      { status: 500 }
    )
  }
} 
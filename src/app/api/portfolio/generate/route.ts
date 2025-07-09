import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GitHubService } from '@/lib/github'
import { renderTemplate, formatUserDataForTemplate } from '@/lib/templateEngine'
import { PortfolioService } from '@/lib/portfolioService'

export async function POST(request: NextRequest) {
  console.log('🚀 Portfolio Generate API çağrıldı!')
  try {
    // Demo mode kontrolü
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    console.log('🎭 Demo mode:', demoMode)

    const { templateName, selectedRepos, cvUrl } = await request.json()
    console.log('📂 Template name:', templateName)
    console.log('📋 Selected repos:', selectedRepos)
    console.log('📄 CV URL:', cvUrl)
    
    if (!templateName) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 })
    }

    let userData, repos

    if (demoMode) {
      // Demo mode - Mock data kullan
      console.log('🎭 Demo mode: Mock data kullanılıyor')
      userData = {
        login: 'mockuser',
        name: 'Mock User',
        bio: 'Deneyimli yazılım geliştirici. React, Node.js ve modern web teknolojileri konusunda uzman.',
        avatar_url: 'https://via.placeholder.com/150',
        html_url: 'https://github.com/mockuser',
        location: 'İstanbul, Turkey',
        company: 'Tech Company',
        blog: 'https://mockuser.dev',
        public_repos: 25,
        followers: 150,
        following: 75
      }

      repos = [
        {
          id: 1,
          name: 'e-commerce-app',
          description: 'Modern React e-commerce application with Next.js, TypeScript and Stripe integration',
          html_url: 'https://github.com/mockuser/e-commerce-app',
          language: 'TypeScript',
          stargazers_count: 42,
          forks_count: 12,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-12-20T15:45:00Z',
          topics: ['react', 'nextjs', 'ecommerce', 'typescript'],
          homepage: 'https://my-shop.vercel.app'
        },
        {
          id: 2,
          name: 'task-manager-api',
          description: 'RESTful API for task management built with Node.js, Express, and MongoDB',
          html_url: 'https://github.com/mockuser/task-manager-api',
          language: 'JavaScript',
          stargazers_count: 18,
          forks_count: 5,
          created_at: '2024-02-10T08:20:00Z',
          updated_at: '2024-11-30T12:15:00Z',
          topics: ['nodejs', 'express', 'mongodb', 'api'],
          homepage: null
        },
        {
          id: 3,
          name: 'portfolio-website',
          description: 'Personal portfolio website with modern design and dark mode support',
          html_url: 'https://github.com/mockuser/portfolio-website',
          language: 'JavaScript',
          stargazers_count: 8,
          forks_count: 3,
          created_at: '2024-03-05T14:10:00Z',
          updated_at: '2024-10-15T09:30:00Z',
          topics: ['portfolio', 'website', 'responsive'],
          homepage: 'https://mockuser.dev'
        }
      ]
    } else {
      // Gerçek mode - GitHub API kullan
      const session = await getServerSession(authOptions)
      console.log('🔐 Session var mı?', !!session)
      
      if (!session || !session.accessToken) {
        console.log('❌ Session veya accessToken yok!')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // GitHub servisini kullanarak kullanıcı verilerini al
      const githubService = new GitHubService(session.accessToken)
      const [userDataResult, reposResult] = await Promise.all([
        githubService.getUserData(),
        githubService.getUserRepos()
      ])
      userData = userDataResult
      repos = reposResult
    }

    // 🗃️ 1. ADIM: Portfolio kaydını database'e kaydet
    let savedPortfolio
    if (demoMode) {
      // Demo mode - Mock portfolio ID oluştur
      console.log('🎭 Demo mode: Mock portfolio ID oluşturuluyor')
      savedPortfolio = {
        id: 'demo-portfolio-' + Date.now(),
        created_at: new Date().toISOString()
      }
    } else {
      console.log('🗃️ Portfolio database\'e kaydediliyor...')
      const session = await getServerSession(authOptions)
      const portfolioData = {
        user_id: session?.user?.email || userData.login,
        selected_template: templateName,
        selected_repos: selectedRepos || [],
        cv_url: cvUrl
      }
      
      savedPortfolio = await PortfolioService.createPortfolio(portfolioData)
      if (!savedPortfolio) {
        console.log('❌ Portfolio database\'e kaydedilemedi!')
        return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 })
      }
      console.log('✅ Portfolio başarıyla kaydedildi:', savedPortfolio.id)
    }

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
    
    // Doğru portfolio URL'ini kaydet
    const portfolioUrl = `/portfolio/${savedPortfolio.id}`
    await PortfolioService.updatePortfolioUrl(savedPortfolio.id, portfolioUrl)

    return NextResponse.json({ 
      success: true,
      html: generatedHTML,
      portfolioUrl: portfolioUrl,
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
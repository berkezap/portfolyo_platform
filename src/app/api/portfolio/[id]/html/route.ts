import { NextRequest, NextResponse } from 'next/server'
import { PortfolioService } from '@/lib/portfolioService'
import { renderTemplate, formatUserDataForTemplate } from '@/lib/templateEngine'
import { GitHubService } from '@/lib/github'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const portfolioId = resolvedParams.id
    
    console.log('🎨 Portfolio HTML API çağrıldı! ID:', portfolioId)
    
    // Portfolio verisini getir
    const portfolio = await PortfolioService.getPortfolio(portfolioId)
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }
    
    console.log('📋 Portfolio bulundu:', portfolio.selected_template)
    
    // Demo mode kontrolü
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    let userData, repos
    
    if (demoMode) {
      // Demo mode - Mock data kullan
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
          name: 'portfolio-platform',
          description: 'PortfolYO - 5 dakikada GitHub projelerinden portfolyo oluşturma platformu',
          html_url: 'https://github.com/mockuser/portfolio-platform',
          language: 'TypeScript',
          stargazers_count: 0,
          forks_count: 0,
          created_at: '2024-07-10T08:20:00Z',
          updated_at: '2024-12-20T15:45:00Z',
          topics: ['portfolio', 'nextjs', 'typescript'],
          homepage: null
        }
      ]
    } else {
      // Gerçek mode - GitHub API kullan (authentication olmadan mock data kullanacağız)
      // Çünkü portfolio görüntüleme public olmalı
      userData = {
        login: portfolio.metadata?.user || 'developer',
        name: portfolio.metadata?.user || 'Developer',
        bio: portfolio.metadata?.user_bio || 'Deneyimli yazılım geliştirici',
        avatar_url: portfolio.metadata?.user_avatar || 'https://via.placeholder.com/150',
        html_url: portfolio.metadata?.github_url || 'https://github.com',
        location: 'Turkey',
        company: 'Tech Company',
        blog: '',
        public_repos: portfolio.metadata?.total_repos || 5,
        followers: 50,
        following: 25
      }

      // Selected repos'u kullan
      repos = portfolio.selected_repos.map((repoName, index) => ({
        id: index + 1,
        name: repoName,
        description: `${repoName} project description`,
        html_url: `https://github.com/${portfolio.metadata?.user || 'developer'}/${repoName}`,
        language: 'TypeScript',
        stargazers_count: Math.floor(Math.random() * 50),
        forks_count: Math.floor(Math.random() * 10),
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-12-20T15:45:00Z',
        topics: ['web', 'javascript'],
        homepage: null
      }))
    }
    
    // Template data formatla
    const templateData = formatUserDataForTemplate(userData, repos, portfolio.selected_repos)
    
    // CV URL'i ekle
    if (portfolio.cv_url) {
      templateData.CV_URL = portfolio.cv_url
    }
    
    // HTML render et
    const generatedHTML = renderTemplate(portfolio.selected_template, templateData)
    
    console.log('✅ Portfolio HTML oluşturuldu, uzunluk:', generatedHTML.length)
    
    return NextResponse.json({
      success: true,
      html: generatedHTML,
      portfolio: {
        id: portfolio.id,
        template: portfolio.selected_template,
        createdAt: portfolio.created_at
      }
    })
    
  } catch (error) {
    console.error('❌ Portfolio HTML hatası:', error)
    return NextResponse.json(
      { error: 'Failed to generate portfolio HTML' },
      { status: 500 }
    )
  }
} 
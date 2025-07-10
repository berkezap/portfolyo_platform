import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PortfolioService } from '@/lib/portfolioService'

export async function GET() {
  console.log('📋 Portfolio List API çağrıldı!')
  
  try {
    // 🔐 Session kontrolü
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log('❌ Session yok, unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.email
    console.log('👤 User ID:', userId)

    // 📊 Kullanıcının portfolyolarını getir
    const portfolios = await PortfolioService.getUserPortfolios(userId)
    
    console.log(`✅ ${portfolios.length} portfolio bulundu:`)
    portfolios.forEach(portfolio => {
      console.log(`  - ${portfolio.id} (${portfolio.selected_template}, ${portfolio.metadata?.repoCount || '?'} repo)`)
    })

    // 📋 Portfolio listesini formatla
    const formattedPortfolios = portfolios.map(portfolio => ({
      id: portfolio.id,
      template: portfolio.selected_template,
      selectedRepos: portfolio.selected_repos || [],
      cvUrl: portfolio.cv_url,
      createdAt: portfolio.created_at,
      updatedAt: portfolio.updated_at,
      metadata: portfolio.metadata || {}
    }))

    return NextResponse.json({
      success: true,
      portfolios: formattedPortfolios,
      count: portfolios.length
    })

  } catch (error) {
    console.error('💥 Portfolio list hatası:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    )
  }
}

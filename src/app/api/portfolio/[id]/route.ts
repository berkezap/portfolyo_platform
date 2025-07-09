import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PortfolioService } from '@/lib/portfolioService'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const portfolioId = resolvedParams.id
    
    console.log('📋 Portfolio GET API çağrıldı! ID:', portfolioId)
    
    // Session kontrolü
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Portfolio verisini getir
    const portfolio = await PortfolioService.getPortfolio(portfolioId)
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }
    
    // Kullanıcı kontrolü - sadece portfolio sahibi erişebilir
    if (portfolio.user_id !== session.user.email) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    // Portfolio verisini formatla
    const formattedPortfolio = {
      id: portfolio.id,
      template: portfolio.selected_template,
      selectedRepos: portfolio.selected_repos || [],
      cvUrl: portfolio.cv_url,
      url: portfolio.generated_url,
      createdAt: portfolio.created_at,
      updatedAt: portfolio.updated_at,
      metadata: portfolio.metadata || {}
    }
    
    console.log('✅ Portfolio başarıyla alındı:', portfolioId)
    
    return NextResponse.json({
      success: true,
      portfolio: formattedPortfolio
    })
    
  } catch (error) {
    console.error('❌ Portfolio GET hatası:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const portfolioId = resolvedParams.id
    
    console.log('🔄 Portfolio PATCH API çağrıldı! ID:', portfolioId)
    
    // Session kontrolü
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Mevcut portfolio'yu kontrol et
    const existingPortfolio = await PortfolioService.getPortfolio(portfolioId)
    if (!existingPortfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }
    
    // Kullanıcı kontrolü - sadece portfolio sahibi güncelleyebilir
    if (existingPortfolio.user_id !== session.user.email) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    // Update verilerini al
    const updateData = await request.json()
    console.log('📝 Güncelleme verileri:', updateData)
    
    // Güncelleme verilerini portfolyo format'ına çevir
    const portfolioUpdateData: any = {}
    
    if (updateData.template) {
      portfolioUpdateData.selected_template = updateData.template
    }
    
    if (updateData.selectedRepos) {
      portfolioUpdateData.selected_repos = updateData.selectedRepos
    }
    
    if (updateData.cvUrl !== undefined) {
      portfolioUpdateData.cv_url = updateData.cvUrl
    }
    
    // Metadata'yı güncelle
    const newMetadata = {
      ...existingPortfolio.metadata,
      ...updateData.metadata
    }
    portfolioUpdateData.metadata = newMetadata
    
    // Portfolio'yu güncelle
    const updatedPortfolio = await PortfolioService.updatePortfolio(portfolioId, portfolioUpdateData)
    
    if (!updatedPortfolio) {
      return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
    }
    
    // Güncellenmiş portfolio'yu formatla
    const formattedPortfolio = {
      id: updatedPortfolio.id,
      template: updatedPortfolio.selected_template,
      selectedRepos: updatedPortfolio.selected_repos || [],
      cvUrl: updatedPortfolio.cv_url,
      url: updatedPortfolio.generated_url,
      createdAt: updatedPortfolio.created_at,
      updatedAt: updatedPortfolio.updated_at,
      metadata: updatedPortfolio.metadata || {}
    }
    
    console.log('✅ Portfolio başarıyla güncellendi:', portfolioId)
    
    return NextResponse.json({
      success: true,
      portfolio: formattedPortfolio
    })
    
  } catch (error) {
    console.error('❌ Portfolio PATCH hatası:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const portfolioId = resolvedParams.id
    
    console.log('🗑️ Portfolio DELETE API çağrıldı! ID:', portfolioId)
    
    // Session kontrolü
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Mevcut portfolio'yu kontrol et
    const existingPortfolio = await PortfolioService.getPortfolio(portfolioId)
    if (!existingPortfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }
    
    // Kullanıcı kontrolü - sadece portfolio sahibi silebilir
    if (existingPortfolio.user_id !== session.user.email) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    // Portfolio'yu sil
    const success = await PortfolioService.deletePortfolio(portfolioId)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
    }
    
    console.log('✅ Portfolio başarıyla silindi:', portfolioId)
    
    return NextResponse.json({
      success: true,
      message: 'Portfolio deleted successfully'
    })
    
  } catch (error) {
    console.error('❌ Portfolio DELETE hatası:', error)
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    )
  }
}

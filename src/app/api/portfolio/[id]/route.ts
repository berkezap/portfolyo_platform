import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PortfolioService } from '@/lib/portfolioService'

// GET - Portfolio detayını getir (public access)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Portfolio detayı getiriliyor:', params.id)
    
    const portfolio = await PortfolioService.getPortfolio(params.id)
    
    if (!portfolio) {
      console.log('❌ Portfolio bulunamadı:', params.id)
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    console.log('✅ Portfolio bulundu:', portfolio.id)
    
    return NextResponse.json({
      success: true,
      portfolio: {
        id: portfolio.id,
        template: portfolio.selected_template,
        selectedRepos: portfolio.selected_repos,
        cvUrl: portfolio.cv_url,
        generatedHtml: portfolio.generated_url, // This should contain the HTML content
        metadata: portfolio.metadata,
        createdAt: portfolio.created_at,
        updatedAt: portfolio.updated_at
      }
    })

  } catch (error) {
    console.error('💥 Portfolio getirme hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Portfolio güncelle (requires authentication and ownership)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔄 Portfolio güncelleniyor:', params.id)
    
    // Session kontrolü
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log('❌ Unauthorized - session yok')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Portfolio'nun varlığını ve sahipliğini kontrol et
    const existingPortfolio = await PortfolioService.getPortfolio(params.id)
    if (!existingPortfolio) {
      console.log('❌ Portfolio bulunamadı:', params.id)
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // Ownership kontrolü
    if (existingPortfolio.user_id !== session.user.email) {
      console.log('❌ Ownership violation:', {
        portfolioOwner: existingPortfolio.user_id,
        currentUser: session.user.email
      })
      return NextResponse.json(
        { success: false, error: 'Access denied - You can only edit your own portfolios' },
        { status: 403 }
      )
    }

    const updateData = await request.json()
    console.log('📝 Update data:', updateData)

    const updatedPortfolio = await PortfolioService.updatePortfolio(params.id, updateData)
    
    if (!updatedPortfolio) {
      return NextResponse.json(
        { success: false, error: 'Failed to update portfolio' },
        { status: 500 }
      )
    }

    console.log('✅ Portfolio güncellendi:', updatedPortfolio.id)
    
    return NextResponse.json({
      success: true,
      portfolio: updatedPortfolio
    })

  } catch (error) {
    console.error('💥 Portfolio güncelleme hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Portfolio sil (requires authentication and ownership)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🗑️ Portfolio siliniyor:', params.id)
    
    // Session kontrolü
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log('❌ Unauthorized - session yok')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Portfolio'nun varlığını ve sahipliğini kontrol et
    const existingPortfolio = await PortfolioService.getPortfolio(params.id)
    if (!existingPortfolio) {
      console.log('❌ Portfolio bulunamadı:', params.id)
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // Ownership kontrolü
    if (existingPortfolio.user_id !== session.user.email) {
      console.log('❌ Ownership violation:', {
        portfolioOwner: existingPortfolio.user_id,
        currentUser: session.user.email
      })
      return NextResponse.json(
        { success: false, error: 'Access denied - You can only delete your own portfolios' },
        { status: 403 }
      )
    }

    const deleted = await PortfolioService.deletePortfolio(params.id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete portfolio' },
        { status: 500 }
      )
    }

    console.log('✅ Portfolio silindi:', params.id)
    
    return NextResponse.json({
      success: true,
      message: 'Portfolio successfully deleted'
    })

  } catch (error) {
    console.error('💥 Portfolio silme hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  console.log('🗄️ Supabase test başlıyor...')
  
  try {
    // Database bağlantı testi
    const { data, error } = await supabaseAdmin
      .from('portfolios')
      .select('count(*)', { count: 'exact', head: true })

    if (error) {
      console.log('❌ Supabase bağlantı hatası:', error)
      return NextResponse.json({
        status: 'error',
        error: error.message
      }, { status: 500 })
    }

    console.log('✅ Supabase bağlantı başarılı!')
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection working!'
    })

  } catch (error) {
    console.error('💥 Test failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Test failed'
    }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  console.log('🗄️ Supabase test başlıyor...')
  
  try {
    // Optimized bağlantı testi (daha hızlı timeout)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database timeout')), 2000) // 2 saniye timeout (optimized)
    })
    
    const dbPromise = supabaseAdmin
      .from('portfolios')
      .select('id')
      .limit(1)
      .maybeSingle() // Daha hızlı query
    
    const { data, error } = await Promise.race([
      dbPromise,
      timeoutPromise
    ])

    if (error) {
      console.log('❌ Supabase bağlantı hatası:', error)
      
      // Eğer tablo yoksa, bu normal bir durum
      if (error.code === '42P01') { // undefined_table
        return NextResponse.json({
          status: 'warning',
          message: 'Database connected but portfolios table not found. Please run database/schema.sql in Supabase SQL Editor.',
          error: error.message
        }, { status: 200 })
      }
      
      return NextResponse.json({
        status: 'error',
        error: error.message
      }, { status: 500 })
    }

    console.log('✅ Supabase bağlantı başarılı!')
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection working!',
      data: data
    })

  } catch (error) {
    console.error('💥 Test failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

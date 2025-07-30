import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Demo mode kontrolü
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    
    let userEmail: string
    
    if (demoMode) {
      // Demo mode - test email kullan
      userEmail = 'test@example.com'
    } else {
      // Gerçek mode - session kontrolü
      const session = await getServerSession(authOptions)
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      userEmail = session.user.email
    }

    const { fileName, fileType } = await request.json()
    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'Missing file info' }, { status: 400 })
    }

    const ext = fileName.split('.').pop() || 'pdf'
    const objectName = `${userEmail}/${crypto.randomUUID()}.${ext}`

    // Create signed upload URL (valid 60 seconds)
    const { data, error } = await supabaseAdmin.storage
      .from('cvs')
      .createSignedUploadUrl(objectName)

    if (error || !data) {
      console.error('Supabase signed URL error', error)
      return NextResponse.json({ error: 'Failed to create upload url' }, { status: 500 })
    }

    const publicUrl = supabaseAdmin.storage.from('cvs').getPublicUrl(objectName).data.publicUrl

    return NextResponse.json({ uploadUrl: data.signedUrl, publicUrl })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal' }, { status: 500 })
  }
} 
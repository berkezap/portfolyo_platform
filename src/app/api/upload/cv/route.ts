import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Demo mode kontrolü
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    let userEmail: string;

    if (demoMode) {
      // Demo mode - test email kullan
      userEmail = 'test@example.com';
    } else {
      // Gerçek mode - session kontrolü
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userEmail = session.user.email;
    }

    const { fileName, fileType } = await request.json();
    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'Missing file info' }, { status: 400 });
    }

    // Server-side validation (accept only PDF)
    if (fileType !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Validate environment configuration for Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Supabase client env vars missing (URL/ANON_KEY)' },
        { status: 500 },
      );
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase service role key missing (SUPABASE_SERVICE_ROLE_KEY)' },
        { status: 500 },
      );
    }

    const ext = fileName.split('.').pop() || 'pdf';
    const objectName = `${userEmail}/${crypto.randomUUID()}.${ext}`;

    // Create signed upload URL (valid 60 seconds)
    const { data, error } = await supabaseAdmin.storage
      .from('cvs')
      .createSignedUploadUrl(objectName);

    if (error || !data) {
      console.error('Supabase signed URL error', error);
      const message = (error as any)?.message || 'Failed to create upload url';
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const publicUrl = supabaseAdmin.storage.from('cvs').getPublicUrl(objectName).data.publicUrl;

    return NextResponse.json({ uploadUrl: data.signedUrl, publicUrl });
  } catch (err) {
    console.error('CV upload route error', err);
    const message = err instanceof Error ? err.message : 'Internal';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

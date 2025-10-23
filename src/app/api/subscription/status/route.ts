import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Default response for unauthenticated users
    if (!session?.user?.email) {
      return NextResponse.json({
        plan: 'FREE',
        isPro: false,
        status: 'active',
      });
    }

    console.log('🔍 Checking subscription for:', session.user.email);

    // Check user subscription in database
    const { data, error } = await supabaseAdmin
      .from('user_subscriptions')
      .select('plan, status, end_date')
      .eq('user_email', session.user.email)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Subscription check error:', error);
      return NextResponse.json({
        plan: 'FREE',
        isPro: false,
        status: 'active',
      });
    }

    // If no subscription record exists, user is on FREE plan
    if (!data) {
      return NextResponse.json({
        plan: 'FREE',
        isPro: false,
        status: 'active',
      });
    }

    // Check if PRO subscription is active and not expired
    const isPro =
      data.plan === 'PRO' &&
      data.status === 'active' &&
      (!data.end_date || new Date(data.end_date) > new Date());

    return NextResponse.json({
      plan: isPro ? 'PRO' : 'FREE',
      isPro,
      status: data.status,
      endDate: data.end_date,
    });
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json({
      plan: 'FREE',
      isPro: false,
      status: 'active',
    });
  }
}

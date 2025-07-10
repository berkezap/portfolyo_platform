import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client (RLS aktif)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (RLS bypass - admin yetkisi)
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Portfolio {
  id: string
  user_id: string
  selected_template: string
  selected_repos: string[]
  cv_url?: string
  generated_html?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
} 
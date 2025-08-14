import { z } from 'zod'

const EnvSchema = z.object({
  // Node.js environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  
  // GitHub OAuth
  GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required'),
  GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required'),
  
  // Optional: Redis (Upstash)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  
  // Optional: Monitoring
  SENTRY_DSN: z.string().url().optional(),
  
  // App configuration
  FREE_TIER_MAX_PORTFOLIOS: z.coerce.number().int().positive().default(1),
  NEXT_PUBLIC_APP_VERSION: z.string().default('dev'),
  NEXT_PUBLIC_DEMO_MODE: z.enum(['true', 'false']).default('false'),
})

function validateEnv() {
  try {
    return EnvSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n')
      
      console.error('❌ Environment validation failed:')
      console.error(missingVars)
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Environment validation failed in production:\n${missingVars}`)
      } else {
        console.warn('⚠️ Environment validation failed in development - some features may not work')
        // Return partial env for development
        return process.env as any
      }
    }
    throw error
  }
}

export const env = validateEnv()

// Type export for use in other files
export type Env = z.infer<typeof EnvSchema>

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Redis bağlantısı (Upstash kullanıyoruz)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'http://localhost:6379',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Rate limiter oluşturma (sadece Redis varsa)
export const rateLimiter = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '10 s'), // 10 saniyede 20 istek
      analytics: true,
      prefix: '@upstash/ratelimit',
    })
  : null

// IP adresi alma fonksiyonu
export function getIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1'
  return ip
}

// Rate limit kontrolü
export async function checkRateLimit(request: Request) {
  const ip = getIP(request)
  
  // Rate limiter yoksa varsayılan olarak izin ver
  if (!rateLimiter) {
    return {
      success: true,
      limit: 100,
      reset: Date.now() + 60000,
      remaining: 99,
      ip
    }
  }
  
  const { success, limit, reset, remaining } = await rateLimiter.limit(ip)
  
  return {
    success,
    limit,
    reset,
    remaining,
    ip
  }
} 
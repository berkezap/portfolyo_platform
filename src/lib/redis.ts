import { Redis as UpstashRedis } from '@upstash/redis'

// Detect Upstash Redis availability
const hasUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

// Cache service interface
interface ICacheService {
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>
  get<T>(key: string): Promise<T | null>
  delete(key: string): Promise<void>
  clear(): Promise<void>
  getStats(): Promise<{ keys: number; memory: string }>
  healthCheck(): Promise<boolean>
}

// In-memory cache implementation (fallback)
class InMemoryCacheService implements ICacheService {
  private memoryCache = new Map<string, { value: unknown; expiry: number }>()

  constructor() {
    console.log('⚠️ Using in-memory cache (Redis disabled)')
  }

  async set(key: string, value: unknown, ttlSeconds: number = 300): Promise<void> {
    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000,
    })
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = this.memoryCache.get(key)
    if (!cached || cached.expiry < Date.now()) {
      this.memoryCache.delete(key)
      return null
    }
    return cached.value as T
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key)
  }

  async clear(): Promise<void> {
    this.memoryCache.clear()
  }

  async getStats(): Promise<{ keys: number; memory: string }> {
    return { keys: this.memoryCache.size, memory: 'in-memory' }
  }

  async healthCheck(): Promise<boolean> {
    return true
  }
}

// Upstash Redis implementation (production)
class UpstashCacheService implements ICacheService {
  private redis: UpstashRedis

  constructor(url: string, token: string) {
    this.redis = new UpstashRedis({ url, token })
    console.log('✅ Using Upstash Redis for cache and rate limiting')
  }

  async set(key: string, value: unknown, ttlSeconds: number = 300): Promise<void> {
    // Upstash supports numbers/strings/JSON
    await this.redis.set(key, value as any, { ex: ttlSeconds })
  }

  async get<T>(key: string): Promise<T | null> {
    const v = (await this.redis.get<T>(key)) as T | null
    return v === undefined ? null : v
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async clear(): Promise<void> {
    // Not supported without key listing; noop
  }

  async getStats(): Promise<{ keys: number; memory: string }> {
    return { keys: 0, memory: 'upstash' }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const client: any = this.redis as any
      if (typeof client.ping === 'function') {
        const res = await client.ping()
        return !!res
      }
      const key = `health:${Date.now()}`
      await this.redis.set(key, 1, { ex: 5 })
      const val = await this.redis.get<number>(key)
      return val === 1
    } catch (e) {
      console.error('Redis health check failed:', e)
      return false
    }
  }
}

// Choose implementation
const cacheImpl: ICacheService = hasUpstash
  ? new UpstashCacheService(
      process.env.UPSTASH_REDIS_REST_URL as string,
      process.env.UPSTASH_REDIS_REST_TOKEN as string
    )
  : new InMemoryCacheService()

// Export singleton compatible with previous API
export const cacheService = cacheImpl
export const redis = hasUpstash
  ? new UpstashRedis({
      url: process.env.UPSTASH_REDIS_REST_URL as string,
      token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
    })
  : null
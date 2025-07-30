// In-memory cache service (Redis disabled for now)
console.log('⚠️ Using in-memory cache (Redis disabled)')

// Cache service class
export class CacheService {
  private static instance: CacheService
  private memoryCache = new Map<string, { value: any; expiry: number }>()

  constructor() {
    // In-memory cache only
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  // Set cache with TTL
  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    try {
      this.memoryCache.set(key, {
        value,
        expiry: Date.now() + (ttlSeconds * 1000)
      })
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  // Get cache value
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = this.memoryCache.get(key)
      if (!cached || cached.expiry < Date.now()) {
        this.memoryCache.delete(key)
        return null
      }
      return cached.value as T
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  // Delete cache key
  async delete(key: string): Promise<void> {
    try {
      this.memoryCache.delete(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    try {
      this.memoryCache.clear()
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }

  // Get cache stats
  async getStats(): Promise<{ keys: number; memory: string }> {
    try {
      return { keys: this.memoryCache.size, memory: 'in-memory' }
    } catch (error) {
      console.error('Cache stats error:', error)
      return { keys: 0, memory: 'unknown' }
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      return true // In-memory cache is always healthy
    } catch (error) {
      console.error('Cache health check failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance()

// Export empty redis for compatibility
export const redis = null 
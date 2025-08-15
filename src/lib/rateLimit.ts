import { NextRequest, NextResponse } from 'next/server';
import { cacheService } from './redis';
import { randomUUID } from 'crypto';

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000, // Max requests per window - increased for testing
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  keyGenerator: (req: NextRequest) => {
    // Use IP address as key, fallback to user agent
    return req.headers.get('x-forwarded-for') || req.headers.get('user-agent') || 'unknown';
  },
};

// Rate limit middleware
export async function rateLimitMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const key = RATE_LIMIT_CONFIG.keyGenerator(request);
  const cacheKey = `rate_limit:${key}`;

  try {
    // Get current request count
    const currentCount = (await cacheService.get<number>(cacheKey)) || 0;

    // Check if limit exceeded
    if (currentCount >= RATE_LIMIT_CONFIG.maxRequests) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again in ${Math.ceil(RATE_LIMIT_CONFIG.windowMs / 60000)} minutes.`,
          retryAfter: Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_CONFIG.windowMs).toISOString(),
          },
        },
      );
    }

    // Increment counter
    await cacheService.set(
      cacheKey,
      currentCount + 1,
      Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000),
    );

    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString());
    response.headers.set(
      'X-RateLimit-Remaining',
      (RATE_LIMIT_CONFIG.maxRequests - currentCount - 1).toString(),
    );
    response.headers.set(
      'X-RateLimit-Reset',
      new Date(Date.now() + RATE_LIMIT_CONFIG.windowMs).toISOString(),
    );

    return null; // Continue to next middleware/handler
  } catch (error) {
    console.error('Rate limit error:', error);
    // If Redis fails, allow request to continue
    return null;
  }
}

// Specific rate limits for different endpoints
export const ENDPOINT_RATE_LIMITS = {
  '/api/github/repos': { maxRequests: 30, windowMs: 15 * 60 * 1000 }, // GitHub API limit
  '/api/portfolio/generate': { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // Heavy operation
  '/api/upload/cv': { maxRequests: 20, windowMs: 15 * 60 * 1000 }, // File upload
  '/api/portfolio/list': { maxRequests: 50, windowMs: 15 * 60 * 1000 }, // Light operation
};

// Get rate limit config for specific endpoint
export function getRateLimitConfig(pathname: string) {
  return ENDPOINT_RATE_LIMITS[pathname as keyof typeof ENDPOINT_RATE_LIMITS] || RATE_LIMIT_CONFIG;
}

// Rate limit decorator for API routes
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: NextRequest) => string;
}

export function withRateLimit(
  handler: (request: NextRequest, ...args: unknown[]) => Promise<NextResponse | unknown>,
  customConfig?: RateLimitConfig,
) {
  return async (request: NextRequest, ...args: unknown[]) => {
    // TEMPORARILY DISABLED: Rate limiting is disabled for testing
    // TODO: Re-enable rate limiting in production
    console.log('⚠️ Rate limiting temporarily disabled for:', request.nextUrl.pathname);
    return handler(request, ...args);
  };
}

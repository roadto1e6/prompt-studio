import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface RateLimitOptions {
  max: number; // Maximum requests
  timeWindow: number; // Time window in milliseconds
  keyGenerator?: (request: FastifyRequest) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for multi-instance)
const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime < now) {
      store.delete(key);
    }
  }
}, 60000); // Cleanup every minute

export function createRateLimiter(options: RateLimitOptions) {
  const { max, timeWindow, keyGenerator } = options;

  return async function rateLimitMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    // Generate key (default: IP address)
    const key = keyGenerator
      ? keyGenerator(request)
      : request.ip || 'unknown';

    const now = Date.now();
    let entry = store.get(key);

    // Reset if window expired
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + timeWindow,
      };
    }

    entry.count++;
    store.set(key, entry);

    // Set rate limit headers
    const remaining = Math.max(0, max - entry.count);
    const reset = Math.ceil((entry.resetTime - now) / 1000);

    reply.header('X-RateLimit-Limit', max);
    reply.header('X-RateLimit-Remaining', remaining);
    reply.header('X-RateLimit-Reset', reset);

    // Check if limit exceeded
    if (entry.count > max) {
      reply.header('Retry-After', reset);
      return reply.status(429).send({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later',
          retryAfter: reset,
        },
      });
    }
  };
}

// Pre-configured rate limiters
export const rateLimiters = {
  // Strict: 5 requests per minute (for login/register)
  strict: createRateLimiter({
    max: 5,
    timeWindow: 60 * 1000,
  }),

  // Standard: 100 requests per minute
  standard: createRateLimiter({
    max: 100,
    timeWindow: 60 * 1000,
  }),

  // Relaxed: 300 requests per minute
  relaxed: createRateLimiter({
    max: 300,
    timeWindow: 60 * 1000,
  }),

  // API: 1000 requests per minute
  api: createRateLimiter({
    max: 1000,
    timeWindow: 60 * 1000,
  }),
};

// Plugin to register global rate limiting
export async function rateLimitPlugin(fastify: FastifyInstance) {
  fastify.addHook('onRequest', rateLimiters.api);
}

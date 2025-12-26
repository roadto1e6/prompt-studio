import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

/**
 * Security headers middleware
 * Adds security-related HTTP headers to all responses
 */
export async function securityHeaders(fastify: FastifyInstance) {
  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply) => {
    // Prevent clickjacking
    reply.header('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    reply.header('X-Content-Type-Options', 'nosniff');

    // XSS protection (legacy, but still useful for older browsers)
    reply.header('X-XSS-Protection', '1; mode=block');

    // Referrer policy
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions policy (disable unnecessary features)
    reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Content Security Policy (API server - restrictive)
    reply.header('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");

    // Strict Transport Security (HTTPS only in production)
    if (process.env.NODE_ENV === 'production') {
      reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
  });
}

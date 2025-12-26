import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ShareService } from './share.service.js';
import { createShareSchema, accessShareSchema } from './share.schema.js';
import { success, errors } from '../../utils/response.js';
import { rateLimiters } from '../../middlewares/index.js';

export async function shareRoutes(fastify: FastifyInstance) {
  const shareService = new ShareService();

  // ============================================
  // Public routes (no auth required)
  // These must be registered BEFORE the auth hook
  // ============================================

  // GET /shares/:code - Get share content (public, matches frontend API)
  fastify.get('/:code', {
    preHandler: async (request, reply) => {
      // Skip auth for share code routes (8-char alphanumeric)
      const { code } = request.params as { code: string };
      if (/^[A-Za-z0-9]{8}$/.test(code)) {
        return; // Allow without auth
      }
      // Otherwise, require auth
      try {
        await request.jwtVerify();
        const decoded = request.user as { userId: string };
        request.userId = decoded.userId;
      } catch {
        return errors.unauthorized(reply, 'Invalid or expired token');
      }
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { code } = request.params as { code: string };

      // If it's a share code format, return share content
      if (/^[A-Za-z0-9]{8}$/.test(code)) {
        const result = await shareService.accessShare(code);

        // Transform to match frontend expected format
        const shareData = result.data as Record<string, unknown>;
        const promptData = shareData.type === 'prompt'
          ? shareData.prompt as Record<string, unknown>
          : null;

        success(reply, {
          prompt: promptData,
          viewCount: result.viewCount,
          createdAt: result.createdAt,
        });
        return;
      }

      // Otherwise it's not a valid share code
      return errors.notFound(reply, 'Share not found');
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Share not found') {
          return errors.notFound(reply, err.message);
        }
        if (err.message === 'Share link has expired') {
          return errors.badRequest(reply, err.message);
        }
        if (err.message === 'Password required') {
          return errors.badRequest(reply, err.message);
        }
      }
      return errors.internal(reply);
    }
  });

  // GET /shares/public/:code/check - Check if share requires password (legacy)
  fastify.get(
    '/public/:code/check',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { code } = request.params as { code: string };
        const result = await shareService.checkShare(code);
        success(reply, result);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Share not found') {
            return errors.notFound(reply, err.message);
          }
          if (err.message === 'Share link has expired') {
            return errors.badRequest(reply, err.message);
          }
        }
        return errors.internal(reply);
      }
    }
  );

  // POST /shares/public/:code/access - Access share content (legacy with password)
  // Add rate limiting to prevent brute force attacks on password-protected shares
  fastify.post(
    '/public/:code/access',
    { preHandler: rateLimiters.strict },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { code } = request.params as { code: string };
        const input = accessShareSchema.parse(request.body);
        const result = await shareService.accessShare(code, input.password);
        success(reply, result);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Share not found') {
            return errors.notFound(reply, err.message);
          }
          if (
            err.message === 'Share link has expired' ||
            err.message === 'Password required' ||
            err.message === 'Invalid password'
          ) {
            return errors.badRequest(reply, err.message);
          }
        }
        return errors.internal(reply);
      }
    }
  );

  // ============================================
  // Protected routes (auth required)
  // ============================================

  // Use a sub-plugin for protected routes
  fastify.register(async (protectedRoutes) => {
    // Auth hook for protected routes
    protectedRoutes.addHook('onRequest', async (request, reply) => {
      try {
        await request.jwtVerify();
        const decoded = request.user as { userId: string };
        request.userId = decoded.userId;
      } catch {
        return errors.unauthorized(reply, 'Invalid or expired token');
      }
    });

    // GET /shares/my - Get user's shares (use /my to avoid conflict with /:code)
    protectedRoutes.get('/my', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const shares = await shareService.getUserShares(request.userId!);
        success(reply, shares);
      } catch (err) {
        return errors.internal(reply);
      }
    });

    // GET /shares/stats - Get stats
    protectedRoutes.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const stats = await shareService.getStats(request.userId!);
        success(reply, stats);
      } catch (err) {
        return errors.internal(reply);
      }
    });

    // POST /shares - Create share
    protectedRoutes.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const input = createShareSchema.parse(request.body);
        const share = await shareService.createShare(request.userId!, input);
        success(reply, share, 201);
      } catch (err) {
        if (err instanceof Error) {
          if (
            err.message === 'Prompt not found' ||
            err.message === 'Collection not found'
          ) {
            return errors.notFound(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    });

    // DELETE /shares/:id - Delete share
    protectedRoutes.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        await shareService.deleteShare(request.userId!, id);
        success(reply, { message: 'Share deleted' });
      } catch (err) {
        if (err instanceof Error && err.message === 'Share not found') {
          return errors.notFound(reply, err.message);
        }
        return errors.internal(reply);
      }
    });
  });
}

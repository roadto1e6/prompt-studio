import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ModelService } from './model.service.js';
import {
  createProviderSchema,
  updateProviderSchema,
  createModelSchema,
  updateModelSchema,
  queryModelsSchema,
} from './model.schema.js';
import { success, errors } from '../../utils/response.js';

export async function modelRoutes(fastify: FastifyInstance) {
  const modelService = new ModelService();

  // ============================================
  // Public routes (no auth required)
  // ============================================

  // GET /models - Get all models and providers (public)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = queryModelsSchema.parse(request.query);
      const data = await modelService.getModels(query);
      success(reply, data);
    } catch (err) {
      if (err instanceof Error) {
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // GET /models/providers - Get provider list (public)
  fastify.get('/providers', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const providers = await modelService.getProviders();
      success(reply, providers);
    } catch (err) {
      return errors.internal(reply);
    }
  });

  // GET /models/providers/:id - Get single provider with models (public)
  fastify.get('/providers/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const provider = await modelService.getProvider(id);
      success(reply, provider);
    } catch (err) {
      if (err instanceof Error && err.message === 'Provider not found') {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // GET /models/:id - Get single model (public)
  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      // Skip if id matches other route patterns
      if (['providers', 'stats'].includes(id)) {
        return;
      }
      const model = await modelService.getModel(id);
      success(reply, model);
    } catch (err) {
      if (err instanceof Error && err.message === 'Model not found') {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // GET /models/stats - Get model statistics (public)
  fastify.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await modelService.getStats();
      success(reply, stats);
    } catch (err) {
      return errors.internal(reply);
    }
  });

  // ============================================
  // Protected routes (auth required)
  // ============================================

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

    // ============================================
    // Provider Management (Crowdsourced)
    // ============================================

    // POST /models/providers - Create provider
    protectedRoutes.post('/providers', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const input = createProviderSchema.parse(request.body);
        const provider = await modelService.createProvider(request.userId!, input);
        success(reply, provider, 201);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Provider ID already exists') {
            return errors.badRequest(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    });

    // PATCH /models/providers/:id - Update provider
    protectedRoutes.patch('/providers/:id', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const input = updateProviderSchema.parse(request.body);
        const provider = await modelService.updateProvider(request.userId!, id, input);
        success(reply, provider);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Provider not found') {
            return errors.notFound(reply, err.message);
          }
          if (err.message.includes('only update')) {
            return errors.forbidden(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    });

    // DELETE /models/providers/:id - Delete provider
    protectedRoutes.delete('/providers/:id', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        await modelService.deleteProvider(request.userId!, id);
        success(reply, { message: 'Provider deleted' });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Provider not found') {
            return errors.notFound(reply, err.message);
          }
          if (err.message.includes('Cannot delete') || err.message.includes('only delete')) {
            return errors.forbidden(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    });

    // ============================================
    // Model Management (Crowdsourced)
    // ============================================

    // POST /models - Create model
    protectedRoutes.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const input = createModelSchema.parse(request.body);
        const model = await modelService.createModel(request.userId!, input);
        success(reply, model, 201);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Model ID already exists' || err.message === 'Provider not found') {
            return errors.badRequest(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    });

    // PATCH /models/:id - Update model
    protectedRoutes.patch('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const input = updateModelSchema.parse(request.body);
        const model = await modelService.updateModel(request.userId!, id, input);
        success(reply, model);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Model not found') {
            return errors.notFound(reply, err.message);
          }
          if (err.message.includes('only update')) {
            return errors.forbidden(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    });

    // DELETE /models/:id - Delete model
    protectedRoutes.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        await modelService.deleteModel(request.userId!, id);
        success(reply, { message: 'Model deleted' });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Model not found') {
            return errors.notFound(reply, err.message);
          }
          if (err.message.includes('Cannot delete') || err.message.includes('only delete')) {
            return errors.forbidden(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    });

    // POST /models/:id/use - Increment use count (when user selects model)
    protectedRoutes.post('/:id/use', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        await modelService.incrementUseCount(id);
        success(reply, { message: 'Use count incremented' });
      } catch (err) {
        return errors.internal(reply);
      }
    });
  });
}

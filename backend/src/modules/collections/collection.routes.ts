import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CollectionService } from './collection.service.js';
import {
  createCollectionSchema,
  updateCollectionSchema,
  queryCollectionsSchema,
} from './collection.schema.js';
import { success, paginated, errors } from '../../utils/response.js';

export async function collectionRoutes(fastify: FastifyInstance) {
  const collectionService = new CollectionService();

  // All routes require authentication
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
      const decoded = request.user as { userId: string };
      request.userId = decoded.userId;
    } catch {
      return errors.unauthorized(reply, 'Invalid or expired token');
    }
  });

  // GET /collections - List collections (paginated)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = queryCollectionsSchema.parse(request.query);
      const result = await collectionService.getCollections(request.userId!, query);
      paginated(reply, result.items, result.total, result.page, result.pageSize);
    } catch (err) {
      if (err instanceof Error) {
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // GET /collections/all - Get all collections (no pagination)
  fastify.get('/all', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const collections = await collectionService.getAllCollections(request.userId!);
      success(reply, collections);
    } catch (err) {
      return errors.internal(reply);
    }
  });

  // GET /collections/stats - Get stats
  fastify.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await collectionService.getStats(request.userId!);
      success(reply, stats);
    } catch (err) {
      return errors.internal(reply);
    }
  });

  // GET /collections/:id - Get single collection
  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const collection = await collectionService.getCollection(request.userId!, id);
      success(reply, collection);
    } catch (err) {
      if (err instanceof Error && err.message === 'Collection not found') {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /collections - Create collection
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const input = createCollectionSchema.parse(request.body);
      const collection = await collectionService.createCollection(request.userId!, input);
      success(reply, collection, 201);
    } catch (err) {
      if (err instanceof Error) {
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // PATCH /collections/:id - Update collection
  fastify.patch('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const input = updateCollectionSchema.parse(request.body);
      const collection = await collectionService.updateCollection(request.userId!, id, input);
      success(reply, collection);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Collection not found') {
          return errors.notFound(reply, err.message);
        }
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // DELETE /collections/:id - Delete collection
  fastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await collectionService.deleteCollection(request.userId!, id);
      success(reply, { message: 'Collection deleted' });
    } catch (err) {
      if (err instanceof Error && err.message === 'Collection not found') {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // GET /collections/:id/prompts - Get prompts in collection
  fastify.get('/:id/prompts', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await collectionService.getCollectionPrompts(request.userId!, id);
      success(reply, result);
    } catch (err) {
      if (err instanceof Error && err.message === 'Collection not found') {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /collections/:id/prompts - Move prompts to collection
  fastify.post('/:id/prompts', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { promptIds } = request.body as { promptIds: string[] };

      if (!Array.isArray(promptIds)) {
        return errors.badRequest(reply, 'promptIds must be an array');
      }

      const result = await collectionService.movePromptsToCollection(request.userId!, id, promptIds);
      success(reply, result);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Collection not found') {
          return errors.notFound(reply, err.message);
        }
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // DELETE /collections/:id/prompts - Remove prompts from collection
  fastify.delete('/:id/prompts', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { promptIds } = request.body as { promptIds: string[] };

      if (!Array.isArray(promptIds)) {
        return errors.badRequest(reply, 'promptIds must be an array');
      }

      const result = await collectionService.removePromptsFromCollection(
        request.userId!,
        id,
        promptIds
      );
      success(reply, result);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Collection not found') {
          return errors.notFound(reply, err.message);
        }
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });
}

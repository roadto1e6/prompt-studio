import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PromptService } from './prompt.service.js';
import {
  createPromptSchema,
  updatePromptSchema,
  queryPromptsSchema,
  createVersionSchema,
  batchUpdateSchema,
  batchDeleteSchema,
} from './prompt.schema.js';
import { success, paginated, errors } from '../../utils/response.js';

export async function promptRoutes(fastify: FastifyInstance) {
  const promptService = new PromptService();

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

  // GET /prompts - List prompts
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = queryPromptsSchema.parse(request.query);
      const result = await promptService.getPrompts(request.userId!, query);
      paginated(reply, result.items, result.total, result.page, result.pageSize);
    } catch (err) {
      if (err instanceof Error) {
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // GET /prompts/stats - Get stats
  fastify.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await promptService.getStats(request.userId!);
      success(reply, stats);
    } catch (err) {
      return errors.internal(reply);
    }
  });

  // GET /prompts/:id - Get single prompt
  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const prompt = await promptService.getPrompt(request.userId!, id);
      success(reply, prompt);
    } catch (err) {
      if (err instanceof Error && err.message === 'Prompt not found') {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /prompts - Create prompt
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const input = createPromptSchema.parse(request.body);
      const prompt = await promptService.createPrompt(request.userId!, input);
      success(reply, prompt, 201);
    } catch (err) {
      if (err instanceof Error) {
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // PATCH /prompts/:id - Update prompt
  fastify.patch('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const input = updatePromptSchema.parse(request.body);
      const prompt = await promptService.updatePrompt(request.userId!, id, input);
      success(reply, prompt);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Prompt not found') {
          return errors.notFound(reply, err.message);
        }
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // DELETE /prompts/:id - Soft delete (move to trash)
  fastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await promptService.updatePrompt(request.userId!, id, { status: 'trash' });
      success(reply, { message: 'Prompt moved to trash' });
    } catch (err) {
      if (err instanceof Error && err.message === 'Prompt not found') {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /prompts/:id/restore - Restore from trash
  fastify.post('/:id/restore', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const prompt = await promptService.restoreFromTrash(request.userId!, id);
      success(reply, prompt);
    } catch (err) {
      if (err instanceof Error && err.message.includes('not found')) {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // DELETE /prompts/:id/permanent - Permanent delete
  fastify.delete('/:id/permanent', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await promptService.permanentDelete(request.userId!, id);
      success(reply, { message: 'Prompt permanently deleted' });
    } catch (err) {
      if (err instanceof Error && err.message === 'Prompt not found') {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /prompts/:id/favorite - Toggle favorite
  fastify.post('/:id/favorite', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const prompt = await promptService.toggleFavorite(request.userId!, id);
      success(reply, prompt);
    } catch (err) {
      if (err instanceof Error && err.message === 'Prompt not found') {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /prompts/:id/duplicate - Duplicate prompt
  fastify.post('/:id/duplicate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const prompt = await promptService.duplicatePrompt(request.userId!, id);
      success(reply, prompt, 201);
    } catch (err) {
      if (err instanceof Error && err.message === 'Prompt not found') {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // ============================================
  // Batch operations
  // ============================================

  // PATCH /prompts/batch - Batch update
  fastify.patch('/batch', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const input = batchUpdateSchema.parse(request.body);
      const prompts = await promptService.batchUpdate(request.userId!, input);
      success(reply, prompts);
    } catch (err) {
      if (err instanceof Error) {
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // DELETE /prompts/batch - Batch delete
  fastify.delete('/batch', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const input = batchDeleteSchema.parse(request.body);
      const result = await promptService.batchDelete(request.userId!, input);
      success(reply, result);
    } catch (err) {
      if (err instanceof Error) {
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // ============================================
  // Version routes
  // ============================================

  // GET /prompts/:id/versions - Get versions
  fastify.get('/:id/versions', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const versions = await promptService.getVersions(request.userId!, id);
      success(reply, versions);
    } catch (err) {
      if (err instanceof Error && err.message === 'Prompt not found') {
        return errors.notFound(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /prompts/:id/versions - Create version
  fastify.post('/:id/versions', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const input = createVersionSchema.parse(request.body);
      const version = await promptService.createVersion(request.userId!, id, input);
      success(reply, version, 201);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Prompt not found') {
          return errors.notFound(reply, err.message);
        }
        return errors.badRequest(reply, err.message);
      }
      return errors.internal(reply);
    }
  });

  // POST /prompts/:id/versions/:versionId/restore - Restore version
  fastify.post(
    '/:id/versions/:versionId/restore',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id, versionId } = request.params as { id: string; versionId: string };
        const prompt = await promptService.restoreVersion(request.userId!, id, versionId);
        success(reply, prompt);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Prompt not found' || err.message === 'Version not found') {
            return errors.notFound(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    }
  );

  // DELETE /prompts/:id/versions/:versionId - Delete version (soft delete)
  fastify.delete(
    '/:id/versions/:versionId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id, versionId } = request.params as { id: string; versionId: string };
        await promptService.deleteVersion(request.userId!, id, versionId);
        success(reply, { message: 'Version deleted' });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Prompt not found' || err.message === 'Version not found') {
            return errors.notFound(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    }
  );

  // POST /prompts/:id/versions/:versionId/restore-deleted - Restore deleted version
  fastify.post(
    '/:id/versions/:versionId/restore-deleted',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id, versionId } = request.params as { id: string; versionId: string };
        const version = await promptService.restoreDeletedVersion(request.userId!, id, versionId);
        success(reply, version);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Prompt not found' || err.message === 'Version not found') {
            return errors.notFound(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    }
  );

  // DELETE /prompts/:id/versions/:versionId/permanent - Permanently delete version
  fastify.delete(
    '/:id/versions/:versionId/permanent',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id, versionId } = request.params as { id: string; versionId: string };
        await promptService.permanentDeleteVersion(request.userId!, id, versionId);
        success(reply, { message: 'Version permanently deleted' });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Prompt not found' || err.message === 'Version not found') {
            return errors.notFound(reply, err.message);
          }
          return errors.badRequest(reply, err.message);
        }
        return errors.internal(reply);
      }
    }
  );
}

import prisma from '../../config/database.js';
import { generateVersionNumber } from '../../utils/token.js';
import type {
  CreatePromptInput,
  UpdatePromptInput,
  QueryPromptsInput,
  CreateVersionInput,
  BatchUpdateInput,
  BatchDeleteInput,
} from './prompt.schema.js';
import { Prisma } from '@prisma/client';

// Include versions in prompt response
const promptInclude = {
  versions: {
    orderBy: { createdAt: 'desc' as const },
  },
};

export class PromptService {
  // Get prompts with pagination and filters
  async getPrompts(userId: string, query: QueryPromptsInput) {
    const { page, pageSize, search, category, collectionId, status, favorite, sortBy, sortOrder, tags } =
      query;

    // Build where clause
    const where: Prisma.PromptWhereInput = {
      userId,
    };

    if (status) {
      where.status = status;
    } else {
      // Default: exclude trash
      where.status = { not: 'trash' };
    }

    if (category) {
      where.category = category;
    }

    if (collectionId) {
      if (collectionId === 'uncategorized') {
        where.collectionId = null;
      } else {
        where.collectionId = collectionId;
      }
    }

    if (favorite !== undefined) {
      where.favorite = favorite;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim());
      where.tags = { hasEvery: tagList };
    }

    // Count total
    const total = await prisma.prompt.count({ where });

    // Get prompts
    const prompts = await prisma.prompt.findMany({
      where,
      include: promptInclude,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items: prompts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // Get single prompt
  async getPrompt(userId: string, promptId: string) {
    const prompt = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
      include: promptInclude,
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    return prompt;
  }

  // Create prompt
  async createPrompt(userId: string, input: CreatePromptInput) {
    // Normalize collectionId - empty string should be null
    const collectionId = input.collectionId && input.collectionId.trim() !== ''
      ? input.collectionId
      : null;

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create prompt with initial version
      const prompt = await tx.prompt.create({
        data: {
          userId,
          title: input.title,
          description: input.description || '',
          category: input.category,
          systemPrompt: input.systemPrompt || '',
          userTemplate: input.userTemplate || '',
          model: input.model,
          temperature: input.temperature,
          maxTokens: input.maxTokens,
          tags: input.tags,
          collectionId,
          versions: {
            create: {
              versionNumber: '1.0',
              systemPrompt: input.systemPrompt || '',
              userTemplate: input.userTemplate || '',
              model: input.model,
              temperature: input.temperature,
              maxTokens: input.maxTokens,
              changeNote: 'Initial creation',
              createdBy: userId,
            },
          },
        },
        include: promptInclude,
      });

      // Set current version ID
      const currentVersion = prompt.versions[0];
      const updatedPrompt = await tx.prompt.update({
        where: { id: prompt.id },
        data: { currentVersionId: currentVersion.id },
        include: promptInclude,
      });

      return updatedPrompt;
    });

    return result;
  }

  // Update prompt
  async updatePrompt(userId: string, promptId: string, input: UpdatePromptInput) {
    // Verify ownership
    const existing = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
    });

    if (!existing) {
      throw new Error('Prompt not found');
    }

    // Normalize collectionId - empty string should be null
    const updateData = { ...input };
    if ('collectionId' in updateData) {
      updateData.collectionId = updateData.collectionId && updateData.collectionId.trim() !== ''
        ? updateData.collectionId
        : null;
    }

    const prompt = await prisma.prompt.update({
      where: { id: promptId },
      data: updateData,
      include: promptInclude,
    });

    return prompt;
  }

  // Delete prompt (permanent)
  async deletePrompt(userId: string, promptId: string) {
    // Verify ownership
    const existing = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
    });

    if (!existing) {
      throw new Error('Prompt not found');
    }

    await prisma.prompt.delete({
      where: { id: promptId },
    });
  }

  // Move to trash
  async moveToTrash(userId: string, promptId: string) {
    return this.updatePrompt(userId, promptId, { status: 'trash' });
  }

  // Restore from trash
  async restoreFromTrash(userId: string, promptId: string) {
    const existing = await prisma.prompt.findFirst({
      where: { id: promptId, userId, status: 'trash' },
    });

    if (!existing) {
      throw new Error('Prompt not found in trash');
    }

    return prisma.prompt.update({
      where: { id: promptId },
      data: { status: 'active' },
      include: promptInclude,
    });
  }

  // Toggle favorite (without explicit value - toggles current state)
  async toggleFavorite(userId: string, promptId: string) {
    const existing = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
    });

    if (!existing) {
      throw new Error('Prompt not found');
    }

    return prisma.prompt.update({
      where: { id: promptId },
      data: { favorite: !existing.favorite },
      include: promptInclude,
    });
  }

  // ============================================
  // Version management
  // ============================================

  // Get versions for a prompt
  async getVersions(userId: string, promptId: string) {
    // Verify ownership
    const prompt = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    return prisma.promptVersion.findMany({
      where: { promptId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Create new version
  async createVersion(userId: string, promptId: string, input: CreateVersionInput) {
    // Get prompt with versions
    const prompt = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
      include: { versions: true },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    if (!prompt.currentVersionId) {
      throw new Error('Prompt has no current version');
    }

    // Generate version number based on current version
    const versionNumber = generateVersionNumber(
      prompt.versions,
      prompt.currentVersionId,
      input.versionType || 'minor'
    );

    // Create version
    const version = await prisma.promptVersion.create({
      data: {
        promptId,
        versionNumber,
        systemPrompt: prompt.systemPrompt,
        userTemplate: prompt.userTemplate,
        model: prompt.model,
        temperature: prompt.temperature,
        maxTokens: prompt.maxTokens,
        changeNote: input.changeNote,
        createdBy: userId,
      },
    });

    // Update current version
    await prisma.prompt.update({
      where: { id: promptId },
      data: { currentVersionId: version.id },
    });

    return version;
  }

  // Restore to a specific version
  async restoreVersion(userId: string, promptId: string, versionId: string) {
    // Verify ownership
    const prompt = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    // Get version
    const version = await prisma.promptVersion.findFirst({
      where: { id: versionId, promptId },
    });

    if (!version) {
      throw new Error('Version not found');
    }

    // Update prompt with version data and set current version ID
    const updated = await prisma.prompt.update({
      where: { id: promptId },
      data: {
        systemPrompt: version.systemPrompt,
        userTemplate: version.userTemplate,
        model: version.model,
        temperature: version.temperature,
        maxTokens: version.maxTokens,
        currentVersionId: versionId,
      },
      include: promptInclude,
    });

    return updated;
  }

  // Delete version (soft delete)
  async deleteVersion(userId: string, promptId: string, versionId: string) {
    // Verify ownership
    const prompt = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    // Get the version to check if it's current
    const version = await prisma.promptVersion.findFirst({
      where: { id: versionId, promptId },
    });

    if (!version) {
      throw new Error('Version not found');
    }

    // Don't allow deleting current version
    if (prompt.currentVersionId === versionId) {
      throw new Error('Cannot delete the current active version');
    }

    // Don't allow deleting the only active version
    const activeVersionCount = await prisma.promptVersion.count({
      where: { promptId, deleted: false },
    });

    if (activeVersionCount <= 1) {
      throw new Error('Cannot delete the only remaining version');
    }

    // Soft delete version
    await prisma.promptVersion.update({
      where: { id: versionId },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
  }

  // Restore deleted version
  async restoreDeletedVersion(userId: string, promptId: string, versionId: string) {
    // Verify ownership
    const prompt = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    // Get the version
    const version = await prisma.promptVersion.findFirst({
      where: { id: versionId, promptId },
    });

    if (!version) {
      throw new Error('Version not found');
    }

    if (!version.deleted) {
      throw new Error('Version is not deleted');
    }

    // Restore version
    const restored = await prisma.promptVersion.update({
      where: { id: versionId },
      data: {
        deleted: false,
        deletedAt: null,
      },
    });

    return restored;
  }

  // Permanently delete version
  async permanentDeleteVersion(userId: string, promptId: string, versionId: string) {
    // Verify ownership
    const prompt = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    // Get the version
    const version = await prisma.promptVersion.findFirst({
      where: { id: versionId, promptId },
    });

    if (!version) {
      throw new Error('Version not found');
    }

    // Don't allow permanently deleting current version
    if (prompt.currentVersionId === versionId) {
      throw new Error('Cannot permanently delete the current active version');
    }

    // Permanently delete version
    await prisma.promptVersion.delete({
      where: { id: versionId },
    });
  }

  // Get stats
  async getStats(userId: string) {
    const [total, byCategory, byStatus, favorites] = await Promise.all([
      prisma.prompt.count({ where: { userId } }),
      prisma.prompt.groupBy({
        by: ['category'],
        where: { userId },
        _count: true,
      }),
      prisma.prompt.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      }),
      prisma.prompt.count({ where: { userId, favorite: true } }),
    ]);

    return {
      total,
      byCategory: Object.fromEntries(byCategory.map((g) => [g.category, g._count])),
      byStatus: Object.fromEntries(byStatus.map((g) => [g.status, g._count])),
      favorites,
    };
  }

  // ============================================
  // Additional endpoints to match frontend API
  // ============================================

  // Permanent delete
  async permanentDelete(userId: string, promptId: string) {
    const existing = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
    });

    if (!existing) {
      throw new Error('Prompt not found');
    }

    await prisma.prompt.delete({
      where: { id: promptId },
    });
  }

  // Duplicate prompt
  async duplicatePrompt(userId: string, promptId: string) {
    const existing = await prisma.prompt.findFirst({
      where: { id: promptId, userId },
      include: promptInclude,
    });

    if (!existing) {
      throw new Error('Prompt not found');
    }

    // Create a copy with new ID
    const prompt = await prisma.prompt.create({
      data: {
        userId,
        title: `${existing.title} (Copy)`,
        description: existing.description,
        category: existing.category,
        systemPrompt: existing.systemPrompt,
        userTemplate: existing.userTemplate,
        model: existing.model,
        temperature: existing.temperature,
        maxTokens: existing.maxTokens,
        tags: existing.tags,
        collectionId: existing.collectionId,
        versions: {
          create: {
            versionNumber: '1.0',
            systemPrompt: existing.systemPrompt,
            userTemplate: existing.userTemplate,
            model: existing.model,
            temperature: existing.temperature,
            maxTokens: existing.maxTokens,
            changeNote: 'Duplicated from original',
            createdBy: userId,
          },
        },
      },
      include: promptInclude,
    });

    // Set current version ID
    const currentVersion = prompt.versions[0];
    await prisma.prompt.update({
      where: { id: prompt.id },
      data: { currentVersionId: currentVersion.id },
    });

    return { ...prompt, currentVersionId: currentVersion.id };
  }

  // Batch update prompts
  async batchUpdate(userId: string, input: BatchUpdateInput) {
    const { ids, ...updateData } = input;

    // Verify ownership of all prompts
    const prompts = await prisma.prompt.findMany({
      where: { id: { in: ids }, userId },
    });

    if (prompts.length !== ids.length) {
      throw new Error('Some prompts not found or not owned by user');
    }

    // Update all prompts
    await prisma.prompt.updateMany({
      where: { id: { in: ids }, userId },
      data: updateData,
    });

    // Return updated prompts
    return prisma.prompt.findMany({
      where: { id: { in: ids } },
      include: promptInclude,
    });
  }

  // Batch delete prompts
  async batchDelete(userId: string, input: BatchDeleteInput) {
    const { ids } = input;

    // Verify ownership
    const prompts = await prisma.prompt.findMany({
      where: { id: { in: ids }, userId },
    });

    if (prompts.length !== ids.length) {
      throw new Error('Some prompts not found or not owned by user');
    }

    // Delete all prompts
    await prisma.prompt.deleteMany({
      where: { id: { in: ids }, userId },
    });

    return { deleted: ids.length };
  }
}

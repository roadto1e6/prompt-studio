import prisma from '../../config/database.js';
import type {
  CreateCollectionInput,
  UpdateCollectionInput,
  QueryCollectionsInput,
} from './collection.schema.js';
import { Prisma } from '@prisma/client';

export class CollectionService {
  // Get collections with pagination
  async getCollections(userId: string, query: QueryCollectionsInput) {
    const { page, pageSize, search, sortBy, sortOrder } = query;

    const where: Prisma.CollectionWhereInput = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.collection.count({ where });

    const collections = await prisma.collection.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: { prompts: true },
        },
      },
    });

    // Transform to include promptCount
    const items = collections.map((c) => ({
      ...c,
      promptCount: c._count.prompts,
      _count: undefined,
    }));

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // Get all collections (no pagination)
  async getAllCollections(userId: string) {
    const collections = await prisma.collection.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { prompts: true },
        },
      },
    });

    return collections.map((c) => ({
      ...c,
      promptCount: c._count.prompts,
      _count: undefined,
    }));
  }

  // Get single collection
  async getCollection(userId: string, collectionId: string) {
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
      include: {
        _count: {
          select: { prompts: true },
        },
      },
    });

    if (!collection) {
      throw new Error('Collection not found');
    }

    return {
      ...collection,
      promptCount: collection._count.prompts,
      _count: undefined,
    };
  }

  // Create collection
  async createCollection(userId: string, input: CreateCollectionInput) {
    const collection = await prisma.collection.create({
      data: {
        userId,
        name: input.name,
        description: input.description || '',
        color: input.color,
        icon: input.icon,
      },
      include: {
        _count: {
          select: { prompts: true },
        },
      },
    });

    return {
      ...collection,
      promptCount: collection._count.prompts,
      _count: undefined,
    };
  }

  // Update collection
  async updateCollection(userId: string, collectionId: string, input: UpdateCollectionInput) {
    // Verify ownership
    const existing = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });

    if (!existing) {
      throw new Error('Collection not found');
    }

    const collection = await prisma.collection.update({
      where: { id: collectionId },
      data: input,
      include: {
        _count: {
          select: { prompts: true },
        },
      },
    });

    return {
      ...collection,
      promptCount: collection._count.prompts,
      _count: undefined,
    };
  }

  // Delete collection
  async deleteCollection(userId: string, collectionId: string) {
    // Verify ownership
    const existing = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });

    if (!existing) {
      throw new Error('Collection not found');
    }

    // Remove collection reference from prompts (set to null)
    await prisma.prompt.updateMany({
      where: { collectionId },
      data: { collectionId: null },
    });

    await prisma.collection.delete({
      where: { id: collectionId },
    });
  }

  // Get prompts in collection
  async getCollectionPrompts(userId: string, collectionId: string) {
    // Verify ownership
    const existing = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });

    if (!existing) {
      throw new Error('Collection not found');
    }

    const prompts = await prisma.prompt.findMany({
      where: { collectionId, userId },
      select: { id: true },
    });

    return {
      prompts: prompts.map((p) => p.id),
      count: prompts.length,
    };
  }

  // Move prompts to collection
  async movePromptsToCollection(userId: string, collectionId: string, promptIds: string[]) {
    // Verify collection ownership
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });

    if (!collection) {
      throw new Error('Collection not found');
    }

    // Update prompts
    const result = await prisma.prompt.updateMany({
      where: {
        id: { in: promptIds },
        userId,
      },
      data: { collectionId },
    });

    return { updated: result.count };
  }

  // Remove prompts from collection
  async removePromptsFromCollection(userId: string, collectionId: string, promptIds: string[]) {
    // Verify collection ownership
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });

    if (!collection) {
      throw new Error('Collection not found');
    }

    // Remove collection from prompts
    const result = await prisma.prompt.updateMany({
      where: {
        id: { in: promptIds },
        userId,
        collectionId,
      },
      data: { collectionId: null },
    });

    return { updated: result.count };
  }

  // Get stats
  async getStats(userId: string) {
    const [total, withPrompts] = await Promise.all([
      prisma.collection.count({ where: { userId } }),
      prisma.collection.count({
        where: {
          userId,
          prompts: { some: {} },
        },
      }),
    ]);

    return {
      total,
      withPrompts,
      empty: total - withPrompts,
    };
  }
}

import prisma from '../../config/database.js';
import { generateShareCode } from '../../utils/token.js';
import { hashPassword, verifyPassword } from '../../utils/hash.js';
import type { CreateShareInput } from './share.schema.js';

export class ShareService {
  // Create share link
  async createShare(userId: string, input: CreateShareInput) {
    const { promptId, collectionId, expiresIn, password } = input;

    // Verify ownership
    if (promptId) {
      const prompt = await prisma.prompt.findFirst({
        where: { id: promptId, userId },
        include: { versions: true },
      });

      if (!prompt) {
        throw new Error('Prompt not found');
      }

      // Build share data
      const shareData = {
        type: 'prompt',
        prompt: {
          id: prompt.id,
          title: prompt.title,
          description: prompt.description,
          category: prompt.category,
          systemPrompt: prompt.systemPrompt,
          userTemplate: prompt.userTemplate,
          model: prompt.model,
          temperature: prompt.temperature,
          maxTokens: prompt.maxTokens,
          tags: prompt.tags,
        },
      };

      return this.createShareRecord(userId, shareData, expiresIn, password);
    }

    if (collectionId) {
      const collection = await prisma.collection.findFirst({
        where: { id: collectionId, userId },
        include: {
          prompts: {
            include: { versions: true },
          },
        },
      });

      if (!collection) {
        throw new Error('Collection not found');
      }

      // Build share data
      const shareData = {
        type: 'collection',
        collection: {
          id: collection.id,
          name: collection.name,
          description: collection.description,
          color: collection.color,
          icon: collection.icon,
          prompts: collection.prompts.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            systemPrompt: p.systemPrompt,
            userTemplate: p.userTemplate,
            model: p.model,
            temperature: p.temperature,
            maxTokens: p.maxTokens,
            tags: p.tags,
          })),
        },
      };

      return this.createShareRecord(userId, shareData, expiresIn, password);
    }

    throw new Error('Invalid share input');
  }

  // Create share record in database
  private async createShareRecord(
    userId: string,
    data: Record<string, unknown>,
    expiresIn: number,
    password?: string
  ) {
    const code = generateShareCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresIn);

    const share = await prisma.share.create({
      data: {
        code,
        userId,
        data: JSON.parse(JSON.stringify(data)),
        password: password ? await hashPassword(password) : null,
        expiresAt,
      },
    });

    return {
      id: share.id,
      code: share.code,
      shareUrl: `/share/${share.code}`,
      expiresAt: share.expiresAt?.toISOString(),
      hasPassword: !!password,
    };
  }

  // Access share (public - no auth required)
  async accessShare(code: string, password?: string) {
    const share = await prisma.share.findUnique({
      where: { code },
    });

    if (!share) {
      throw new Error('Share not found');
    }

    // Check expiration
    if (share.expiresAt && new Date() > share.expiresAt) {
      throw new Error('Share link has expired');
    }

    // Check password
    if (share.password) {
      if (!password) {
        throw new Error('Password required');
      }

      const valid = await verifyPassword(password, share.password);
      if (!valid) {
        throw new Error('Invalid password');
      }
    }

    // Increment view count
    await prisma.share.update({
      where: { id: share.id },
      data: { viewCount: { increment: 1 } },
    });

    return {
      data: share.data,
      viewCount: share.viewCount + 1,
      createdAt: share.createdAt.toISOString(),
    };
  }

  // Check if share requires password (public)
  async checkShare(code: string) {
    const share = await prisma.share.findUnique({
      where: { code },
      select: {
        id: true,
        password: true,
        expiresAt: true,
      },
    });

    if (!share) {
      throw new Error('Share not found');
    }

    // Check expiration
    if (share.expiresAt && new Date() > share.expiresAt) {
      throw new Error('Share link has expired');
    }

    return {
      requiresPassword: !!share.password,
    };
  }

  // Get user's shares
  async getUserShares(userId: string) {
    const shares = await prisma.share.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        data: true,
        viewCount: true,
        expiresAt: true,
        createdAt: true,
        password: true,
      },
    });

    return shares.map((s) => ({
      id: s.id,
      code: s.code,
      type: (s.data as Record<string, unknown>)?.type || 'unknown',
      title: this.getShareTitle(s.data as Record<string, unknown>),
      viewCount: s.viewCount,
      expiresAt: s.expiresAt,
      createdAt: s.createdAt,
      hasPassword: !!s.password,
      isExpired: s.expiresAt ? new Date() > s.expiresAt : false,
    }));
  }

  // Get share title from data
  private getShareTitle(data: Record<string, unknown>): string {
    if (data.type === 'prompt') {
      const prompt = data.prompt as Record<string, unknown>;
      return (prompt?.title as string) || 'Untitled Prompt';
    }
    if (data.type === 'collection') {
      const collection = data.collection as Record<string, unknown>;
      return (collection?.name as string) || 'Untitled Collection';
    }
    return 'Unknown';
  }

  // Delete share
  async deleteShare(userId: string, shareId: string) {
    // Verify ownership
    const share = await prisma.share.findFirst({
      where: { id: shareId, userId },
    });

    if (!share) {
      throw new Error('Share not found');
    }

    await prisma.share.delete({
      where: { id: shareId },
    });
  }

  // Get stats
  async getStats(userId: string) {
    const [total, active, expired, totalViews] = await Promise.all([
      prisma.share.count({ where: { userId } }),
      prisma.share.count({
        where: {
          userId,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      }),
      prisma.share.count({
        where: {
          userId,
          expiresAt: { lte: new Date() },
        },
      }),
      prisma.share.aggregate({
        where: { userId },
        _sum: { viewCount: true },
      }),
    ]);

    return {
      total,
      active,
      expired,
      totalViews: totalViews._sum.viewCount || 0,
    };
  }
}

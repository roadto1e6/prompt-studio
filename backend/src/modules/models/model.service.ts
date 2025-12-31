import prisma from '../../config/database.js';
import type {
  CreateProviderInput,
  UpdateProviderInput,
  CreateModelInput,
  UpdateModelInput,
  QueryModelsInput,
  CreateUserModelInput,
  UpdateUserModelInput,
  ReviewUserModelInput,
} from './model.schema.js';

// Default providers data (seeded on first request if empty)
const defaultProviders = [
  { id: 'openai', name: 'OpenAI', website: 'https://openai.com', apiDocsUrl: 'https://platform.openai.com/docs' },
  { id: 'anthropic', name: 'Anthropic', website: 'https://anthropic.com', apiDocsUrl: 'https://docs.anthropic.com' },
  { id: 'google', name: 'Google', website: 'https://ai.google.dev', apiDocsUrl: 'https://ai.google.dev/docs' },
  { id: 'deepseek', name: 'DeepSeek', website: 'https://deepseek.com', apiDocsUrl: 'https://platform.deepseek.com/docs' },
  { id: 'meta', name: 'Meta', website: 'https://llama.meta.com', apiDocsUrl: 'https://llama.meta.com/docs' },
  { id: 'xai', name: 'xAI', website: 'https://x.ai', apiDocsUrl: 'https://docs.x.ai' },
  { id: 'mistral', name: 'Mistral AI', website: 'https://mistral.ai', apiDocsUrl: 'https://docs.mistral.ai' },
  { id: 'aws', name: 'Amazon Bedrock', website: 'https://aws.amazon.com/bedrock', apiDocsUrl: 'https://docs.aws.amazon.com/bedrock' },
  { id: 'stability', name: 'Stability AI', website: 'https://stability.ai', apiDocsUrl: 'https://platform.stability.ai/docs' },
  { id: 'midjourney', name: 'Midjourney', website: 'https://midjourney.com' },
  { id: 'elevenlabs', name: 'ElevenLabs', website: 'https://elevenlabs.io', apiDocsUrl: 'https://docs.elevenlabs.io' },
  { id: 'runway', name: 'Runway', website: 'https://runwayml.com', apiDocsUrl: 'https://docs.runwayml.com' },
  { id: 'pika', name: 'Pika', website: 'https://pika.art' },
];

// Default models data (2025年12月 LMArena排行榜)
const defaultModels = [
  // ==================== OpenAI ====================
  { id: 'gpt-5.2-high', name: 'GPT-5.2 High', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 400000, contextWindow: 400000, status: 'active', description: 'Arena Elo 1465', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true } },
  { id: 'gpt-5.2', name: 'GPT-5.2', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 400000, contextWindow: 400000, status: 'active', description: 'Arena Elo 1464', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true } },
  { id: 'gpt-5.1-high', name: 'GPT-5.1 High', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 256000, contextWindow: 256000, status: 'active', description: 'Arena Elo 1464', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true } },
  { id: 'gpt-5.1', name: 'GPT-5.1', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 256000, contextWindow: 256000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true } },
  { id: 'gpt-5', name: 'GPT-5', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true } },
  { id: 'o3', name: 'o3', providerId: 'openai', capabilities: ['text'], maxTokens: 200000, contextWindow: 200000, status: 'active', description: '高级推理模型', features: { streaming: true, functionCalling: true, jsonMode: true } },
  { id: 'o4-mini', name: 'o4 Mini', providerId: 'openai', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, functionCalling: true, jsonMode: true } },
  { id: 'o1', name: 'o1', providerId: 'openai', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true } },
  { id: 'gpt-4o', name: 'GPT-4o', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true } },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true } },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true } },
  { id: 'dall-e-3', name: 'DALL-E 3', providerId: 'openai', capabilities: ['image'], maxTokens: 4000, status: 'active' },
  { id: 'whisper-1', name: 'Whisper', providerId: 'openai', capabilities: ['audio'], maxTokens: 4000, status: 'active' },
  { id: 'tts-1-hd', name: 'TTS HD', providerId: 'openai', capabilities: ['audio'], maxTokens: 4000, status: 'active' },
  { id: 'sora', name: 'Sora', providerId: 'openai', capabilities: ['video'], maxTokens: 4000, status: 'active' },

  // ==================== Anthropic ====================
  { id: 'claude-opus-4.5-thinking', name: 'Claude Opus 4.5 Thinking', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', description: 'Arena Elo 1466', features: { streaming: true, vision: true } },
  { id: 'claude-opus-4.5', name: 'Claude Opus 4.5', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', description: 'Arena Elo 1462', features: { streaming: true, vision: true } },
  { id: 'claude-4-opus', name: 'Claude 4 Opus', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', features: { streaming: true, vision: true } },
  { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 1000000, status: 'active', features: { streaming: true, vision: true } },
  { id: 'claude-4-haiku', name: 'Claude 4 Haiku', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', features: { streaming: true, vision: true } },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', features: { streaming: true, vision: true } },

  // ==================== Google ====================
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 10000000, contextWindow: 10000000, status: 'active', description: 'Arena Elo 1492，全球第一', features: { streaming: true, vision: true } },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 2000000, contextWindow: 2000000, status: 'active', description: 'Arena Elo 1470', features: { streaming: true, vision: true } },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 2000000, contextWindow: 2000000, status: 'active', description: 'Arena Elo 1460', features: { streaming: true, vision: true } },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', providerId: 'google', capabilities: ['text', 'vision', 'audio'], maxTokens: 1000000, contextWindow: 1000000, status: 'active', features: { streaming: true, vision: true } },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 1000000, contextWindow: 1000000, status: 'active', features: { streaming: true, vision: true } },

  // ==================== DeepSeek ====================
  { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', providerId: 'deepseek', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, functionCalling: true } },
  { id: 'deepseek-v3', name: 'DeepSeek V3', providerId: 'deepseek', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, functionCalling: true } },
  { id: 'deepseek-coder-v2', name: 'DeepSeek Coder V2', providerId: 'deepseek', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true } },

  // ==================== Meta ====================
  { id: 'llama-4-scout', name: 'Llama 4 Scout', providerId: 'meta', capabilities: ['text'], maxTokens: 10000000, contextWindow: 10000000, status: 'active', features: { streaming: true } },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', providerId: 'meta', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true } },
  { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', providerId: 'meta', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true } },
  { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', providerId: 'meta', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true } },

  // ==================== xAI ====================
  { id: 'grok-4.1-thinking', name: 'Grok 4.1 Thinking', providerId: 'xai', capabilities: ['text', 'vision'], maxTokens: 131072, contextWindow: 131072, status: 'active', description: 'Arena Elo 1482', features: { streaming: true, vision: true } },
  { id: 'grok-4.1', name: 'Grok 4.1', providerId: 'xai', capabilities: ['text', 'vision'], maxTokens: 131072, contextWindow: 131072, status: 'active', description: 'Arena Elo 1463', features: { streaming: true, vision: true } },
  { id: 'grok-3', name: 'Grok 3', providerId: 'xai', capabilities: ['text', 'vision'], maxTokens: 131072, contextWindow: 131072, status: 'active', features: { streaming: true, vision: true } },
  { id: 'grok-2', name: 'Grok 2', providerId: 'xai', capabilities: ['text', 'vision'], maxTokens: 131072, contextWindow: 131072, status: 'active', features: { streaming: true, vision: true } },

  // ==================== Mistral AI ====================
  { id: 'mistral-large-2', name: 'Mistral Large 2', providerId: 'mistral', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, functionCalling: true } },
  { id: 'mistral-medium', name: 'Mistral Medium', providerId: 'mistral', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true } },
  { id: 'mistral-small', name: 'Mistral Small', providerId: 'mistral', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true } },
  { id: 'codestral', name: 'Codestral', providerId: 'mistral', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true } },

  // ==================== Amazon Bedrock ====================
  { id: 'nova-pro', name: 'Nova Pro', providerId: 'aws', capabilities: ['text', 'vision'], maxTokens: 300000, contextWindow: 300000, status: 'active', features: { streaming: true, vision: true } },
  { id: 'nova-lite', name: 'Nova Lite', providerId: 'aws', capabilities: ['text', 'vision'], maxTokens: 300000, contextWindow: 300000, status: 'active', features: { streaming: true, vision: true } },
  { id: 'nova-micro', name: 'Nova Micro', providerId: 'aws', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true } },

  // ==================== Image ====================
  { id: 'sd-3.5-large', name: 'Stable Diffusion 3.5 Large', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active' },
  { id: 'sd-3-turbo', name: 'SD 3 Turbo', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active' },
  { id: 'sdxl-1.0', name: 'Stable Diffusion XL', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active' },
  { id: 'midjourney-v6.1', name: 'Midjourney V6.1', providerId: 'midjourney', capabilities: ['image'], maxTokens: 4000, status: 'active' },
  { id: 'midjourney-v6', name: 'Midjourney V6', providerId: 'midjourney', capabilities: ['image'], maxTokens: 4000, status: 'active' },

  // ==================== Audio ====================
  { id: 'eleven-multilingual-v2', name: 'Multilingual V2', providerId: 'elevenlabs', capabilities: ['audio'], maxTokens: 4000, status: 'active' },
  { id: 'eleven-turbo-v2.5', name: 'Turbo V2.5', providerId: 'elevenlabs', capabilities: ['audio'], maxTokens: 4000, status: 'active' },

  // ==================== Video ====================
  { id: 'gen-3-alpha-turbo', name: 'Gen-3 Alpha Turbo', providerId: 'runway', capabilities: ['video'], maxTokens: 4000, status: 'active' },
  { id: 'gen-3-alpha', name: 'Gen-3 Alpha', providerId: 'runway', capabilities: ['video'], maxTokens: 4000, status: 'active' },
  { id: 'pika-2.0', name: 'Pika 2.0', providerId: 'pika', capabilities: ['video'], maxTokens: 4000, status: 'active' },
  { id: 'pika-1.5', name: 'Pika 1.5', providerId: 'pika', capabilities: ['video'], maxTokens: 4000, status: 'active' },
];

export class ModelService {
  // Ensure default data exists
  private async ensureDefaults() {
    const providerCount = await prisma.modelProvider.count();
    if (providerCount === 0) {
      // Seed providers (system preset, contributedBy = null)
      for (const provider of defaultProviders) {
        await prisma.modelProvider.create({
          data: {
            ...provider,
            contributedBy: null, // System preset
          },
        });
      }

      // Seed models (system preset, contributedBy = null)
      for (const model of defaultModels) {
        await prisma.model.create({
          data: {
            ...model,
            features: model.features ? JSON.parse(JSON.stringify(model.features)) : undefined,
            contributedBy: null, // System preset
          },
        });
      }
    }
  }

  // ============================================
  // Public Model Data (All users can see)
  // ============================================

  // Get all models and providers
  async getModels(query?: QueryModelsInput, userId?: string) {
    await this.ensureDefaults();

    const { category, providerId, status, search, sourceType, includeUserModels } = query || {};

    // Build where clause for models
    const modelWhere: Record<string, unknown> = {};
    if (category) {
      modelWhere.capabilities = { has: category };
    }
    if (providerId) {
      modelWhere.providerId = providerId;
    }
    if (status) {
      modelWhere.status = status;
    }
    if (search) {
      modelWhere.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by source type
    if (sourceType) {
      modelWhere.sourceType = sourceType;
    } else if (includeUserModels && userId) {
      // Include system models and user's own models
      modelWhere.OR = [
        { sourceType: 'system' },
        { sourceType: 'user', userId },
        { sourceType: 'user', reviewStatus: 'approved' }, // Include approved user models
      ];
    } else {
      // By default, only show system models and approved user models
      modelWhere.OR = [
        { sourceType: 'system' },
        { sourceType: 'user', reviewStatus: 'approved' },
      ];
    }

    const [providers, models] = await Promise.all([
      prisma.modelProvider.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      }),
      prisma.model.findMany({
        where: modelWhere,
        include: {
          provider: {
            select: { id: true, name: true },
          },
        },
        orderBy: [{ useCount: 'desc' }, { providerId: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
      }),
    ]);

    return { providers, models };
  }

  // Get providers list
  async getProviders() {
    await this.ensureDefaults();
    return prisma.modelProvider.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  // Get single provider
  async getProvider(id: string) {
    const provider = await prisma.modelProvider.findUnique({
      where: { id },
      include: {
        models: {
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        },
      },
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    return provider;
  }

  // Get single model
  async getModel(id: string) {
    const model = await prisma.model.findUnique({
      where: { id },
      include: {
        provider: true,
      },
    });

    if (!model) {
      throw new Error('Model not found');
    }

    return model;
  }

  // ============================================
  // Crowdsourced Provider Management
  // ============================================

  // Create provider (crowdsourced)
  async createProvider(userId: string, input: CreateProviderInput) {
    // Check if provider ID already exists
    const existing = await prisma.modelProvider.findUnique({
      where: { id: input.id },
    });

    if (existing) {
      throw new Error('Provider ID already exists');
    }

    const provider = await prisma.modelProvider.create({
      data: {
        ...input,
        website: input.website || null,
        apiDocsUrl: input.apiDocsUrl || null,
        logoUrl: input.logoUrl || null,
        contributedBy: userId,
      },
    });

    return provider;
  }

  // Update provider (only contributor can update)
  async updateProvider(userId: string, id: string, input: UpdateProviderInput) {
    const provider = await prisma.modelProvider.findUnique({
      where: { id },
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    // Only contributor or system preset can be updated
    if (provider.contributedBy && provider.contributedBy !== userId) {
      throw new Error('You can only update providers you contributed');
    }

    const updated = await prisma.modelProvider.update({
      where: { id },
      data: {
        ...input,
        website: input.website || null,
        apiDocsUrl: input.apiDocsUrl || null,
        logoUrl: input.logoUrl || null,
      },
    });

    return updated;
  }

  // Delete provider (only contributor can delete)
  async deleteProvider(userId: string, id: string) {
    const provider = await prisma.modelProvider.findUnique({
      where: { id },
      include: { models: true },
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    // Cannot delete system presets
    if (!provider.contributedBy) {
      throw new Error('Cannot delete system preset providers');
    }

    // Only contributor can delete
    if (provider.contributedBy !== userId) {
      throw new Error('You can only delete providers you contributed');
    }

    // Cannot delete if has models
    if (provider.models.length > 0) {
      throw new Error('Cannot delete provider with existing models');
    }

    await prisma.modelProvider.delete({
      where: { id },
    });
  }

  // ============================================
  // Crowdsourced Model Management
  // ============================================

  // Create model (crowdsourced)
  async createModel(userId: string, input: CreateModelInput) {
    // Check if model ID already exists
    const existing = await prisma.model.findUnique({
      where: { id: input.id },
    });

    if (existing) {
      throw new Error('Model ID already exists');
    }

    // Verify provider exists
    const provider = await prisma.modelProvider.findUnique({
      where: { id: input.providerId },
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    const model = await prisma.model.create({
      data: {
        ...input,
        releasedAt: input.releasedAt ? new Date(input.releasedAt) : null,
        pricing: input.pricing ? JSON.parse(JSON.stringify(input.pricing)) : null,
        features: input.features ? JSON.parse(JSON.stringify(input.features)) : null,
        contributedBy: userId,
      },
      include: {
        provider: {
          select: { id: true, name: true },
        },
      },
    });

    return model;
  }

  // Update model (only contributor can update)
  async updateModel(userId: string, id: string, input: UpdateModelInput) {
    const model = await prisma.model.findUnique({
      where: { id },
    });

    if (!model) {
      throw new Error('Model not found');
    }

    // Only contributor or system preset can be updated
    if (model.contributedBy && model.contributedBy !== userId) {
      throw new Error('You can only update models you contributed');
    }

    const updated = await prisma.model.update({
      where: { id },
      data: {
        ...input,
        releasedAt: input.releasedAt ? new Date(input.releasedAt) : model.releasedAt,
        pricing: input.pricing ? JSON.parse(JSON.stringify(input.pricing)) : model.pricing,
        features: input.features ? JSON.parse(JSON.stringify(input.features)) : model.features,
      },
      include: {
        provider: {
          select: { id: true, name: true },
        },
      },
    });

    return updated;
  }

  // Delete model (only contributor can delete)
  async deleteModel(userId: string, id: string) {
    const model = await prisma.model.findUnique({
      where: { id },
    });

    if (!model) {
      throw new Error('Model not found');
    }

    // Cannot delete system presets
    if (!model.contributedBy) {
      throw new Error('Cannot delete system preset models');
    }

    // Only contributor can delete
    if (model.contributedBy !== userId) {
      throw new Error('You can only delete models you contributed');
    }

    await prisma.model.delete({
      where: { id },
    });
  }

  // Increment model use count (called when user selects a model for prompt)
  async incrementUseCount(modelId: string) {
    await prisma.model.update({
      where: { id: modelId },
      data: { useCount: { increment: 1 } },
    }).catch(() => {
      // Ignore if model not found (might be using custom/mock model)
    });
  }

  // ============================================
  // Stats
  // ============================================

  async getStats() {
    const [
      totalProviders,
      totalModels,
      modelsByCapability,
      modelsByProvider,
      topModels,
    ] = await Promise.all([
      prisma.modelProvider.count({ where: { isActive: true } }),
      prisma.model.count(),
      prisma.model.groupBy({
        by: ['capabilities'],
        _count: true,
      }),
      prisma.model.groupBy({
        by: ['providerId'],
        _count: true,
      }),
      prisma.model.findMany({
        orderBy: { useCount: 'desc' },
        take: 10,
        select: { id: true, name: true, providerId: true, useCount: true },
      }),
    ]);

    return {
      totalProviders,
      totalModels,
      modelsByCapability,
      modelsByProvider,
      topModels,
    };
  }
}

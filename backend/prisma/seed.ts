import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default providers data
const defaultProviders = [
  { id: 'openai', name: 'OpenAI', website: 'https://openai.com', apiDocsUrl: 'https://platform.openai.com/docs', description: 'Leading AI research company' },
  { id: 'anthropic', name: 'Anthropic', website: 'https://anthropic.com', apiDocsUrl: 'https://docs.anthropic.com', description: 'AI safety research company' },
  { id: 'google', name: 'Google', website: 'https://ai.google.dev', apiDocsUrl: 'https://ai.google.dev/docs', description: 'Google AI and Gemini models' },
  { id: 'meta', name: 'Meta', website: 'https://llama.meta.com', apiDocsUrl: 'https://llama.meta.com/docs', description: 'Meta open-source LLaMA models' },
  { id: 'mistral', name: 'Mistral AI', website: 'https://mistral.ai', apiDocsUrl: 'https://docs.mistral.ai', description: 'European AI startup' },
  { id: 'stability', name: 'Stability AI', website: 'https://stability.ai', apiDocsUrl: 'https://platform.stability.ai/docs', description: 'Stable Diffusion image models' },
  { id: 'midjourney', name: 'Midjourney', website: 'https://midjourney.com', description: 'AI image generation' },
  { id: 'elevenlabs', name: 'ElevenLabs', website: 'https://elevenlabs.io', apiDocsUrl: 'https://docs.elevenlabs.io', description: 'AI voice synthesis' },
  { id: 'runway', name: 'Runway', website: 'https://runwayml.com', apiDocsUrl: 'https://docs.runwayml.com', description: 'AI video generation' },
  { id: 'pika', name: 'Pika', website: 'https://pika.art', description: 'AI video creation' },
  { id: 'deepseek', name: 'DeepSeek', website: 'https://deepseek.com', apiDocsUrl: 'https://platform.deepseek.com/docs', description: 'Chinese AI research company' },
  { id: 'moonshot', name: 'Moonshot AI', website: 'https://moonshot.cn', apiDocsUrl: 'https://platform.moonshot.cn/docs', description: 'Kimi AI assistant' },
  { id: 'zhipu', name: 'Zhipu AI', website: 'https://zhipuai.cn', apiDocsUrl: 'https://open.bigmodel.cn/dev/api', description: 'GLM and CogView models' },
  { id: 'baidu', name: 'Baidu', website: 'https://yiyan.baidu.com', apiDocsUrl: 'https://cloud.baidu.com/doc/WENXINWORKSHOP', description: 'ERNIE Bot and Wenxin models' },
  { id: 'alibaba', name: 'Alibaba', website: 'https://tongyi.aliyun.com', apiDocsUrl: 'https://help.aliyun.com/document_detail/2712195.html', description: 'Qwen and Tongyi models' },
];

// Default models data
const defaultModels = [
  // OpenAI - Text
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 1 },
  { id: 'gpt-4', name: 'GPT-4', providerId: 'openai', capabilities: ['text'], maxTokens: 8192, contextWindow: 8192, status: 'active', features: { streaming: true, functionCalling: true }, sortOrder: 2 },
  { id: 'gpt-4o', name: 'GPT-4o', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 3 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 4 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', providerId: 'openai', capabilities: ['text'], maxTokens: 16385, contextWindow: 16385, status: 'active', features: { streaming: true, functionCalling: true }, sortOrder: 5 },
  { id: 'o1', name: 'o1', providerId: 'openai', capabilities: ['text'], maxTokens: 200000, contextWindow: 200000, status: 'active', description: 'Advanced reasoning model', sortOrder: 6 },
  { id: 'o1-mini', name: 'o1 Mini', providerId: 'openai', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: 'Fast reasoning model', sortOrder: 7 },

  // OpenAI - Image
  { id: 'dall-e-3', name: 'DALL-E 3', providerId: 'openai', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 10 },
  { id: 'dall-e-2', name: 'DALL-E 2', providerId: 'openai', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 11 },

  // OpenAI - Audio
  { id: 'whisper-1', name: 'Whisper', providerId: 'openai', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 20 },
  { id: 'tts-1-hd', name: 'TTS HD', providerId: 'openai', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 21 },
  { id: 'tts-1', name: 'TTS', providerId: 'openai', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 22 },

  // Anthropic
  { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 1 },
  { id: 'claude-3-5-haiku-latest', name: 'Claude 3.5 Haiku', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 2 },
  { id: 'claude-3-opus-latest', name: 'Claude 3 Opus', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 3 },

  // Google
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 1000000, contextWindow: 1000000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 1 },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 2000000, contextWindow: 2000000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 2 },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 1000000, contextWindow: 1000000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 3 },

  // Meta
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', providerId: 'meta', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', sortOrder: 1 },
  { id: 'llama-3.2-90b-vision', name: 'Llama 3.2 90B Vision', providerId: 'meta', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', sortOrder: 2 },
  { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', providerId: 'meta', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', sortOrder: 3 },

  // Mistral
  { id: 'mistral-large-latest', name: 'Mistral Large', providerId: 'mistral', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, functionCalling: true }, sortOrder: 1 },
  { id: 'mistral-small-latest', name: 'Mistral Small', providerId: 'mistral', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true }, sortOrder: 2 },
  { id: 'codestral-latest', name: 'Codestral', providerId: 'mistral', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', description: 'Code generation model', sortOrder: 3 },

  // Stability AI - Image
  { id: 'sd-3.5-large', name: 'Stable Diffusion 3.5 Large', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 1 },
  { id: 'sd-3', name: 'Stable Diffusion 3', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 2 },
  { id: 'sdxl-1.0', name: 'Stable Diffusion XL', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 3 },

  // Midjourney - Image
  { id: 'midjourney-v6.1', name: 'Midjourney V6.1', providerId: 'midjourney', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 1 },
  { id: 'midjourney-v6', name: 'Midjourney V6', providerId: 'midjourney', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 2 },

  // ElevenLabs - Audio
  { id: 'eleven-multilingual-v2', name: 'Multilingual V2', providerId: 'elevenlabs', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 1 },
  { id: 'eleven-turbo-v2.5', name: 'Turbo V2.5', providerId: 'elevenlabs', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 2 },

  // Runway - Video
  { id: 'gen-3-alpha-turbo', name: 'Gen-3 Alpha Turbo', providerId: 'runway', capabilities: ['video'], maxTokens: 4000, status: 'active', sortOrder: 1 },
  { id: 'gen-3-alpha', name: 'Gen-3 Alpha', providerId: 'runway', capabilities: ['video'], maxTokens: 4000, status: 'active', sortOrder: 2 },

  // Pika - Video
  { id: 'pika-1.5', name: 'Pika 1.5', providerId: 'pika', capabilities: ['video'], maxTokens: 4000, status: 'active', sortOrder: 1 },
  { id: 'pika-1.0', name: 'Pika 1.0', providerId: 'pika', capabilities: ['video'], maxTokens: 4000, status: 'active', sortOrder: 2 },

  // OpenAI - Video (Sora)
  { id: 'sora', name: 'Sora', providerId: 'openai', capabilities: ['video'], maxTokens: 4000, status: 'active', sortOrder: 30 },

  // DeepSeek
  { id: 'deepseek-chat', name: 'DeepSeek Chat', providerId: 'deepseek', capabilities: ['text'], maxTokens: 64000, contextWindow: 64000, status: 'active', features: { streaming: true }, sortOrder: 1 },
  { id: 'deepseek-coder', name: 'DeepSeek Coder', providerId: 'deepseek', capabilities: ['text'], maxTokens: 64000, contextWindow: 64000, status: 'active', features: { streaming: true }, description: 'Code generation model', sortOrder: 2 },

  // Moonshot (Kimi)
  { id: 'moonshot-v1-128k', name: 'Moonshot 128K', providerId: 'moonshot', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true }, sortOrder: 1 },
  { id: 'moonshot-v1-32k', name: 'Moonshot 32K', providerId: 'moonshot', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true }, sortOrder: 2 },

  // Zhipu AI (GLM)
  { id: 'glm-4-plus', name: 'GLM-4 Plus', providerId: 'zhipu', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true }, sortOrder: 1 },
  { id: 'glm-4-flash', name: 'GLM-4 Flash', providerId: 'zhipu', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true }, sortOrder: 2 },
  { id: 'cogview-3-plus', name: 'CogView 3 Plus', providerId: 'zhipu', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 10 },

  // Baidu (ERNIE)
  { id: 'ernie-4.0', name: 'ERNIE 4.0', providerId: 'baidu', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true }, sortOrder: 1 },
  { id: 'ernie-speed', name: 'ERNIE Speed', providerId: 'baidu', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true }, sortOrder: 2 },

  // Alibaba (Qwen/Tongyi)
  { id: 'qwen-max', name: 'Qwen Max', providerId: 'alibaba', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true }, sortOrder: 1 },
  { id: 'qwen-plus', name: 'Qwen Plus', providerId: 'alibaba', capabilities: ['text'], maxTokens: 131072, contextWindow: 131072, status: 'active', features: { streaming: true }, sortOrder: 2 },
  { id: 'qwen-vl-max', name: 'Qwen VL Max', providerId: 'alibaba', capabilities: ['text', 'vision'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 3 },
];

async function main() {
  console.log('Seeding database...');

  // Seed providers
  console.log('Seeding providers...');
  for (const provider of defaultProviders) {
    await prisma.modelProvider.upsert({
      where: { id: provider.id },
      update: {
        name: provider.name,
        website: provider.website || null,
        apiDocsUrl: provider.apiDocsUrl || null,
        description: provider.description || null,
      },
      create: {
        ...provider,
        website: provider.website || null,
        apiDocsUrl: provider.apiDocsUrl || null,
        description: provider.description || null,
        contributedBy: null,
      },
    });
  }
  console.log(`Seeded ${defaultProviders.length} providers`);

  // Seed models
  console.log('Seeding models...');
  for (const model of defaultModels) {
    await prisma.model.upsert({
      where: { id: model.id },
      update: {
        name: model.name,
        providerId: model.providerId,
        capabilities: model.capabilities,
        maxTokens: model.maxTokens,
        contextWindow: model.contextWindow || null,
        status: model.status,
        description: model.description || null,
        features: model.features ? JSON.parse(JSON.stringify(model.features)) : null,
        sortOrder: model.sortOrder || 0,
      },
      create: {
        ...model,
        contextWindow: model.contextWindow || null,
        description: model.description || null,
        features: model.features ? JSON.parse(JSON.stringify(model.features)) : null,
        sortOrder: model.sortOrder || 0,
        contributedBy: null,
      },
    });
  }
  console.log(`Seeded ${defaultModels.length} models`);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

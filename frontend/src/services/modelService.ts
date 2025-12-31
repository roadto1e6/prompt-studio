/**
 * Model Service
 * 统一的模型服务层，抽象 Mock/API 实现细节
 */

import { api } from './api';
import type {
  Provider,
  Model,
  GetModelsResponse,
  ModelStatsResponse,
  CreateProviderRequest,
  UpdateProviderRequest,
  CreateModelRequest,
  UpdateModelRequest,
  QueryModelsParams,
  ModelOption,
  GroupedModelOptions,
  Category,
} from '@/types';

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

// ============ 工具函数 ============

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ Mock 数据 ============

const mockProviders: Provider[] = [
  { id: 'openai', name: 'OpenAI', website: 'https://openai.com', apiDocsUrl: 'https://platform.openai.com/docs', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'anthropic', name: 'Anthropic', website: 'https://anthropic.com', apiDocsUrl: 'https://docs.anthropic.com', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'google', name: 'Google', website: 'https://ai.google.dev', apiDocsUrl: 'https://ai.google.dev/docs', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'deepseek', name: 'DeepSeek', website: 'https://deepseek.com', apiDocsUrl: 'https://platform.deepseek.com/docs', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'meta', name: 'Meta', website: 'https://llama.meta.com', apiDocsUrl: 'https://llama.meta.com/docs', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'xai', name: 'xAI', website: 'https://x.ai', apiDocsUrl: 'https://docs.x.ai', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'mistral', name: 'Mistral AI', website: 'https://mistral.ai', apiDocsUrl: 'https://docs.mistral.ai', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'aws', name: 'Amazon Bedrock', website: 'https://aws.amazon.com/bedrock', apiDocsUrl: 'https://docs.aws.amazon.com/bedrock', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'stability', name: 'Stability AI', website: 'https://stability.ai', apiDocsUrl: 'https://platform.stability.ai/docs', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'midjourney', name: 'Midjourney', website: 'https://midjourney.com', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'elevenlabs', name: 'ElevenLabs', website: 'https://elevenlabs.io', apiDocsUrl: 'https://docs.elevenlabs.io', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'runway', name: 'Runway', website: 'https://runwayml.com', apiDocsUrl: 'https://docs.runwayml.com', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
  { id: 'pika', name: 'Pika', website: 'https://pika.art', isActive: true, contributedBy: null, createdAt: '', updatedAt: '' },
];

const mockModels: Model[] = [
  // ==================== OpenAI ====================
  // GPT-5 系列 (2025 最新)
  { id: 'gpt-5.2-high', name: 'GPT-5.2 High', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 400000, contextWindow: 400000, status: 'active', description: 'Arena Elo 1465，高性能模式', pricing: { inputPer1kTokens: 0.003, outputPer1kTokens: 0.028, currency: 'USD' }, features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gpt-5.2', name: 'GPT-5.2', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 400000, contextWindow: 400000, status: 'active', description: 'Arena Elo 1464，最新旗舰', pricing: { inputPer1kTokens: 0.0015, outputPer1kTokens: 0.014, currency: 'USD' }, features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gpt-5.1-high', name: 'GPT-5.1 High', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 256000, contextWindow: 256000, status: 'active', description: 'Arena Elo 1464，高性能模式', pricing: { inputPer1kTokens: 0.003, outputPer1kTokens: 0.028, currency: 'USD' }, features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 3, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gpt-5.1', name: 'GPT-5.1', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 256000, contextWindow: 256000, status: 'active', description: '稳定版本', pricing: { inputPer1kTokens: 0.0015, outputPer1kTokens: 0.014, currency: 'USD' }, features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 4, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gpt-5', name: 'GPT-5', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: '前沿推理能力，低幻觉率', pricing: { inputPer1kTokens: 0.00175, outputPer1kTokens: 0.014, currency: 'USD' }, features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 5, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  // o 系列推理模型
  { id: 'o3', name: 'o3', providerId: 'openai', capabilities: ['text'], maxTokens: 200000, contextWindow: 200000, status: 'active', description: '高级推理模型', pricing: { inputPer1kTokens: 0.01, outputPer1kTokens: 0.04, currency: 'USD' }, features: { streaming: true, functionCalling: true, jsonMode: true }, sortOrder: 3, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'o4-mini', name: 'o4 Mini', providerId: 'openai', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: '轻量推理模型', pricing: { inputPer1kTokens: 0.0011, outputPer1kTokens: 0.0044, currency: 'USD' }, features: { streaming: true, functionCalling: true, jsonMode: true }, sortOrder: 4, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'o1', name: 'o1', providerId: 'openai', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: '深度推理模型', features: { streaming: true }, sortOrder: 5, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  // GPT-4 系列
  { id: 'gpt-4o', name: 'GPT-4o', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: '多模态旗舰模型', pricing: { inputPer1kTokens: 0.0025, outputPer1kTokens: 0.01, currency: 'USD' }, features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 6, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: '高性价比多模态', pricing: { inputPer1kTokens: 0.00015, outputPer1kTokens: 0.0006, currency: 'USD' }, features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 7, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', providerId: 'openai', capabilities: ['text', 'vision'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true, vision: true, functionCalling: true, jsonMode: true }, sortOrder: 8, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  // OpenAI - Image
  { id: 'dall-e-3', name: 'DALL-E 3', providerId: 'openai', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 20, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  // OpenAI - Audio
  { id: 'whisper-1', name: 'Whisper', providerId: 'openai', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 30, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'tts-1-hd', name: 'TTS HD', providerId: 'openai', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 31, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  // OpenAI - Video
  { id: 'sora', name: 'Sora', providerId: 'openai', capabilities: ['video'], maxTokens: 4000, status: 'active', description: '文生视频模型', sortOrder: 40, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== Anthropic ====================
  { id: 'claude-opus-4.5-thinking', name: 'Claude Opus 4.5 Thinking', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', description: 'Arena Elo 1466，深度推理模式', pricing: { inputPer1kTokens: 0.01, outputPer1kTokens: 0.05, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'claude-opus-4.5', name: 'Claude Opus 4.5', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', description: 'Arena Elo 1462，SWE-bench 80.9%', pricing: { inputPer1kTokens: 0.005, outputPer1kTokens: 0.025, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'claude-4-opus', name: 'Claude 4 Opus', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', description: '顶级推理与代码分析', pricing: { inputPer1kTokens: 0.015, outputPer1kTokens: 0.075, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 1000000, status: 'active', description: '平衡性能与成本，1M上下文(Beta)', pricing: { inputPer1kTokens: 0.003, outputPer1kTokens: 0.015, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 3, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'claude-4-haiku', name: 'Claude 4 Haiku', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', description: '快速响应，低成本', pricing: { inputPer1kTokens: 0.0008, outputPer1kTokens: 0.004, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 4, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', providerId: 'anthropic', capabilities: ['text', 'vision'], maxTokens: 200000, contextWindow: 200000, status: 'active', features: { streaming: true, vision: true }, sortOrder: 5, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== Google ====================
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 10000000, contextWindow: 10000000, status: 'active', description: 'Arena Elo 1492，GPQA 91.9%，全球第一', pricing: { inputPer1kTokens: 0.002, outputPer1kTokens: 0.012, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 2000000, contextWindow: 2000000, status: 'active', description: 'Arena Elo 1470，高速版本', pricing: { inputPer1kTokens: 0.0005, outputPer1kTokens: 0.002, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 2000000, contextWindow: 2000000, status: 'active', description: 'Arena Elo 1460，大型多模态', pricing: { inputPer1kTokens: 0.00125, outputPer1kTokens: 0.005, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 3, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', providerId: 'google', capabilities: ['text', 'vision', 'audio'], maxTokens: 1000000, contextWindow: 1000000, status: 'active', description: '支持音频的快速模型', pricing: { inputPer1kTokens: 0.000075, outputPer1kTokens: 0.0003, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 4, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', providerId: 'google', capabilities: ['text', 'vision'], maxTokens: 1000000, contextWindow: 1000000, status: 'active', description: '超快速，257 tokens/sec', pricing: { inputPer1kTokens: 0.0001, outputPer1kTokens: 0.0004, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 5, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== DeepSeek ====================
  { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', providerId: 'deepseek', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: '极致性价比，Sparse Attention架构', pricing: { inputPer1kTokens: 0.00027, outputPer1kTokens: 0.0011, currency: 'USD' }, features: { streaming: true, functionCalling: true }, sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', providerId: 'deepseek', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: '开源领先模型', pricing: { inputPer1kTokens: 0.00027, outputPer1kTokens: 0.0011, currency: 'USD' }, features: { streaming: true, functionCalling: true }, sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'deepseek-coder-v2', name: 'DeepSeek Coder V2', providerId: 'deepseek', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: '专注编程任务', features: { streaming: true }, sortOrder: 3, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== Meta ====================
  { id: 'llama-4-scout', name: 'Llama 4 Scout', providerId: 'meta', capabilities: ['text'], maxTokens: 10000000, contextWindow: 10000000, status: 'active', description: '1000万上下文，研究文档利器', features: { streaming: true }, sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', providerId: 'meta', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: '2500 tokens/sec 高速推理', pricing: { inputPer1kTokens: 0.00059, outputPer1kTokens: 0.0007, currency: 'USD' }, features: { streaming: true }, sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', providerId: 'meta', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true }, sortOrder: 3, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', providerId: 'meta', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', features: { streaming: true }, sortOrder: 4, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== xAI ====================
  { id: 'grok-4.1-thinking', name: 'Grok 4.1 Thinking', providerId: 'xai', capabilities: ['text', 'vision'], maxTokens: 131072, contextWindow: 131072, status: 'active', description: 'Arena Elo 1482，深度推理模式', features: { streaming: true, vision: true }, sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'grok-4.1', name: 'Grok 4.1', providerId: 'xai', capabilities: ['text', 'vision'], maxTokens: 131072, contextWindow: 131072, status: 'active', description: 'Arena Elo 1463', features: { streaming: true, vision: true }, sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'grok-3', name: 'Grok 3', providerId: 'xai', capabilities: ['text', 'vision'], maxTokens: 131072, contextWindow: 131072, status: 'active', description: 'xAI 旗舰模型', features: { streaming: true, vision: true }, sortOrder: 3, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'grok-2', name: 'Grok 2', providerId: 'xai', capabilities: ['text', 'vision'], maxTokens: 131072, contextWindow: 131072, status: 'active', features: { streaming: true, vision: true }, sortOrder: 4, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== Mistral AI ====================
  { id: 'mistral-large-2', name: 'Mistral Large 2', providerId: 'mistral', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: '企业级旗舰模型', pricing: { inputPer1kTokens: 0.002, outputPer1kTokens: 0.006, currency: 'USD' }, features: { streaming: true, functionCalling: true }, sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'mistral-medium', name: 'Mistral Medium', providerId: 'mistral', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true }, sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'mistral-small', name: 'Mistral Small', providerId: 'mistral', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', features: { streaming: true }, sortOrder: 3, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'codestral', name: 'Codestral', providerId: 'mistral', capabilities: ['text'], maxTokens: 32000, contextWindow: 32000, status: 'active', description: '专业编程模型', features: { streaming: true }, sortOrder: 4, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== Amazon Bedrock ====================
  { id: 'nova-pro', name: 'Nova Pro', providerId: 'aws', capabilities: ['text', 'vision'], maxTokens: 300000, contextWindow: 300000, status: 'active', description: '高性能多模态', pricing: { inputPer1kTokens: 0.0008, outputPer1kTokens: 0.0032, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'nova-lite', name: 'Nova Lite', providerId: 'aws', capabilities: ['text', 'vision'], maxTokens: 300000, contextWindow: 300000, status: 'active', description: '高性价比选择', pricing: { inputPer1kTokens: 0.00006, outputPer1kTokens: 0.00024, currency: 'USD' }, features: { streaming: true, vision: true }, sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'nova-micro', name: 'Nova Micro', providerId: 'aws', capabilities: ['text'], maxTokens: 128000, contextWindow: 128000, status: 'active', description: '最快响应 0.3s 延迟', pricing: { inputPer1kTokens: 0.00004, outputPer1kTokens: 0.00014, currency: 'USD' }, features: { streaming: true }, sortOrder: 3, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== Stability AI - Image ====================
  { id: 'sd-3.5-large', name: 'Stable Diffusion 3.5 Large', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active', description: '最新图像生成', sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'sd-3-turbo', name: 'SD 3 Turbo', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'sdxl-1.0', name: 'Stable Diffusion XL', providerId: 'stability', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 3, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== Midjourney - Image ====================
  { id: 'midjourney-v6.1', name: 'Midjourney V6.1', providerId: 'midjourney', capabilities: ['image'], maxTokens: 4000, status: 'active', description: '最新版本', sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'midjourney-v6', name: 'Midjourney V6', providerId: 'midjourney', capabilities: ['image'], maxTokens: 4000, status: 'active', sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== ElevenLabs - Audio ====================
  { id: 'eleven-multilingual-v2', name: 'Multilingual V2', providerId: 'elevenlabs', capabilities: ['audio'], maxTokens: 4000, status: 'active', sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'eleven-turbo-v2.5', name: 'Turbo V2.5', providerId: 'elevenlabs', capabilities: ['audio'], maxTokens: 4000, status: 'active', description: '最快语音合成', sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== Runway - Video ====================
  { id: 'gen-3-alpha-turbo', name: 'Gen-3 Alpha Turbo', providerId: 'runway', capabilities: ['video'], maxTokens: 4000, status: 'active', description: '最新视频生成', sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'gen-3-alpha', name: 'Gen-3 Alpha', providerId: 'runway', capabilities: ['video'], maxTokens: 4000, status: 'active', sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },

  // ==================== Pika - Video ====================
  { id: 'pika-2.0', name: 'Pika 2.0', providerId: 'pika', capabilities: ['video'], maxTokens: 4000, status: 'active', description: '最新视频生成', sortOrder: 1, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
  { id: 'pika-1.5', name: 'Pika 1.5', providerId: 'pika', capabilities: ['video'], maxTokens: 4000, status: 'active', sortOrder: 2, sourceType: 'system', useCount: 0, createdAt: '', updatedAt: '' },
];

// ============ 通用工具方法 ============

const utils = {
  getModelOptions(
    models: Model[],
    providers: Provider[],
    options?: { category?: Category; includeDisabled?: boolean }
  ): GroupedModelOptions[] {
    const { category, includeDisabled = false } = options || {};

    let filteredModels = models;
    if (category) {
      filteredModels = models.filter(m => m.capabilities.includes(category));
    }
    if (!includeDisabled) {
      filteredModels = filteredModels.filter(m => m.status !== 'deprecated');
    }

    const providerMap = new Map<string, ModelOption[]>();

    for (const model of filteredModels) {
      const provider = providers.find(p => p.id === model.providerId);
      const option: ModelOption = {
        value: model.id,
        label: model.name,
        provider: model.providerId,
        providerName: provider?.name || model.providerId,
        maxTokens: model.maxTokens,
        disabled: model.status === 'deprecated',
        badge: model.status === 'beta' ? 'beta' : model.status === 'deprecated' ? 'deprecated' : undefined,
        useCount: model.useCount,
      };

      const existing = providerMap.get(model.providerId) || [];
      providerMap.set(model.providerId, [...existing, option]);
    }

    const result: GroupedModelOptions[] = [];
    for (const [providerId, modelOptions] of providerMap) {
      const provider = providers.find(p => p.id === providerId);
      result.push({
        provider: providerId,
        providerName: provider?.name || providerId,
        options: modelOptions,
      });
    }

    return result;
  },

  findModel(modelId: string, models: Model[]): Model | undefined {
    return models.find(m => m.id === modelId);
  },

  getDefaultModelId(category: Category): string {
    const defaults: Record<Category, string> = {
      text: 'gpt-4o',
      image: 'dall-e-3',
      audio: 'whisper-1',
      video: 'sora',
    };
    return defaults[category];
  },
};

// ============ Mock 实现 ============

const mockService = {
  getModels: async (params?: QueryModelsParams): Promise<GetModelsResponse> => {
    await delay(100);

    let filteredModels = [...mockModels];
    if (params?.category) {
      filteredModels = filteredModels.filter(m => m.capabilities.includes(params.category!));
    }
    if (params?.providerId) {
      filteredModels = filteredModels.filter(m => m.providerId === params.providerId);
    }
    if (params?.status) {
      filteredModels = filteredModels.filter(m => m.status === params.status);
    }
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredModels = filteredModels.filter(m =>
        m.name.toLowerCase().includes(search) ||
        m.description?.toLowerCase().includes(search)
      );
    }

    return { providers: mockProviders, models: filteredModels };
  },

  getProviders: async (): Promise<Provider[]> => {
    await delay(50);
    return [...mockProviders];
  },

  getProvider: async (id: string): Promise<Provider & { models: Model[] }> => {
    await delay(50);
    const provider = mockProviders.find(p => p.id === id);
    if (!provider) throw new Error('Provider not found');
    const models = mockModels.filter(m => m.providerId === id);
    return { ...provider, models };
  },

  getModel: async (id: string): Promise<Model> => {
    await delay(50);
    const model = mockModels.find(m => m.id === id);
    if (!model) throw new Error('Model not found');
    return model;
  },

  getStats: async (): Promise<ModelStatsResponse> => {
    await delay(50);
    return {
      totalProviders: mockProviders.length,
      totalModels: mockModels.length,
      modelsByCapability: [],
      modelsByProvider: [],
      topModels: mockModels.slice(0, 10).map(m => ({
        id: m.id,
        name: m.name,
        providerId: m.providerId,
        useCount: m.useCount,
      })),
    };
  },

  createProvider: async (data: CreateProviderRequest): Promise<Provider> => {
    await delay(100);
    const provider: Provider = {
      ...data,
      isActive: true,
      contributedBy: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProviders.push(provider);
    return provider;
  },

  updateProvider: async (id: string, data: UpdateProviderRequest): Promise<Provider> => {
    await delay(100);
    const index = mockProviders.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Provider not found');
    mockProviders[index] = { ...mockProviders[index], ...data, updatedAt: new Date().toISOString() };
    return mockProviders[index];
  },

  deleteProvider: async (id: string): Promise<void> => {
    await delay(100);
    const index = mockProviders.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Provider not found');
    mockProviders.splice(index, 1);
  },

  createModel: async (data: CreateModelRequest): Promise<Model> => {
    await delay(100);
    const model: Model = {
      ...data,
      status: data.status || 'active',
      sortOrder: 0,
      sourceType: 'system',
      contributedBy: null,
      useCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockModels.push(model);
    return model;
  },

  updateModel: async (id: string, data: UpdateModelRequest): Promise<Model> => {
    await delay(100);
    const index = mockModels.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Model not found');
    mockModels[index] = { ...mockModels[index], ...data, updatedAt: new Date().toISOString() };
    return mockModels[index];
  },

  deleteModel: async (id: string): Promise<void> => {
    await delay(100);
    const index = mockModels.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Model not found');
    mockModels.splice(index, 1);
  },

  incrementUseCount: async (modelId: string): Promise<void> => {
    await delay(50);
    const model = mockModels.find(m => m.id === modelId);
    if (model) model.useCount++;
  },

  ...utils,
};

// ============ API 实现 ============

const apiService = {
  getModels: async (params?: QueryModelsParams): Promise<GetModelsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.set('category', params.category);
    if (params?.providerId) queryParams.set('providerId', params.providerId);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.search) queryParams.set('search', params.search);

    const url = queryParams.toString() ? `/models?${queryParams}` : '/models';
    return api.get<GetModelsResponse>(url);
  },

  getProviders: async (): Promise<Provider[]> => {
    return api.get<Provider[]>('/models/providers');
  },

  getProvider: async (id: string): Promise<Provider & { models: Model[] }> => {
    return api.get<Provider & { models: Model[] }>(`/models/providers/${id}`);
  },

  getModel: async (id: string): Promise<Model> => {
    return api.get<Model>(`/models/${id}`);
  },

  getStats: async (): Promise<ModelStatsResponse> => {
    return api.get<ModelStatsResponse>('/models/stats');
  },

  createProvider: async (data: CreateProviderRequest): Promise<Provider> => {
    return api.post<Provider>('/models/providers', data);
  },

  updateProvider: async (id: string, data: UpdateProviderRequest): Promise<Provider> => {
    return api.patch<Provider>(`/models/providers/${id}`, data);
  },

  deleteProvider: async (id: string): Promise<void> => {
    await api.delete(`/models/providers/${id}`);
  },

  createModel: async (data: CreateModelRequest): Promise<Model> => {
    return api.post<Model>('/models', data);
  },

  updateModel: async (id: string, data: UpdateModelRequest): Promise<Model> => {
    return api.patch<Model>(`/models/${id}`, data);
  },

  deleteModel: async (id: string): Promise<void> => {
    await api.delete(`/models/${id}`);
  },

  incrementUseCount: async (modelId: string): Promise<void> => {
    await api.post(`/models/${modelId}/use`);
  },

  ...utils,
};

// ============ 导出统一接口 ============

export const modelService = USE_MOCK ? mockService : apiService;

export default modelService;

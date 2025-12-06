import { Category } from '@/types';

// Text generation models
export const TEXT_MODELS = [
  {
    group: 'OpenAI',
    models: [
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', maxTokens: 128000 },
      { id: 'gpt-4', name: 'GPT-4', maxTokens: 8192 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', maxTokens: 16385 },
    ]
  },
  {
    group: 'Anthropic',
    models: [
      { id: 'claude-3-opus', name: 'Claude 3 Opus', maxTokens: 200000 },
      { id: 'claude-3-sonnet', name: 'Claude 3.5 Sonnet', maxTokens: 200000 },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', maxTokens: 200000 },
    ]
  },
  {
    group: 'Google',
    models: [
      { id: 'gemini-pro', name: 'Gemini Pro', maxTokens: 32000 },
      { id: 'gemini-ultra', name: 'Gemini Ultra', maxTokens: 32000 },
    ]
  },
  {
    group: 'Meta',
    models: [
      { id: 'llama-3-70b', name: 'Llama 3 70B', maxTokens: 8192 },
      { id: 'llama-3-8b', name: 'Llama 3 8B', maxTokens: 8192 },
    ]
  }
];

// Image generation models
export const IMAGE_MODELS = [
  {
    group: 'OpenAI',
    models: [
      { id: 'dall-e-3', name: 'DALL-E 3', maxTokens: 4000 },
      { id: 'dall-e-2', name: 'DALL-E 2', maxTokens: 4000 },
    ]
  },
  {
    group: 'Stability AI',
    models: [
      { id: 'sdxl-1.0', name: 'Stable Diffusion XL', maxTokens: 4000 },
      { id: 'sd-3', name: 'Stable Diffusion 3', maxTokens: 4000 },
    ]
  },
  {
    group: 'Midjourney',
    models: [
      { id: 'midjourney-v6', name: 'Midjourney V6', maxTokens: 4000 },
      { id: 'midjourney-v5', name: 'Midjourney V5', maxTokens: 4000 },
    ]
  }
];

// Audio generation models
export const AUDIO_MODELS = [
  {
    group: 'OpenAI',
    models: [
      { id: 'whisper-1', name: 'Whisper', maxTokens: 4000 },
      { id: 'tts-1-hd', name: 'TTS HD', maxTokens: 4000 },
      { id: 'tts-1', name: 'TTS', maxTokens: 4000 },
    ]
  },
  {
    group: 'ElevenLabs',
    models: [
      { id: 'eleven-multilingual-v2', name: 'Multilingual V2', maxTokens: 4000 },
      { id: 'eleven-turbo-v2', name: 'Turbo V2', maxTokens: 4000 },
    ]
  }
];

// Video generation models
export const VIDEO_MODELS = [
  {
    group: 'Runway',
    models: [
      { id: 'gen-3-alpha', name: 'Gen-3 Alpha', maxTokens: 4000 },
      { id: 'gen-2', name: 'Gen-2', maxTokens: 4000 },
    ]
  },
  {
    group: 'Pika',
    models: [
      { id: 'pika-1.0', name: 'Pika 1.0', maxTokens: 4000 },
    ]
  },
  {
    group: 'OpenAI',
    models: [
      { id: 'sora', name: 'Sora', maxTokens: 4000 },
    ]
  }
];

// Category to models mapping
export const MODELS_BY_CATEGORY: Record<Category, typeof TEXT_MODELS> = {
  text: TEXT_MODELS,
  image: IMAGE_MODELS,
  audio: AUDIO_MODELS,
  video: VIDEO_MODELS,
};

// Default model for each category
export const DEFAULT_MODEL_BY_CATEGORY: Record<Category, string> = {
  text: 'gpt-4-turbo',
  image: 'dall-e-3',
  audio: 'whisper-1',
  video: 'gen-3-alpha',
};

// Legacy export for backward compatibility
export const AI_MODELS = TEXT_MODELS;

export const CATEGORIES = [
  { id: 'text', label: 'Text', icon: 'FileText', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
  { id: 'image', label: 'Image', icon: 'Image', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  { id: 'audio', label: 'Audio', icon: 'AudioLines', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  { id: 'video', label: 'Video', icon: 'Video', color: 'text-rose-400', bgColor: 'bg-rose-500/20' },
] as const;

export const QUICK_FILTERS = [
  { id: 'all', label: 'All Prompts', icon: 'Infinity' },
  { id: 'favorites', label: 'Favorites', icon: 'Star' },
  { id: 'recent', label: 'Recent', icon: 'Clock' },
  { id: 'trash', label: 'Trash', icon: 'Trash2' },
] as const;

export const COLLECTION_COLORS = [
  'text-pink-500',
  'text-emerald-500',
  'text-blue-500',
  'text-amber-500',
  'text-purple-500',
  'text-cyan-500',
  'text-red-500',
  'text-lime-500',
];

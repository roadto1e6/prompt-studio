export const AI_MODELS = [
  {
    group: 'OpenAI',
    models: [
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', maxTokens: 128000 },
      { id: 'gpt-4', name: 'GPT-4', maxTokens: 8192 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', maxTokens: 16385 },
      { id: 'dall-e-3', name: 'DALL-E 3', maxTokens: 4000 },
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

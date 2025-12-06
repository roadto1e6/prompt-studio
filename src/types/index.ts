// Prompt Types
export type Category = 'text' | 'image' | 'audio' | 'video';
export type PromptStatus = 'active' | 'archived' | 'trash';

export interface PromptVersion {
  id: string;
  promptId: string;
  versionNumber: string;
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  changeNote: string;
  createdAt: string;
  createdBy: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: Category;
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tags: string[];
  collectionId: string | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  currentVersionId: string;
  versions: PromptVersion[];
  status: PromptStatus;
}

// Collection Types
export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  promptCount: number;
  createdAt: string;
  updatedAt: string;
}

// Filter Types
export type QuickFilter = 'all' | 'favorites' | 'recent' | 'trash';
export type ViewMode = 'grid' | 'list';
export type SortBy = 'updatedAt' | 'title' | 'createdAt';
export type SortOrder = 'asc' | 'desc';
export type TabType = 'editor' | 'metadata' | 'versions';

// UI Types
export type ModalType = 'createPrompt' | 'createCollection' | 'settings' | 'deleteConfirm' | 'sharePrompt' | 'importPrompt';

// Share Types
export interface SharedPromptData {
  title: string;
  description: string;
  category: Category;
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tags: string[];
  sharedAt: string;
  sharedBy: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'team';
}

// i18n Types
export type Language = 'en' | 'zh';

// Theme Types
export type Theme = 'dark' | 'light';

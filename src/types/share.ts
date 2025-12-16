/**
 * Share Types
 * 分享相关类型定义
 */

import { Category } from './prompt';

// ============ 分享的 Prompt 数据 ============

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

// ============ 分享记录 ============

export interface ShareRecord {
  id: string;
  code: string;
  promptId: string;
  prompt: SharedPromptData;
  createdAt: string;
  expiresAt?: string;
  viewCount: number;
}

// ============ API 请求类型 ============

export interface CreateShareRequest {
  promptId?: string;
  prompt?: SharedPromptData;  // For mock mode - pass full prompt data
  expiresIn?: number; // 过期时间（小时）
}

// ============ API 响应类型 ============

export interface CreateShareResponse {
  id: string;
  code: string;
  shareUrl: string;
  expiresAt?: string;
}

export interface GetShareResponse {
  prompt: SharedPromptData;
  sharedBy: {
    name: string;
    avatar?: string;
  };
  viewCount: number;
  createdAt: string;
  expiresAt?: string;
}

// ============ 我的分享列表 ============

export interface MyShareRecord {
  id: string;
  code: string;
  promptId: string;
  promptTitle: string;
  viewCount: number;
  createdAt: string;
  expiresAt?: string;
}

/**
 * Share Service
 * 统一的分享服务层，抽象 Mock/API 实现细节
 */

import { api } from './api';
import type {
  CreateShareRequest,
  CreateShareResponse,
  GetShareResponse,
  ShareRecord,
} from '@/types';

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

// Mock 存储 - 使用 localStorage 模拟后端存储
const MOCK_STORAGE_KEY = 'prompt_studio_shares';

// ============ 工具函数 ============

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateShortCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getMockShares(): Record<string, ShareRecord> {
  try {
    const data = localStorage.getItem(MOCK_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveMockShares(shares: Record<string, ShareRecord>): void {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(shares));
}

// ============ 通用工具方法 ============

const utils = {
  isShortCode(text: string): boolean {
    return /^[A-Za-z0-9]{8}$/.test(text.trim());
  },

  getCodeFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('s');
  },

  getShareUrl(code: string): string {
    return `${window.location.origin}${window.location.pathname}?s=${code}`;
  },
};

// ============ Mock 实现 ============

const mockService = {
  create: async (request: CreateShareRequest): Promise<CreateShareResponse> => {
    await delay(300);

    const code = generateShortCode();
    const now = new Date().toISOString();
    const expiresAt = request.expiresIn
      ? new Date(Date.now() + request.expiresIn * 60 * 60 * 1000).toISOString()
      : undefined;

    const id = `share_${Date.now()}`;
    const record: ShareRecord = {
      id,
      code,
      promptId: request.promptId || '',
      prompt: request.prompt!,
      createdAt: now,
      expiresAt,
      viewCount: 0,
    };

    const shares = getMockShares();
    shares[code] = record;
    saveMockShares(shares);

    return {
      id,
      code,
      shareUrl: utils.getShareUrl(code),
      expiresAt,
    };
  },

  get: async (code: string): Promise<GetShareResponse> => {
    await delay(200);

    const shares = getMockShares();
    const record = shares[code];

    if (!record) {
      throw new Error('分享不存在或已过期');
    }

    if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
      delete shares[code];
      saveMockShares(shares);
      throw new Error('分享已过期');
    }

    record.viewCount += 1;
    saveMockShares(shares);

    return {
      prompt: record.prompt,
      sharedBy: {
        name: record.prompt.sharedBy,
      },
      viewCount: record.viewCount,
      createdAt: record.createdAt,
      expiresAt: record.expiresAt,
    };
  },

  ...utils,
};

// ============ API 实现 ============

const apiService = {
  create: async (request: CreateShareRequest): Promise<CreateShareResponse> => {
    const result = await api.post<CreateShareResponse>('/shares', request);

    // 验证响应数据
    if (!result || typeof result !== 'object' || !result.code) {
      throw new Error('Invalid API response');
    }

    // 构建完整 URL（后端返回相对路径）
    return {
      id: result.id,
      code: result.code,
      shareUrl: utils.getShareUrl(result.code),
      expiresAt: result.expiresAt,
    };
  },

  get: async (code: string): Promise<GetShareResponse> => {
    return api.get<GetShareResponse>(`/shares/${code}`);
  },

  ...utils,
};

// ============ 导出统一接口 ============

export const shareService = USE_MOCK ? mockService : apiService;

export default shareService;

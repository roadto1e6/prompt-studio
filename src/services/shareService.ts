/**
 * Share Service
 * 提示词分享服务 - 当前使用 mock 实现，后续可接入真实 API
 */

import { api } from './api';
import {
  CreateShareRequest,
  CreateShareResponse,
  GetShareResponse,
  ShareRecord,
} from '@/types';

// Mock 存储 - 使用 localStorage 模拟后端存储
const MOCK_STORAGE_KEY = 'prompt_studio_shares';
const USE_MOCK = true; // 切换为 false 时使用真实 API

// 生成短码
function generateShortCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Mock 存储操作
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

// Mock API 实现
async function mockCreateShare(request: CreateShareRequest): Promise<CreateShareResponse> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300));

  const code = generateShortCode();
  const now = new Date().toISOString();
  const expiresAt = request.expiresIn
    ? new Date(Date.now() + request.expiresIn * 60 * 60 * 1000).toISOString()
    : undefined;

  const record: ShareRecord = {
    code,
    prompt: request.prompt,
    createdAt: now,
    expiresAt,
    viewCount: 0,
  };

  const shares = getMockShares();
  shares[code] = record;
  saveMockShares(shares);

  return {
    code,
    shareUrl: `${window.location.origin}${window.location.pathname}?s=${code}`,
    expiresAt,
  };
}

async function mockGetShare(code: string): Promise<GetShareResponse> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200));

  const shares = getMockShares();
  const record = shares[code];

  if (!record) {
    throw new Error('分享不存在或已过期');
  }

  // 检查是否过期
  if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
    delete shares[code];
    saveMockShares(shares);
    throw new Error('分享已过期');
  }

  // 增加访问计数
  record.viewCount += 1;
  saveMockShares(shares);

  return {
    prompt: record.prompt,
    viewCount: record.viewCount,
    createdAt: record.createdAt,
  };
}

// 分享服务 API
export const shareService = {
  /**
   * 创建分享
   */
  async create(request: CreateShareRequest): Promise<CreateShareResponse> {
    if (USE_MOCK) {
      return mockCreateShare(request);
    }
    return api.post<CreateShareResponse>('/shares', request);
  },

  /**
   * 获取分享内容
   */
  async get(code: string): Promise<GetShareResponse> {
    if (USE_MOCK) {
      return mockGetShare(code);
    }
    return api.get<GetShareResponse>(`/shares/${code}`);
  },

  /**
   * 检查是否为短码格式
   */
  isShortCode(text: string): boolean {
    // 短码为 8 位字母数字
    return /^[A-Za-z0-9]{8}$/.test(text.trim());
  },

  /**
   * 从 URL 提取短码
   */
  getCodeFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('s');
  },

  /**
   * 生成分享链接
   */
  getShareUrl(code: string): string {
    return `${window.location.origin}${window.location.pathname}?s=${code}`;
  },
};

export default shareService;

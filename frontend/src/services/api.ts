/**
 * HTTP API Client
 * 封装 fetch 请求，提供统一的错误处理、认证拦截、请求/响应转换
 */

// API 配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  code?: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API 错误
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 请求配置类型
interface RequestConfig extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

// Token 管理
let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export const tokenManager = {
  setTokens: (access: string, refresh: string) => {
    accessToken = access;
    refreshToken = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },

  getAccessToken: () => {
    if (!accessToken) {
      accessToken = localStorage.getItem('access_token');
    }
    return accessToken;
  },

  getRefreshToken: () => {
    if (!refreshToken) {
      refreshToken = localStorage.getItem('refresh_token');
    }
    return refreshToken;
  },

  clearTokens: () => {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated: () => {
    return !!tokenManager.getAccessToken();
  },
};

// Token 刷新函数
async function refreshAccessToken(): Promise<string> {
  const refresh = tokenManager.getRefreshToken();
  if (!refresh) {
    throw new ApiError('No refresh token available', 401, 'NO_REFRESH_TOKEN');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: refresh }),
  });

  if (!response.ok) {
    tokenManager.clearTokens();
    throw new ApiError('Session expired, please login again', 401, 'SESSION_EXPIRED');
  }

  const data = await response.json();
  tokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
  return data.data.accessToken;
}

// 带超时的 fetch
async function fetchWithTimeout(
  url: string,
  config: RequestConfig
): Promise<Response> {
  const { timeout = API_TIMEOUT, ...fetchConfig } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// 主请求函数
async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { skipAuth = false, ...fetchConfig } = config;

  // 构建 URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // 构建 Headers
  const headers = new Headers(fetchConfig.headers);

  if (!headers.has('Content-Type') && fetchConfig.body) {
    headers.set('Content-Type', 'application/json');
  }

  // 添加认证 Token
  if (!skipAuth && tokenManager.isAuthenticated()) {
    headers.set('Authorization', `Bearer ${tokenManager.getAccessToken()}`);
  }

  // 发送请求
  let response = await fetchWithTimeout(url, {
    ...fetchConfig,
    headers,
  });

  // 处理 401 - Token 过期，尝试刷新
  if (response.status === 401 && !skipAuth && tokenManager.getRefreshToken()) {
    try {
      // 避免并发刷新
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }

      const newToken = await refreshPromise;
      refreshPromise = null;

      // 重试原请求
      headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetchWithTimeout(url, {
        ...fetchConfig,
        headers,
      });
    } catch {
      refreshPromise = null;
      // 刷新失败，清除 token 并抛出错误
      tokenManager.clearTokens();
      throw new ApiError('Session expired, please login again', 401, 'SESSION_EXPIRED');
    }
  }

  // 解析响应
  const contentType = response.headers.get('Content-Type');
  let data: ApiResponse<T>;

  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { success: response.ok, data: text as unknown as T };
  }

  // 处理错误响应
  if (!response.ok) {
    throw new ApiError(
      data.message || data.error || `HTTP ${response.status}`,
      response.status,
      data.code,
      data
    );
  }

  return data.data;
}

// HTTP 方法快捷函数
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};

export default api;

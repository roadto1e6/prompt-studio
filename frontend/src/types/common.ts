/**
 * Common Types
 * 通用类型定义
 */

// ============ API 响应类型 ============

// 标准 API 响应
export interface ApiResponse<T> {
  success: true;
  data: T;
}

// 分页响应
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: Pagination;
}

// 分页信息
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// API 错误响应
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// ============ 通用过滤和排序 ============

export type SortOrder = 'asc' | 'desc';

// 基础查询参数
export interface BaseQueryParams {
  page?: number;
  pageSize?: number;
  sortOrder?: SortOrder;
}

// ============ 通用实体字段 ============

// 带时间戳的实体
export interface TimestampedEntity {
  createdAt: string;
  updatedAt: string;
}

// 带软删除的实体
export interface SoftDeletableEntity {
  isDeleted: boolean;
  deletedAt?: string;
}

// ============ i18n 和主题 ============

export type Language = 'en' | 'zh';
export type Theme = 'dark' | 'light' | 'system';

/**
 * Collection Types
 * 集合相关类型定义
 */

import { BaseQueryParams, TimestampedEntity } from './common';

// ============ Collection 实体 ============

export interface Collection extends TimestampedEntity {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  promptCount: number;
  // 后端返回时可能包含
  createdBy?: string;
}

// ============ API 请求类型 ============

export interface CreateCollectionRequest {
  name: string;
  description?: string;
  color: string;
  icon?: string;
}

export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

// ============ 查询参数 ============

export type CollectionSortBy = 'name' | 'createdAt' | 'updatedAt' | 'promptCount';

export interface CollectionQueryParams extends BaseQueryParams {
  search?: string;
  sortBy?: CollectionSortBy;
}

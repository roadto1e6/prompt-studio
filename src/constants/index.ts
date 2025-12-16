/**
 * Constants
 * 纯静态 UI 配置
 *
 * 注意：动态数据（如 AI 模型）已移至 services/modelService.ts
 */

import type { Category } from '@/types';

// ============ 分类配置 ============

export const CATEGORIES = [
  { id: 'text' as Category, label: 'Text', icon: 'FileText', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
  { id: 'image' as Category, label: 'Image', icon: 'Image', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  { id: 'audio' as Category, label: 'Audio', icon: 'AudioLines', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  { id: 'video' as Category, label: 'Video', icon: 'Video', color: 'text-rose-400', bgColor: 'bg-rose-500/20' },
] as const;

// ============ 快速过滤 ============

export const QUICK_FILTERS = [
  { id: 'all', label: 'All Prompts', icon: 'Infinity' },
  { id: 'favorites', label: 'Favorites', icon: 'Star' },
  { id: 'recent', label: 'Recent', icon: 'Clock' },
  { id: 'trash', label: 'Trash', icon: 'Trash2' },
] as const;

// ============ 集合颜色 ============

export const COLLECTION_COLORS = [
  'text-pink-500',
  'text-emerald-500',
  'text-blue-500',
  'text-amber-500',
  'text-purple-500',
  'text-cyan-500',
  'text-red-500',
  'text-lime-500',
] as const;

// ============ 集合图标 ============

export const COLLECTION_ICONS = [
  'Folder',
  'FolderOpen',
  'Star',
  'Heart',
  'Bookmark',
  'Tag',
  'Flag',
  'Zap',
  'Flame',
  'Rocket',
  'Code',
  'FileText',
  'Image',
  'Video',
  'Music',
  'Megaphone',
  'Palette',
  'Lightbulb',
  'Target',
  'Trophy',
] as const;

// ============ 排序选项 ============

export const SORT_OPTIONS = [
  { id: 'updatedAt', label: 'Last Modified' },
  { id: 'createdAt', label: 'Date Created' },
  { id: 'title', label: 'Title' },
] as const;

// ============ 视图模式 ============

export const VIEW_MODES = [
  { id: 'grid', label: 'Grid View', icon: 'LayoutGrid' },
  { id: 'list', label: 'List View', icon: 'List' },
] as const;

// ============ 温度预设 ============

export const TEMPERATURE_PRESETS = [
  { value: 0, label: 'Precise', description: 'Deterministic, focused responses' },
  { value: 0.3, label: 'Balanced', description: 'Slight variation, reliable' },
  { value: 0.7, label: 'Creative', description: 'More varied, creative outputs' },
  { value: 1.0, label: 'Random', description: 'Maximum variation and creativity' },
] as const;

// ============ Token 预设 ============

export const MAX_TOKENS_PRESETS = [
  { value: 256, label: 'Short' },
  { value: 512, label: 'Medium' },
  { value: 1024, label: 'Long' },
  { value: 2048, label: 'Very Long' },
  { value: 4096, label: 'Maximum' },
] as const;

// ============ 分享过期时间选项 ============

export const SHARE_EXPIRY_OPTIONS = [
  { value: 0, label: 'Never Expire' },
  { value: 1, label: '1 Hour' },
  { value: 24, label: '1 Day' },
  { value: 168, label: '1 Week' },
  { value: 720, label: '1 Month' },
] as const;

// ============ 辅助函数 ============

/**
 * 根据分类 ID 获取分类配置
 */
export function getCategoryConfig(categoryId: Category) {
  return CATEGORIES.find(c => c.id === categoryId);
}

/**
 * 根据过滤器 ID 获取过滤器配置
 */
export function getFilterConfig(filterId: string) {
  return QUICK_FILTERS.find(f => f.id === filterId);
}

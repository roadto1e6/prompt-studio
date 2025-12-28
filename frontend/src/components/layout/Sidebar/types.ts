/**
 * Sidebar 组件 - 类型定义
 * 文件路径: frontend/src/components/layout/Sidebar/types.ts
 */

import type { LucideIcon } from 'lucide-react';

/**
 * 导航项接口
 */
export interface NavItem {
  /** 唯一标识符 */
  id: string;
  /** 图标组件 */
  icon: LucideIcon;
  /** 图标颜色类名 */
  iconColor?: string;
  /** 项目数量 */
  count: number;
}

/**
 * 集合导航项接口
 */
export interface CollectionNavItem {
  /** 集合 ID */
  id: string;
  /** 集合名称 */
  name: string;
  /** 图标颜色类名 */
  color: string;
  /** 提示词数量 */
  count: number;
}

/**
 * 上下文菜单位置
 */
export interface ContextMenuPosition {
  /** X 坐标 */
  x: number;
  /** Y 坐标 */
  y: number;
  /** 集合 ID */
  collectionId: string;
}

/**
 * Sidebar 组件属性
 */
export interface SidebarProps {
  /** 是否折叠（响应式） */
  collapsed?: boolean;
  /** 折叠状态变化回调 */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * useSidebar Hook 返回值
 */
export interface UseSidebarReturn {
  // ==================== 搜索相关 ====================
  /** 搜索查询 */
  searchQuery: string;
  /** 搜索输入框引用 */
  searchInputRef: React.RefObject<HTMLInputElement>;
  /** 处理搜索变化 */
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 清除搜索 */
  clearSearch: () => void;

  // ==================== 导航相关 ====================
  /** 快速访问导航项 */
  quickAccessItems: NavItem[];
  /** 分类导航项 */
  categoryItems: NavItem[];
  /** 集合导航项 */
  collectionItems: CollectionNavItem[];
  /** 处理筛选变化 */
  handleFilterChange: (filter: string) => void;
  /** 处理分类变化 */
  handleCategoryChange: (category: string | null) => void;
  /** 处理集合变化 */
  handleCollectionChange: (collectionId: string) => void;
  /** 检查是否激活 */
  isQuickAccessActive: (itemId: string) => boolean;
  /** 检查分类是否激活 */
  isCategoryActive: (categoryId: string) => boolean;
  /** 检查集合是否激活 */
  isCollectionActive: (collectionId: string) => boolean;

  // ==================== 上下文菜单相关 ====================
  /** 上下文菜单位置 */
  contextMenu: ContextMenuPosition | null;
  /** 上下文菜单引用 */
  contextMenuRef: React.RefObject<HTMLDivElement>;
  /** 处理集合上下文菜单 */
  handleCollectionContextMenu: (e: React.MouseEvent, collectionId: string) => void;
  /** 处理删除集合 */
  handleDeleteCollection: (collectionId: string) => void;

  // ==================== UI 操作相关 ====================
  /** 打开创建集合模态框 */
  handleCreateCollection: () => void;
  /** 打开设置模态框 */
  handleOpenSettings: () => void;

  // ==================== Store 数据 ====================
  /** 当前用户 */
  user: any;
  /** 国际化文本 */
  t: any;
}

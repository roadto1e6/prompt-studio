/**
 * Sidebar 组件 - Hook
 * 文件路径: frontend/src/components/layout/Sidebar/useSidebar.ts
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Infinity,
  Star,
  Clock,
  Trash2,
  FileText,
  Image,
  AudioLines,
  Video,
  Folder,
} from 'lucide-react';
import { usePromptStore, useCollectionStore, useUIStore, useI18nStore, useAuthStore } from '@/stores';
import { CATEGORIES, QUICK_FILTERS } from '@/constants';
import { debounce } from '@/utils';
import type { UseSidebarReturn, NavItem, CollectionNavItem, ContextMenuPosition } from './types';

/**
 * 图标映射
 */
const iconMap = {
  Infinity,
  Star,
  Clock,
  Trash2,
  FileText,
  Image,
  AudioLines,
  Video,
  Folder,
} as const;

/**
 * useSidebar Hook - 侧边栏逻辑
 *
 * 职责：
 * 1. 搜索功能（防抖处理）
 * 2. 导航状态管理（筛选、分类、集合）
 * 3. 集合上下文菜单
 * 4. 键盘快捷键
 *
 * @returns {UseSidebarReturn} Hook 返回值
 */
export const useSidebar = (): UseSidebarReturn => {
  // ==================== Store ====================
  const {
    prompts,
    filter,
    categoryFilter,
    collectionFilter,
    setFilter,
    setCategory,
    setCollection,
    setSearch,
  } = usePromptStore();
  const { collections, deleteCollection } = useCollectionStore();
  const { openModal, closeDetailPanel, showConfirm } = useUIStore();
  const { t } = useI18nStore();
  const { user } = useAuthStore();

  // ==================== 本地状态 ====================
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);

  // ==================== Refs ====================
  const searchInputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // ==================== 搜索功能 ====================

  /**
   * 防抖搜索处理器（250ms）
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearch = useCallback(
    debounce((query: string) => setSearch(query), 250),
    [setSearch]
  );

  /**
   * 处理搜索变化
   */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch]
  );

  /**
   * 清除搜索
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearch('');
    searchInputRef.current?.blur();
  }, [setSearch]);

  // ==================== 键盘快捷键 ====================

  /**
   * 键盘快捷键处理
   * - Cmd/Ctrl + K: 聚焦搜索
   * - ESC: 清除搜索并失焦
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: 聚焦搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // ESC: 清除搜索并失焦
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        clearSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSearch]);

  // ==================== 上下文菜单 ====================

  /**
   * 点击外部关闭上下文菜单
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

  /**
   * 处理集合上下文菜单
   */
  const handleCollectionContextMenu = useCallback((e: React.MouseEvent, collectionId: string) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setContextMenu({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      collectionId,
    });
  }, []);

  /**
   * 处理删除集合
   */
  const handleDeleteCollection = useCallback(
    (collectionId: string) => {
      const collection = collections.find((c) => c.id === collectionId);
      if (!collection) return;

      setContextMenu(null);
      showConfirm({
        title: t.confirm?.deleteCollection?.title || 'Delete Collection',
        message: t.confirm?.deleteCollection?.message?.replace('{name}', collection.name) || `Are you sure you want to delete "${collection.name}"? Prompts in this collection will not be deleted.`,
        confirmText: t.confirm?.deleteCollection?.confirmText || 'Delete',
        variant: 'danger',
        onConfirm: () => {
          deleteCollection(collectionId);
          if (collectionFilter === collectionId) {
            setCollection(null);
          }
        },
      });
    },
    [collections, collectionFilter, deleteCollection, setCollection, showConfirm]
  );

  // ==================== 导航功能 ====================

  /**
   * 处理筛选变化
   */
  const handleFilterChange = useCallback(
    (newFilter: string) => {
      setFilter(newFilter as any);
      closeDetailPanel();
    },
    [setFilter, closeDetailPanel]
  );

  /**
   * 处理分类变化
   */
  const handleCategoryChange = useCallback(
    (newCategory: string | null) => {
      setCategory(newCategory as any);
      closeDetailPanel();
    },
    [setCategory, closeDetailPanel]
  );

  /**
   * 处理集合变化
   */
  const handleCollectionChange = useCallback(
    (collectionId: string) => {
      setCollection(collectionId);
      closeDetailPanel();
    },
    [setCollection, closeDetailPanel]
  );

  /**
   * 检查快速访问是否激活
   */
  const isQuickAccessActive = useCallback(
    (itemId: string) => {
      return filter === itemId && !categoryFilter && !collectionFilter;
    },
    [filter, categoryFilter, collectionFilter]
  );

  /**
   * 检查分类是否激活
   */
  const isCategoryActive = useCallback(
    (categoryId: string) => {
      return categoryFilter === categoryId;
    },
    [categoryFilter]
  );

  /**
   * 检查集合是否激活
   */
  const isCollectionActive = useCallback(
    (collectionId: string) => {
      return collectionFilter === collectionId;
    },
    [collectionFilter]
  );

  // ==================== UI 操作 ====================

  /**
   * 打开创建集合模态框
   */
  const handleCreateCollection = useCallback(() => {
    openModal('createCollection');
  }, [openModal]);

  /**
   * 打开设置模态框
   */
  const handleOpenSettings = useCallback(() => {
    openModal('settings');
  }, [openModal]);

  // ==================== 导航项数据 ====================

  /**
   * 快速访问导航项
   */
  const quickAccessItems = useMemo((): NavItem[] => {
    // 防御性检查：确保 prompts 是数组
    const safePrompts = Array.isArray(prompts) ? prompts : [];

    return QUICK_FILTERS.map((item) => {
      let count = 0;
      if (item.id === 'all') {
        count = safePrompts.filter((p) => p.status !== 'trash').length;
      } else if (item.id === 'favorites') {
        count = safePrompts.filter((p) => p.favorite && p.status !== 'trash').length;
      } else if (item.id === 'recent') {
        count = safePrompts.filter((p) => p.status !== 'trash').length;
      } else if (item.id === 'trash') {
        count = safePrompts.filter((p) => p.status === 'trash').length;
      }

      return {
        id: item.id,
        icon: iconMap[item.icon as keyof typeof iconMap],
        count,
      };
    });
  }, [prompts]);

  /**
   * 分类导航项
   */
  const categoryItems = useMemo((): NavItem[] => {
    // 防御性检查：确保 prompts 是数组
    const safePrompts = Array.isArray(prompts) ? prompts : [];

    return CATEGORIES.map((cat) => {
      const count = safePrompts.filter((p) => p.category === cat.id && p.status !== 'trash').length;
      return {
        id: cat.id,
        icon: iconMap[cat.icon as keyof typeof iconMap],
        iconColor: cat.color,
        count,
      };
    });
  }, [prompts]);

  /**
   * 集合导航项
   */
  const collectionItems = useMemo((): CollectionNavItem[] => {
    // 防御性检查：确保 prompts 是数组
    const safePrompts = Array.isArray(prompts) ? prompts : [];

    // 添加"无集合"选项
    const uncategorizedCount = safePrompts.filter((p) => !p.collectionId && p.status !== 'trash').length;
    const uncategorized: CollectionNavItem = {
      id: 'uncategorized',
      name: t.sidebar.noCollection || 'No Collection',
      color: 'text-theme-text-muted',
      count: uncategorizedCount,
    };

    // 映射所有集合
    const collectionList = collections.map((col) => {
      const count = safePrompts.filter((p) => p.collectionId === col.id && p.status !== 'trash').length;
      return {
        id: col.id,
        name: col.name,
        color: col.color,
        count,
      };
    });

    return [uncategorized, ...collectionList];
  }, [collections, prompts, t.sidebar.noCollection]);

  // ==================== 返回值 ====================

  return {
    // 搜索相关
    searchQuery,
    searchInputRef,
    handleSearchChange,
    clearSearch,

    // 导航相关
    quickAccessItems,
    categoryItems,
    collectionItems,
    handleFilterChange,
    handleCategoryChange,
    handleCollectionChange,
    isQuickAccessActive,
    isCategoryActive,
    isCollectionActive,

    // 上下文菜单相关
    contextMenu,
    contextMenuRef,
    handleCollectionContextMenu,
    handleDeleteCollection,

    // UI 操作相关
    handleCreateCollection,
    handleOpenSettings,

    // Store 数据
    user,
    t,
  };
};

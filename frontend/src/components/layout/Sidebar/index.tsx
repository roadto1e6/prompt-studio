/**
 * Sidebar 组件 - 视图层
 * 文件路径: frontend/src/components/layout/Sidebar/index.tsx
 *
 * 职责：
 * 1. 纯声明式 UI 渲染
 * 2. 所有逻辑委托给 useSidebar Hook
 * 3. 样式通过 CSS Modules 管理
 */

import React, { memo, useCallback } from 'react';
import { Search, X, Settings, Folder, Trash2 } from 'lucide-react';
import { useSidebar } from './useSidebar';
import styles from './index.module.css';
import type { SidebarProps, NavItem, CollectionNavItem } from './types';

/**
 * NavItemButton - 导航项按钮子组件
 */
interface NavItemButtonProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  label: string;
  collapsed?: boolean;
}

const NavItemButton = memo<NavItemButtonProps>(({
  item,
  isActive,
  onClick,
  label,
  collapsed = false,
}) => {
  const Icon = item.icon;
  const iconColorClass = item.iconColor || '';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.navItem} ${isActive ? styles.navItemActive : styles.navItemInactive}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={styles.navItemContent}>
        <Icon
          className={`${styles.navItemIcon} ${iconColorClass} ${
            isActive ? styles.navItemIconActive : styles.navItemIconInactive
          }`}
        />
        {!collapsed && <span className={styles.navItemText}>{label}</span>}
      </span>
      {!collapsed && <span className={styles.navItemCount}>{item.count}</span>}
    </button>
  );
});

NavItemButton.displayName = 'NavItemButton';

/**
 * CollectionItemButton - 集合项按钮子组件
 */
interface CollectionItemButtonProps {
  item: CollectionNavItem;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  collapsed?: boolean;
}

const CollectionItemButton = memo<CollectionItemButtonProps>(({
  item,
  isActive,
  onClick,
  onDelete,
  collapsed = false,
}) => {
  const isUncategorized = item.id === 'uncategorized';

  /**
   * 处理删除按钮点击，阻止事件冒泡
   */
  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  }, [onDelete]);

  return (
    <div className={styles.collectionItem}>
      <button
        type="button"
        onClick={onClick}
        className={`${styles.navItem} ${styles.collectionButton} ${isActive ? styles.navItemActive : styles.navItemInactive}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className={styles.navItemContent}>
          <Folder
            className={`${styles.navItemIcon} ${item.color} ${
              isActive ? styles.navItemIconActive : styles.navItemIconInactive
            }`}
          />
          {!collapsed && (
            <span className={styles.navItemText}>
              {isUncategorized ? (
                <span className="text-theme-text-muted">{item.name}</span>
              ) : (
                item.name
              )}
            </span>
          )}
        </span>
        {!collapsed && <span className={styles.navItemCount}>{item.count}</span>}
      </button>
      {/* Hover 时显示删除按钮 */}
      {!collapsed && !isUncategorized && (
        <button
          type="button"
          onClick={handleDeleteClick}
          className={styles.collectionDeleteButton}
          aria-label="Delete collection"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});

CollectionItemButton.displayName = 'CollectionItemButton';

/**
 * Sidebar 组件
 *
 * @description 应用侧边栏，包含搜索、导航、集合列表和用户信息
 * @param {SidebarProps} props - 组件属性
 * @returns {JSX.Element} 侧边栏组件
 */
const Sidebar = memo<SidebarProps>(({ collapsed = false, className = '' }) => {
  const {
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

    // 删除集合
    handleDeleteCollection,

    // UI 操作相关
    handleCreateCollection,
    handleOpenSettings,

    // Store 数据
    user,
    t,
  } = useSidebar();

  /**
   * 获取用户显示名称首字母
   */
  const getUserInitials = (): string => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} ${className}`}
      aria-label={t.sidebar.mainNavigation}
    >
      {/* Logo 区域 */}
      <div className={styles.logoContainer}>
        <svg
          className={styles.logoIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        {!collapsed && (
          <span className={styles.logoText}>Prompt Studio</span>
        )}
      </div>

      {/* 搜索区域 */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={collapsed ? '' : t.sidebar.searchPlaceholder || 'Search prompts...'}
            className={styles.searchInput}
            aria-label={t.sidebar.searchPlaceholder || 'Search prompts'}
          />
          {searchQuery && !collapsed && (
            <button
              type="button"
              onClick={clearSearch}
              className={styles.clearButton}
              aria-label={t.sidebar.clearSearch}
            >
              <X />
            </button>
          )}
        </div>
      </div>

      {/* 导航区域 */}
      <nav className={styles.navContainer}>
        {/* 快速访问 */}
        <div className={styles.navGroup}>
          {!collapsed && (
            <h2 className={styles.navGroupHeader}>
              {t.sidebar.quickAccess || 'Quick Access'}
            </h2>
          )}
          <ul className={styles.navList} role="list">
            {quickAccessItems.map((item) => (
              <li key={item.id}>
                <NavItemButton
                  item={item}
                  isActive={isQuickAccessActive(item.id)}
                  onClick={() => handleFilterChange(item.id)}
                  label={t.filters?.[item.id] || item.id}
                  collapsed={collapsed}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* 分类 */}
        <div className={styles.navGroup}>
          {!collapsed && (
            <h2 className={styles.navGroupHeader}>
              {t.sidebar.categories || 'Categories'}
            </h2>
          )}
          <ul className={styles.navList} role="list">
            {categoryItems.map((item) => (
              <li key={item.id}>
                <NavItemButton
                  item={item}
                  isActive={isCategoryActive(item.id)}
                  onClick={() => handleCategoryChange(item.id)}
                  label={t.categories?.[item.id] || item.id}
                  collapsed={collapsed}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* 集合 */}
        <div className={styles.navGroup}>
          <div className={styles.collectionsHeader}>
            {!collapsed && (
              <h2 className={styles.collectionsTitle}>
                {t.sidebar.collections || 'Collections'}
              </h2>
            )}
            <button
              type="button"
              onClick={handleCreateCollection}
              className={styles.addCollectionButton}
              aria-label={t.sidebar.createCollection || 'Create collection'}
              title={t.sidebar.createCollection || 'Create collection'}
            >
              <span className={styles.addCollectionIcon}>+</span>
            </button>
          </div>
          <ul className={styles.navList} role="list">
            {collectionItems.map((item) => (
              <li key={item.id}>
                <CollectionItemButton
                  item={item}
                  isActive={isCollectionActive(item.id)}
                  onClick={() => handleCollectionChange(item.id)}
                  onDelete={() => handleDeleteCollection(item.id)}
                  collapsed={collapsed}
                />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* 用户区域 */}
      <div className={styles.userContainer}>
        <button
          type="button"
          onClick={handleOpenSettings}
          className={styles.userButton}
          aria-label={t.sidebar.settings || 'Settings'}
        >
          <div className={styles.userAvatar}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.displayName || 'User avatar'}
                className={styles.userAvatarImage}
              />
            ) : (
              <div className={styles.userAvatarFallback}>
                {getUserInitials()}
              </div>
            )}
          </div>
          {!collapsed && (
            <>
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  {user?.displayName || t.sidebar.guest || 'Guest'}
                </div>
                <div className={styles.userEmail}>
                  {user?.email || t.sidebar.signInPrompt || 'Sign in to sync'}
                </div>
              </div>
              <Settings className={styles.settingsIcon} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export { Sidebar };
export type { SidebarProps } from './types';

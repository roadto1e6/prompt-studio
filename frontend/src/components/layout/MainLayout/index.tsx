/**
 * MainLayout Component - Refactored
 * 主布局组件 - 重构版本
 *
 * 架构：
 * - 使用 CSS Grid 实现响应式三栏布局
 * - Sidebar（可折叠）| Main Content | Detail Panel（可选）
 * - 支持全屏模式
 * - 响应式断点自动调整
 * - 滚动容器管理
 * - 键盘快捷键支持
 *
 * 快捷键：
 * - Cmd/Ctrl + B: 切换侧边栏
 * - Cmd/Ctrl + D: 切换详情面板
 * - Cmd/Ctrl + Shift + F: 切换全屏模式
 * - ESC: 退出全屏或关闭详情面板
 *
 * @example
 * ```tsx
 * <MainLayout detailPanel={<PromptDetail />}>
 *   <PromptList />
 * </MainLayout>
 * ```
 */

import React from 'react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { cn } from '@/utils';
import { useMainLayout } from './useMainLayout';
import type { MainLayoutProps } from './types';
import styles from './index.module.css';

/**
 * MainLayout 组件
 */
export const MainLayout: React.FC<MainLayoutProps> = React.memo(({
  children,
  detailPanel,
  sidebar,
  header,
  className,
  contentClassName,
  detailPanelClassName,
  disableSidebar = false,
  disableHeader = false,
  initialSidebarExpanded = true,
  initialDetailPanelExpanded = false,
}) => {
  // 布局状态管理
  const {
    state,
    isMobile,
    isTablet,
    contentRef,
    detailPanelRef,
  } = useMainLayout({
    initialSidebarExpanded,
    initialDetailPanelExpanded,
    enableKeyboardShortcuts: true,
  });

  // 是否显示详情面板
  const shouldShowDetailPanel = detailPanel && state.detailPanel.expanded;

  return (
    <div
      className={cn(
        styles.layout,
        state.isFullscreen && styles.fullscreen,
        className
      )}
    >
      {/* ========== 侧边栏 ========== */}
      {!disableSidebar && (
        <div
          className={cn(
            styles.sidebar,
            !state.sidebar.expanded && (isMobile ? styles.hidden : styles.collapsed)
          )}
        >
          {sidebar || <Sidebar />}
        </div>
      )}

      {/* ========== 主内容区域 ========== */}
      <div className={styles.mainArea}>
        {/* 头部 */}
        {!disableHeader && (
          <div
            className={cn(
              styles.header,
              !state.header.visible && styles.hidden
            )}
          >
            {header || <Header />}
          </div>
        )}

        {/* 内容容器 */}
        <div className={styles.contentContainer}>
          {/* 主内容 */}
          <main
            ref={contentRef}
            className={cn(
              styles.content,
              contentClassName
            )}
          >
            {children}
          </main>

          {/* 详情面板 */}
          {shouldShowDetailPanel && (
            <aside
              ref={detailPanelRef}
              className={cn(
                styles.detailPanel,
                !state.detailPanel.expanded && (isMobile || isTablet ? styles.hidden : styles.collapsed),
                detailPanelClassName
              )}
            >
              <div className={styles.detailPanelContent}>
                {detailPanel}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;

// Re-export hook and types
export { useMainLayout } from './useMainLayout';
export type {
  MainLayoutProps,
  LayoutState,
  LayoutActions,
  LayoutRegion,
  UseMainLayoutReturn,
} from './types';
export { DEFAULT_LAYOUT_CONFIG, LAYOUT_BREAKPOINTS } from './types';

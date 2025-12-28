/**
 * useMainLayout Hook
 * 主布局状态管理 Hook
 *
 * 功能：
 * - 管理侧边栏、详情面板、头部的展开/收起状态
 * - 响应式断点检测
 * - 全屏模式管理
 * - 滚动容器引用管理
 * - 键盘快捷键支持
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useUIStore } from '@/stores';
import type { UseMainLayoutReturn, LayoutState } from './types';
import { LAYOUT_BREAKPOINTS } from './types';

export interface UseMainLayoutOptions {
  /**
   * 初始侧边栏展开状态
   * @default true
   */
  initialSidebarExpanded?: boolean;

  /**
   * 初始详情面板展开状态
   * @default false
   */
  initialDetailPanelExpanded?: boolean;

  /**
   * 是否启用键盘快捷键
   * @default true
   */
  enableKeyboardShortcuts?: boolean;

  /**
   * 侧边栏展开状态变化回调
   */
  onSidebarToggle?: (expanded: boolean) => void;

  /**
   * 详情面板展开状态变化回调
   */
  onDetailPanelToggle?: (expanded: boolean) => void;
}

/**
 * 使用响应式断点检测
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // 初始化
    setMatches(media.matches);

    // 监听变化
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    // 兼容旧版和新版 API
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // 兼容 Safari < 14
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);

  return matches;
};

/**
 * useMainLayout Hook
 */
export const useMainLayout = (options: UseMainLayoutOptions = {}): UseMainLayoutReturn => {
  const {
    initialSidebarExpanded = true,
    initialDetailPanelExpanded = false,
    enableKeyboardShortcuts = true,
    onSidebarToggle,
    onDetailPanelToggle,
  } = options;

  // UI Store - 详情面板状态同步
  const { detailPanelOpen, openDetailPanel, closeDetailPanel } = useUIStore();

  // 响应式检测
  const isMobile = useMediaQuery(`(max-width: ${LAYOUT_BREAKPOINTS.mobile}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${LAYOUT_BREAKPOINTS.mobile + 1}px) and (max-width: ${LAYOUT_BREAKPOINTS.tablet}px)`
  );

  // 引用
  const contentRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  // 布局状态
  const [state, setState] = useState<LayoutState>(() => ({
    sidebar: {
      visible: true,
      expanded: isMobile ? false : initialSidebarExpanded,
    },
    detailPanel: {
      visible: initialDetailPanelExpanded,
      expanded: initialDetailPanelExpanded,
    },
    header: {
      visible: true,
    },
    isFullscreen: false,
  }));

  // 响应式自动调整
  useEffect(() => {
    if (isMobile) {
      // 移动端默认隐藏侧边栏和详情面板
      setState(prev => ({
        ...prev,
        sidebar: { ...prev.sidebar, expanded: false },
        detailPanel: { ...prev.detailPanel, expanded: false },
      }));
    }
  }, [isMobile]);

  // 同步 UI Store 的详情面板状态
  useEffect(() => {
    setState(prev => ({
      ...prev,
      detailPanel: { ...prev.detailPanel, expanded: detailPanelOpen },
    }));
  }, [detailPanelOpen]);

  // 布局动作
  const actions = useMemo(() => ({
    toggleSidebar: () => {
      setState(prev => {
        const newExpanded = !prev.sidebar.expanded;
        onSidebarToggle?.(newExpanded);
        return {
          ...prev,
          sidebar: { ...prev.sidebar, expanded: newExpanded },
        };
      });
    },

    toggleDetailPanel: () => {
      if (detailPanelOpen) {
        closeDetailPanel();
      } else {
        openDetailPanel();
      }
      onDetailPanelToggle?.(!detailPanelOpen);
    },

    showSidebar: () => {
      setState(prev => {
        if (!prev.sidebar.expanded) {
          onSidebarToggle?.(true);
        }
        return {
          ...prev,
          sidebar: { ...prev.sidebar, expanded: true },
        };
      });
    },

    hideSidebar: () => {
      setState(prev => {
        if (prev.sidebar.expanded) {
          onSidebarToggle?.(false);
        }
        return {
          ...prev,
          sidebar: { ...prev.sidebar, expanded: false },
        };
      });
    },

    showDetailPanel: () => {
      if (!detailPanelOpen) {
        openDetailPanel();
        onDetailPanelToggle?.(true);
      }
    },

    hideDetailPanel: () => {
      if (detailPanelOpen) {
        closeDetailPanel();
        onDetailPanelToggle?.(false);
      }
    },

    toggleFullscreen: () => {
      setState(prev => ({
        ...prev,
        isFullscreen: !prev.isFullscreen,
        // 全屏模式下隐藏侧边栏和详情面板
        sidebar: {
          ...prev.sidebar,
          expanded: prev.isFullscreen ? initialSidebarExpanded : false,
        },
        detailPanel: {
          ...prev.detailPanel,
          expanded: false,
        },
      }));
    },

    resetLayout: () => {
      setState({
        sidebar: {
          visible: true,
          expanded: isMobile ? false : initialSidebarExpanded,
        },
        detailPanel: {
          visible: initialDetailPanelExpanded,
          expanded: initialDetailPanelExpanded,
        },
        header: {
          visible: true,
        },
        isFullscreen: false,
      });
    },
  }), [
    isMobile,
    initialSidebarExpanded,
    initialDetailPanelExpanded,
    onSidebarToggle,
    onDetailPanelToggle,
    detailPanelOpen,
    openDetailPanel,
    closeDetailPanel,
  ]);

  // 键盘快捷键
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + B: 切换侧边栏
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        actions.toggleSidebar();
      }

      // Cmd/Ctrl + D: 切换详情面板
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        actions.toggleDetailPanel();
      }

      // Cmd/Ctrl + Shift + F: 切换全屏模式
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        actions.toggleFullscreen();
      }

      // ESC: 退出全屏或关闭详情面板
      if (e.key === 'Escape') {
        if (state.isFullscreen) {
          e.preventDefault();
          actions.toggleFullscreen();
        } else if (state.detailPanel.expanded) {
          e.preventDefault();
          actions.hideDetailPanel();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts, state.isFullscreen, state.detailPanel.expanded, actions]);

  // 滚动到顶部工具函数
  const scrollToTop = useCallback(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 滚动到底部工具函数
  const scrollToBottom = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  return {
    state,
    actions,
    isMobile,
    isTablet,
    contentRef,
    detailPanelRef,
    // 额外的工具函数
    scrollToTop,
    scrollToBottom,
  } as UseMainLayoutReturn & {
    scrollToTop: () => void;
    scrollToBottom: () => void;
  };
};

export default useMainLayout;

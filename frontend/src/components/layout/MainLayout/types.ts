/**
 * MainLayout Types
 * 主布局组件的类型定义
 */

import { ReactNode } from 'react';

/**
 * 布局区域配置
 */
export interface LayoutRegion {
  /**
   * 是否可见
   */
  visible: boolean;

  /**
   * 是否展开（用于可折叠区域）
   */
  expanded?: boolean;

  /**
   * 宽度（适用于 Sidebar 和 DetailPanel）
   */
  width?: number;
}

/**
 * 布局状态
 */
export interface LayoutState {
  /**
   * 侧边栏状态
   */
  sidebar: LayoutRegion;

  /**
   * 详情面板状态
   */
  detailPanel: LayoutRegion;

  /**
   * 头部状态
   */
  header: LayoutRegion;

  /**
   * 是否处于全屏模式
   */
  isFullscreen: boolean;
}

/**
 * 布局动作
 */
export interface LayoutActions {
  /**
   * 切换侧边栏展开/收起
   */
  toggleSidebar: () => void;

  /**
   * 切换详情面板展开/收起
   */
  toggleDetailPanel: () => void;

  /**
   * 显示侧边栏
   */
  showSidebar: () => void;

  /**
   * 隐藏侧边栏
   */
  hideSidebar: () => void;

  /**
   * 显示详情面板
   */
  showDetailPanel: () => void;

  /**
   * 隐藏详情面板
   */
  hideDetailPanel: () => void;

  /**
   * 切换全屏模式
   */
  toggleFullscreen: () => void;

  /**
   * 重置布局到默认状态
   */
  resetLayout: () => void;
}

/**
 * MainLayout Props
 */
export interface MainLayoutProps {
  /**
   * 主内容区域
   */
  children: ReactNode;

  /**
   * 详情面板内容（可选）
   */
  detailPanel?: ReactNode;

  /**
   * 自定义侧边栏内容（可选，默认使用内置 Sidebar）
   */
  sidebar?: ReactNode;

  /**
   * 自定义头部内容（可选，默认使用内置 Header）
   */
  header?: ReactNode;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 内容区域类名
   */
  contentClassName?: string;

  /**
   * 详情面板类名
   */
  detailPanelClassName?: string;

  /**
   * 是否禁用侧边栏
   */
  disableSidebar?: boolean;

  /**
   * 是否禁用头部
   */
  disableHeader?: boolean;

  /**
   * 初始侧边栏状态
   * @default true
   */
  initialSidebarExpanded?: boolean;

  /**
   * 初始详情面板状态
   * @default false
   */
  initialDetailPanelExpanded?: boolean;
}

/**
 * useMainLayout Hook 返回值
 */
export interface UseMainLayoutReturn {
  /**
   * 布局状态
   */
  state: LayoutState;

  /**
   * 布局动作
   */
  actions: LayoutActions;

  /**
   * 是否为移动设备
   */
  isMobile: boolean;

  /**
   * 是否为平板设备
   */
  isTablet: boolean;

  /**
   * 主内容区域引用
   */
  contentRef: React.RefObject<HTMLDivElement>;

  /**
   * 详情面板引用
   */
  detailPanelRef: React.RefObject<HTMLDivElement>;
}

/**
 * 布局断点
 */
export const LAYOUT_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

/**
 * 默认布局配置
 */
export const DEFAULT_LAYOUT_CONFIG = {
  sidebar: {
    width: 260,
    minWidth: 200,
    maxWidth: 400,
  },
  detailPanel: {
    width: 360,
    minWidth: 280,
    maxWidth: 600,
  },
  header: {
    height: 64,
  },
} as const;

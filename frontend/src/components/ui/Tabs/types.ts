/**
 * Tabs 组件类型定义
 */

import type { TabVariant } from '@/styles/variants';

/** 单个 Tab 配置 */
export interface Tab {
  /** 唯一标识 */
  id: string;
  /** 标签文本 */
  label: string;
  /** 图标（可选） */
  icon?: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
}

/** useTabs 配置 */
export interface UseTabsOptions {
  /** 所有 Tabs */
  tabs: Tab[];
  /** 当前活动 Tab ID */
  activeTab: string;
  /** 切换 Tab 回调 */
  onChange: (tabId: string) => void;
}

/** useTabs 返回值 */
export interface UseTabsReturn {
  /** 键盘事件处理 */
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

/** Tabs Props */
export interface TabsProps {
  /** 标签列表 */
  tabs: Tab[];
  /** 当前活动的 Tab ID */
  activeTab: string;
  /** Tab 切换回调 */
  onChange: (tabId: string) => void;
  /** 样式变体 */
  variant?: TabVariant;
  /** 自定义容器类名 */
  className?: string;
  /** 自定义 Tab 按钮类名 */
  tabClassName?: string;
  /** 自定义活动 Tab 类名 */
  activeTabClassName?: string;
}

/** TabPanel Props */
export interface TabPanelProps {
  /** Tab ID */
  id: string;
  /** 当前活动的 Tab ID */
  activeTab: string;
  /** 面板内容 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否启用动画 */
  animated?: boolean;
  /** 是否保持挂载（隐藏而不是销毁） */
  keepMounted?: boolean;
}

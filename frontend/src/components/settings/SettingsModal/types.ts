/**
 * SettingsModal Types
 * 设置模态框类型定义
 */

import type { ReactNode } from 'react';

/**
 * 设置标签页类型
 */
export type SettingsTab = 'profile' | 'security' | 'aiModels';

/**
 * 标签页配置
 */
export interface TabConfig {
  /** 标签 ID */
  id: SettingsTab;
  /** 标签标题 */
  label: string;
  /** 标签图标 */
  icon: ReactNode;
  /** 标签描述 */
  description: string;
}

/**
 * 标签页标签和描述
 */
export interface TabLabels {
  [key: string]: {
    label: string;
    description: string;
  };
}

/**
 * SettingsModal 组件属性
 */
export interface SettingsModalProps {
  /** 是否打开 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 初始激活的标签页 */
  defaultTab?: SettingsTab;
  /** 类名 */
  className?: string;
}

/**
 * useSettingsModal Hook 返回值
 */
export interface UseSettingsModalReturn {
  /** 当前激活的标签页 */
  activeTab: SettingsTab;
  /** 设置激活的标签页 */
  setActiveTab: (tab: SettingsTab) => void;
  /** 标签页标签和描述 */
  tabLabels: TabLabels;
  /** 处理标签切换 */
  handleTabChange: (tab: SettingsTab) => void;
  /** 关闭回调 */
  onClose: () => void;
}

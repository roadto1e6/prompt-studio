// 文件路径: frontend/src/components/settings/shared/SettingsSection/types.ts

/**
 * SettingsSection 类型定义
 * 契约层：先设计数据结构，后写逻辑
 */

/**
 * 设置节组件 Props
 */
export interface SettingsSectionProps {
  /** 节标题（可选） */
  title?: string;

  /** 节描述（可选） */
  description?: string;

  /** 子内容 */
  children: React.ReactNode;

  /** 自定义类名（可选） */
  className?: string;

  /** 头部操作区域（可选，如开关、按钮等） */
  action?: React.ReactNode;

  /** 禁用内容区域内边距 */
  noPadding?: boolean;

  /** 是否可折叠 */
  collapsible?: boolean;

  /** 默认是否展开（仅在 collapsible=true 时生效） */
  defaultExpanded?: boolean;

  /** 折叠状态（受控模式） */
  expanded?: boolean;

  /** 折叠状态改变回调 */
  onExpandedChange?: (expanded: boolean) => void;

  /** 是否显示分隔线 */
  showDivider?: boolean;
}

/**
 * Hook 返回的状态和方法
 */
export interface UseSettingsSectionReturn {
  /** 当前展开状态 */
  isExpanded: boolean;

  /** 是否显示头部 */
  hasHeader: boolean;

  /** 是否可折叠 */
  isCollapsible: boolean;

  /** 切换展开状态 */
  toggleExpanded: () => void;

  /** 处理键盘导航（已使用 useCallback 优化） */
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

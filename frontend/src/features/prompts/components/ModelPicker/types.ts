// 文件路径: frontend/src/features/prompts/components/ModelPicker/types.ts

/**
 * ModelPicker 组件类型定义
 * 契约层：定义严格的 TypeScript 类型
 */

import type { GroupedModelOptions } from '@/types';

/**
 * 简单选项类型
 */
export interface SimpleOption {
  value: string;
  label: string;
}

/**
 * ModelPicker 组件 Props
 */
export interface ModelPickerProps {
  /** 标签文本 */
  label?: string;
  /** 当前选中值 */
  value: string;
  /** 值变更回调 */
  onChange: (value: string) => void;
  /** 分组选项（优先级高于 options） */
  groups?: GroupedModelOptions[];
  /** 简单选项列表 */
  options?: SimpleOption[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 占位符文本 */
  placeholder?: string;
}

/**
 * 面板位置类型
 */
export interface PanelPosition {
  top: number;
  left: number;
  width: number;
}

/**
 * 选中项信息
 */
export interface SelectedItemInfo {
  label: string;
  subtitle: string | null;
}

/**
 * useModelPicker Hook 返回值类型
 */
export interface UseModelPickerReturn {
  /** 是否展开 */
  isExpanded: boolean;
  /** 面板位置 */
  position: PanelPosition | null;
  /** 搜索关键词 */
  searchQuery: string;
  /** 触发器 ref */
  triggerRef: React.RefObject<HTMLButtonElement>;
  /** 面板 ref */
  panelRef: React.RefObject<HTMLDivElement>;
  /** 搜索输入框 ref */
  searchInputRef: React.RefObject<HTMLInputElement>;
  /** 是否为分组模式 */
  isGroupMode: boolean;
  /** 是否显示搜索 */
  hasSearch: boolean;
  /** 选中项信息 */
  selectedItem: SelectedItemInfo | null;
  /** 过滤后的分组 */
  filteredGroups: GroupedModelOptions[];
  /** 过滤后的选项 */
  filteredOptions: SimpleOption[];
  /** 切换展开状态 */
  handleToggle: () => void;
  /** 选择选项 */
  handleSelect: (value: string) => void;
  /** 设置搜索关键词 */
  setSearchQuery: (query: string) => void;
  /** 关闭面板 */
  handleClose: () => void;
}

/**
 * useModelPicker Hook 参数类型
 */
export interface UseModelPickerOptions {
  value: string;
  onChange: (value: string) => void;
  groups?: GroupedModelOptions[];
  options?: SimpleOption[];
  disabled?: boolean;
}

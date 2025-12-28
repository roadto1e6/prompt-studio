// 文件路径: frontend/src/components/ui/Select/types.ts

/**
 * Select 组件类型定义
 * 契约层：定义严格的 TypeScript 类型
 */

import type { RefObject } from 'react';

/** 选项数据 */
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

/** 分组数据 */
export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

/** 下拉菜单位置 */
export interface SelectPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  flipUp: boolean;
}

/** Select Props */
export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  maxHeight?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  emptyMessage?: string;
}

/** useSelect Hook 配置 */
export interface UseSelectOptions {
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  groups: SelectGroup[];
  disabled: boolean;
  searchable: boolean;
  maxHeight: number;
}

/** useSelect Hook 返回值 */
export interface UseSelectReturn {
  // 状态
  isOpen: boolean;
  searchQuery: string;
  highlightedIndex: number;
  position: SelectPosition;

  // Refs
  containerRef: RefObject<HTMLDivElement>;
  buttonRef: RefObject<HTMLButtonElement>;
  inputRef: RefObject<HTMLInputElement>;
  listRef: RefObject<HTMLDivElement>;

  // 派生数据
  allOptions: SelectOption[];
  filteredGroups: SelectGroup[];
  filteredOptions: SelectOption[];
  visibleOptions: SelectOption[];
  selectedLabel: string;
  isEmpty: boolean;
  hasGroups: boolean;

  // Handlers
  handleToggle: () => void;
  handleClose: () => void;
  handleSelect: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  setSearchQuery: (query: string) => void;
  setHighlightedIndex: (index: number) => void;
}

/** useSelectPosition 配置（内部使用） */
export interface UseSelectPositionOptions {
  triggerRef: RefObject<HTMLElement>;
  isOpen: boolean;
  maxHeight?: number;
  closeOnScroll?: boolean;
  onScrollClose?: () => void;
}

/** useSelectKeyboard 配置（内部使用） */
export interface UseSelectKeyboardOptions<T = SelectOption> {
  isOpen: boolean;
  disabled?: boolean;
  options: T[];
  getOptionValue: (option: T) => string;
  onSelect: (value: string) => void;
  onOpen: () => void;
  onClose: () => void;
  listRef?: RefObject<HTMLElement>;
}

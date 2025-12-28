// 文件路径: frontend/src/components/ui/Select/useSelect.ts

/**
 * Select 组件逻辑层
 * Headless UI Hook：封装所有状态、副作用和处理器
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type {
  SelectOption,
  SelectGroup,
  SelectPosition,
  UseSelectOptions,
  UseSelectReturn,
} from './types';

/**
 * 默认位置状态
 */
const DEFAULT_POSITION: SelectPosition = {
  top: 0,
  left: 0,
  width: 0,
  maxHeight: 0,
  flipUp: false,
};

/**
 * useSelect Hook
 *
 * @description
 * 采用 Headless UI 思路，将 Select 组件的所有逻辑与视图分离。
 * 封装：状态管理、位置计算、键盘导航、搜索过滤、点击外部关闭等。
 *
 * @param options - Hook 配置选项
 * @returns 状态和操作方法
 */
export function useSelect(options: UseSelectOptions): UseSelectReturn {
  const {
    value,
    onChange,
    onValueChange,
    options: selectOptions,
    groups,
    disabled,
    searchable,
    maxHeight,
  } = options;

  // ==================== Client State ====================
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [position, setPosition] = useState<SelectPosition>(DEFAULT_POSITION);

  // ==================== Refs ====================
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 用于保持回调引用稳定
  const onSelectRef = useRef(onChange);
  const onValueChangeRef = useRef(onValueChange);

  useEffect(() => {
    onSelectRef.current = onChange;
    onValueChangeRef.current = onValueChange;
  }, [onChange, onValueChange]);

  // ==================== 派生数据（缓存计算） ====================

  /**
   * 所有选项（扁平化分组）
   */
  const allOptions = useMemo<SelectOption[]>(() => {
    if (groups.length > 0) {
      return groups.flatMap((g) => g.options);
    }
    return selectOptions;
  }, [selectOptions, groups]);

  /**
   * 过滤后的分组
   */
  const filteredGroups = useMemo<SelectGroup[]>(() => {
    if (!searchQuery) return groups;
    const query = searchQuery.toLowerCase();
    return groups
      .map((group) => ({
        ...group,
        options: group.options.filter(
          (opt) =>
            opt.label.toLowerCase().includes(query) ||
            opt.value.toLowerCase().includes(query) ||
            opt.description?.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [groups, searchQuery]);

  /**
   * 过滤后的选项
   */
  const filteredOptions = useMemo<SelectOption[]>(() => {
    if (!searchQuery) return selectOptions;
    const query = searchQuery.toLowerCase();
    return selectOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query) ||
        opt.description?.toLowerCase().includes(query)
    );
  }, [selectOptions, searchQuery]);

  /**
   * 当前可见选项
   */
  const visibleOptions = useMemo<SelectOption[]>(() => {
    const hasGroups = groups.length > 0 || filteredGroups.length > 0;
    if (hasGroups) {
      return filteredGroups.flatMap((g) => g.options);
    }
    return filteredOptions;
  }, [filteredGroups, filteredOptions, groups.length]);

  /**
   * 当前选中的标签
   */
  const selectedLabel = useMemo(() => {
    const found = allOptions.find((opt) => opt.value === value);
    return found?.label || '';
  }, [allOptions, value]);

  /**
   * 是否为空
   */
  const isEmpty = visibleOptions.length === 0;

  /**
   * 是否有分组
   */
  const hasGroups = groups.length > 0 || filteredGroups.length > 0;

  // ==================== 位置计算 ====================

  /**
   * 更新下拉菜单位置
   */
  const updatePosition = useCallback(() => {
    if (!buttonRef.current || !isOpen) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldFlipUp = spaceBelow < 200 && spaceAbove > spaceBelow;

    const calculatedMaxHeight = shouldFlipUp
      ? Math.min(spaceAbove - 20, maxHeight)
      : Math.min(spaceBelow - 20, maxHeight);

    // 使用 fixed 定位，直接使用视口坐标，不需要加 scrollY/scrollX
    const top = shouldFlipUp
      ? rect.top - calculatedMaxHeight - 4
      : rect.bottom + 4;

    setPosition({
      top,
      left: rect.left,
      width: rect.width,
      maxHeight: calculatedMaxHeight,
      flipUp: shouldFlipUp,
    });
  }, [isOpen, maxHeight]);

  // ==================== Handlers ====================

  /**
   * 关闭下拉菜单
   */
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  }, []);

  /**
   * 切换下拉菜单
   */
  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  /**
   * 选择选项
   */
  const handleSelect = useCallback((optionValue: string) => {
    onSelectRef.current?.({ target: { value: optionValue } });
    onValueChangeRef.current?.(optionValue);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  }, []);

  /**
   * 键盘事件处理
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (highlightedIndex >= 0 && visibleOptions[highlightedIndex]) {
            handleSelect(visibleOptions[highlightedIndex].value);
          }
          break;

        case 'Escape':
          e.preventDefault();
          if (isOpen) {
            handleClose();
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < visibleOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : visibleOptions.length - 1
            );
          }
          break;

        case 'Home':
          if (isOpen) {
            e.preventDefault();
            setHighlightedIndex(0);
          }
          break;

        case 'End':
          if (isOpen) {
            e.preventDefault();
            setHighlightedIndex(visibleOptions.length - 1);
          }
          break;

        case 'Tab':
          if (isOpen) {
            handleClose();
          }
          break;

        default:
          // 快速字符搜索
          if (isOpen && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const searchChar = e.key.toLowerCase();
            const startIndex = highlightedIndex + 1;

            for (let i = 0; i < visibleOptions.length; i++) {
              const index = (startIndex + i) % visibleOptions.length;
              const option = visibleOptions[index];

              if (option.value.toLowerCase().startsWith(searchChar)) {
                setHighlightedIndex(index);
                break;
              }
            }
          }
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, visibleOptions, handleSelect, handleClose]
  );

  // ==================== Effects ====================

  /**
   * 位置计算和滚动监听
   */
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScroll = (e: Event) => {
      // 如果滚动发生在下拉菜单内部，不关闭
      const target = e.target as Element;
      if (target && (
        listRef.current?.contains(target) ||
        target.closest('[data-select-dropdown]')
      )) {
        return;
      }
      handleClose();
    };

    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, updatePosition, handleClose]);

  /**
   * 点击外部关闭
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !(event.target as Element).closest('[data-select-dropdown]')
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClose]);

  /**
   * 打开时聚焦搜索框
   */
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  /**
   * 搜索时重置高亮
   */
  useEffect(() => {
    if (searchQuery) {
      setHighlightedIndex(0);
    }
  }, [searchQuery]);

  /**
   * 高亮项滚动到可视区域
   */
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-option]');
      const item = items[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  /**
   * 修正高亮索引越界
   */
  useEffect(() => {
    if (highlightedIndex >= visibleOptions.length) {
      setHighlightedIndex(visibleOptions.length > 0 ? 0 : -1);
    }
  }, [visibleOptions.length, highlightedIndex]);

  // ==================== 返回值 ====================

  return {
    // 状态
    isOpen,
    searchQuery,
    highlightedIndex,
    position,

    // Refs
    containerRef,
    buttonRef,
    inputRef,
    listRef,

    // 派生数据
    allOptions,
    filteredGroups,
    filteredOptions,
    visibleOptions,
    selectedLabel,
    isEmpty,
    hasGroups,

    // Handlers
    handleToggle,
    handleClose,
    handleSelect,
    handleKeyDown,
    setSearchQuery,
    setHighlightedIndex,
  };
}

// 保留原有的细粒度 Hooks 供外部使用
export { useSelectPosition, useSelectKeyboard } from './useSelectInternal';

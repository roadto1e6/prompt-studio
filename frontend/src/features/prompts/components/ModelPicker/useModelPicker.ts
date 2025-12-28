// 文件路径: frontend/src/features/prompts/components/ModelPicker/useModelPicker.ts

/**
 * useModelPicker Hook
 * 逻辑层：封装所有状态、Side-effects 和 Handlers
 */

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { GroupedModelOptions } from '@/types';
import type {
  UseModelPickerReturn,
  UseModelPickerOptions,
  PanelPosition,
  SelectedItemInfo,
  SimpleOption,
} from './types';

/**
 * ModelPicker 组件的业务逻辑 Hook
 *
 * @description
 * 采用 Headless UI 思路，将模型选择逻辑与视图分离。
 *
 * @param options - Hook 配置选项
 * @returns 状态和操作方法
 */
export const useModelPicker = ({
  value,
  onChange,
  groups,
  options,
  disabled = false,
}: UseModelPickerOptions): UseModelPickerReturn => {
  // ==================== 状态 ====================
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState<PanelPosition | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ==================== Refs ====================
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ==================== 派生状态 ====================

  /** 是否为分组模式 */
  const isGroupMode = useMemo(() => {
    return !!groups && groups.length > 0;
  }, [groups]);

  /** 是否显示搜索（仅分组模式） */
  const hasSearch = isGroupMode;

  /** 获取当前选中项信息 */
  const selectedItem = useMemo((): SelectedItemInfo | null => {
    if (isGroupMode && groups) {
      for (const group of groups) {
        const found = group.options.find(opt => opt.value === value);
        if (found) {
          return { label: found.label, subtitle: group.providerName };
        }
      }
    } else if (options) {
      const found = options.find(opt => opt.value === value);
      if (found) {
        return { label: found.label, subtitle: null };
      }
    }
    return null;
  }, [groups, options, value, isGroupMode]);

  /** 过滤分组 */
  const filteredGroups = useMemo((): GroupedModelOptions[] => {
    if (!isGroupMode || !groups) return [];
    if (!searchQuery.trim()) return groups;

    const query = searchQuery.toLowerCase();
    return groups
      .map(group => ({
        ...group,
        options: group.options.filter(opt =>
          opt.label.toLowerCase().includes(query) ||
          opt.value.toLowerCase().includes(query)
        ),
      }))
      .filter(group => group.options.length > 0);
  }, [groups, searchQuery, isGroupMode]);

  /** 过滤简单选项 */
  const filteredOptions = useMemo((): SimpleOption[] => {
    if (isGroupMode || !options) return [];
    return options;
  }, [options, isGroupMode]);

  // ==================== Handlers ====================

  /** 关闭面板 */
  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setSearchQuery('');
  }, []);

  /** 切换展开状态 */
  const handleToggle = useCallback(() => {
    if (disabled) return;

    if (!isExpanded && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const panelHeight = isGroupMode ? 300 : 200;

      setPosition({
        top: rect.top - panelHeight - 4,
        left: rect.left,
        width: rect.width,
      });

      if (hasSearch) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    } else {
      setSearchQuery('');
    }

    setIsExpanded(prev => !prev);
  }, [disabled, isExpanded, isGroupMode, hasSearch]);

  /** 选择选项 */
  const handleSelect = useCallback((modelValue: string) => {
    onChange(modelValue);
    setIsExpanded(false);
    setSearchQuery('');
  }, [onChange]);

  // ==================== Effects ====================

  /** 点击外部关闭 */
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, handleClose]);

  return {
    isExpanded,
    position,
    searchQuery,
    triggerRef,
    panelRef,
    searchInputRef,
    isGroupMode,
    hasSearch,
    selectedItem,
    filteredGroups,
    filteredOptions,
    handleToggle,
    handleSelect,
    setSearchQuery,
    handleClose,
  };
};

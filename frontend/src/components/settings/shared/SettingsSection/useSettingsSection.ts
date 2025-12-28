/**
 * SettingsSection 逻辑层
 * 文件路径: frontend/src/components/settings/shared/SettingsSection/useSettingsSection.ts
 *
 * Headless UI Hook：封装折叠状态管理和键盘导航
 */

import { useState, useCallback } from 'react';
import type { SettingsSectionProps, UseSettingsSectionReturn } from './types';

/**
 * useSettingsSection Hook
 *
 * @description
 * 封装设置节的折叠展开逻辑和键盘导航。
 * 支持受控和非受控两种模式。
 *
 * @param props - 组件 Props
 * @returns Hook 返回值
 */
export function useSettingsSection(props: SettingsSectionProps): UseSettingsSectionReturn {
  const {
    title,
    description,
    collapsible = false,
    defaultExpanded = true,
    expanded: controlledExpanded,
    onExpandedChange,
  } = props;

  // 非受控模式的内部状态
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // 判断是否使用受控模式
  const isControlled = controlledExpanded !== undefined;

  // 当前展开状态
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  // 是否显示头部
  const hasHeader = Boolean(title || description);

  // 是否可折叠
  const isCollapsible = collapsible && hasHeader;

  /**
   * 切换展开状态
   */
  const toggleExpanded = useCallback(() => {
    if (!isCollapsible) return;

    const newExpanded = !isExpanded;

    if (isControlled) {
      onExpandedChange?.(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }
  }, [isCollapsible, isExpanded, isControlled, onExpandedChange]);

  /**
   * 处理键盘导航
   * - Enter/Space: 切换展开状态
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isCollapsible) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleExpanded();
      }
    },
    [isCollapsible, toggleExpanded]
  );

  return {
    isExpanded,
    hasHeader,
    isCollapsible,
    toggleExpanded,
    handleKeyDown,
  };
}

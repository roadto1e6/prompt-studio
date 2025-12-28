// 文件路径: frontend/src/components/ui/KeyboardShortcutsModal/useKeyboardShortcutsModal.ts

/**
 * KeyboardShortcutsModal 逻辑层
 * Headless UI Hook：封装快捷键数据组织和平台检测逻辑
 */

import { useMemo } from 'react';
import { useI18nStore } from '@/stores';
import type { Shortcut, UseKeyboardShortcutsModalReturn } from './types';

/**
 * 快捷键列表数据（使用键值对便于 i18n）
 */
interface ShortcutDefinition {
  keys: string[];
  descriptionKey: string;
  categoryKey: string;
}

const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
  // 搜索和导航
  { keys: ['⌘', 'K'], descriptionKey: 'focusSearch', categoryKey: 'searchAndNav' },
  { keys: ['Esc'], descriptionKey: 'clearOrClose', categoryKey: 'searchAndNav' },
  { keys: ['?'], descriptionKey: 'showHelp', categoryKey: 'searchAndNav' },

  // 提示词操作
  { keys: ['⌘', 'N'], descriptionKey: 'createPrompt', categoryKey: 'promptActions' },
  { keys: ['⌘', 'S'], descriptionKey: 'savePrompt', categoryKey: 'promptActions' },
  { keys: ['⌘', 'E'], descriptionKey: 'editPrompt', categoryKey: 'promptActions' },
  { keys: ['⌘', 'D'], descriptionKey: 'duplicatePrompt', categoryKey: 'promptActions' },
  { keys: ['⌘', 'Backspace'], descriptionKey: 'deletePrompt', categoryKey: 'promptActions' },

  // 视图切换
  { keys: ['⌘', '1'], descriptionKey: 'gridView', categoryKey: 'viewSwitching' },
  { keys: ['⌘', '2'], descriptionKey: 'listView', categoryKey: 'viewSwitching' },
  { keys: ['⌘', 'B'], descriptionKey: 'toggleSidebar', categoryKey: 'viewSwitching' },
  { keys: ['⌘', '/'], descriptionKey: 'toggleDetail', categoryKey: 'viewSwitching' },

  // 全局操作
  { keys: ['⌘', ','], descriptionKey: 'openSettings', categoryKey: 'globalActions' },
  { keys: ['⌘', 'Shift', 'T'], descriptionKey: 'toggleTheme', categoryKey: 'globalActions' },
  { keys: ['⌘', 'Shift', 'L'], descriptionKey: 'toggleLanguage', categoryKey: 'globalActions' },
];

/**
 * 将快捷键列表按类别分组
 * @param shortcuts - 快捷键列表
 * @returns 分组后的快捷键对象
 */
const groupShortcutsByCategory = (shortcuts: Shortcut[]): Record<string, Shortcut[]> => {
  return shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);
};

/**
 * 检测当前操作系统是否为 macOS
 * @returns 是否为 macOS
 */
const detectIsMac = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
};

/**
 * KeyboardShortcutsModal Headless Hook
 *
 * @description
 * 封装快捷键数据组织、平台检测和格式化逻辑。
 * 采用 Headless UI 模式，视图层只需使用返回的数据和方法。
 *
 * @example
 * ```tsx
 * const modal = useKeyboardShortcutsModal();
 * return (
 *   <div>
 *     {Object.entries(modal.groupedShortcuts).map(([category, shortcuts]) => (
 *       <div key={category}>
 *         <h3>{category}</h3>
 *         {shortcuts.map(shortcut => (
 *           <div>{modal.formatKeys(shortcut.keys).join(' + ')}</div>
 *         ))}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useKeyboardShortcutsModal(): UseKeyboardShortcutsModalReturn {
  // ==================== i18n ====================
  const { t } = useI18nStore();

  // ==================== 平台检测 ====================

  /**
   * 检测操作系统（仅在客户端执行一次）
   */
  const isMac = useMemo(() => detectIsMac(), []);

  // ==================== 数据组织 ====================

  /**
   * 将定义转换为带翻译的快捷键列表
   */
  const shortcuts = useMemo((): Shortcut[] => {
    const categories = t.keyboard?.categories || {};
    const shortcutTexts = t.keyboard?.shortcuts || {};

    return SHORTCUT_DEFINITIONS.map(def => ({
      keys: def.keys,
      description: shortcutTexts[def.descriptionKey as keyof typeof shortcutTexts] || def.descriptionKey,
      category: categories[def.categoryKey as keyof typeof categories] || def.categoryKey,
    }));
  }, [t.keyboard]);

  /**
   * 按类别分组的快捷键数据（缓存计算结果）
   */
  const groupedShortcuts = useMemo(() => {
    return groupShortcutsByCategory(shortcuts);
  }, [shortcuts]);

  // ==================== 格式化方法 ====================

  /**
   * 格式化快捷键显示
   * 将 ⌘ (Command) 在非 macOS 系统上替换为 Ctrl
   *
   * @param keys - 原始快捷键数组
   * @returns 格式化后的快捷键数组
   */
  const formatKeys = (keys: string[]): string[] => {
    return keys.map(key => {
      if (key === '⌘' && !isMac) {
        return 'Ctrl';
      }
      return key;
    });
  };

  // ==================== 返回值 ====================

  return {
    groupedShortcuts,
    isMac,
    formatKeys,
  };
}

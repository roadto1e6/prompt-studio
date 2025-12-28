import { useEffect, useCallback } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: KeyHandler;
  preventDefault?: boolean;
  disabled?: boolean;
  description?: string;
}

/**
 * 增强的键盘快捷键钩子
 * - 修复了修饰键匹配逻辑
 * - 支持禁用快捷键
 * - 自动忽略输入框中的快捷键（可配置）
 * - 跨平台支持（Mac 的 Cmd 和 Windows/Linux 的 Ctrl）
 */
export function useKeyboardShortcut(
  shortcuts: ShortcutConfig[],
  options?: {
    ignoreInputFields?: boolean; // 是否忽略输入框中的快捷键，默认 true
  }
) {
  const { ignoreInputFields = true } = options || {};

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 忽略输入框中的快捷键（除了 Escape）
      if (ignoreInputFields && event.key !== 'Escape') {
        const target = event.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        if (shortcut.disabled) continue;

        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();

        // 修复：只有明确指定了修饰键时才检查
        const matchesShift = shortcut.shiftKey === undefined ? true : event.shiftKey === shortcut.shiftKey;
        const matchesAlt = shortcut.altKey === undefined ? true : event.altKey === shortcut.altKey;
        const matchesCtrl = shortcut.ctrlKey === undefined ? true : event.ctrlKey === shortcut.ctrlKey;
        const matchesMeta = shortcut.metaKey === undefined ? true : event.metaKey === shortcut.metaKey;

        // 跨平台支持：Cmd (Mac) 或 Ctrl (Windows/Linux)
        let matchesModifier = true;
        if (shortcut.ctrlKey || shortcut.metaKey) {
          matchesModifier = event.ctrlKey || event.metaKey;
        }

        if (
          matchesKey &&
          matchesShift &&
          matchesAlt &&
          matchesCtrl &&
          matchesMeta &&
          matchesModifier
        ) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler(event);
          break; // 只触发第一个匹配的快捷键
        }
      }
    },
    [shortcuts, ignoreInputFields]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * 单个快捷键的便捷钩子
 */
export function useKeyPress(
  key: string,
  handler: KeyHandler,
  options?: Omit<ShortcutConfig, 'key' | 'handler'>
) {
  useKeyboardShortcut([{ key, handler, ...options }]);
}

/**
 * 格式化快捷键显示（用于 UI）
 */
export function formatShortcut(shortcut: Pick<ShortcutConfig, 'key' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'altKey'>): string {
  const keys: string[] = [];
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  if (shortcut.metaKey || shortcut.ctrlKey) {
    keys.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.shiftKey) {
    keys.push('Shift');
  }
  if (shortcut.altKey) {
    keys.push(isMac ? '⌥' : 'Alt');
  }
  keys.push(shortcut.key.toUpperCase());

  return keys.join('+');
}

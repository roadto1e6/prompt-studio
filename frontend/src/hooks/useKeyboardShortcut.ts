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
}

export function useKeyboardShortcut(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesShift = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const matchesAlt = shortcut.altKey ? event.altKey : !event.altKey;

        // Check if this shortcut requires Cmd/Ctrl
        const requiresModifier = shortcut.ctrlKey || shortcut.metaKey;
        const hasModifier = event.ctrlKey || event.metaKey;

        if (
          matchesKey &&
          matchesShift &&
          matchesAlt &&
          (requiresModifier ? hasModifier : true)
        ) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler(event);
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Convenience hook for single shortcut
export function useKeyPress(
  key: string,
  handler: KeyHandler,
  options?: Omit<ShortcutConfig, 'key' | 'handler'>
) {
  useKeyboardShortcut([{ key, handler, ...options }]);
}

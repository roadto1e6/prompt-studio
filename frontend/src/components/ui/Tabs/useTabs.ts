/**
 * Tabs 逻辑层
 * 封装键盘导航逻辑
 */

import { useCallback } from 'react';
import type { UseTabsOptions, UseTabsReturn } from './types';

/**
 * Tabs Hook
 * 处理键盘导航（左右箭头、Home、End）
 */
export function useTabs(options: UseTabsOptions): UseTabsReturn {
  const { tabs, activeTab, onChange } = options;

  /** 键盘导航处理 */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;

      switch (e.key) {
        case 'ArrowLeft':
          // 向左切换（跳过禁用的）
          nextIndex = currentIndex - 1;
          while (nextIndex >= 0 && tabs[nextIndex].disabled) {
            nextIndex--;
          }
          if (nextIndex >= 0) {
            e.preventDefault();
            onChange(tabs[nextIndex].id);
          }
          break;

        case 'ArrowRight':
          // 向右切换（跳过禁用的）
          nextIndex = currentIndex + 1;
          while (nextIndex < tabs.length && tabs[nextIndex].disabled) {
            nextIndex++;
          }
          if (nextIndex < tabs.length) {
            e.preventDefault();
            onChange(tabs[nextIndex].id);
          }
          break;

        case 'Home':
          // 跳转到第一个未禁用的 Tab
          nextIndex = 0;
          while (nextIndex < tabs.length && tabs[nextIndex].disabled) {
            nextIndex++;
          }
          if (nextIndex < tabs.length) {
            e.preventDefault();
            onChange(tabs[nextIndex].id);
          }
          break;

        case 'End':
          // 跳转到最后一个未禁用的 Tab
          nextIndex = tabs.length - 1;
          while (nextIndex >= 0 && tabs[nextIndex].disabled) {
            nextIndex--;
          }
          if (nextIndex >= 0) {
            e.preventDefault();
            onChange(tabs[nextIndex].id);
          }
          break;
      }
    },
    [tabs, activeTab, onChange]
  );

  return { handleKeyDown };
}

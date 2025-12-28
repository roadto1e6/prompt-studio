/**
 * Global Keyboard Shortcuts Hook
 * 全局快捷键管理
 */

import { useState } from 'react';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { usePromptStore, useUIStore, useAuthStore, useThemeStore, useI18nStore } from '@/stores';

export function useGlobalShortcuts() {
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const { openModal, toggleSidebar, toggleDetailPanel } = useUIStore();
  const { activePromptId, setViewMode } = usePromptStore();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { language, setLanguage } = useI18nStore();

  // 切换主题辅助函数
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // 切换语言辅助函数
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  // 定义所有全局快捷键
  useKeyboardShortcut([
    // 搜索和导航
    {
      key: 'k',
      metaKey: true,
      description: '聚焦搜索框',
      handler: () => {
        // 由 Sidebar 组件处理
        // 这里只是占位，实际实现在 Sidebar.tsx
      },
      disabled: true, // 已在 Sidebar 中实现
    },
    {
      key: '?',
      shiftKey: true,
      description: '显示快捷键帮助',
      handler: () => setShowShortcutsHelp(true),
    },

    // 提示词操作
    {
      key: 'n',
      metaKey: true,
      description: '创建新提示词',
      handler: () => {
        if (user) {
          openModal('createPrompt');
        }
      },
    },
    {
      key: 's',
      metaKey: true,
      description: '保存当前提示词',
      handler: () => {
        // 由编辑器组件处理
        // 这里触发保存事件
        const event = new CustomEvent('prompt:save');
        window.dispatchEvent(event);
      },
    },
    {
      key: 'e',
      metaKey: true,
      description: '编辑当前提示词',
      handler: () => {
        if (activePromptId) {
          // 触发编辑事件，由其他组件处理
          const event = new CustomEvent('prompt:edit', { detail: activePromptId });
          window.dispatchEvent(event);
        }
      },
    },
    {
      key: 'd',
      metaKey: true,
      description: '复制当前提示词',
      handler: () => {
        if (activePromptId) {
          // 触发复制事件
          const event = new CustomEvent('prompt:duplicate', { detail: activePromptId });
          window.dispatchEvent(event);
        }
      },
    },
    {
      key: 'Backspace',
      metaKey: true,
      description: '删除当前提示词',
      handler: () => {
        if (activePromptId) {
          // 触发删除事件
          const event = new CustomEvent('prompt:delete', { detail: activePromptId });
          window.dispatchEvent(event);
        }
      },
    },

    // 视图切换
    {
      key: '1',
      metaKey: true,
      description: '切换到网格视图',
      handler: () => setViewMode('grid'),
    },
    {
      key: '2',
      metaKey: true,
      description: '切换到列表视图',
      handler: () => setViewMode('list'),
    },
    {
      key: 'b',
      metaKey: true,
      description: '切换侧边栏',
      handler: () => toggleSidebar(),
    },
    {
      key: '/',
      metaKey: true,
      description: '切换详情面板',
      handler: () => toggleDetailPanel(),
    },

    // 全局操作
    {
      key: ',',
      metaKey: true,
      description: '打开设置',
      handler: () => openModal('settings'),
    },
    {
      key: 't',
      metaKey: true,
      shiftKey: true,
      description: '切换主题',
      handler: () => toggleTheme(),
    },
    {
      key: 'l',
      metaKey: true,
      shiftKey: true,
      description: '切换语言',
      handler: () => toggleLanguage(),
    },
  ]);

  return {
    showShortcutsHelp,
    setShowShortcutsHelp,
  };
}

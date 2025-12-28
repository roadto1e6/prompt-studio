/**
 * useSettingsModal Hook
 * 设置模态框业务逻辑 Hook
 *
 * 职责：
 * 1. 标签页切换逻辑
 * 2. 模型初始化
 * 3. 状态管理
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18nStore } from '@/stores/i18nStore';
import { useModelStore } from '@/stores/modelStore';
import type { SettingsTab, UseSettingsModalReturn } from './types';

/**
 * useSettingsModal Hook
 */
export function useSettingsModal(
  defaultTab: SettingsTab = 'profile',
  onClose: () => void
): UseSettingsModalReturn {
  const { t } = useI18nStore();
  const { initialize: initModels, initialized: modelsInitialized } = useModelStore();

  // 当前激活的标签页
  const [activeTab, setActiveTab] = useState<SettingsTab>(defaultTab);

  // 标签页标签和描述
  const tabLabels = {
    profile: {
      label: t.settings?.profile || 'Profile',
      description: t.settings?.profileDescription || 'Manage your profile',
    },
    security: {
      label: t.settings?.security || 'Security',
      description: t.settings?.securityDescription || 'Password & security',
    },
    aiModels: {
      label: t.settings?.aiModels || 'AI Models',
      description: t.settings?.aiModelsDescription || 'Manage AI models',
    },
  };

  // 初始化模型数据（当切换到 AI Models 标签时）
  useEffect(() => {
    if (activeTab === 'aiModels' && !modelsInitialized) {
      initModels();
    }
  }, [activeTab, modelsInitialized, initModels]);

  // 处理标签切换
  const handleTabChange = useCallback((tab: SettingsTab) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    setActiveTab,
    tabLabels,
    handleTabChange,
    onClose,
  };
}

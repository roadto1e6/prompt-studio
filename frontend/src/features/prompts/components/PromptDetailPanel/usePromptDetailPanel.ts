// 文件路径: frontend/src/features/prompts/components/PromptDetailPanel/usePromptDetailPanel.ts

/**
 * PromptDetailPanel 逻辑层
 * 封装所有状态和处理器
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePromptStore, useCollectionStore, useUIStore, useI18nStore } from '@/stores';
import type { UsePromptDetailPanelReturn } from './types';

/**
 * 分类颜色映射
 */
const CATEGORY_COLORS: Record<string, string> = {
  text: 'bg-theme-accent',
  image: 'bg-emerald-500',
  audio: 'bg-amber-500',
  video: 'bg-rose-500',
};

/**
 * PromptDetailPanel Hook
 */
export function usePromptDetailPanel(): UsePromptDetailPanelReturn {
  // Store 依赖
  const { getActivePrompt, restoreFromTrash, permanentDelete, updatePrompt } = usePromptStore();
  const { getCollectionById } = useCollectionStore();
  const { detailPanelOpen, activeTab, setActiveTab, closeDetailPanel, showConfirm, openModal } = useUIStore();
  const { t } = useI18nStore();

  // 本地状态
  const [localTitle, setLocalTitle] = useState('');
  const titleDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  // 派生数据
  const prompt = getActivePrompt();
  const collection = prompt?.collectionId ? getCollectionById(prompt.collectionId) : null;
  const isInTrash = prompt?.status === 'trash';

  const tabs = [
    { id: 'editor', label: t.detailPanel.tabs.editor },
    { id: 'metadata', label: t.detailPanel.tabs.metadata },
    { id: 'versions', label: t.detailPanel.tabs.versions },
  ];

  // 同步标题
  useEffect(() => {
    if (prompt) {
      setLocalTitle(prompt.title);
    }
  }, [prompt?.id]);

  // 清理
  useEffect(() => {
    return () => {
      if (titleDebounceRef.current) {
        clearTimeout(titleDebounceRef.current);
      }
    };
  }, []);

  // 处理器
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);

    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
    }

    titleDebounceRef.current = setTimeout(() => {
      if (prompt && newTitle !== prompt.title) {
        updatePrompt(prompt.id, { title: newTitle });
      }
    }, 500);
  }, [prompt, updatePrompt]);

  const handleTitleBlur = useCallback(() => {
    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
    }
    if (prompt && localTitle !== prompt.title) {
      updatePrompt(prompt.id, { title: localTitle });
    }
  }, [prompt, localTitle, updatePrompt]);

  const handleRestore = useCallback(() => {
    if (prompt) {
      restoreFromTrash(prompt.id);
      closeDetailPanel();
    }
  }, [prompt, restoreFromTrash, closeDetailPanel]);

  const handlePermanentDelete = useCallback(() => {
    if (prompt) {
      showConfirm({
        title: t.confirm.deletePermanently.title,
        message: `${t.confirm.deletePermanently.message.replace('this prompt', `"${prompt.title}"`)}`,
        confirmText: t.confirm.deletePermanently.confirmText,
        cancelText: t.common.cancel,
        variant: 'danger',
        onConfirm: () => {
          permanentDelete(prompt.id);
          closeDetailPanel();
        },
      });
    }
  }, [prompt, showConfirm, t, permanentDelete, closeDetailPanel]);

  const handleShare = useCallback(() => {
    openModal('sharePrompt');
  }, [openModal]);

  const handleClose = useCallback(() => {
    closeDetailPanel();
  }, [closeDetailPanel]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as typeof activeTab);
  }, [setActiveTab]);

  return {
    prompt,
    collection,
    isInTrash,
    localTitle,
    detailPanelOpen,
    activeTab,
    tabs,
    categoryColors: CATEGORY_COLORS,
    t,
    handleTitleChange,
    handleTitleBlur,
    handleRestore,
    handlePermanentDelete,
    handleShare,
    handleClose,
    handleTabChange,
  };
}

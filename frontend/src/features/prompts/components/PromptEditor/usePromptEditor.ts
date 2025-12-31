// 文件路径: frontend/src/features/prompts/components/PromptEditor/usePromptEditor.ts

/**
 * PromptEditor 逻辑层
 * 封装所有状态和处理器
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { usePromptStore, useI18nStore } from '@/stores';
import { estimateTokens, countChars, hasPromptChanged } from '@/utils';
import type { UsePromptEditorReturn, VersionType } from './types';

/**
 * PromptEditor Hook
 */
export function usePromptEditor(): UsePromptEditorReturn {
  // Store 依赖
  const { getActivePrompt, updatePrompt, createVersion } = usePromptStore();
  const { t } = useI18nStore();
  const prompt = getActivePrompt();

  // 本地状态
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [changeNote, setChangeNote] = useState('');
  const [versionType, setVersionType] = useState<VersionType>('minor');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 定时器引用
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // 清理定时器
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // 同步 prompt 数据
  useEffect(() => {
    if (prompt) {
      setSystemPrompt(prompt.systemPrompt);
      setIsDirty(false);
    }
  }, [prompt?.id]);

  // 计算统计数据
  const charCount = useMemo(() => countChars(systemPrompt), [systemPrompt]);
  const tokenCount = useMemo(() => estimateTokens(systemPrompt), [systemPrompt]);

  // 当前版本 - 根据 currentVersionId 查找，而不是假设第一个就是当前版本
  const currentVersion = useMemo(() => {
    if (!prompt) return null;
    return prompt.versions.find(v => v.id === prompt.currentVersionId) || prompt.versions[0] || null;
  }, [prompt]);

  // 获取当前版本号
  const getCurrentVersionNumber = useCallback(() => {
    if (!prompt) return '1.0';
    const current = prompt.versions.find(v => v.id === prompt.currentVersionId);
    return current?.versionNumber || '1.0';
  }, [prompt]);

  // 计算下一个版本号
  const getNextVersionNumber = useCallback((type: VersionType) => {
    if (!prompt) return type === 'major' ? '2.0' : '1.1';
    const current = prompt.versions.find(v => v.id === prompt.currentVersionId);
    if (!current) return type === 'major' ? '2.0' : '1.1';

    const [major, minor] = current.versionNumber.split('.').map(Number);
    return type === 'major' ? `${major + 1}.0` : `${major}.${minor + 1}`;
  }, [prompt]);

  // 处理器
  const handleSystemPromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!prompt) return;

    // 检查内容是否变化
    const currentVersionData = prompt.versions.find(v => v.id === prompt.currentVersionId);
    const hasChanged = currentVersionData && hasPromptChanged(
      { systemPrompt, model: prompt.model, temperature: prompt.temperature, maxTokens: prompt.maxTokens },
      currentVersionData
    );

    // 更新 prompt
    updatePrompt(prompt.id, {
      systemPrompt,
    });

    // 如果有变化，显示版本创建模态框
    if (hasChanged) {
      setShowVersionModal(true);
    } else {
      setIsDirty(false);
    }
  }, [prompt, systemPrompt, updatePrompt]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(systemPrompt);
      setCopied(true);
      // 清理之前的定时器
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [systemPrompt]);

  const handleCreateVersion = useCallback(async () => {
    if (!prompt) return;

    try {
      await createVersion(
        prompt.id,
        changeNote || 'Updated prompt content.',
        versionType
      );
      setShowVersionModal(false);
      setChangeNote('');
      setVersionType('minor');
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to create version:', error);
    }
  }, [prompt, changeNote, versionType, createVersion]);

  const handleSkipVersion = useCallback(() => {
    setShowVersionModal(false);
    setChangeNote('');
    setVersionType('minor');
    setIsDirty(false);
  }, []);

  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  // 全屏模式处理器
  const openFullscreen = useCallback(() => {
    setIsFullscreen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  // 全屏编辑器保存处理器（保存后自动关闭全屏）
  const handleFullscreenSave = useCallback(() => {
    if (!prompt) return;

    // 检查内容是否变化
    const currentVersionData = prompt.versions.find(v => v.id === prompt.currentVersionId);
    const hasChanged = currentVersionData && hasPromptChanged(
      { systemPrompt, model: prompt.model, temperature: prompt.temperature, maxTokens: prompt.maxTokens },
      currentVersionData
    );

    // 更新 prompt
    updatePrompt(prompt.id, {
      systemPrompt,
    });

    // 关闭全屏编辑器
    setIsFullscreen(false);

    // 如果有变化，显示版本创建模态框
    if (hasChanged) {
      setShowVersionModal(true);
    } else {
      setIsDirty(false);
    }
  }, [prompt, systemPrompt, updatePrompt]);

  // 直接设置系统提示词值（用于全屏编辑器）
  const handleSystemPromptValueChange = useCallback((value: string) => {
    setSystemPrompt(value);
    setIsDirty(true);
  }, []);

  return {
    prompt,
    systemPrompt,
    isDirty,
    copied,
    showVersionModal,
    changeNote,
    versionType,
    charCount,
    tokenCount,
    currentVersion,
    t,
    handleSystemPromptChange,
    handleSystemPromptValueChange,
    handleSave,
    handleFullscreenSave,
    handleCopy,
    handleCreateVersion,
    handleSkipVersion,
    setChangeNote,
    setVersionType,
    setShowVersionModal,
    getNextVersionNumber,
    getCurrentVersionNumber,
    isPreviewMode,
    togglePreviewMode,
    isFullscreen,
    openFullscreen,
    closeFullscreen,
  };
}

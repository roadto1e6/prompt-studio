// 文件路径: frontend/src/features/prompts/components/PromptMetadata/usePromptMetadata.ts

/**
 * PromptMetadata 逻辑层
 * Headless Hook：封装元数据管理逻辑
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { usePromptStore, useCollectionStore, useModelStore, useI18nStore } from '@/stores';
import type { UsePromptMetadataReturn, ModelOptionGroup, CollectionOption } from './types';

/**
 * PromptMetadata Headless Hook
 *
 * @description
 * 封装提示词元数据的业务逻辑，包括：
 * - 状态管理（model、temperature、maxTokens、tags 等）
 * - 时间格式化（使用 date-fns）
 * - 模型选项处理
 * - 集合选项处理
 * - 性能优化（useMemo、useCallback）
 *
 * @architecture
 * - 分离业务逻辑与 UI
 * - 使用 useMemo 缓存派生状态
 * - 使用 useCallback 缓存事件处理器
 *
 * @performance
 * - 格式化时间结果被 useMemo 缓存
 * - 模型/集合选项被 useMemo 缓存
 * - 事件处理器被 useCallback 缓存
 *
 * @example
 * ```tsx
 * const metadata = usePromptMetadata();
 * // 访问 metadata.prompt, metadata.formattedCreatedAt 等
 * ```
 */
export function usePromptMetadata(): UsePromptMetadataReturn {
  // ==================== Store 状态 ====================
  const { getActivePrompt, updatePrompt } = usePromptStore();
  const { collections } = useCollectionStore();
  const { getModelOptions, initialized, initialize, providers } = useModelStore();
  const { t } = useI18nStore();

  const prompt = getActivePrompt();

  // ==================== 本地状态 ====================
  const [model, setModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ==================== 初始化模型数据 ====================
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  // ==================== 同步 Prompt 数据 ====================
  useEffect(() => {
    if (prompt) {
      setModel(prompt.model);
      setTemperature(prompt.temperature);
      setMaxTokens(prompt.maxTokens);
      setTags(prompt.tags);
      setCollectionId(prompt.collectionId);
    }
  }, [prompt?.id]); // 只依赖 prompt.id，避免不必要的重渲染

  // ==================== 派生状态（Memoized） ====================

  /**
   * 格式化创建时间
   * 使用 date-fns 格式化为易读格式
   */
  const formattedCreatedAt = useMemo(() => {
    if (!prompt?.createdAt) return '--';
    try {
      const date = new Date(prompt.createdAt);
      return format(date, 'PPpp'); // 例：Apr 29, 2024, 9:30:00 AM
    } catch {
      return '--';
    }
  }, [prompt?.createdAt]);

  /**
   * 格式化更新时间
   * 使用 date-fns 格式化为易读格式
   */
  const formattedUpdatedAt = useMemo(() => {
    if (!prompt?.updatedAt) return '--';
    try {
      const date = new Date(prompt.updatedAt);
      return format(date, 'PPpp'); // 例：Apr 29, 2024, 9:30:00 AM
    } catch {
      return '--';
    }
  }, [prompt?.updatedAt]);

  /**
   * 模型选项组
   * 根据当前 prompt 的类别获取可用模型
   * 依赖 providers 以确保在数据加载后重新计算
   */
  const modelGroups = useMemo<ModelOptionGroup[]>(() => {
    if (!prompt || !initialized) return [];

    const modelOptions = getModelOptions(prompt.category);
    return modelOptions.map(group => ({
      label: group.providerName,
      options: group.options.map(m => ({ value: m.value, label: m.label })),
    }));
  }, [prompt?.category, getModelOptions, initialized, providers]);

  /**
   * 集合选项列表
   * 包含"无集合"选项
   */
  const collectionOptions = useMemo<CollectionOption[]>(() => {
    return [
      { value: '', label: t.metadata?.noCollection || 'No Collection' },
      ...collections.map(c => ({ value: c.id, label: c.name })),
    ];
  }, [collections, t.metadata?.noCollection]);

  // ==================== 事件处理器（Memoized） ====================

  /**
   * 处理模型变更
   */
  const handleModelChange = useCallback((e: { target: { value: string } }) => {
    const newModel = e.target.value;
    setModel(newModel);
    if (prompt) {
      updatePrompt(prompt.id, { model: newModel });
    }
  }, [prompt, updatePrompt]);

  /**
   * 处理温度变更
   */
  const handleTemperatureChange = useCallback((value: number) => {
    setTemperature(value);
    if (prompt) {
      updatePrompt(prompt.id, { temperature: value });
    }
  }, [prompt, updatePrompt]);

  /**
   * 处理最大令牌数变更
   */
  const handleMaxTokensChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMaxTokens(value);
    if (prompt) {
      updatePrompt(prompt.id, { maxTokens: value });
    }
  }, [prompt, updatePrompt]);

  /**
   * 处理添加标签
   * 支持 Enter 键添加
   */
  const handleAddTag = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      const tag = newTag.trim().toLowerCase().replace(/\s+/g, '-');
      if (!tags.includes(tag)) {
        const newTags = [...tags, tag];
        setTags(newTags);
        if (prompt) {
          updatePrompt(prompt.id, { tags: newTags });
        }
      }
      setNewTag('');
    }
  }, [newTag, tags, prompt, updatePrompt]);

  /**
   * 处理移除标签
   */
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    setTags(newTags);
    if (prompt) {
      updatePrompt(prompt.id, { tags: newTags });
    }
  }, [tags, prompt, updatePrompt]);

  /**
   * 处理集合变更
   */
  const handleCollectionChange = useCallback((e: { target: { value: string } }) => {
    const value = e.target.value || null;
    setCollectionId(value);
    if (prompt) {
      updatePrompt(prompt.id, { collectionId: value });
    }
  }, [prompt, updatePrompt]);

  /**
   * 处理新标签输入变更
   */
  const handleNewTagChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  }, []);

  /**
   * 切换高级设置显示
   */
  const toggleAdvanced = useCallback(() => {
    setShowAdvanced(prev => !prev);
  }, []);

  // ==================== 返回值 ====================
  return {
    prompt,
    modelGroups,
    collectionOptions,
    model,
    temperature,
    maxTokens,
    tags,
    newTag,
    collectionId,
    showAdvanced,
    formattedCreatedAt,
    formattedUpdatedAt,
    handleModelChange,
    handleTemperatureChange,
    handleMaxTokensChange,
    handleAddTag,
    handleRemoveTag,
    handleCollectionChange,
    handleNewTagChange,
    toggleAdvanced,
  };
}

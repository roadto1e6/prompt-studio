// 文件路径: frontend/src/features/prompts/components/ImportPromptModal/useImportPromptModal.ts

/**
 * ImportPromptModal 逻辑层
 * Headless UI Hook：封装所有状态、副作用和处理器
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { usePromptStore, useUIStore } from '@/stores';
import { shareService } from '@/services';
import type {
  ImportViewState,
  FormState,
  UseImportModalReturn,
} from './types';

/**
 * 默认表单状态
 */
const DEFAULT_FORM_STATE: FormState = {
  inputCode: '',
  parsedData: null,
  errorMessage: '',
  asyncState: 'idle',
};

/**
 * ImportPromptModal Headless Hook
 *
 * @description
 * 封装所有导入流程：分享码解码、验证、预览、异步导入。
 * 采用 Headless UI 模式，视图层只需调用返回的 handlers 和 state。
 *
 * @features
 * 1. 分享码解码：支持完整 URL 或纯短码
 * 2. 异步获取：从 shareService 获取数据
 * 3. 导入前预览：显示完整提示词信息
 * 4. 重复检测：检查是否已存在相同提示词
 * 5. 异步导入：带 Loading/Error/Success 状态
 *
 * @example
 * ```tsx
 * const modal = useImportPromptModal();
 * return (
 *   <form>
 *     {modal.viewState === 'input' && (
 *       <input value={modal.formState.inputCode} onChange={e => modal.handleInputChange(e.target.value)} />
 *     )}
 *     {modal.viewState === 'preview' && (
 *       <PreviewCard data={modal.displayData} />
 *     )}
 *   </form>
 * );
 * ```
 */
export function useImportPromptModal(): UseImportModalReturn {
  // ==================== Store 依赖 ====================
  const { prompts, createPrompt } = usePromptStore();
  const { modals, closeModal, pendingImportData, setPendingImportData } = useUIStore();

  // ==================== Client State ====================
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

  // ==================== 派生状态 ====================

  /**
   * 当前视图状态
   * - 有解析数据或待导入数据时显示预览
   * - 否则显示输入框
   */
  const viewState: ImportViewState = useMemo(() => {
    return formState.parsedData || pendingImportData ? 'preview' : 'input';
  }, [formState.parsedData, pendingImportData]);

  /**
   * 是否正在获取数据
   */
  const isFetching = formState.asyncState === 'fetching';

  /**
   * 是否正在导入
   */
  const isImporting = formState.asyncState === 'importing';

  /**
   * 是否有任何加载状态
   */
  const isLoading = isFetching || isImporting;

  /**
   * 是否有错误
   */
  const hasError = formState.asyncState === 'error' && !!formState.errorMessage;

  /**
   * 显示的数据（优先使用解析数据，其次使用待导入数据）
   */
  const displayData = formState.parsedData || pendingImportData;

  /**
   * 检查是否存在重复提示词
   * 匹配条件：标题、系统提示词相同且未删除
   */
  const duplicatePrompt = useMemo(() => {
    if (!displayData) return null;

    const existing = prompts.find(
      (p) =>
        p.title === displayData.title &&
        p.systemPrompt === displayData.systemPrompt &&
        p.status !== 'trash'
    );

    return existing
      ? {
          id: existing.id,
          title: existing.title,
        }
      : null;
  }, [displayData, prompts]);

  const isDuplicate = !!duplicatePrompt;

  // ==================== 分享码解码逻辑 ====================

  /**
   * 从输入中提取短码
   * 支持两种格式：
   * 1. 完整 URL：https://example.com?s=ABC12345
   * 2. 纯短码：ABC12345
   *
   * @param input - 用户输入的字符串
   * @returns 提取的短码，无效返回 null
   */
  const extractCode = useCallback((input: string): string | null => {
    const trimmed = input.trim();

    // 检查是否是新的短链接格式 ?s=xxx
    if (trimmed.includes('?s=')) {
      try {
        const url = new URL(trimmed);
        const code = url.searchParams.get('s');
        if (code && shareService.isShortCode(code)) {
          return code;
        }
      } catch {
        // 不是有效 URL，继续尝试其他方式
      }
    }

    // 检查是否直接是短码
    if (shareService.isShortCode(trimmed)) {
      return trimmed;
    }

    return null;
  }, []);

  // ==================== 字段更新 Handlers ====================

  /**
   * 处理输入框变化
   * 清除错误信息
   */
  const handleInputChange = useCallback((value: string) => {
    setFormState((prev) => ({
      ...prev,
      inputCode: value,
      errorMessage: '',
      asyncState: 'idle',
    }));
  }, []);

  // ==================== 异步获取分享数据 ====================

  /**
   * 处理获取分享数据
   * 完整流程：解码 → 验证 → 获取 → 处理成功/失败
   */
  const handleFetchShare = useCallback(async () => {
    // 提取短码
    const code = extractCode(formState.inputCode);

    if (!code) {
      setFormState((prev) => ({
        ...prev,
        errorMessage: '无效的分享码或链接',
        asyncState: 'error',
      }));
      return;
    }

    // 开始获取
    setFormState((prev) => ({
      ...prev,
      asyncState: 'fetching',
      errorMessage: '',
    }));

    try {
      // 调用 shareService 获取数据
      const result = await shareService.get(code);

      // 获取成功
      setFormState((prev) => ({
        ...prev,
        parsedData: result.prompt,
        asyncState: 'idle',
        errorMessage: '',
      }));
    } catch (error) {
      // 获取失败
      setFormState((prev) => ({
        ...prev,
        parsedData: null,
        asyncState: 'error',
        errorMessage: error instanceof Error ? error.message : '获取失败，请重试',
      }));
    }
  }, [formState.inputCode, extractCode]);

  // ==================== 异步导入提示词 ====================

  /**
   * 处理导入提示词
   * 完整流程：验证 → 导入 → 成功/失败处理
   */
  const handleImport = useCallback(async () => {
    const dataToImport = displayData;
    if (!dataToImport) return;

    // 开始导入
    setFormState((prev) => ({
      ...prev,
      asyncState: 'importing',
      errorMessage: '',
    }));

    try {
      // 调用 Store 的创建方法
      await createPrompt({
        title: dataToImport.title,
        description: dataToImport.description,
        category: dataToImport.category,
        systemPrompt: dataToImport.systemPrompt,
        userTemplate: dataToImport.userTemplate,
        model: dataToImport.model,
        temperature: dataToImport.temperature,
        maxTokens: dataToImport.maxTokens,
        tags: dataToImport.tags,
      });

      // 导入成功
      setFormState((prev) => ({
        ...prev,
        asyncState: 'success',
      }));

      // 延迟关闭，让用户看到成功状态
      setTimeout(() => {
        closeModal('importPrompt');
        // 重置状态
        setFormState(DEFAULT_FORM_STATE);
        setPendingImportData(null);
      }, 300);
    } catch (error) {
      // 导入失败
      setFormState((prev) => ({
        ...prev,
        asyncState: 'error',
        errorMessage: error instanceof Error ? error.message : '导入失败，请重试',
      }));
    }
  }, [displayData, createPrompt, closeModal, setPendingImportData]);

  // ==================== 导航控制 ====================

  /**
   * 返回到输入状态
   * 清除解析数据和待导入数据
   */
  const handleBack = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      parsedData: null,
      inputCode: '',
      errorMessage: '',
      asyncState: 'idle',
    }));
    setPendingImportData(null);
  }, [setPendingImportData]);

  /**
   * 处理模态框关闭
   * 重置所有状态
   */
  const handleClose = useCallback(() => {
    // 立即重置表单
    setFormState(DEFAULT_FORM_STATE);
    setPendingImportData(null);

    // 关闭模态框
    closeModal('importPrompt');
  }, [closeModal, setPendingImportData]);

  /**
   * 重置表单到初始状态
   */
  const reset = useCallback(() => {
    setFormState(DEFAULT_FORM_STATE);
  }, []);

  // ==================== 副作用：监听模态框开关 ====================

  /**
   * 当模态框打开时：
   * 1. 如果有待导入数据，直接显示预览
   * 2. 否则重置表单
   */
  useEffect(() => {
    if (modals.importPrompt) {
      if (pendingImportData) {
        // 有待导入数据，直接进入预览模式
        setFormState((prev) => ({
          ...prev,
          parsedData: null, // 清除之前的解析数据
          inputCode: '',
          errorMessage: '',
          asyncState: 'idle',
        }));
      } else {
        // 无待导入数据，重置表单
        reset();
      }
    }
  }, [modals.importPrompt, pendingImportData, reset]);

  /**
   * 支持 Enter 键快速获取
   */
  useEffect(() => {
    if (!modals.importPrompt || viewState !== 'input') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && formState.inputCode.trim() && !isLoading) {
        handleFetchShare();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [modals.importPrompt, viewState, formState.inputCode, isLoading, handleFetchShare]);

  // ==================== 返回值 ====================

  return {
    // 状态
    viewState,
    formState,
    isFetching,
    isImporting,
    isLoading,
    hasError,
    displayData,
    isDuplicate,
    duplicatePrompt,

    // 处理器（全部使用 useCallback 优化）
    handleInputChange,
    handleFetchShare,
    handleImport,
    handleBack,
    handleClose,
    reset,
  };
}

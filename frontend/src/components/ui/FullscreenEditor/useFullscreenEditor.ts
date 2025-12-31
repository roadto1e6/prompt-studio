// 文件路径: frontend/src/components/ui/FullscreenEditor/useFullscreenEditor.ts

/**
 * FullscreenEditor 逻辑层
 * Headless UI Hook：封装所有状态、副作用和处理器
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useI18nStore } from '@/stores';
import { estimateTokens, countChars } from '@/utils';
import type { EditorMode, FullscreenEditorProps, UseFullscreenEditorReturn } from './types';

/**
 * FullscreenEditor Hook
 *
 * @description
 * 封装全屏编辑器的所有状态管理和交互逻辑。
 * 支持编辑/预览模式切换、字符/令牌统计、快捷键操作。
 */
export function useFullscreenEditor(props: FullscreenEditorProps): UseFullscreenEditorReturn {
  const { value, onChange, onClose, onSave, isOpen } = props;

  // Store 依赖
  const { t } = useI18nStore();

  // 本地状态
  const [mode, setMode] = useState<EditorMode>('edit');
  const [localValue, setLocalValue] = useState(value);

  // 同步外部值
  useEffect(() => {
    if (isOpen) {
      setLocalValue(value);
    }
  }, [value, isOpen]);

  // 计算统计数据
  const charCount = useMemo(() => countChars(localValue), [localValue]);
  const tokenCount = useMemo(() => estimateTokens(localValue), [localValue]);

  // 模式切换
  const handleModeChange = useCallback((newMode: EditorMode) => {
    setMode(newMode);
  }, []);

  // 内容变化
  const handleValueChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  }, [onChange]);

  // 关闭
  const handleClose = useCallback(() => {
    setMode('edit');
    onClose();
  }, [onClose]);

  // 保存
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave();
    }
  }, [onSave]);

  // 键盘快捷键
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Escape 关闭
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
      return;
    }

    // Cmd/Ctrl + S 保存
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
      return;
    }

    // Cmd/Ctrl + P 切换预览
    if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
      e.preventDefault();
      setMode(prev => prev === 'edit' ? 'preview' : 'edit');
      return;
    }
  }, [handleClose, handleSave]);

  // 全局键盘事件
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Escape 关闭
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, handleClose]);

  // 锁定背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return {
    mode,
    charCount,
    tokenCount,
    localValue,
    t,
    handleModeChange,
    handleValueChange,
    handleClose,
    handleSave,
    handleKeyDown,
  };
}

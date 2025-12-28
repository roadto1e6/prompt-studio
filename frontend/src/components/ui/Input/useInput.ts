/**
 * Input 组件逻辑 Hook
 */

import { useCallback, useEffect, useRef, useMemo } from 'react';
import { inputVariants } from '@/styles/variants';

export interface UseInputOptions {
  error?: string;
  disabled?: boolean;
}

export interface UseInputReturn {
  inputId: string;
  variantClasses: string;
}

export function useInput(options: UseInputOptions): UseInputReturn {
  const { error, disabled } = options;

  const inputId = useMemo(
    () => `input-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const variant = error ? 'error' : disabled ? 'disabled' : 'default';
  const variantClasses = inputVariants[variant].base;

  return {
    inputId,
    variantClasses,
  };
}

export interface UseTextareaOptions {
  error?: string;
  disabled?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  value?: string | number | readonly string[];
  externalRef?: React.RefObject<HTMLTextAreaElement>;
}

export interface UseTextareaReturn {
  textareaId: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  variantClasses: string;
  charCount: number;
  charCounterClass: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function useTextarea(
  options: UseTextareaOptions,
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  maxLength?: number
): UseTextareaReturn {
  const {
    error,
    disabled,
    autoResize = false,
    minRows = 3,
    maxRows = 10,
    value,
    externalRef,
  } = options;

  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = externalRef || internalRef;

  const textareaId = useMemo(
    () => `textarea-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const variant = error ? 'error' : disabled ? 'disabled' : 'default';
  const variantClasses = inputVariants[variant].base;

  const charCount = typeof value === 'string' ? value.length : 0;

  const charCounterClass = useMemo(() => {
    if (maxLength && charCount > maxLength) {
      return 'charCounterError';
    }
    if (maxLength && charCount >= maxLength * 0.9) {
      return 'charCounterWarning';
    }
    return 'charCounterNormal';
  }, [charCount, maxLength]);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoResize) return;

    textarea.style.height = 'auto';
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const paddingTop = parseInt(getComputedStyle(textarea).paddingTop);
    const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom);
    const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);

    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = newHeight >= maxHeight ? 'auto' : 'hidden';
  }, [autoResize, minRows, maxRows, textareaRef]);

  useEffect(() => {
    if (autoResize) adjustHeight();
  }, [value, autoResize, adjustHeight]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      if (autoResize) adjustHeight();
    },
    [onChange, autoResize, adjustHeight]
  );

  return {
    textareaId,
    textareaRef,
    variantClasses,
    charCount,
    charCounterClass,
    handleChange,
  };
}

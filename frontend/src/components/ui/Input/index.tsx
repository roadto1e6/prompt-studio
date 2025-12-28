/**
 * Input 组件 - 视图层
 * 输入框和文本域组件
 */

import React, { forwardRef, memo } from 'react';
import { cn } from '@/utils';
import { useInput, useTextarea } from './useInput';
import type { InputProps, TextareaProps } from './types';
import styles from './index.module.css';

// ============ 内联子组件 ============

// 标签组件
const Label: React.FC<{
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}> = ({ children, required, htmlFor }) => (
  <label htmlFor={htmlFor} className={styles.label}>
    {children}
    {required && <span className={styles.requiredMark}>*</span>}
  </label>
);

// 错误提示组件
const Error: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  if (!children) return null;
  return (
    <div className={styles.error}>
      <span>{children}</span>
    </div>
  );
};

// 字符计数器组件
const CharCounter: React.FC<{
  current: number;
  max?: number;
  counterClass: string;
}> = ({ current, max, counterClass }) => (
  <div className={cn(styles.charCounterBadge, styles[counterClass])}>
    {current}{max && ` / ${max}`}
  </div>
);

// ============ Input 主组件 ============

const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, suffix, className, containerClassName, fullWidth = true, id, required, disabled, ...props }, ref) => {
    const { inputId, variantClasses } = useInput({ error, disabled });
    const finalId = id || inputId;

    return (
      <div className={cn(fullWidth && 'w-full', containerClassName)}>
        {label && <Label htmlFor={finalId} required={required}>{label}</Label>}

        <div className={styles.inputWrapper}>
          {icon && (
            <span className={styles.iconWrapper}>
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={finalId}
            disabled={disabled}
            className={cn(
              styles.input,
              variantClasses,
              !!icon && styles.inputWithIcon,
              !!suffix && styles.inputWithSuffix,
              className
            )}
            {...props}
          />

          {suffix && (
            <div className={styles.suffixWrapper}>
              {suffix}
            </div>
          )}
        </div>

        <Error>{error}</Error>
      </div>
    );
  }
);

InputComponent.displayName = 'Input';

export const Input = memo(InputComponent);

// ============ Textarea 主组件 ============

const TextareaComponent = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label, error, showCount = false, autoResize = false,
      minRows = 3, maxRows = 10, maxLength,
      className, containerClassName, fullWidth = true,
      value, id, required, disabled, onChange, ...props
    },
    externalRef
  ) => {
    const {
      textareaId,
      textareaRef,
      variantClasses,
      charCount,
      charCounterClass,
      handleChange,
    } = useTextarea(
      {
        error,
        disabled,
        autoResize,
        minRows,
        maxRows,
        value,
        externalRef: externalRef as React.RefObject<HTMLTextAreaElement>,
      },
      onChange,
      maxLength
    );

    const finalId = id || textareaId;

    return (
      <div className={cn(fullWidth && 'w-full', containerClassName)}>
        {label && <Label htmlFor={finalId} required={required}>{label}</Label>}

        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            id={finalId}
            value={value}
            maxLength={maxLength}
            disabled={disabled}
            onChange={handleChange}
            className={cn(
              styles.textarea,
              variantClasses,
              autoResize && styles.textareaAutoResize,
              showCount && styles.textareaWithCount,
              className
            )}
            {...props}
          />

          {showCount && (
            <div className={styles.charCounter}>
              <CharCounter current={charCount} max={maxLength} counterClass={charCounterClass} />
            </div>
          )}
        </div>

        <Error>{error}</Error>
      </div>
    );
  }
);

TextareaComponent.displayName = 'Textarea';

export const Textarea = memo(TextareaComponent);

// 导出
export type { InputProps, TextareaProps } from './types';
export default Input;

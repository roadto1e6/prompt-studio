// 文件路径: frontend/src/components/ui/FullscreenEditor/index.tsx

/**
 * FullscreenEditor 视图层
 * 全屏编辑器组件，支持 Markdown 预览
 */

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { X, Edit3, Eye, Type, Hash } from 'lucide-react';
import { Button, MarkdownPreview } from '@/components/ui';
import { cn } from '@/utils';
import { useFullscreenEditor } from './useFullscreenEditor';
import type { FullscreenEditorProps } from './types';
import styles from './index.module.css';

/**
 * FullscreenEditor 组件
 * 提供沉浸式全屏编辑体验
 */
const FullscreenEditorComponent: React.FC<FullscreenEditorProps> = (props) => {
  const {
    isOpen,
    title,
    placeholder,
    disabled,
    onSave,
    isDirty,
  } = props;

  const {
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
  } = useFullscreenEditor(props);

  // 不显示时返回 null
  if (!isOpen) {
    return null;
  }

  const editorContent = (
    <div className={styles.overlay} onKeyDown={handleKeyDown}>
      {/* 头部 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label={t.common?.close || 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
          <span className={styles.title}>
            {title || t.editor?.systemPrompt || 'System Prompt'}
          </span>
        </div>

        <div className={styles.headerRight}>
          {/* 模式切换 */}
          <div className={styles.modeToggle}>
            <button
              onClick={() => handleModeChange('edit')}
              className={cn(styles.modeButton, mode === 'edit' && styles.modeButtonActive)}
            >
              <Edit3 className={styles.modeIcon} />
              {t.editor?.edit || 'Edit'}
            </button>
            <button
              onClick={() => handleModeChange('preview')}
              className={cn(styles.modeButton, mode === 'preview' && styles.modeButtonActive)}
            >
              <Eye className={styles.modeIcon} />
              {t.editor?.preview || 'Preview'}
            </button>
          </div>

          {/* 保存按钮 */}
          {onSave && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!isDirty}
            >
              {isDirty ? (t.editor?.saveChanges || 'Save Changes') : (t.editor?.saved || 'Saved')}
            </Button>
          )}
        </div>
      </header>

      {/* 主体内容 */}
      <main className={styles.content}>
        {mode === 'edit' ? (
          <div className={styles.editorWrapper}>
            <textarea
              value={localValue}
              onChange={handleValueChange}
              placeholder={placeholder || t.editor?.systemPromptPlaceholder}
              disabled={disabled}
              className={styles.textarea}
              autoFocus
            />
          </div>
        ) : (
          <div className={styles.previewWrapper}>
            <MarkdownPreview content={localValue} />
          </div>
        )}
      </main>

      {/* 底部状态栏 */}
      <footer className={styles.footer}>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            <Type className={styles.statIcon} />
            {charCount} {t.fullscreen?.chars || 'chars'}
          </span>
          <span className={styles.statItem}>
            <Hash className={styles.statIcon} />
            {tokenCount} {t.fullscreen?.tokens || 'tokens'}
          </span>
        </div>

        <div className={styles.footerActions}>
          <span className={styles.shortcutHint}>
            <span className={styles.shortcutKey}>Esc</span> {t.fullscreen?.toClose || 'to close'}
          </span>
          <span className={styles.shortcutHint}>
            <span className={styles.shortcutKey}>⌘P</span> {t.fullscreen?.togglePreview || 'toggle preview'}
          </span>
        </div>
      </footer>
    </div>
  );

  // 使用 Portal 渲染到 body
  return createPortal(editorContent, document.body);
};

export const FullscreenEditor = memo(FullscreenEditorComponent);

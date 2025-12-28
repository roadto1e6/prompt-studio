// 文件路径: frontend/src/features/prompts/components/PromptEditor/index.tsx

/**
 * PromptEditor 视图层
 * 仅负责声明式 UI 结构
 */

import React, { memo } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button, Modal, Input } from '@/components/ui';
import { cn } from '@/utils';
import { usePromptEditor } from './usePromptEditor';
import styles from './index.module.css';

/**
 * PromptEditor 组件
 */
const PromptEditorComponent: React.FC = () => {
  const {
    prompt,
    systemPrompt,
    userTemplate,
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
    handleUserTemplateChange,
    handleSave,
    handleCopy,
    handleCreateVersion,
    handleSkipVersion,
    setChangeNote,
    setVersionType,
    getNextVersionNumber,
    getCurrentVersionNumber,
  } = usePromptEditor();

  if (!prompt) {
    return (
      <div className={styles.emptyState}>
        <p>{t.editor.selectPrompt}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* System Prompt Header */}
      <div className={styles.editorHeader}>
        <div className={styles.labelGroup}>
          <label className={styles.label}>
            {t.editor.systemPrompt}
          </label>
          <button
            onClick={handleCopy}
            disabled={!systemPrompt}
            className={styles.copyButton}
            title={t.editor.copyToClipboard}
          >
            {copied ? (
              <Check className={cn(styles.copyIcon, styles.copyIconSuccess)} />
            ) : (
              <Copy className={styles.copyIcon} />
            )}
          </button>
        </div>
        <div>
          {currentVersion && (
            <span className={styles.versionBadge}>
              v{currentVersion.versionNumber} ({t.editor.currentVersion})
            </span>
          )}
        </div>
      </div>

      {/* System Prompt Textarea */}
      <div className={styles.textareaWrapper}>
        <textarea
          value={systemPrompt}
          onChange={handleSystemPromptChange}
          className={styles.textarea}
          placeholder={t.editor.systemPromptPlaceholder}
        />
        <div className={styles.statsOverlay}>
          {t.editor.charsAndTokens.replace('{chars}', String(charCount)).replace('{tokens}', String(tokenCount))}
        </div>
      </div>

      {/* User Template */}
      <div className={styles.userTemplateSection}>
        <label className={styles.userTemplateLabel}>
          {t.editor.userTemplateOptional}
        </label>
        <textarea
          value={userTemplate}
          onChange={handleUserTemplateChange}
          className={styles.textareaSmall}
          placeholder={t.editor.userTemplatePlaceholder}
        />
      </div>

      {/* Save Button */}
      <div className={styles.saveSection}>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!isDirty}
        >
          {isDirty ? t.editor.saveChanges : t.editor.saved}
        </Button>
      </div>

      {/* Version Creation Modal */}
      <Modal
        isOpen={showVersionModal}
        onClose={handleSkipVersion}
        title={t.editor.createVersionModal.title}
      >
        <div className={styles.modalContent}>
          <p className={styles.modalDescription}>
            {t.editor.createVersionModal.description}
          </p>

          {/* Change Note Input */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {t.editor.createVersionModal.changeNote}
            </label>
            <Input
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              placeholder={t.editor.createVersionModal.changeNotePlaceholder}
              className="w-full"
            />
          </div>

          {/* Version Type Selection */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {t.editor.createVersionModal.versionType}
            </label>
            <div className={styles.versionTypeGroup}>
              <button
                onClick={() => setVersionType('minor')}
                className={cn(
                  styles.versionTypeButton,
                  versionType === 'minor' && styles.versionTypeButtonActive
                )}
              >
                <div className={styles.versionTypeTitle}>
                  {t.editor.createVersionModal.minorVersion}
                </div>
                <div className={styles.versionTypeVersion}>
                  {t.editor.createVersionModal.currentVersion
                    .replace('{current}', getCurrentVersionNumber())
                    .replace('{next}', getNextVersionNumber('minor'))}
                </div>
                <div className={styles.versionTypeDescription}>
                  {t.editor.createVersionModal.minorDescription}
                </div>
              </button>
              <button
                onClick={() => setVersionType('major')}
                className={cn(
                  styles.versionTypeButton,
                  versionType === 'major' && styles.versionTypeButtonActive
                )}
              >
                <div className={styles.versionTypeTitle}>
                  {t.editor.createVersionModal.majorVersion}
                </div>
                <div className={styles.versionTypeVersion}>
                  {t.editor.createVersionModal.currentVersion
                    .replace('{current}', getCurrentVersionNumber())
                    .replace('{next}', getNextVersionNumber('major'))}
                </div>
                <div className={styles.versionTypeDescription}>
                  {t.editor.createVersionModal.majorDescription}
                </div>
              </button>
            </div>
            <p className={styles.versionHint}>
              {t.editor.createVersionModal.versionHint}
            </p>
          </div>

          {/* Action Buttons */}
          <div className={styles.modalActions}>
            <Button
              variant="secondary"
              onClick={handleSkipVersion}
            >
              {t.editor.createVersionModal.skip}
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateVersion}
            >
              {t.editor.createVersionModal.create}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const PromptEditor = memo(PromptEditorComponent);

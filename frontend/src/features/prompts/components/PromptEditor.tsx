import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { usePromptStore, useI18nStore } from '@/stores';
import { Button, Modal, Input } from '@/components/ui';
import { estimateTokens, countChars, hasPromptChanged } from '@/utils';

export const PromptEditor: React.FC = () => {
  const { getActivePrompt, updatePrompt, createVersion } = usePromptStore();
  const { t } = useI18nStore();
  const prompt = getActivePrompt();

  const [systemPrompt, setSystemPrompt] = useState('');
  const [userTemplate, setUserTemplate] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);

  // Version creation modal state
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [changeNote, setChangeNote] = useState('');
  const [versionType, setVersionType] = useState<'major' | 'minor'>('minor');

  // Sync with selected prompt
  useEffect(() => {
    if (prompt) {
      setSystemPrompt(prompt.systemPrompt);
      setUserTemplate(prompt.userTemplate);
      setIsDirty(false);
    }
  }, [prompt?.id]);

  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
    setIsDirty(true);
  };

  const handleUserTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserTemplate(e.target.value);
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!prompt) return;

    // Check if content actually changed
    const currentVersion = prompt.versions.find(v => v.id === prompt.currentVersionId);
    const hasChanged = currentVersion && hasPromptChanged(
      { systemPrompt, userTemplate, model: prompt.model, temperature: prompt.temperature, maxTokens: prompt.maxTokens },
      currentVersion
    );

    // Update prompt
    updatePrompt(prompt.id, {
      systemPrompt,
      userTemplate,
    });

    // If content changed, show version creation modal
    if (hasChanged) {
      setShowVersionModal(true);
    } else {
      setIsDirty(false);
    }
  };

  const handleCreateVersion = async () => {
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
  };

  const handleSkipVersion = () => {
    setShowVersionModal(false);
    setChangeNote('');
    setVersionType('minor');
    setIsDirty(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(systemPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!prompt) {
    return (
      <div className="h-full flex items-center justify-center text-theme-text-muted">
        <p>{t.editor.selectPrompt}</p>
      </div>
    );
  }

  const charCount = countChars(systemPrompt);
  const tokenCount = estimateTokens(systemPrompt);
  const currentVersion = prompt.versions[0];

  return (
    <div className="h-full flex flex-col p-6">
      {/* System Prompt */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-theme-text-label uppercase tracking-wider">
            {t.editor.systemPrompt}
          </label>
          <button
            onClick={handleCopy}
            disabled={!systemPrompt}
            className="p-1 rounded text-theme-text-muted hover:text-theme-accent hover:bg-theme-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={t.editor.copyToClipboard}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <div className="flex gap-2">
          {currentVersion && (
            <span className="text-[10px] text-theme-text-muted bg-theme-bg-secondary px-2 py-0.5 rounded">
              v{currentVersion.versionNumber} ({t.editor.currentVersion})
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 relative mb-6 min-h-[200px]">
        <textarea
          value={systemPrompt}
          onChange={handleSystemPromptChange}
          className="w-full h-full bg-theme-input-bg border border-theme-input-border rounded-lg p-4 font-mono text-sm text-theme-input-text focus:outline-none focus:border-theme-accent resize-none leading-relaxed transition-colors"
          placeholder={t.editor.systemPromptPlaceholder}
        />
        <div className="absolute bottom-4 right-4 text-[10px] text-theme-text-muted bg-theme-bg-secondary px-2 py-1 rounded backdrop-blur-sm">
          {t.editor.charsAndTokens.replace('{chars}', String(charCount)).replace('{tokens}', String(tokenCount))}
        </div>
      </div>

      {/* User Template */}
      <div className="mb-2">
        <label className="text-xs font-bold text-theme-text-label uppercase tracking-wider mb-2 block">
          {t.editor.userTemplateOptional}
        </label>
        <textarea
          value={userTemplate}
          onChange={handleUserTemplateChange}
          className="w-full h-24 bg-theme-input-bg border border-theme-input-border rounded-lg p-3 font-mono text-sm text-theme-input-text focus:outline-none focus:border-theme-accent resize-none"
          placeholder={t.editor.userTemplatePlaceholder}
        />
      </div>

      {/* Save Button */}
      <div className="mt-4 flex justify-end">
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
        <div className="space-y-4">
          <p className="text-sm text-theme-text-secondary">
            {t.editor.createVersionModal.description}
          </p>

          {/* Change Note Input */}
          <div>
            <label className="text-xs font-bold text-theme-text-label uppercase tracking-wider mb-2 block">
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
          <div>
            <label className="text-xs font-bold text-theme-text-label uppercase tracking-wider mb-2 block">
              {t.editor.createVersionModal.versionType}
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setVersionType('minor')}
                className={`flex-1 px-4 py-3 rounded-lg border text-sm transition-all ${
                  versionType === 'minor'
                    ? 'bg-theme-accent/10 border-theme-accent text-theme-accent shadow-lg'
                    : 'bg-theme-card-bg border-theme-border text-theme-text-secondary hover:border-theme-card-hover-border'
                }`}
              >
                <div className="font-bold mb-1">{t.editor.createVersionModal.minorVersion}</div>
                <div className="text-xs text-theme-text-muted mb-1">
                  {prompt?.versions[0] ? (
                    <>
                      {t.editor.createVersionModal.currentVersion
                        .replace('{current}', prompt.versions.find(v => v.id === prompt.currentVersionId)?.versionNumber || '1.0')
                        .replace('{next}', (() => {
                          const current = prompt.versions.find(v => v.id === prompt.currentVersionId);
                          if (!current) return '1.1';
                          const [major, minor] = current.versionNumber.split('.');
                          return `${major}.${Number(minor) + 1}`;
                        })())}
                    </>
                  ) : t.editor.createVersionModal.currentVersion.replace('{current}', '1.0').replace('{next}', '1.1')}
                </div>
                <div className="text-xs text-theme-text-muted">{t.editor.createVersionModal.minorDescription}</div>
              </button>
              <button
                onClick={() => setVersionType('major')}
                className={`flex-1 px-4 py-3 rounded-lg border text-sm transition-all ${
                  versionType === 'major'
                    ? 'bg-theme-accent/10 border-theme-accent text-theme-accent shadow-lg'
                    : 'bg-theme-card-bg border-theme-border text-theme-text-secondary hover:border-theme-card-hover-border'
                }`}
              >
                <div className="font-bold mb-1">{t.editor.createVersionModal.majorVersion}</div>
                <div className="text-xs text-theme-text-muted mb-1">
                  {prompt?.versions[0] ? (
                    <>
                      {t.editor.createVersionModal.currentVersion
                        .replace('{current}', prompt.versions.find(v => v.id === prompt.currentVersionId)?.versionNumber || '1.0')
                        .replace('{next}', (() => {
                          const current = prompt.versions.find(v => v.id === prompt.currentVersionId);
                          if (!current) return '2.0';
                          const [major] = current.versionNumber.split('.');
                          return `${Number(major) + 1}.0`;
                        })())}
                    </>
                  ) : t.editor.createVersionModal.currentVersion.replace('{current}', '1.0').replace('{next}', '2.0')}
                </div>
                <div className="text-xs text-theme-text-muted">{t.editor.createVersionModal.majorDescription}</div>
              </button>
            </div>
            <p className="text-xs text-theme-text-muted mt-2">
              {t.editor.createVersionModal.versionHint}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={handleSkipVersion}
              className="flex-1"
            >
              {t.editor.createVersionModal.skip}
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateVersion}
              className="flex-1"
            >
              {t.editor.createVersionModal.create}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

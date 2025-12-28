// 文件路径: frontend/src/features/prompts/components/PromptVersions/usePromptVersions.ts

/**
 * PromptVersions 逻辑层
 * 封装所有状态和处理器
 */

import { useState, useMemo, useCallback } from 'react';
import { diffLines, type Change } from 'diff';
import { usePromptStore, useUIStore, useI18nStore } from '@/stores';
import type { PromptVersion } from '@/types';
import type { UsePromptVersionsReturn, VersionDiffStats } from './types';

/**
 * 分割文本为行数组
 */
const splitLines = (value: string): string[] => {
  const lines = value.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines.length ? lines : [''];
};

/**
 * 获取 Change 行数
 */
const getLineCount = (change: Change): number => {
  if (typeof change.count === 'number') return change.count;
  if (!change.value) return 0;
  return splitLines(change.value).length;
};

/**
 * 排序版本列表
 */
const sortVersions = (versions: PromptVersion[]): PromptVersion[] => {
  return [...versions].sort((a, b) => {
    const aTime = Date.parse(a.createdAt);
    const bTime = Date.parse(b.createdAt);

    if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
      return bTime - aTime;
    }

    const [aMajor, aMinor] = (a.versionNumber || '0.0').split('.').map(Number);
    const [bMajor, bMinor] = (b.versionNumber || '0.0').split('.').map(Number);

    if (aMajor !== bMajor) return bMajor - aMajor;
    if (aMinor !== bMinor) return bMinor - aMinor;

    return b.id.localeCompare(a.id);
  });
};

/**
 * PromptVersions Hook
 */
export function usePromptVersions(): UsePromptVersionsReturn {
  // Store 依赖
  const { getActivePrompt, restoreVersion, deleteVersion, restoreDeletedVersion, permanentDeleteVersion } = usePromptStore();
  const { showConfirm } = useUIStore();
  const { t } = useI18nStore();

  // 本地状态
  const [viewingVersion, setViewingVersion] = useState<PromptVersion | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeletedVersions, setShowDeletedVersions] = useState(false);

  // 派生数据
  const prompt = getActivePrompt();

  const { activeVersions, deletedVersions } = useMemo(() => {
    if (!prompt) return { activeVersions: [], deletedVersions: [] };

    const active = prompt.versions.filter((v: PromptVersion) => !v.deleted);
    const deleted = prompt.versions.filter((v: PromptVersion) => v.deleted);

    return {
      activeVersions: sortVersions(active),
      deletedVersions: sortVersions(deleted),
    };
  }, [prompt?.versions]);

  // 计算 Diff 统计
  const versionDiffs = useMemo(() => {
    if (!activeVersions.length) return new Map<string, VersionDiffStats>();

    const diffs = new Map<string, VersionDiffStats>();

    for (let i = 0; i < activeVersions.length - 1; i++) {
      const current = activeVersions[i];
      const previous = activeVersions[i + 1];
      const changes = diffLines(previous.systemPrompt || '', current.systemPrompt || '');

      let added = 0;
      let removed = 0;

      changes.forEach((change) => {
        const lineCount = getLineCount(change);
        if (change.added) added += lineCount;
        if (change.removed) removed += lineCount;
      });

      diffs.set(current.id, { added, removed });
    }

    return diffs;
  }, [activeVersions]);

  // 处理器
  const handleRestore = useCallback((versionId: string, versionNumber: string) => {
    if (!prompt) return;

    showConfirm({
      title: t.versions.modal.restoreConfirm.title,
      message: t.versions.modal.restoreConfirm.message.replace('{version}', versionNumber),
      confirmText: t.versions.modal.restoreConfirm.confirmText,
      cancelText: t.versions.modal.restoreConfirm.cancelText,
      variant: 'warning',
      onConfirm: () => {
        restoreVersion(prompt.id, versionId);
        setViewingVersion(null);
      },
    });
  }, [prompt, showConfirm, t, restoreVersion]);

  const handleDelete = useCallback((versionId: string, versionNumber: string) => {
    if (!prompt) return;

    showConfirm({
      title: t.versions.modal.deleteConfirm.title,
      message: t.versions.modal.deleteConfirm.message.replace('{version}', versionNumber),
      confirmText: t.versions.modal.deleteConfirm.confirmText,
      cancelText: t.versions.modal.deleteConfirm.cancelText,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteVersion(prompt.id, versionId);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to delete version';
          showConfirm({
            title: t.common?.error || 'Error',
            message: t.versions.errors[message as keyof typeof t.versions.errors] || message,
            confirmText: t.common?.ok || 'OK',
            variant: 'danger',
            onConfirm: () => {},
          });
        }
      },
    });
  }, [prompt, showConfirm, t, deleteVersion]);

  const handleRestoreDeleted = useCallback((versionId: string, versionNumber: string) => {
    if (!prompt) return;

    showConfirm({
      title: t.versions.modal.restoreDeletedConfirm.title,
      message: t.versions.modal.restoreDeletedConfirm.message.replace('{version}', versionNumber),
      confirmText: t.versions.modal.restoreDeletedConfirm.confirmText,
      cancelText: t.versions.modal.restoreDeletedConfirm.cancelText,
      variant: 'warning',
      onConfirm: async () => {
        try {
          await restoreDeletedVersion(prompt.id, versionId);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to restore version';
          showConfirm({
            title: t.common?.error || 'Error',
            message,
            confirmText: t.common?.ok || 'OK',
            variant: 'danger',
            onConfirm: () => {},
          });
        }
      },
    });
  }, [prompt, showConfirm, t, restoreDeletedVersion]);

  const handlePermanentDelete = useCallback((versionId: string, versionNumber: string) => {
    if (!prompt) return;

    showConfirm({
      title: t.versions.modal.permanentDeleteConfirm.title,
      message: t.versions.modal.permanentDeleteConfirm.message.replace('{version}', versionNumber),
      confirmText: t.versions.modal.permanentDeleteConfirm.confirmText,
      cancelText: t.versions.modal.permanentDeleteConfirm.cancelText,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await permanentDeleteVersion(prompt.id, versionId);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to permanently delete version';
          showConfirm({
            title: t.common?.error || 'Error',
            message,
            confirmText: t.common?.ok || 'OK',
            variant: 'danger',
            onConfirm: () => {},
          });
        }
      },
    });
  }, [prompt, showConfirm, t, permanentDeleteVersion]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setViewingVersion(null);
    setShowDiff(false);
  }, []);

  const toggleDiff = useCallback(() => {
    setShowDiff(prev => !prev);
  }, []);

  return {
    prompt,
    activeVersions,
    deletedVersions,
    versionDiffs,
    viewingVersion,
    showDiff,
    copied,
    showDeletedVersions,
    t,
    setViewingVersion,
    setShowDiff,
    setShowDeletedVersions,
    handleRestore,
    handleDelete,
    handleRestoreDeleted,
    handlePermanentDelete,
    handleCopy,
    handleCloseModal,
    toggleDiff,
  };
}

/**
 * 计算到期天数
 */
export function calculateDaysUntilExpiration(deletedAt: string): number {
  const deletedDate = new Date(deletedAt);
  const expirationDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  return Math.max(0, daysRemaining);
}

/**
 * 计算 Diff
 */
export function computeDiff(oldText: string, newText: string) {
  return diffLines(oldText || '', newText || '').flatMap((change) => {
    const type = change.added ? 'added' : change.removed ? 'removed' : 'same';
    return splitLines(change.value).map((text) => ({ type, text }));
  });
}

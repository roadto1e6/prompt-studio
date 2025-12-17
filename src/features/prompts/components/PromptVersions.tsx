import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { diffLines, type Change } from 'diff';
import { X, Copy, Check, RotateCcw, Eye, GitCompare, Trash2, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { usePromptStore, useUIStore, useI18nStore, useThemeStore } from '@/stores';
import { formatRelativeTime, cn } from '@/utils';
import { Badge, Button } from '@/components/ui';
import { PromptVersion } from '@/types';

type DiffLine = { type: 'same' | 'added' | 'removed'; text: string };

const splitLines = (value: string): string[] => {
  const lines = value.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines.length ? lines : [''];
};

// Calculate days until auto-deletion (30 days after deletion)
const calculateDaysUntilExpiration = (deletedAt: string): number => {
  const deletedDate = new Date(deletedAt);
  const expirationDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  return Math.max(0, daysRemaining);
};

const getLineCount = (change: Change): number => {
  if (typeof change.count === 'number') return change.count;
  if (!change.value) return 0;
  return splitLines(change.value).length;
};

// Use a battle-tested diff library to compare versions accurately
function computeDiff(oldText: string, newText: string): DiffLine[] {
  return diffLines(oldText || '', newText || '').flatMap((change) => {
    const type: DiffLine['type'] = change.added ? 'added' : change.removed ? 'removed' : 'same';
    return splitLines(change.value).map((text) => ({ type, text }));
  });
}

// Version Modal Component
interface VersionModalProps {
  viewingVersion: PromptVersion | null;
  versions: PromptVersion[];
  currentVersionId: string;
  showDiff: boolean;
  copied: boolean;
  versionDiffs: Map<string, { added: number; removed: number }>;
  t: any;
  onClose: () => void;
  onToggleDiff: () => void;
  onRestore: (versionId: string, versionNumber: string) => void;
  onCopy: (text: string) => void;
}

const VersionModal: React.FC<VersionModalProps> = ({
  viewingVersion,
  versions,
  currentVersionId,
  showDiff,
  copied,
  versionDiffs,
  t,
  onClose,
  onToggleDiff,
  onRestore,
  onCopy,
}) => {
  if (!viewingVersion) return null;

  const versionIndex = versions.findIndex(v => v.id === viewingVersion.id);
  const previousVersion = versionIndex < versions.length - 1 ? versions[versionIndex + 1] : null;
  const diff = previousVersion ? computeDiff(previousVersion.systemPrompt, viewingVersion.systemPrompt) : null;
  const hasChanges = diff && diff.some(d => d.type !== 'same');
  const changedFields = previousVersion ? [
    previousVersion.systemPrompt !== viewingVersion.systemPrompt ? 'System Prompt' : null,
    previousVersion.userTemplate !== viewingVersion.userTemplate ? 'User Template' : null,
    previousVersion.model !== viewingVersion.model ? 'Model' : null,
    previousVersion.temperature !== viewingVersion.temperature ? 'Temperature' : null,
    previousVersion.maxTokens !== viewingVersion.maxTokens ? 'Max Tokens' : null,
  ].filter(Boolean) : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-dark-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <h3 className="text-white font-semibold">
                {t.versions.modal.version.replace('{number}', viewingVersion.versionNumber)}
              </h3>
              {viewingVersion.id === currentVersionId && (
                <Badge variant="primary" size="sm">{t.versions.current}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <button
                  onClick={onToggleDiff}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
                    showDiff
                      ? 'bg-theme-accent/10 text-theme-accent'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  {t.versions.diff}
                </button>
              )}
              {viewingVersion.id !== currentVersionId && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onRestore(viewingVersion.id, viewingVersion.versionNumber)}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  {t.versions.restore}
                </Button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 flex-wrap">
              <span>{t.versions.createdAgo.replace('{time}', formatRelativeTime(viewingVersion.createdAt))}</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">{viewingVersion.model}</span>
              <span>Temperature: {viewingVersion.temperature}</span>
              <span>Max Tokens: {viewingVersion.maxTokens}</span>
              {versionDiffs.get(viewingVersion.id) && (
                <span>
                  <span className="text-emerald-400">+{versionDiffs.get(viewingVersion.id)!.added}</span>
                  {' '}
                  <span className="text-red-400">-{versionDiffs.get(viewingVersion.id)!.removed}</span>
                  {' lines'}
                </span>
              )}
            </div>

            {changedFields.length > 0 && (
              <div className="flex items-center gap-2 mb-4 text-xs text-slate-300 flex-wrap">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.versions.changed}</span>
                {changedFields.map(field => (
                  <span key={field} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                    {field}
                  </span>
                ))}
              </div>
            )}

            {/* Change Note */}
            <div className="mb-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                {t.versions.changeNote}
              </label>
              <p className="text-sm text-slate-400">{viewingVersion.changeNote}</p>
            </div>

            {/* System Prompt */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {showDiff && previousVersion
                    ? t.versions.modal.changesFrom.replace('{version}', previousVersion.versionNumber)
                    : t.versions.modal.systemPrompt}
                </label>
                <button
                  onClick={() => onCopy(viewingVersion.systemPrompt)}
                  className="p-1 rounded text-slate-500 hover:text-theme-accent hover:bg-slate-700 transition-colors"
                  title={t.versions.copyToClipboard}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {showDiff && diff ? (
                <div className="bg-dark-900 border border-slate-700 rounded-lg p-4 font-mono text-sm max-h-60 overflow-y-auto">
                  {diff.map((line, i) => (
                    <div
                      key={i}
                      className={cn(
                        'px-2 -mx-2',
                        line.type === 'added' && 'bg-emerald-500/10 text-emerald-300',
                        line.type === 'removed' && 'bg-red-500/10 text-red-300 line-through',
                        line.type === 'same' && 'text-slate-400'
                      )}
                    >
                      <span className="select-none mr-2 text-slate-600">
                        {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                      </span>
                      {line.text || ' '}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-dark-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {viewingVersion.systemPrompt || <span className="text-slate-600 italic">{t.versions.modal.noSystemPrompt}</span>}
                </div>
              )}
            </div>

            {/* User Template */}
            {viewingVersion.userTemplate && (
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  {t.versions.modal.userTemplate}
                </label>
                <div className="bg-dark-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {viewingVersion.userTemplate}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PromptVersions: React.FC = () => {
  const { getActivePrompt, restoreVersion, deleteVersion, restoreDeletedVersion, permanentDeleteVersion } = usePromptStore();
  const { showConfirm } = useUIStore();
  const { t } = useI18nStore();
  const { theme } = useThemeStore();
  const prompt = getActivePrompt();
  const [viewingVersion, setViewingVersion] = useState<PromptVersion | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeletedVersions, setShowDeletedVersions] = useState(false);

  const isDark = theme === 'dark';

  // 获取背景色用于 ring
  const getRingColor = () => {
    if (isDark) return 'ring-dark-900';
    // 亮模式下使用页面背景色
    return 'ring-white';
  };

  const { activeVersions, deletedVersions } = useMemo(() => {
    if (!prompt) return { activeVersions: [], deletedVersions: [] };

    const sortVersions = (versions: PromptVersion[]) => {
      return [...versions].sort((a, b) => {
        const aTime = Date.parse(a.createdAt);
        const bTime = Date.parse(b.createdAt);

        if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
          return bTime - aTime; // newest first
        }

        const [aMajor, aMinor] = (a.versionNumber || '0.0').split('.').map(Number);
        const [bMajor, bMinor] = (b.versionNumber || '0.0').split('.').map(Number);

        if (aMajor !== bMajor) return bMajor - aMajor;
        if (aMinor !== bMinor) return bMinor - aMinor;

        return b.id.localeCompare(a.id);
      });
    };

    const active = prompt.versions.filter(v => !v.deleted);
    const deleted = prompt.versions.filter(v => v.deleted);

    return {
      activeVersions: sortVersions(active),
      deletedVersions: sortVersions(deleted),
    };
  }, [prompt?.versions]);

  // Calculate diff stats for each version compared to previous
  const versionDiffs = useMemo(() => {
    if (!activeVersions.length) return new Map<string, { added: number; removed: number }>();

    const diffs = new Map<string, { added: number; removed: number }>();
    const versions = activeVersions;

    for (let i = 0; i < versions.length - 1; i++) {
      const current = versions[i];
      const previous = versions[i + 1];
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

  if (!prompt) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <p>{t.versions.selectPrompt}</p>
      </div>
    );
  }

  const handleRestore = (versionId: string, versionNumber: string) => {
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
  };

  const handleDelete = (versionId: string, versionNumber: string) => {
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
          // Show error message using confirm dialog
          showConfirm({
            title: 'Error',
            message: t.versions.errors[message as keyof typeof t.versions.errors] || message,
            confirmText: 'OK',
            variant: 'danger',
            onConfirm: () => {},
          });
        }
      },
    });
  };

  const handleRestoreDeleted = (versionId: string, versionNumber: string) => {
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
            title: 'Error',
            message,
            confirmText: 'OK',
            variant: 'danger',
            onConfirm: () => {},
          });
        }
      },
    });
  };

  const handlePermanentDelete = (versionId: string, versionNumber: string) => {
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
            title: 'Error',
            message,
            confirmText: 'OK',
            variant: 'danger',
            onConfirm: () => {},
          });
        }
      },
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {t.versions.activeVersions || t.versions.title}
        </h3>
        <span className="text-xs text-slate-600">
          {activeVersions.length > 1
            ? t.versions.versionCountPlural.replace('{count}', String(activeVersions.length))
            : t.versions.versionCount.replace('{count}', String(activeVersions.length))}
        </span>
      </div>

      {/* Active Versions Timeline */}
      <div className="space-y-4 mb-8">
        {activeVersions.map((version, index) => {
          const isCurrent = version.id === prompt.currentVersionId;

          return (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'relative pl-6 border-l-2',
                isCurrent
                  ? 'border-theme-accent'
                  : isDark ? 'border-slate-800' : 'border-slate-300'
              )}
            >
              {/* Timeline Dot */}
              <div
                className={cn(
                  'absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ring-4',
                  getRingColor(),
                  isCurrent ? 'bg-theme-accent' : isDark ? 'bg-slate-600' : 'bg-slate-400'
                )}
              />

              {/* Version Card */}
              <div
                className={cn(
                  'p-4 rounded-lg border transition-colors',
                  isCurrent
                    ? isDark
                      ? 'bg-dark-800 border-slate-700'
                      : 'bg-white border-slate-300'
                    : isDark
                      ? 'bg-dark-800/50 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                )}
              >
                {/* Version Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-sm font-bold',
                      isCurrent
                        ? isDark ? 'text-white' : 'text-slate-900'
                        : isDark ? 'text-slate-300' : 'text-slate-700'
                    )}>
                      v{version.versionNumber}
                    </span>
                    {isCurrent && (
                      <Badge variant="primary" size="sm">{t.versions.current}</Badge>
                    )}
                  </div>
                  <span className={cn(
                    'text-xs',
                    isCurrent
                      ? isDark ? 'text-slate-500' : 'text-slate-600'
                      : isDark ? 'text-slate-600' : 'text-slate-500'
                  )}>
                    {t.versions.timeAgo.replace('{time}', formatRelativeTime(version.createdAt))}
                  </span>
                </div>

                {/* Change Note */}
                <p className={cn(
                  'text-xs mb-3',
                  isCurrent
                    ? isDark ? 'text-slate-400' : 'text-slate-600'
                    : isDark ? 'text-slate-500' : 'text-slate-600'
                )}>
                  {version.changeNote}
                </p>

                {/* Diff Stats & Model Info */}
                <div className={cn(
                  'flex items-center gap-2 mb-3 text-[10px] flex-wrap',
                  isDark ? 'text-slate-600' : 'text-slate-500'
                )}>
                  {versionDiffs.get(version.id) && (
                    <>
                      <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>
                        +{versionDiffs.get(version.id)!.added}
                      </span>
                      <span className={isDark ? 'text-red-400' : 'text-red-600'}>
                        -{versionDiffs.get(version.id)!.removed}
                      </span>
                      <span className={isDark ? 'text-slate-700' : 'text-slate-400'}>|</span>
                    </>
                  )}
                  <span className={cn(
                    'px-1.5 py-0.5 rounded',
                    isDark ? 'bg-slate-800' : 'bg-slate-200'
                  )}>{version.model}</span>
                  <span>{t.versions.temp.replace('{value}', String(version.temperature))}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-[10px] px-2 py-1"
                    onClick={() => { setViewingVersion(version); setShowDiff(true); }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    {t.versions.view}
                  </Button>
                  {!isCurrent && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-[10px] px-2 py-1"
                        onClick={() => handleRestore(version.id, version.versionNumber)}
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        {t.versions.restore}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className={cn(
                          'text-[10px] px-2 py-1',
                          isDark
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        )}
                        onClick={() => handleDelete(version.id, version.versionNumber)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        {t.versions.delete}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Deleted Versions Section */}
      {deletedVersions.length > 0 && (
        <div className="mt-8">
          {/* Collapsible Header */}
          <button
            onClick={() => setShowDeletedVersions(!showDeletedVersions)}
            className="group w-full flex items-center justify-between mb-6 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              {showDeletedVersions ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.versions.deletedVersions}
              </h3>
              <span className="text-xs text-slate-600">
                {deletedVersions.length}
              </span>
            </div>
            <span className="text-[10px] text-slate-600">
              {t.versions.autoDeleteWarning}
            </span>
          </button>

          {/* Deleted Versions List */}
          <AnimatePresence>
            {showDeletedVersions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {deletedVersions.map((version, index) => {
                  const daysLeft = version.deletedAt ? calculateDaysUntilExpiration(version.deletedAt) : 0;

                  return (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'relative pl-6 border-l-2',
                        isDark ? 'border-slate-800' : 'border-slate-300'
                      )}
                    >
                      {/* Timeline Dot */}
                      <div className={cn(
                        'absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ring-4',
                        getRingColor(),
                        isDark ? 'bg-slate-600' : 'bg-slate-400'
                      )} />

                      {/* Version Card */}
                      <div className={cn(
                        'p-4 rounded-lg border transition-colors',
                        isDark
                          ? 'bg-dark-800/50 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      )}>
                        {/* Version Header */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'text-sm font-bold',
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            )}>
                              v{version.versionNumber}
                            </span>
                            <Badge variant="danger" size="sm">{t.versions.deleted}</Badge>
                            {version.deletedAt && (
                              <div className={cn(
                                'flex items-center gap-1 text-[10px]',
                                isDark ? 'text-amber-400' : 'text-amber-600'
                              )}>
                                <Clock className="w-3 h-3" />
                                <span>
                                  {daysLeft === 0
                                    ? t.versions.expiresToday
                                    : t.versions.expiresIn.replace('{days}', String(daysLeft))}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className={cn(
                            'text-xs',
                            isDark ? 'text-slate-600' : 'text-slate-500'
                          )}>
                            {t.versions.timeAgo.replace('{time}', formatRelativeTime(version.createdAt))}
                          </span>
                        </div>

                        {/* Change Note */}
                        <p className={cn(
                          'text-xs mb-3',
                          isDark ? 'text-slate-500' : 'text-slate-600'
                        )}>
                          {version.changeNote}
                        </p>

                        {/* Model Info */}
                        <div className={cn(
                          'flex items-center gap-2 mb-3 text-[10px] flex-wrap',
                          isDark ? 'text-slate-600' : 'text-slate-500'
                        )}>
                          <span className={cn(
                            'px-1.5 py-0.5 rounded',
                            isDark ? 'bg-slate-800' : 'bg-slate-200'
                          )}>{version.model}</span>
                          <span>{t.versions.temp.replace('{value}', String(version.temperature))}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-[10px] px-2 py-1"
                            onClick={() => { setViewingVersion(version); setShowDiff(false); }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            {t.versions.view}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-[10px] px-2 py-1"
                            onClick={() => handleRestoreDeleted(version.id, version.versionNumber)}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            {t.versions.restore}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className={cn(
                              'text-[10px] px-2 py-1',
                              isDark
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                            )}
                            onClick={() => handlePermanentDelete(version.id, version.versionNumber)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            {t.versions.permanentDelete}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Version View Modal */}
      <VersionModal
        viewingVersion={viewingVersion}
        versions={activeVersions}
        currentVersionId={prompt.currentVersionId}
        showDiff={showDiff}
        copied={copied}
        versionDiffs={versionDiffs}
        t={t}
        onClose={() => { setViewingVersion(null); setShowDiff(false); }}
        onToggleDiff={() => setShowDiff(!showDiff)}
        onRestore={handleRestore}
        onCopy={handleCopy}
      />
    </div>
  );
};

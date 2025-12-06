import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, RotateCcw, Eye, GitCompare } from 'lucide-react';
import { usePromptStore, useUIStore } from '@/stores';
import { formatRelativeTime, cn } from '@/utils';
import { Badge, Button } from '@/components/ui';
import { PromptVersion } from '@/types';

// Simple diff algorithm to find changes between two strings
function computeDiff(oldText: string, newText: string): { type: 'same' | 'added' | 'removed'; text: string }[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const diff: { type: 'same' | 'added' | 'removed'; text: string }[] = [];

  let oldIndex = 0;
  let newIndex = 0;

  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    if (oldIndex >= oldLines.length) {
      // Remaining new lines are additions
      diff.push({ type: 'added', text: newLines[newIndex] });
      newIndex++;
    } else if (newIndex >= newLines.length) {
      // Remaining old lines are removals
      diff.push({ type: 'removed', text: oldLines[oldIndex] });
      oldIndex++;
    } else if (oldLines[oldIndex] === newLines[newIndex]) {
      // Lines are the same
      diff.push({ type: 'same', text: oldLines[oldIndex] });
      oldIndex++;
      newIndex++;
    } else {
      // Lines are different - check if it's a modification or insertion/deletion
      const oldInNew = newLines.indexOf(oldLines[oldIndex], newIndex);
      const newInOld = oldLines.indexOf(newLines[newIndex], oldIndex);

      if (oldInNew === -1 && newInOld === -1) {
        // Both lines are unique - treat as removal then addition
        diff.push({ type: 'removed', text: oldLines[oldIndex] });
        diff.push({ type: 'added', text: newLines[newIndex] });
        oldIndex++;
        newIndex++;
      } else if (oldInNew === -1 || (newInOld !== -1 && newInOld < oldInNew)) {
        // Old line was removed
        diff.push({ type: 'removed', text: oldLines[oldIndex] });
        oldIndex++;
      } else {
        // New line was added
        diff.push({ type: 'added', text: newLines[newIndex] });
        newIndex++;
      }
    }
  }

  return diff;
}

// Version Modal Component
interface VersionModalProps {
  viewingVersion: PromptVersion | null;
  prompt: { versions: PromptVersion[]; currentVersionId: string };
  showDiff: boolean;
  copied: boolean;
  versionDiffs: Map<string, { added: number; removed: number }>;
  onClose: () => void;
  onToggleDiff: () => void;
  onRestore: (versionId: string, versionNumber: string) => void;
  onCopy: (text: string) => void;
}

const VersionModal: React.FC<VersionModalProps> = ({
  viewingVersion,
  prompt,
  showDiff,
  copied,
  versionDiffs,
  onClose,
  onToggleDiff,
  onRestore,
  onCopy,
}) => {
  if (!viewingVersion) return null;

  const versionIndex = prompt.versions.findIndex(v => v.id === viewingVersion.id);
  const previousVersion = versionIndex < prompt.versions.length - 1 ? prompt.versions[versionIndex + 1] : null;
  const diff = previousVersion ? computeDiff(previousVersion.systemPrompt, viewingVersion.systemPrompt) : null;
  const hasChanges = diff && diff.some(d => d.type !== 'same');

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
                Version {viewingVersion.versionNumber}
              </h3>
              {viewingVersion.id === prompt.currentVersionId && (
                <Badge variant="primary" size="sm">Current</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <button
                  onClick={onToggleDiff}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
                    showDiff
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  Diff
                </button>
              )}
              {viewingVersion.id !== prompt.currentVersionId && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onRestore(viewingVersion.id, viewingVersion.versionNumber)}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Restore
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
              <span>Created {formatRelativeTime(viewingVersion.createdAt)} ago</span>
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

            {/* Change Note */}
            <div className="mb-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                Change Note
              </label>
              <p className="text-sm text-slate-400">{viewingVersion.changeNote}</p>
            </div>

            {/* System Prompt */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {showDiff && previousVersion ? `Changes from v${previousVersion.versionNumber}` : 'System Prompt'}
                </label>
                <button
                  onClick={() => onCopy(viewingVersion.systemPrompt)}
                  className="p-1 rounded text-slate-500 hover:text-indigo-400 hover:bg-slate-700 transition-colors"
                  title="Copy to clipboard"
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
                  {viewingVersion.systemPrompt || <span className="text-slate-600 italic">No system prompt</span>}
                </div>
              )}
            </div>

            {/* User Template */}
            {viewingVersion.userTemplate && (
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  User Template
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
  const { getActivePrompt, restoreVersion } = usePromptStore();
  const { showConfirm } = useUIStore();
  const prompt = getActivePrompt();
  const [viewingVersion, setViewingVersion] = useState<PromptVersion | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate diff stats for each version compared to previous
  const versionDiffs = useMemo(() => {
    if (!prompt) return new Map<string, { added: number; removed: number }>();

    const diffs = new Map<string, { added: number; removed: number }>();
    const versions = prompt.versions;

    for (let i = 0; i < versions.length - 1; i++) {
      const current = versions[i];
      const previous = versions[i + 1];
      const diff = computeDiff(previous.systemPrompt, current.systemPrompt);

      const added = diff.filter(d => d.type === 'added').length;
      const removed = diff.filter(d => d.type === 'removed').length;

      diffs.set(current.id, { added, removed });
    }

    return diffs;
  }, [prompt?.versions]);

  if (!prompt) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <p>Select a prompt to view version history</p>
      </div>
    );
  }

  const handleRestore = (versionId: string, versionNumber: string) => {
    showConfirm({
      title: 'Restore Version',
      message: `Are you sure you want to restore version ${versionNumber}? This will overwrite the current prompt content.`,
      confirmText: 'Restore',
      cancelText: 'Cancel',
      variant: 'warning',
      onConfirm: () => {
        restoreVersion(prompt.id, versionId);
        setViewingVersion(null);
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
          Version History
        </h3>
        <span className="text-xs text-slate-600">
          {prompt.versions.length} version{prompt.versions.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {prompt.versions.map((version, index) => {
          const isCurrent = version.id === prompt.currentVersionId;

          return (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'relative pl-6',
                'border-l-2',
                isCurrent ? 'border-indigo-500' : 'border-slate-800'
              )}
            >
              {/* Timeline Dot */}
              <div
                className={cn(
                  'absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ring-4 ring-dark-900',
                  isCurrent ? 'bg-indigo-500' : 'bg-slate-600'
                )}
              />

              {/* Version Card */}
              <div
                className={cn(
                  'p-4 rounded-lg border transition-colors',
                  isCurrent
                    ? 'bg-dark-800 border-slate-700'
                    : 'bg-dark-800/50 border-slate-800 hover:border-slate-700'
                )}
              >
                {/* Version Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-sm font-bold',
                      isCurrent ? 'text-white' : 'text-slate-300'
                    )}>
                      v{version.versionNumber}
                    </span>
                    {isCurrent && (
                      <Badge variant="primary" size="sm">Current</Badge>
                    )}
                  </div>
                  <span className={cn(
                    'text-xs',
                    isCurrent ? 'text-slate-500' : 'text-slate-600'
                  )}>
                    {formatRelativeTime(version.createdAt)} ago
                  </span>
                </div>

                {/* Change Note */}
                <p className={cn(
                  'text-xs mb-3',
                  isCurrent ? 'text-slate-400' : 'text-slate-500'
                )}>
                  {version.changeNote}
                </p>

                {/* Diff Stats & Model Info */}
                <div className="flex items-center gap-2 mb-3 text-[10px] text-slate-600 flex-wrap">
                  {versionDiffs.get(version.id) && (
                    <>
                      <span className="text-emerald-400">+{versionDiffs.get(version.id)!.added}</span>
                      <span className="text-red-400">-{versionDiffs.get(version.id)!.removed}</span>
                      <span className="text-slate-700">|</span>
                    </>
                  )}
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded">{version.model}</span>
                  <span>temp: {version.temperature}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-[10px] px-2 py-1"
                    onClick={() => setViewingVersion(version)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  {!isCurrent && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-[10px] px-2 py-1"
                      onClick={() => handleRestore(version.id, version.versionNumber)}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Version View Modal */}
      <VersionModal
        viewingVersion={viewingVersion}
        prompt={prompt}
        showDiff={showDiff}
        copied={copied}
        versionDiffs={versionDiffs}
        onClose={() => { setViewingVersion(null); setShowDiff(false); }}
        onToggleDiff={() => setShowDiff(!showDiff)}
        onRestore={handleRestore}
        onCopy={handleCopy}
      />
    </div>
  );
};

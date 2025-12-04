import React from 'react';
import { motion } from 'framer-motion';
import { usePromptStore } from '@/stores';
import { formatRelativeTime, cn } from '@/utils';
import { Badge, Button } from '@/components/ui';

export const PromptVersions: React.FC = () => {
  const { getActivePrompt, restoreVersion } = usePromptStore();
  const prompt = getActivePrompt();

  if (!prompt) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <p>Select a prompt to view version history</p>
      </div>
    );
  }

  const handleRestore = (versionId: string) => {
    if (confirm('Are you sure you want to restore this version?')) {
      restoreVersion(prompt.id, versionId);
    }
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Version History
        </h3>
        <button className="text-indigo-400 hover:text-indigo-300 text-xs font-medium">
          Compare
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {prompt.versions.map((version, index) => {
          const isCurrent = index === 0;
          
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

                {/* Diff Preview (for non-current versions) */}
                {!isCurrent && index === 1 && (
                  <div className="bg-dark-900 rounded p-2 text-[10px] font-mono mb-3 border border-slate-800/50">
                    <div className="text-slate-500">
                      <span className="bg-red-500/20 text-red-300 px-1 rounded line-through">
                        Twiter
                      </span>
                      {' → '}
                      <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded">
                        Twitter
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-[10px] px-2 py-1"
                  >
                    View
                  </Button>
                  {!isCurrent && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-[10px] px-2 py-1"
                      onClick={() => handleRestore(version.id)}
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

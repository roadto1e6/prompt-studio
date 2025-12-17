import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, RotateCcw, Share2 } from 'lucide-react';
import { usePromptStore, useCollectionStore, useUIStore, useI18nStore } from '@/stores';
import { Tabs, TabPanel } from '@/components/ui';
import { PromptEditor } from './PromptEditor';
import { PromptMetadata } from './PromptMetadata';
import { PromptVersions } from './PromptVersions';
import { cn } from '@/utils';

export const PromptDetailPanel: React.FC = () => {
  const { getActivePrompt, restoreFromTrash, permanentDelete, updatePrompt } = usePromptStore();
  const { getCollectionById } = useCollectionStore();
  const { detailPanelOpen, activeTab, setActiveTab, closeDetailPanel, showConfirm, openModal } = useUIStore();
  const { t } = useI18nStore();

  const TABS = [
    { id: 'editor', label: t.detailPanel.tabs.editor },
    { id: 'metadata', label: t.detailPanel.tabs.metadata },
    { id: 'versions', label: t.detailPanel.tabs.versions },
  ];

  const prompt = getActivePrompt();
  const collection = prompt?.collectionId ? getCollectionById(prompt.collectionId) : null;
  const isInTrash = prompt?.status === 'trash';

  // Local state for title input with debounced save
  const [localTitle, setLocalTitle] = useState('');
  const titleDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync local title with prompt title only when switching prompts
  useEffect(() => {
    if (prompt) {
      setLocalTitle(prompt.title);
    }
  }, [prompt?.id]);  // 只在切换 prompt 时同步，不在 title 更新时同步

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);

    // Clear existing timeout
    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
    }

    // Set new timeout to save after 500ms of no typing
    titleDebounceRef.current = setTimeout(() => {
      if (prompt && newTitle !== prompt.title) {
        updatePrompt(prompt.id, { title: newTitle });
      }
    }, 500);
  };

  // Save on blur as well
  const handleTitleBlur = () => {
    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
    }
    if (prompt && localTitle !== prompt.title) {
      updatePrompt(prompt.id, { title: localTitle });
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (titleDebounceRef.current) {
        clearTimeout(titleDebounceRef.current);
      }
    };
  }, []);

  const handleRestore = () => {
    if (prompt) {
      restoreFromTrash(prompt.id);
      closeDetailPanel();
    }
  };

  const handlePermanentDelete = () => {
    if (prompt) {
      showConfirm({
        title: t.confirm.deletePermanently.title,
        message: `${t.confirm.deletePermanently.message.replace('this prompt', `"${prompt.title}"`)}`,
        confirmText: t.confirm.deletePermanently.confirmText,
        cancelText: t.common.cancel,
        variant: 'danger',
        onConfirm: () => {
          permanentDelete(prompt.id);
          closeDetailPanel();
        },
      });
    }
  };

  // Category color mapping
  const categoryColors: Record<string, string> = {
    text: 'bg-theme-accent',
    image: 'bg-emerald-500',
    audio: 'bg-amber-500',
    video: 'bg-rose-500',
  };

  return (
    <AnimatePresence>
      {detailPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 500, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="border-l border-theme-border bg-theme-card-bg flex flex-col flex-shrink-0 overflow-hidden"
        >
          {prompt ? (
            <>
              {/* Detail Header */}
              <div className="px-6 pt-4 pb-3 border-b border-theme-border flex-shrink-0">
                {/* Collection name row */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    'w-2 h-2 rounded-full',
                    categoryColors[prompt.category] || 'bg-slate-500'
                  )} />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-theme-text-muted">
                    {collection?.name || t.detailPanel.uncategorized}
                  </span>
                </div>

                {/* Title and buttons row - aligned horizontally */}
                <div className="flex items-center justify-between gap-4">
                  {/* Title input */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={localTitle}
                      onChange={handleTitleChange}
                      onBlur={handleTitleBlur}
                      className="bg-transparent font-semibold text-base w-full focus:outline-none focus:ring-0 border-b border-transparent focus:border-theme-accent truncate transition-all text-theme-text-primary"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isInTrash ? (
                    <>
                      <button
                        onClick={handleRestore}
                        className="p-2 rounded-lg transition-colors text-theme-text-secondary hover:text-emerald-500 hover:bg-theme-overlay"
                        title={t.detailPanel.restore}
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handlePermanentDelete}
                        className="p-2 rounded-lg transition-colors text-theme-text-secondary hover:text-red-500 hover:bg-theme-overlay"
                        title={t.detailPanel.deletePermanently}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => openModal('sharePrompt')}
                      className="p-2 rounded-lg transition-colors text-theme-text-secondary hover:text-theme-accent hover:bg-theme-overlay"
                      title={t.detailPanel.share}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={closeDetailPanel}
                    className="p-2 rounded-lg transition-colors text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-overlay"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs
                tabs={TABS}
                activeTab={activeTab}
                onChange={(tab) => setActiveTab(tab as typeof activeTab)}
                className="px-2 flex-shrink-0"
              />

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden bg-theme-bg-primary">
                <TabPanel id="editor" activeTab={activeTab} className="h-full overflow-y-auto">
                  <PromptEditor />
                </TabPanel>
                <TabPanel id="metadata" activeTab={activeTab} className="h-full overflow-y-auto">
                  <PromptMetadata />
                </TabPanel>
                <TabPanel id="versions" activeTab={activeTab} className="h-full overflow-y-auto">
                  <PromptVersions />
                </TabPanel>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-theme-text-muted">
              <div className="text-center">
                <p className="text-lg font-medium">{t.detailPanel.noPromptSelected}</p>
                <p className="text-sm mt-1">{t.detailPanel.selectPrompt}</p>
              </div>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

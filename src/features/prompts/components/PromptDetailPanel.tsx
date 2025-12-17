import React from 'react';
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (prompt) {
      updatePrompt(prompt.id, { title: e.target.value });
    }
  };

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
              <div className="h-16 px-6 border-b border-theme-border flex items-center justify-between flex-shrink-0">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      categoryColors[prompt.category] || 'bg-slate-500'
                    )} />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-theme-text-muted">
                      {collection?.name || t.detailPanel.uncategorized}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={prompt.title}
                    onChange={handleTitleChange}
                    className="bg-transparent font-semibold text-base w-full focus:outline-none border-b border-transparent focus:border-theme-accent truncate transition-all text-theme-text-primary"
                  />
                </div>

                <div className="flex items-center gap-1">
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

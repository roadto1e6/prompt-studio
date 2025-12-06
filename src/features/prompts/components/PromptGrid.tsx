import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePromptStore, useUIStore, useI18nStore } from '@/stores';
import { PromptCard } from './PromptCard';
import { EmptyState } from '@/components/shared';
import { cn } from '@/utils';

export const PromptGrid: React.FC = () => {
  const { getFilteredPrompts, activePromptId, setActivePrompt, viewMode, toggleFavorite, moveToTrash, permanentDelete, restoreFromTrash, filter } = usePromptStore();
  const { openModal, openDetailPanel, detailPanelOpen, showConfirm } = useUIStore();
  const { t } = useI18nStore();

  const prompts = getFilteredPrompts();

  const handleSelectPrompt = (id: string) => {
    setActivePrompt(id);
    openDetailPanel();
  };

  const handleDelete = (id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (!prompt) return;

    const isTrash = filter === 'trash';

    showConfirm({
      title: isTrash ? t.confirm.deletePermanently.title : t.confirm.moveToTrash.title,
      message: isTrash
        ? `${t.confirm.deletePermanently.message.replace('this prompt', `"${prompt.title}"`)}`
        : `${t.confirm.moveToTrash.message.replace('this prompt', `"${prompt.title}"`)}`  ,
      confirmText: isTrash ? t.confirm.deletePermanently.confirmText : t.metadata.moveToTrash,
      variant: 'danger',
      onConfirm: () => {
        if (isTrash) {
          permanentDelete(id);
        } else {
          moveToTrash(id);
        }
      },
    });
  };

  // Determine empty state content based on filter
  const getEmptyState = () => {
    if (filter === 'favorites') {
      return { title: t.promptGrid.emptyFavoritesTitle, description: t.promptGrid.emptyFavoritesDescription };
    }
    if (filter === 'trash') {
      return { title: t.promptGrid.emptyTrashTitle, description: t.promptGrid.emptyTrashDescription };
    }
    return { title: t.promptGrid.emptyTitle, description: t.promptGrid.emptyDescription };
  };

  if (prompts.length === 0) {
    const emptyState = getEmptyState();
    return (
      <div className="p-6 h-full">
        <EmptyState
          title={emptyState.title}
          description={emptyState.description}
          action={filter !== 'trash' ? {
            label: t.promptGrid.createFirst,
            onClick: () => openModal('createPrompt'),
          } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="p-6 relative h-full overflow-auto">
      <div className={cn(
        viewMode === 'grid'
          ? cn(
              'grid gap-5',
              detailPanelOpen
                ? 'grid-cols-1 lg:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            )
          : 'flex flex-col gap-3'
      )}>
        <AnimatePresence mode="popLayout">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isSelected={activePromptId === prompt.id}
              onClick={() => handleSelectPrompt(prompt.id)}
              viewMode={viewMode}
              onToggleFavorite={toggleFavorite}
              onDelete={handleDelete}
              onRestore={restoreFromTrash}
              isTrashView={filter === 'trash'}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

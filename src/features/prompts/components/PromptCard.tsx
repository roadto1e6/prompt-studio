import React from 'react';
import { motion } from 'framer-motion';
import { Star, FileText, Image, AudioLines, Video, Trash2, RotateCcw } from 'lucide-react';
import { Prompt, Category, ViewMode } from '@/types';
import { formatRelativeTime, cn } from '@/utils';
import { Badge } from '@/components/ui';
import { useI18nStore } from '@/stores';

interface PromptCardProps {
  prompt: Prompt;
  isSelected: boolean;
  onClick: () => void;
  viewMode: ViewMode;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  isTrashView?: boolean;
}

const categoryConfig: Record<Category, { icon: React.FC<{ className?: string }>; color: string; bgColor: string }> = {
  text: { icon: FileText, color: 'text-theme-accent', bgColor: 'bg-theme-accent/20' },
  image: { icon: Image, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  audio: { icon: AudioLines, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  video: { icon: Video, color: 'text-rose-400', bgColor: 'bg-rose-500/20' },
};

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, isSelected, onClick, viewMode, onToggleFavorite, onDelete, onRestore, isTrashView }) => {
  const config = categoryConfig[prompt.category];
  const Icon = config.icon;
  const { t } = useI18nStore();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(prompt.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(prompt.id);
  };

  const handleRestoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRestore?.(prompt.id);
  };

  // List view
  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        className={cn(
          'group cursor-pointer border rounded-lg p-4 transition-all',
          'grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4',
          'bg-theme-card-bg hover:shadow-md',
          isSelected
            ? 'border-theme-accent bg-theme-accent/5'
            : 'border-theme-card-border hover:border-theme-card-hover-border'
        )}
      >
        {/* Icon */}
        <span className={cn('inline-flex items-center justify-center p-2 rounded-lg', config.bgColor)}>
          <Icon className={cn('w-5 h-5', config.color)} />
        </span>

        {/* Content */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate text-theme-text-primary">
              {prompt.title}
            </h3>
          </div>
          <p className="text-xs truncate mt-0.5 text-theme-text-secondary">
            {prompt.description || t.promptCard.noDescription}
          </p>
        </div>

        {/* Tags */}
        <div className="hidden lg:flex items-center gap-2 w-40 justify-end">
          {prompt.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="default" size="sm">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[10px] w-32 justify-end text-theme-text-muted">
          <span className="hidden sm:inline truncate max-w-[80px]">{prompt.model}</span>
          <span className="whitespace-nowrap">{formatRelativeTime(prompt.updatedAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {isTrashView ? (
            <>
              <button
                onClick={handleRestoreClick}
                className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-emerald-500 hover:bg-theme-bg-hover transition-all"
                title={t.promptCard.restore}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-red-500 hover:bg-theme-bg-hover transition-all"
                title={t.promptCard.deletePermanently}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleFavoriteClick}
                className={cn(
                  'p-1.5 rounded-md transition-all',
                  prompt.favorite
                    ? 'text-yellow-500 opacity-100'
                    : 'text-theme-text-muted opacity-0 group-hover:opacity-100 hover:text-yellow-500 hover:bg-theme-bg-hover'
                )}
              >
                <Star className={cn('w-4 h-4', prompt.favorite && 'fill-yellow-500')} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-red-500 hover:bg-theme-bg-hover transition-all"
                title={t.promptCard.moveToTrash}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'group cursor-pointer border rounded-xl p-5 flex flex-col min-h-[14rem] relative transition-all',
        'bg-theme-card-bg hover:shadow-lg',
        isSelected
          ? 'border-theme-accent bg-theme-accent/5 shadow-lg shadow-theme-accent/10'
          : 'border-theme-card-border hover:border-theme-card-hover-border'
      )}
    >
      {/* Header with Icon & Actions */}
      <div className="flex justify-between items-start mb-3 flex-shrink-0">
        <span className={cn('inline-flex items-center justify-center p-1.5 rounded-lg', config.bgColor)}>
          <Icon className={cn('w-4 h-4', config.color)} />
        </span>
        <div className="flex items-center gap-1">
          {isTrashView ? (
            <>
              <button
                onClick={handleRestoreClick}
                className="p-1 rounded-md opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-emerald-500 hover:bg-theme-bg-hover transition-all"
                title={t.promptCard.restore}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1 rounded-md opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-red-500 hover:bg-theme-bg-hover transition-all"
                title={t.promptCard.deletePermanently}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleFavoriteClick}
                className={cn(
                  'p-1 rounded-md transition-all',
                  prompt.favorite
                    ? 'text-yellow-500 opacity-100'
                    : 'text-theme-text-muted opacity-0 group-hover:opacity-100 hover:text-yellow-500 hover:bg-theme-bg-hover'
                )}
              >
                <Star className={cn('w-4 h-4', prompt.favorite && 'fill-yellow-500')} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1 rounded-md opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-red-500 hover:bg-theme-bg-hover transition-all"
                title={t.promptCard.moveToTrash}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-base mb-2 line-clamp-1 flex-shrink-0 text-theme-text-primary">
        {prompt.title}
      </h3>

      {/* Description - fixed height for 2 lines */}
      <p className="text-xs line-clamp-2 leading-relaxed h-[2.25rem] flex-shrink-0 text-theme-text-secondary">
        {prompt.description || t.promptCard.noDescription}
      </p>

      {/* Tags & Footer */}
      <div className="mt-auto pt-3">
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[1.5rem]">
          {prompt.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="default" size="sm">
              #{tag}
            </Badge>
          ))}
          {prompt.tags.length > 2 && (
            <Badge variant="default" size="sm">
              +{prompt.tags.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center text-[10px] pt-3 border-t text-theme-text-muted border-theme-border">
          <div className="flex items-center gap-1.5 truncate max-w-[60%]">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-theme-text-muted" />
            <span className="truncate">{prompt.model}</span>
          </div>
          <span className="flex-shrink-0">{formatRelativeTime(prompt.updatedAt)} ago</span>
        </div>
      </div>
    </motion.div>
  );
};

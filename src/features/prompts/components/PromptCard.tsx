import React from 'react';
import { motion } from 'framer-motion';
import { Star, FileText, Image, AudioLines, Video, Trash2, RotateCcw } from 'lucide-react';
import { Prompt, Category, ViewMode } from '@/types';
import { formatRelativeTime, cn } from '@/utils';
import { Badge } from '@/components/ui';
import { useI18nStore, useThemeStore } from '@/stores';

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
  text: { icon: FileText, color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
  image: { icon: Image, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  audio: { icon: AudioLines, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  video: { icon: Video, color: 'text-rose-400', bgColor: 'bg-rose-500/20' },
};

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, isSelected, onClick, viewMode, onToggleFavorite, onDelete, onRestore, isTrashView }) => {
  const config = categoryConfig[prompt.category];
  const Icon = config.icon;
  const { t } = useI18nStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

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
          isDark
            ? 'bg-dark-800 hover:shadow-md hover:shadow-black/20'
            : 'bg-white hover:shadow-md hover:shadow-slate-200/50',
          isSelected
            ? 'border-theme-accent bg-theme-accent/5'
            : isDark
              ? 'border-slate-800 hover:border-slate-700'
              : 'border-slate-200 hover:border-slate-300'
        )}
      >
        {/* Icon */}
        <span className={cn('inline-flex items-center justify-center p-2 rounded-lg', config.bgColor)}>
          <Icon className={cn('w-5 h-5', config.color)} />
        </span>

        {/* Content */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              'font-semibold text-sm truncate',
              isDark ? 'text-white' : 'text-slate-900'
            )}>
              {prompt.title}
            </h3>
          </div>
          <p className={cn(
            'text-xs truncate mt-0.5',
            isDark ? 'text-slate-400' : 'text-slate-500'
          )}>
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
        <div className={cn(
          'flex items-center gap-3 text-[10px] w-32 justify-end',
          isDark ? 'text-slate-500' : 'text-slate-400'
        )}>
          <span className="hidden sm:inline truncate max-w-[80px]">{prompt.model}</span>
          <span className="whitespace-nowrap">{formatRelativeTime(prompt.updatedAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {isTrashView ? (
            <>
              <button
                onClick={handleRestoreClick}
                className={cn(
                  'p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:text-emerald-500 transition-all',
                  isDark ? 'text-slate-500 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-100'
                )}
                title={t.promptCard.restore}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className={cn(
                  'p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all',
                  isDark ? 'text-slate-500 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-100'
                )}
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
                    : isDark
                      ? 'text-slate-500 opacity-0 group-hover:opacity-100 hover:text-yellow-500 hover:bg-slate-700'
                      : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-yellow-500 hover:bg-slate-100'
                )}
              >
                <Star className={cn('w-4 h-4', prompt.favorite && 'fill-yellow-500')} />
              </button>
              <button
                onClick={handleDeleteClick}
                className={cn(
                  'p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all',
                  isDark ? 'text-slate-500 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-100'
                )}
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
        isDark
          ? 'bg-dark-800 hover:shadow-lg hover:shadow-black/20'
          : 'bg-white hover:shadow-lg hover:shadow-slate-200/50',
        isSelected
          ? 'border-theme-accent bg-theme-accent/5 shadow-lg shadow-theme-accent/10'
          : isDark
            ? 'border-slate-800 hover:border-slate-700'
            : 'border-slate-200 hover:border-slate-300'
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
                className={cn(
                  'p-1 rounded-md opacity-0 group-hover:opacity-100 hover:text-emerald-500 transition-all',
                  isDark ? 'text-slate-500 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-100'
                )}
                title={t.promptCard.restore}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className={cn(
                  'p-1 rounded-md opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all',
                  isDark ? 'text-slate-500 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-100'
                )}
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
                    : isDark
                      ? 'text-slate-500 opacity-0 group-hover:opacity-100 hover:text-yellow-500 hover:bg-slate-700'
                      : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-yellow-500 hover:bg-slate-100'
                )}
              >
                <Star className={cn('w-4 h-4', prompt.favorite && 'fill-yellow-500')} />
              </button>
              <button
                onClick={handleDeleteClick}
                className={cn(
                  'p-1 rounded-md opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all',
                  isDark ? 'text-slate-500 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-100'
                )}
                title={t.promptCard.moveToTrash}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-semibold text-base mb-2 line-clamp-1 flex-shrink-0',
        isDark ? 'text-white' : 'text-slate-900'
      )}>
        {prompt.title}
      </h3>

      {/* Description - fixed height for 2 lines */}
      <p className={cn(
        'text-xs line-clamp-2 leading-relaxed h-[2.25rem] flex-shrink-0',
        isDark ? 'text-slate-400' : 'text-slate-500'
      )}>
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

        <div className={cn(
          'flex justify-between items-center text-[10px] pt-3 border-t',
          isDark
            ? 'text-slate-500 border-slate-800/50'
            : 'text-slate-400 border-slate-200'
        )}>
          <div className="flex items-center gap-1.5 truncate max-w-[60%]">
            <span className={cn(
              'w-1.5 h-1.5 rounded-full flex-shrink-0',
              isDark ? 'bg-slate-600' : 'bg-slate-300'
            )} />
            <span className="truncate">{prompt.model}</span>
          </div>
          <span className="flex-shrink-0">{formatRelativeTime(prompt.updatedAt)} ago</span>
        </div>
      </div>
    </motion.div>
  );
};

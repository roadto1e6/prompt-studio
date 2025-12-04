import React from 'react';
import { motion } from 'framer-motion';
import { Star, FileText, Image, AudioLines, Video } from 'lucide-react';
import { Prompt, Category } from '@/types';
import { formatRelativeTime, cn } from '@/utils';
import { Badge } from '@/components/ui';

interface PromptCardProps {
  prompt: Prompt;
  isSelected: boolean;
  onClick: () => void;
}

const categoryConfig: Record<Category, { icon: React.FC<{ className?: string }>; color: string; bgColor: string }> = {
  text: { icon: FileText, color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
  image: { icon: Image, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  audio: { icon: AudioLines, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  video: { icon: Video, color: 'text-rose-400', bgColor: 'bg-rose-500/20' },
};

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, isSelected, onClick }) => {
  const config = categoryConfig[prompt.category];
  const Icon = config.icon;

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
        'cursor-pointer bg-dark-800 border rounded-xl p-5 flex flex-col h-56 relative transition-all',
        'hover:shadow-lg hover:shadow-black/20',
        isSelected
          ? 'border-indigo-500 shadow-lg shadow-indigo-500/10'
          : 'border-slate-800 hover:border-slate-700'
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <span className={cn('inline-flex items-center justify-center p-1.5 rounded-lg', config.bgColor)}>
          <Icon className={cn('w-4 h-4', config.color)} />
        </span>
        {prompt.favorite && (
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        )}
      </div>

      {/* Title & Description */}
      <h3 className="text-white font-semibold text-base mb-1 truncate pr-4">
        {prompt.title}
      </h3>
      <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
        {prompt.description}
      </p>

      {/* Tags & Footer */}
      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 mb-3">
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
        
        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            {prompt.model}
          </div>
          <span>{formatRelativeTime(prompt.updatedAt)} ago</span>
        </div>
      </div>
    </motion.div>
  );
};

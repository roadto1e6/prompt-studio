import React from 'react';
import { Plus, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { usePromptStore, useUIStore } from '@/stores';
import { Button } from '@/components/ui';
import { cn } from '@/utils';

export const Header: React.FC = () => {
  const { filter, categoryFilter, collectionFilter, viewMode, setViewMode } = usePromptStore();
  const { openModal } = useUIStore();

  // Determine page title
  const getPageTitle = () => {
    if (categoryFilter) {
      return categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1);
    }
    if (collectionFilter) {
      return 'Collection';
    }
    const titles: Record<string, string> = {
      all: 'All Prompts',
      favorites: 'Favorites',
      recent: 'Recent',
      trash: 'Trash',
    };
    return titles[filter] || 'Prompts';
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 flex-shrink-0 bg-dark-900">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white">{getPageTitle()}</h2>
        <div className="h-4 w-px bg-slate-700" />
        
        {/* View Toggle */}
        <div className="flex bg-dark-800 rounded-md p-1 border border-slate-700">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors',
              viewMode === 'grid'
                ? 'text-indigo-400 bg-indigo-500/10'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors',
              viewMode === 'list'
                ? 'text-indigo-400 bg-indigo-500/10'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          icon={<ArrowUpDown className="w-4 h-4" />}
        >
          Sort
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => openModal('createPrompt')}
        >
          New Prompt
        </Button>
      </div>
    </header>
  );
};

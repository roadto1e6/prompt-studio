import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Infinity,
  Star,
  Clock,
  Trash2,
  FileText,
  Image,
  AudioLines,
  Video,
  Folder,
  Plus,
  Search,
  Settings,
} from 'lucide-react';
import { usePromptStore, useCollectionStore, useUIStore, useI18nStore } from '@/stores';
import { CATEGORIES, QUICK_FILTERS } from '@/constants';
import { mockUser } from '@/data/mockData';
import { cn, debounce } from '@/utils';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Infinity,
  Star,
  Clock,
  Trash2,
  FileText,
  Image,
  AudioLines,
  Video,
  Folder,
};

export const Sidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; collectionId: string } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const { prompts, filter, categoryFilter, collectionFilter, setFilter, setCategory, setCollection, setSearch } = usePromptStore();
  const { collections, deleteCollection } = useCollectionStore();
  const { openModal, closeDetailPanel, showConfirm } = useUIStore();
  const { t } = useI18nStore();

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

  // Debounced search handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearch = useCallback(
    debounce((query: string) => setSearch(query), 300),
    [setSearch]
  );

  const handleCollectionContextMenu = (e: React.MouseEvent, collectionId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, collectionId });
  };

  const handleDeleteCollection = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;

    setContextMenu(null);
    showConfirm({
      title: 'Delete Collection',
      message: `Are you sure you want to delete "${collection.name}"? Prompts in this collection will not be deleted.`,
      confirmText: 'Delete',
      variant: 'danger',
      onConfirm: () => {
        deleteCollection(collectionId);
        if (collectionFilter === collectionId) {
          setCollection(null);
        }
      },
    });
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    closeDetailPanel();
  };

  const handleCategoryChange = (newCategory: typeof categoryFilter) => {
    setCategory(newCategory);
    closeDetailPanel();
  };

  const handleCollectionChange = (collectionId: string) => {
    setCollection(collectionId);
    closeDetailPanel();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  return (
    <aside className="w-[260px] flex-shrink-0 border-r border-slate-800 flex flex-col bg-dark-900">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Infinity className="w-8 h-8 text-indigo-500 mr-2" />
        <span className="font-display text-xl tracking-tight text-white font-bold">
          Prompt Studio
        </span>
      </div>

      {/* Global Search */}
      <div className="p-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-dark-800 border border-slate-700 text-slate-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors text-xs font-medium placeholder-slate-500"
            placeholder={t.sidebar.searchPlaceholder}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        {/* Quick Access */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {t.sidebar.quickAccess}
          </h3>
          <nav className="space-y-0.5">
            {QUICK_FILTERS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = filter === item.id && !categoryFilter && !collectionFilter;

              // Calculate count for each filter
              let count = 0;
              if (item.id === 'all') {
                count = prompts.filter(p => p.status !== 'trash').length;
              } else if (item.id === 'favorites') {
                count = prompts.filter(p => p.favorite && p.status !== 'trash').length;
              } else if (item.id === 'recent') {
                count = prompts.filter(p => p.status !== 'trash').length;
              } else if (item.id === 'trash') {
                count = prompts.filter(p => p.status === 'trash').length;
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleFilterChange(item.id as typeof filter)}
                  className={cn(
                    'group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <div className="flex items-center">
                    <Icon
                      className={cn(
                        'mr-3 w-5 h-5 transition-colors',
                        isActive
                          ? 'text-indigo-400'
                          : 'text-slate-500 group-hover:text-white'
                      )}
                    />
                    {t.filters[item.id as keyof typeof t.filters]}
                  </div>
                  <span className="text-xs text-slate-600 group-hover:text-slate-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {t.sidebar.categories}
          </h3>
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const Icon = iconMap[cat.icon];
              const isActive = categoryFilter === cat.id;
              const count = prompts.filter(p => p.category === cat.id && p.status !== 'trash').length;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id as typeof categoryFilter)}
                  className={cn(
                    'group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <div className="flex items-center">
                    <Icon className={cn('mr-3 w-5 h-5', cat.color)} />
                    {t.categories[cat.id as keyof typeof t.categories]}
                  </div>
                  <span className="text-xs text-slate-600 group-hover:text-slate-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Collections */}
        <div>
          <div className="flex justify-between items-center px-3 mb-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.sidebar.collections}
            </h3>
            <button
              onClick={() => openModal('createCollection')}
              className="text-slate-600 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <nav className="space-y-0.5">
            {/* No Collection option */}
            <button
              onClick={() => handleCollectionChange('uncategorized')}
              className={cn(
                'group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
                collectionFilter === 'uncategorized'
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <div className="flex items-center">
                <Folder className="mr-3 w-5 h-5 text-slate-500" />
                {t.sidebar.noCollection}
              </div>
              <span className="text-xs text-slate-600 group-hover:text-slate-400">
                {prompts.filter(p => !p.collectionId && p.status !== 'trash').length}
              </span>
            </button>
            {collections.map((col) => {
              const isActive = collectionFilter === col.id;
              const promptCount = prompts.filter(p => p.collectionId === col.id && p.status !== 'trash').length;

              return (
                <button
                  key={col.id}
                  onClick={() => handleCollectionChange(col.id)}
                  onContextMenu={(e) => handleCollectionContextMenu(e, col.id)}
                  className={cn(
                    'group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <div className="flex items-center">
                    <Folder className={cn('mr-3 w-5 h-5', col.color)} />
                    {col.name}
                  </div>
                  <span className="text-xs text-slate-600 group-hover:text-slate-400">
                    {promptCount}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 bg-dark-800 border border-slate-700 rounded-lg shadow-xl py-1 min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleDeleteCollection(contextMenu.collectionId)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-slate-700/50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {t.common.delete}
          </button>
        </div>
      )}

      {/* User/Settings */}
      <div className="p-4 border-t border-slate-800">
        {/* User Profile */}
        <button
          onClick={() => openModal('settings')}
          className="flex items-center gap-3 w-full hover:bg-slate-800/50 p-2 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
            {mockUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-white truncate">{mockUser.name}</p>
            <p className="text-xs text-slate-500 truncate">{t.user.plan[mockUser.plan as keyof typeof t.user.plan]}</p>
          </div>
          <Settings className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </aside>
  );
};

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
  Search,
  Settings,
} from 'lucide-react';
import { usePromptStore, useCollectionStore, useUIStore, useI18nStore, useAuthStore, useThemeStore } from '@/stores';
import { CATEGORIES, QUICK_FILTERS } from '@/constants';
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
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const rightColumnBase = 'inline-flex items-center min-w-[1.75rem]';
  const countColumnClass = cn(
    'text-xs tabular-nums font-mono justify-end',
    rightColumnBase,
    isDark
      ? 'text-slate-600 group-hover:text-slate-400'
      : 'text-slate-400 group-hover:text-slate-600'
  );

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
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setContextMenu({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      collectionId,
    });
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
    <aside className={cn(
      'w-[260px] flex-shrink-0 border-r flex flex-col',
      isDark
        ? 'bg-dark-900 border-slate-800'
        : 'bg-white border-slate-200'
    )}>
      {/* Logo */}
      <div className={cn(
        'h-16 flex items-center px-6 border-b',
        isDark ? 'border-slate-800' : 'border-slate-200'
      )}>
        <Infinity className="w-8 h-8 text-indigo-500 mr-2" />
        <span className={cn(
          'font-display text-xl tracking-tight font-bold',
          isDark ? 'text-white' : 'text-slate-900'
        )}>
          Prompt Studio
        </span>
      </div>

      {/* Global Search */}
      <div className="p-4">
        <div className="relative group">
          <Search className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
            isDark ? 'text-slate-500' : 'text-slate-400'
          )} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className={cn(
              'w-full rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors text-xs font-medium border',
              isDark
                ? 'bg-dark-800 border-slate-700 text-slate-300 placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            )}
            placeholder={t.sidebar.searchPlaceholder}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        {/* Quick Access */}
        <div>
          <h3 className={cn(
            'px-3 text-xs font-semibold uppercase tracking-wider mb-2',
            isDark ? 'text-slate-500' : 'text-slate-400'
          )}>
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
                      ? 'bg-indigo-500/10 text-indigo-500'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center">
                    <Icon
                      className={cn(
                        'mr-3 w-5 h-5 transition-colors',
                        isActive
                          ? 'text-indigo-500'
                          : isDark
                            ? 'text-slate-500 group-hover:text-white'
                            : 'text-slate-400 group-hover:text-slate-900'
                      )}
                    />
                    {t.filters[item.id as keyof typeof t.filters]}
                  </div>
                  <span className={countColumnClass}>{count}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories */}
        <div>
          <h3 className={cn(
            'px-3 text-xs font-semibold uppercase tracking-wider mb-2',
            isDark ? 'text-slate-500' : 'text-slate-400'
          )}>
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
                      ? 'bg-indigo-500/10 text-indigo-500'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center">
                    <Icon className={cn('mr-3 w-5 h-5', cat.color)} />
                    {t.categories[cat.id as keyof typeof t.categories]}
                  </div>
                  <span className={countColumnClass}>{count}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Collections */}
        <div>
          <div className="flex items-center px-3 mb-2 gap-2">
            <h3 className={cn(
              'flex-1 text-xs font-semibold uppercase tracking-wider',
              isDark ? 'text-slate-500' : 'text-slate-400'
            )}>
              {t.sidebar.collections}
            </h3>
            <button
              onClick={() => openModal('createCollection')}
              className={cn(
                rightColumnBase,
                'justify-end w-[1.75rem] h-[1.75rem] rounded-md transition-colors ml-auto focus:outline-none',
                isDark
                  ? 'text-slate-500 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
              aria-label={t.createCollection.title}
            >
              <span className="font-mono text-sm leading-none font-semibold">+</span>
            </button>
          </div>
          <nav className="space-y-0.5">
            {/* No Collection option */}
            <button
              onClick={() => handleCollectionChange('uncategorized')}
              className={cn(
                'group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
                collectionFilter === 'uncategorized'
                  ? 'bg-indigo-500/10 text-indigo-500'
                  : isDark
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="flex items-center">
                <Folder className={cn('mr-3 w-5 h-5', isDark ? 'text-slate-500' : 'text-slate-400')} />
                {t.sidebar.noCollection}
              </div>
              <span className={countColumnClass}>{prompts.filter(p => !p.collectionId && p.status !== 'trash').length}</span>
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
                      ? 'bg-indigo-500/10 text-indigo-500'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center">
                    <Folder className={cn('mr-3 w-5 h-5', col.color)} />
                    {col.name}
                  </div>
                  <span className={countColumnClass}>{promptCount}</span>
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
          className={cn(
            'fixed z-50 rounded-lg shadow-xl py-1 min-w-[140px] border',
            isDark
              ? 'bg-dark-800 border-slate-700'
              : 'bg-white border-slate-200'
          )}
          style={{ left: contextMenu.x, top: contextMenu.y, transform: 'translate(-50%, -50%)' }}
        >
          <button
            onClick={() => handleDeleteCollection(contextMenu.collectionId)}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 transition-colors',
              isDark ? 'hover:bg-slate-700/50' : 'hover:bg-red-50'
            )}
          >
            <Trash2 className="w-4 h-4" />
            {t.common.delete}
          </button>
        </div>
      )}

      {/* User/Settings */}
      <div className={cn(
        'p-4 border-t',
        isDark ? 'border-slate-800' : 'border-slate-200'
      )}>
        {/* User Profile */}
        <button
          onClick={() => openModal('settings')}
          className={cn(
            'flex items-center gap-3 w-full p-2 rounded-lg transition-colors',
            isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'
          )}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0 text-left">
            <p className={cn(
              'text-sm font-medium truncate',
              isDark ? 'text-white' : 'text-slate-900'
            )}>{user?.name || 'User'}</p>
            <p className={cn(
              'text-xs truncate',
              isDark ? 'text-slate-500' : 'text-slate-500'
            )}>{user?.email || ''}</p>
          </div>
          <Settings className={cn('w-4 h-4', isDark ? 'text-slate-500' : 'text-slate-400')} />
        </button>
      </div>
    </aside>
  );
};

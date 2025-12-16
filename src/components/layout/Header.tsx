import React, { useState, useRef, useEffect } from 'react';
import { Plus, LayoutGrid, List, Download, Sun, Moon } from 'lucide-react';
import { usePromptStore, useUIStore, useI18nStore, useThemeStore } from '@/stores';
import { Button } from '@/components/ui';
import { cn } from '@/utils';
import { SortBy } from '@/types';

export const Header: React.FC = () => {
  const { filter, categoryFilter, collectionFilter, viewMode, setViewMode, sortBy, sortOrder, setSortBy, setSortOrder } = usePromptStore();
  const { openModal } = useUIStore();
  const { t } = useI18nStore();
  const { language, setLanguage } = useI18nStore();
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const SORT_OPTIONS: { id: SortBy; labelKey: keyof typeof t.header.sortBy }[] = [
    { id: 'updatedAt', labelKey: 'updatedAt' },
    { id: 'createdAt', labelKey: 'createdAt' },
    { id: 'title', labelKey: 'title' },
  ];
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortChange = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const currentSortLabel = SORT_OPTIONS.find(o => o.id === sortBy)
    ? t.header.sortBy[SORT_OPTIONS.find(o => o.id === sortBy)!.labelKey]
    : t.header.sortBy.updatedAt;

  // Determine page title
  const getPageTitle = () => {
    if (categoryFilter) {
      return t.categories[categoryFilter as keyof typeof t.categories];
    }
    if (collectionFilter) {
      return t.sidebar.collections;
    }
    return t.filters[filter as keyof typeof t.filters] || t.filters.all;
  };

  return (
    <header className={cn(
      'h-16 flex items-center justify-between px-6 border-b flex-shrink-0',
      isDark
        ? 'bg-dark-900 border-slate-800'
        : 'bg-white border-slate-200'
    )}>
      <div className="flex items-center gap-4">
        <h2 className={cn(
          'text-lg font-semibold',
          isDark ? 'text-white' : 'text-slate-900'
        )}>{getPageTitle()}</h2>
        <div className={cn('h-4 w-px', isDark ? 'bg-slate-700' : 'bg-slate-300')} />

        {/* View Toggle */}
        <div className={cn(
          'flex rounded-md p-1 border',
          isDark
            ? 'bg-dark-800 border-slate-700'
            : 'bg-slate-100 border-slate-200'
        )}>
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors',
              viewMode === 'grid'
                ? 'text-indigo-500 bg-indigo-500/10'
                : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            {t.header.grid}
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors',
              viewMode === 'list'
                ? 'text-indigo-500 bg-indigo-500/10'
                : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
            )}
          >
            <List className="w-3.5 h-3.5" />
            {t.header.list}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={cn(
            'p-2 rounded-lg transition-colors',
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          )}
          title={t.settings.theme}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          className={cn(
            'p-2 rounded-lg transition-colors',
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          )}
          title={t.settings.language}
        >
          <span className="text-xs font-medium">{language === 'en' ? 'EN' : '中'}</span>
        </button>

        <div className={cn('h-4 w-px', isDark ? 'bg-slate-700' : 'bg-slate-300')} />

        {/* Sort Dropdown */}
        <div className="relative" ref={sortMenuRef}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            {currentSortLabel}
            <span className={cn('text-[10px] ml-1', isDark ? 'text-slate-500' : 'text-slate-400')}>
              {sortOrder === 'asc' ? '↑' : '↓'}
            </span>
          </Button>

          {showSortMenu && (
            <div className={cn(
              'absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl z-50 overflow-hidden border',
              isDark
                ? 'bg-dark-800 border-slate-700'
                : 'bg-white border-slate-200'
            )}>
              <div className="p-1">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors',
                      sortBy === option.id
                        ? 'bg-indigo-500/10 text-indigo-500'
                        : isDark
                          ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <span>{t.header.sortBy[option.labelKey]}</span>
                    {sortBy === option.id && (
                      <span className="flex items-center gap-1 text-xs">
                        {sortOrder === 'asc' ? `↑ ${t.header.asc}` : `↓ ${t.header.desc}`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={() => openModal('importPrompt')}
        >
          {t.header.import}
        </Button>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => openModal('createPrompt')}
        >
          {t.header.newPrompt}
        </Button>
      </div>
    </header>
  );
};

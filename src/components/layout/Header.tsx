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
            {t.header.grid}
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
            {t.header.list}
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={t.settings.theme}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={t.settings.language}
        >
          <span className="text-xs font-medium">{language === 'en' ? 'EN' : '中'}</span>
        </button>

        <div className="h-4 w-px bg-slate-700" />

        {/* Sort Dropdown */}
        <div className="relative" ref={sortMenuRef}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            {currentSortLabel}
            <span className="text-[10px] text-slate-500 ml-1">
              {sortOrder === 'asc' ? '↑' : '↓'}
            </span>
          </Button>

          {showSortMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-dark-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-1">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors',
                      sortBy === option.id
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
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

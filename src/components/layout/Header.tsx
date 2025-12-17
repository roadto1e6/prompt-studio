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
    <header className="h-16 flex items-center justify-between px-6 border-b border-theme-border bg-theme-bg-primary flex-shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-theme-text-primary">{getPageTitle()}</h2>
        <div className="h-4 w-px bg-theme-border" />

        {/* View Toggle */}
        <div className="flex rounded-md p-1 border bg-theme-bg-secondary border-theme-border">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors',
              viewMode === 'grid'
                ? 'text-theme-accent bg-theme-accent/10'
                : 'text-theme-text-secondary hover:text-theme-text-primary'
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
                ? 'text-theme-accent bg-theme-accent/10'
                : 'text-theme-text-secondary hover:text-theme-text-primary'
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
          className="p-2 rounded-lg transition-colors text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-bg-hover"
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
          className="p-2 rounded-lg transition-colors text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-bg-hover"
          title={t.settings.language}
        >
          <span className="text-xs font-medium">{language === 'en' ? 'EN' : '中'}</span>
        </button>

        <div className="h-4 w-px bg-theme-border" />

        {/* Sort Dropdown */}
        <div className="relative" ref={sortMenuRef}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            {currentSortLabel}
            <span className="text-[10px] ml-1 text-theme-text-muted">
              {sortOrder === 'asc' ? '↑' : '↓'}
            </span>
          </Button>

          {showSortMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl z-50 overflow-hidden border bg-theme-card-bg border-theme-card-border">
              <div className="p-1">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors',
                      sortBy === option.id
                        ? 'bg-theme-accent/10 text-theme-accent'
                        : 'text-theme-text-secondary hover:bg-theme-bg-hover hover:text-theme-text-primary'
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

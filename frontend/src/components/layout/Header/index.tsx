/**
 * Header Component
 *
 * Top navigation bar that provides:
 * - Page title display based on current filters
 * - View mode toggle (grid/list)
 * - Theme toggle (light/dark)
 * - Language toggle (en/zh)
 * - Sort options dropdown
 * - Create and import prompt actions
 *
 * Features:
 * - Responsive design for all screen sizes
 * - Keyboard accessible
 * - Optimized with React.memo
 * - Clean separation of concerns (view/logic/styles/types)
 */

import React from 'react';
import { Plus, LayoutGrid, List, Download, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/utils';
import { useHeader } from './useHeader';
import { HeaderProps } from './types';
import styles from './index.module.css';

/**
 * Header component (view layer)
 */
export const Header: React.FC<HeaderProps> = React.memo(({ className }) => {
  const {
    viewMode,
    sortBy,
    sortOrder,
    theme,
    language,
    showSortMenu,
    sortMenuRef,
    sortOptions,
    currentSortLabel,
    pageTitle,
    t,
    setViewMode,
    toggleSortMenu,
    handleSortChange,
    toggleTheme,
    toggleLanguage,
    openCreatePrompt,
    openImportPrompt,
  } = useHeader();

  return (
    <header className={cn(styles.header, className)}>
      {/* Left Section: Page Title & View Mode Toggle */}
      <div className={styles.leftSection}>
        <h2 className={styles.pageTitle}>{pageTitle}</h2>

        <div className={styles.divider} />

        {/* View Mode Toggle */}
        <div className={styles.viewModeToggle}>
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              styles.viewModeButton,
              viewMode === 'grid' && styles.active
            )}
            aria-label={t.header.grid}
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid className={styles.viewModeIcon} />
            <span>{t.header.grid}</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={cn(
              styles.viewModeButton,
              viewMode === 'list' && styles.active
            )}
            aria-label={t.header.list}
            aria-pressed={viewMode === 'list'}
          >
            <List className={styles.viewModeIcon} />
            <span>{t.header.list}</span>
          </button>
        </div>
      </div>

      {/* Right Section: Actions & Settings */}
      <div className={styles.rightSection}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={styles.iconButton}
          title={t.settings.theme}
          aria-label={`${t.settings.theme}: ${theme === 'dark' ? t.settings.dark : t.settings.light}`}
        >
          {theme === 'dark' ? (
            <Moon />
          ) : (
            <Sun className={styles.sunIcon} />
          )}
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className={styles.iconButton}
          title={t.settings.language}
          aria-label={`${t.settings.language}: ${language === 'en' ? t.settings.english : t.settings.chinese}`}
        >
          <span className={styles.languageText}>
            {language === 'en' ? 'EN' : '中'}
          </span>
        </button>

        <div className={styles.divider} />

        {/* Sort Dropdown */}
        <div className={styles.sortContainer} ref={sortMenuRef}>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleSortMenu}
            className={styles.sortButton}
            aria-haspopup="true"
            aria-expanded={showSortMenu}
          >
            {currentSortLabel}
            <span className={styles.sortArrow}>
              {sortOrder === 'asc' ? '↑' : '↓'}
            </span>
          </Button>

          {showSortMenu && (
            <div className={styles.sortMenu} role="menu">
              <div className={styles.sortMenuInner}>
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className={cn(
                      styles.sortOption,
                      sortBy === option.id && styles.active
                    )}
                    role="menuitem"
                    aria-current={sortBy === option.id}
                  >
                    <span>{t.header.sortBy[option.labelKey]}</span>
                    {sortBy === option.id && (
                      <span className={styles.sortOrderLabel}>
                        {sortOrder === 'asc' ? `↑ ${t.header.asc}` : `↓ ${t.header.desc}`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Import Button */}
        <Button
          variant="secondary"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={openImportPrompt}
          aria-label={t.header.import}
        >
          {t.header.import}
        </Button>

        {/* Create Prompt Button */}
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={openCreatePrompt}
          aria-label={t.header.newPrompt}
        >
          {t.header.newPrompt}
        </Button>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

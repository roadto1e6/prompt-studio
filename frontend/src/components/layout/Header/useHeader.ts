/**
 * useHeader Hook
 *
 * Manages Header component state and business logic:
 * - View mode (grid/list) toggle
 * - Sort menu state and interactions
 * - Theme toggle
 * - Language toggle
 * - Page title computation
 * - Modal opening (create/import prompts)
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { usePromptStore, useUIStore, useI18nStore, useThemeStore } from '@/stores';
import { SortBy } from '@/types';
import { UseHeaderReturn, SortOption } from './types';

/**
 * Custom hook for Header component logic
 */
export const useHeader = (): UseHeaderReturn => {
  // Store selectors
  const {
    filter,
    categoryFilter,
    collectionFilter,
    viewMode,
    setViewMode,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder
  } = usePromptStore();

  const { openModal } = useUIStore();
  const { t, language, setLanguage } = useI18nStore();
  const { theme, setTheme } = useThemeStore();

  // Local state
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Sort options configuration
  const sortOptions: SortOption[] = useMemo(() => [
    { id: 'updatedAt', labelKey: 'updatedAt' },
    { id: 'createdAt', labelKey: 'createdAt' },
    { id: 'title', labelKey: 'title' },
  ], []);

  /**
   * Close sort menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };

    if (showSortMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSortMenu]);

  /**
   * Handle sort option change
   * If same field is selected, toggle sort order
   * Otherwise, set new field with descending order
   */
  const handleSortChange = useCallback((newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  }, [sortBy, sortOrder, setSortBy, setSortOrder]);

  /**
   * Toggle sort menu visibility
   */
  const toggleSortMenu = useCallback(() => {
    setShowSortMenu(prev => !prev);
  }, []);

  /**
   * Toggle theme between light and dark
   */
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  /**
   * Toggle language between English and Chinese
   */
  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  }, [language, setLanguage]);

  /**
   * Open create prompt modal
   */
  const openCreatePrompt = useCallback(() => {
    openModal('createPrompt');
  }, [openModal]);

  /**
   * Open import prompt modal
   */
  const openImportPrompt = useCallback(() => {
    openModal('importPrompt');
  }, [openModal]);

  /**
   * Get current sort label (translated)
   */
  const currentSortLabel = useMemo(() => {
    const option = sortOptions.find(o => o.id === sortBy);
    return option ? t.header.sortBy[option.labelKey] : t.header.sortBy.updatedAt;
  }, [sortBy, sortOptions, t.header.sortBy]);

  /**
   * Determine page title based on current filters
   */
  const pageTitle = useMemo(() => {
    if (categoryFilter) {
      return t.categories[categoryFilter as keyof typeof t.categories];
    }
    if (collectionFilter) {
      return t.sidebar.collections;
    }
    return t.filters[filter as keyof typeof t.filters] || t.filters.all;
  }, [categoryFilter, collectionFilter, filter, t.categories, t.filters, t.sidebar.collections]);

  return {
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
  };
};

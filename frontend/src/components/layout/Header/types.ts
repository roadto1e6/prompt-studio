/**
 * Header Component Type Definitions
 *
 * Defines all TypeScript interfaces and types for the Header component
 */

import { SortBy, SortOrder, ViewMode } from '@/types';

/**
 * Props for the Header component
 */
export interface HeaderProps {
  /**
   * Optional CSS class name for custom styling
   */
  className?: string;
}

/**
 * Sort option configuration
 */
export interface SortOption {
  /**
   * Unique identifier for the sort option
   */
  id: SortBy;

  /**
   * Translation key for the sort option label
   */
  labelKey: 'updatedAt' | 'createdAt' | 'title';
}

/**
 * Return type for useHeader hook
 */
export interface UseHeaderReturn {
  /**
   * Current view mode (grid/list)
   */
  viewMode: ViewMode;

  /**
   * Current sort field
   */
  sortBy: SortBy;

  /**
   * Current sort order (asc/desc)
   */
  sortOrder: SortOrder;

  /**
   * Current theme (light/dark/system)
   */
  theme: 'light' | 'dark' | 'system';

  /**
   * Current language (en/zh)
   */
  language: 'en' | 'zh';

  /**
   * Sort menu visibility state
   */
  showSortMenu: boolean;

  /**
   * Sort menu ref for click outside detection
   */
  sortMenuRef: React.RefObject<HTMLDivElement>;

  /**
   * Available sort options
   */
  sortOptions: SortOption[];

  /**
   * Current sort label (translated)
   */
  currentSortLabel: string;

  /**
   * Current page title (translated)
   */
  pageTitle: string;

  /**
   * Translation function
   */
  t: any;

  /**
   * Set view mode (grid/list)
   */
  setViewMode: (mode: ViewMode) => void;

  /**
   * Toggle sort menu visibility
   */
  toggleSortMenu: () => void;

  /**
   * Handle sort option change
   */
  handleSortChange: (sortBy: SortBy) => void;

  /**
   * Toggle theme (light/dark)
   */
  toggleTheme: () => void;

  /**
   * Toggle language (en/zh)
   */
  toggleLanguage: () => void;

  /**
   * Open create prompt modal
   */
  openCreatePrompt: () => void;

  /**
   * Open import prompt modal
   */
  openImportPrompt: () => void;
}

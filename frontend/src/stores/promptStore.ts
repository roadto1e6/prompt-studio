import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prompt, QuickFilter, Category, ViewMode, SortBy, SortOrder } from '@/types';
import { matchesSearch } from '@/utils';
import { promptService } from '@/services/promptService';

interface PromptState {
  // Data
  prompts: Prompt[];
  activePromptId: string | null;
  initialized: boolean;
  isLoading: boolean;
  error: string | null;

  // Filters
  filter: QuickFilter;
  categoryFilter: Category | null;
  collectionFilter: string | null;
  searchQuery: string;

  // View
  viewMode: ViewMode;
  sortBy: SortBy;
  sortOrder: SortOrder;

  // Actions - Initialize
  initialize: (userId?: string) => Promise<void>;
  reset: () => void;

  // Actions - Filters
  setFilter: (filter: QuickFilter) => void;
  setCategory: (category: Category | null) => void;
  setCollection: (collectionId: string | null) => void;
  setSearch: (query: string) => void;
  setActivePrompt: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;

  // Actions - CRUD
  createPrompt: (data: Partial<Prompt>) => Promise<Prompt>;
  updatePrompt: (id: string, data: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  moveToTrash: (id: string) => Promise<void>;
  restoreFromTrash: (id: string) => Promise<void>;
  permanentDelete: (id: string) => Promise<void>;

  // Actions - Versions
  createVersion: (promptId: string, note: string, versionType?: 'major' | 'minor') => Promise<void>;
  restoreVersion: (promptId: string, versionId: string) => Promise<void>;
  deleteVersion: (promptId: string, versionId: string) => Promise<void>;
  restoreDeletedVersion: (promptId: string, versionId: string) => Promise<void>;
  permanentDeleteVersion: (promptId: string, versionId: string) => Promise<void>;

  // Computed
  getFilteredPrompts: () => Prompt[];
  getActivePrompt: () => Prompt | null;
  getPromptById: (id: string) => Prompt | null;
}

export const usePromptStore = create<PromptState>()(
  persist(
    (set, get) => ({
      // Initial State
      prompts: [],
      activePromptId: null,
      initialized: false,
      isLoading: false,
      error: null,
      filter: 'recent',
      categoryFilter: null,
      collectionFilter: null,
      searchQuery: '',
      viewMode: 'grid',
      sortBy: 'updatedAt',
      sortOrder: 'desc',

      // Initialize
      initialize: async () => {
        if (get().initialized) return;

        set({ isLoading: true, error: null });

        try {
          const response = await promptService.getPrompts({ pageSize: 100 });
          set({ prompts: response.items });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to load prompts';
          set({ error: message });
        } finally {
          set({ isLoading: false, initialized: true });
        }
      },

      // Reset
      reset: () => {
        set({
          prompts: [],
          activePromptId: null,
          initialized: false,
          isLoading: false,
          error: null,
          filter: 'recent',
          categoryFilter: null,
          collectionFilter: null,
          searchQuery: '',
        });
      },

      // Filter Actions
      setFilter: (filter) => set({ filter, categoryFilter: null, collectionFilter: null, activePromptId: null }),
      setCategory: (category) => set({ categoryFilter: category, filter: 'all', collectionFilter: null, activePromptId: null }),
      setCollection: (collectionId) => set({ collectionFilter: collectionId, filter: 'all', categoryFilter: null, activePromptId: null }),
      setSearch: (query) => set({ searchQuery: query }),
      setActivePrompt: (id) => set({ activePromptId: id }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (order) => set({ sortOrder: order }),

      // CRUD Actions
      createPrompt: async (data) => {
        try {
          const result = await promptService.createPrompt({
            title: data.title || 'Untitled Prompt',
            category: data.category || 'text',
            systemPrompt: data.systemPrompt || '',
            model: data.model || 'gpt-4-turbo',
            temperature: data.temperature ?? 0.7,
            maxTokens: data.maxTokens ?? 2048,
            tags: data.tags || [],
            collectionId: data.collectionId || undefined,
          });

          set((state) => ({
            prompts: [result, ...state.prompts],
            activePromptId: result.id,
          }));

          return result;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to create prompt';
          set({ error: message });
          throw err;
        }
      },

      updatePrompt: async (id, data) => {
        try {
          const updated = await promptService.updatePrompt(id, data);
          set((state) => ({
            prompts: state.prompts.map((p) => (p.id === id ? updated : p)),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to update prompt';
          set({ error: message });
          throw err;
        }
      },

      deletePrompt: async (id) => {
        const { activePromptId } = get();
        try {
          await promptService.deletePrompt(id);
          set((state) => ({
            prompts: state.prompts.filter((p) => p.id !== id),
            activePromptId: activePromptId === id ? null : activePromptId,
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to delete prompt';
          set({ error: message });
          throw err;
        }
      },

      toggleFavorite: async (id) => {
        const prompt = get().prompts.find((p) => p.id === id);
        if (!prompt) return;

        try {
          const updated = await promptService.toggleFavorite(id, !prompt.favorite);
          set((state) => ({
            prompts: state.prompts.map((p) => (p.id === id ? updated : p)),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to toggle favorite';
          set({ error: message });
          throw err;
        }
      },

      moveToTrash: async (id) => {
        try {
          const updated = await promptService.moveToTrash(id);
          set((state) => ({
            prompts: state.prompts.map((p) => (p.id === id ? updated : p)),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to move to trash';
          set({ error: message });
          throw err;
        }
      },

      restoreFromTrash: async (id) => {
        try {
          const updated = await promptService.restoreFromTrash(id);
          set((state) => ({
            prompts: state.prompts.map((p) => (p.id === id ? updated : p)),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to restore from trash';
          set({ error: message });
          throw err;
        }
      },

      permanentDelete: async (id) => {
        const { activePromptId } = get();
        try {
          await promptService.deletePrompt(id);
          set((state) => ({
            prompts: state.prompts.filter((p) => p.id !== id),
            activePromptId: activePromptId === id ? null : activePromptId,
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to permanently delete';
          set({ error: message });
          throw err;
        }
      },

      // Version Actions
      createVersion: async (promptId, note, versionType = 'minor') => {
        try {
          const newVersion = await promptService.createVersion(promptId, { changeNote: note, versionType });
          set((state) => ({
            prompts: state.prompts.map((p) =>
              p.id === promptId
                ? {
                    ...p,
                    currentVersionId: newVersion.id,
                    versions: [newVersion, ...p.versions],
                    updatedAt: new Date().toISOString(),
                  }
                : p
            ),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to create version';
          set({ error: message });
          throw err;
        }
      },

      restoreVersion: async (promptId, versionId) => {
        try {
          const restored = await promptService.restoreVersion(promptId, versionId);
          set((state) => ({
            prompts: state.prompts.map((p) => (p.id === promptId ? restored : p)),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to restore version';
          set({ error: message });
          throw err;
        }
      },

      deleteVersion: async (promptId, versionId) => {
        const prompt = get().prompts.find((p) => p.id === promptId);
        if (!prompt) return;

        // Protection: Cannot delete current version
        if (versionId === prompt.currentVersionId) {
          throw new Error('Cannot delete the current active version');
        }

        // Protection: Must keep at least one active version
        const activeVersions = prompt.versions.filter((v) => !v.deleted);
        if (activeVersions.length <= 1) {
          throw new Error('Cannot delete the only remaining version');
        }

        try {
          await promptService.deleteVersion(promptId, versionId);
          set((state) => ({
            prompts: state.prompts.map((p) =>
              p.id === promptId
                ? {
                    ...p,
                    versions: p.versions.map((v) =>
                      v.id === versionId ? { ...v, deleted: true, deletedAt: new Date().toISOString() } : v
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : p
            ),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to delete version';
          set({ error: message });
          throw err;
        }
      },

      restoreDeletedVersion: async (promptId, versionId) => {
        try {
          const restoredVersion = await promptService.restoreDeletedVersion(promptId, versionId);
          set((state) => ({
            prompts: state.prompts.map((p) =>
              p.id === promptId
                ? {
                    ...p,
                    versions: p.versions.map((v) => (v.id === versionId ? restoredVersion : v)),
                    updatedAt: new Date().toISOString(),
                  }
                : p
            ),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to restore deleted version';
          set({ error: message });
          throw err;
        }
      },

      permanentDeleteVersion: async (promptId, versionId) => {
        const prompt = get().prompts.find((p) => p.id === promptId);
        if (!prompt) return;

        // Protection: Cannot permanently delete current version
        if (versionId === prompt.currentVersionId) {
          throw new Error('Cannot permanently delete the current active version');
        }

        try {
          await promptService.permanentDeleteVersion(promptId, versionId);
          set((state) => ({
            prompts: state.prompts.map((p) =>
              p.id === promptId
                ? {
                    ...p,
                    versions: p.versions.filter((v) => v.id !== versionId),
                    updatedAt: new Date().toISOString(),
                  }
                : p
            ),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to permanently delete version';
          set({ error: message });
          throw err;
        }
      },

      // Computed
      getFilteredPrompts: () => {
        const { prompts, filter, categoryFilter, collectionFilter, searchQuery, sortBy, sortOrder } = get();

        if (!Array.isArray(prompts)) return [];

        let filtered = prompts.filter((p) => {
          // Status filter
          if (filter === 'trash') {
            return p.status === 'trash';
          }
          if (p.status === 'trash') return false;

          // Quick filters
          if (filter === 'favorites' && !p.favorite) return false;

          // Category filter
          if (categoryFilter && p.category !== categoryFilter) return false;

          // Collection filter
          if (collectionFilter === 'uncategorized' && p.collectionId) return false;
          if (collectionFilter && collectionFilter !== 'uncategorized' && p.collectionId !== collectionFilter) return false;

          // Search filter
          if (searchQuery && !matchesSearch(p, searchQuery)) return false;

          return true;
        });

        // Sort
        filtered.sort((a, b) => {
          let comparison = 0;

          if (sortBy === 'updatedAt' || sortBy === 'createdAt') {
            comparison = new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime();
          } else if (sortBy === 'title') {
            comparison = a.title.localeCompare(b.title);
          }

          return sortOrder === 'asc' ? -comparison : comparison;
        });

        return filtered;
      },

      getActivePrompt: () => {
        const { prompts, activePromptId } = get();
        if (!Array.isArray(prompts)) return null;
        return prompts.find((p) => p.id === activePromptId) || null;
      },

      getPromptById: (id) => {
        const prompts = get().prompts;
        if (!Array.isArray(prompts)) return null;
        return prompts.find((p) => p.id === id) || null;
      },
    }),
    {
      name: 'prompt-studio-storage',
      partialize: (state) => ({
        prompts: state.prompts,
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);

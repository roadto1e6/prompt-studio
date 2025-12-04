import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prompt, QuickFilter, Category, ViewMode, SortBy, SortOrder, PromptVersion } from '@/types';
import { mockPrompts } from '@/data/mockData';
import { generateId, generateVersionNumber, matchesSearch } from '@/utils';

interface PromptState {
  // Data
  prompts: Prompt[];
  activePromptId: string | null;
  
  // Filters
  filter: QuickFilter;
  categoryFilter: Category | null;
  collectionFilter: string | null;
  searchQuery: string;
  
  // View
  viewMode: ViewMode;
  sortBy: SortBy;
  sortOrder: SortOrder;

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
  createPrompt: (data: Partial<Prompt>) => Prompt;
  updatePrompt: (id: string, data: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  toggleFavorite: (id: string) => void;
  moveToTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  permanentDelete: (id: string) => void;
  
  // Actions - Versions
  createVersion: (promptId: string, note: string) => void;
  restoreVersion: (promptId: string, versionId: string) => void;
  
  // Computed
  getFilteredPrompts: () => Prompt[];
  getActivePrompt: () => Prompt | null;
  getPromptById: (id: string) => Prompt | null;
}

export const usePromptStore = create<PromptState>()(
  persist(
    (set, get) => ({
      // Initial State
      prompts: mockPrompts,
      activePromptId: null,
      filter: 'recent',
      categoryFilter: null,
      collectionFilter: null,
      searchQuery: '',
      viewMode: 'grid',
      sortBy: 'updatedAt',
      sortOrder: 'desc',

      // Filter Actions
      setFilter: (filter) => set({ filter, categoryFilter: null, collectionFilter: null }),
      setCategory: (category) => set({ categoryFilter: category, filter: 'all', collectionFilter: null }),
      setCollection: (collectionId) => set({ collectionFilter: collectionId, filter: 'all', categoryFilter: null }),
      setSearch: (query) => set({ searchQuery: query }),
      setActivePrompt: (id) => set({ activePromptId: id }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (order) => set({ sortOrder: order }),

      // CRUD Actions
      createPrompt: (data) => {
        const now = new Date().toISOString();
        const id = generateId();
        const versionId = generateId();
        
        const newPrompt: Prompt = {
          id,
          title: data.title || 'Untitled Prompt',
          description: data.description || '',
          category: data.category || 'text',
          systemPrompt: data.systemPrompt || '',
          userTemplate: data.userTemplate || '',
          model: data.model || 'gpt-4-turbo',
          temperature: data.temperature ?? 0.7,
          maxTokens: data.maxTokens ?? 2048,
          tags: data.tags || [],
          collectionId: data.collectionId || null,
          favorite: false,
          createdAt: now,
          updatedAt: now,
          status: 'active',
          currentVersionId: versionId,
          versions: [{
            id: versionId,
            promptId: id,
            versionNumber: '1.0',
            systemPrompt: data.systemPrompt || '',
            userTemplate: data.userTemplate || '',
            model: data.model || 'gpt-4-turbo',
            temperature: data.temperature ?? 0.7,
            maxTokens: data.maxTokens ?? 2048,
            changeNote: 'Initial creation.',
            createdAt: now,
            createdBy: 'user-1',
          }],
        };

        set((state) => ({
          prompts: [newPrompt, ...state.prompts],
          activePromptId: id,
        }));

        return newPrompt;
      },

      updatePrompt: (id, data) => {
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id
              ? { ...p, ...data, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deletePrompt: (id) => {
        const { activePromptId } = get();
        set((state) => ({
          prompts: state.prompts.filter((p) => p.id !== id),
          activePromptId: activePromptId === id ? null : activePromptId,
        }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, favorite: !p.favorite } : p
          ),
        }));
      },

      moveToTrash: (id) => {
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, status: 'trash' as const, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      restoreFromTrash: (id) => {
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, status: 'active' as const, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      permanentDelete: (id) => {
        const { activePromptId } = get();
        set((state) => ({
          prompts: state.prompts.filter((p) => p.id !== id),
          activePromptId: activePromptId === id ? null : activePromptId,
        }));
      },

      // Version Actions
      createVersion: (promptId, note) => {
        const prompt = get().prompts.find((p) => p.id === promptId);
        if (!prompt) return;

        const now = new Date().toISOString();
        const versionId = generateId();
        const versionNumber = generateVersionNumber(prompt.versions);

        const newVersion: PromptVersion = {
          id: versionId,
          promptId,
          versionNumber,
          systemPrompt: prompt.systemPrompt,
          userTemplate: prompt.userTemplate,
          model: prompt.model,
          temperature: prompt.temperature,
          maxTokens: prompt.maxTokens,
          changeNote: note,
          createdAt: now,
          createdBy: 'user-1',
        };

        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === promptId
              ? {
                  ...p,
                  currentVersionId: versionId,
                  versions: [newVersion, ...p.versions],
                  updatedAt: now,
                }
              : p
          ),
        }));
      },

      restoreVersion: (promptId, versionId) => {
        const prompt = get().prompts.find((p) => p.id === promptId);
        const version = prompt?.versions.find((v) => v.id === versionId);
        if (!prompt || !version) return;

        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === promptId
              ? {
                  ...p,
                  systemPrompt: version.systemPrompt,
                  userTemplate: version.userTemplate,
                  model: version.model,
                  temperature: version.temperature,
                  maxTokens: version.maxTokens,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      // Computed
      getFilteredPrompts: () => {
        const { prompts, filter, categoryFilter, collectionFilter, searchQuery, sortBy, sortOrder } = get();
        
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
          if (collectionFilter && p.collectionId !== collectionFilter) return false;
          
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
        return prompts.find((p) => p.id === activePromptId) || null;
      },

      getPromptById: (id) => {
        return get().prompts.find((p) => p.id === id) || null;
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

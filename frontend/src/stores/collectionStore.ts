import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Collection } from '@/types';
import { collectionService } from '@/services/collectionService';

interface CollectionState {
  collections: Collection[];
  initialized: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions - Initialize
  initialize: (userId?: string) => Promise<void>;
  reset: () => void;

  // Actions - CRUD
  createCollection: (data: Partial<Collection>) => Promise<Collection>;
  updateCollection: (id: string, data: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  updatePromptCount: (id: string, delta: number) => void;
  getCollectionById: (id: string) => Collection | null;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collections: [],
      initialized: false,
      isLoading: false,
      error: null,

      // Initialize
      initialize: async () => {
        if (get().initialized) return;

        set({ isLoading: true, error: null });

        try {
          const collections = await collectionService.getAllCollections();
          set({ collections });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to load collections';
          set({ error: message });
        } finally {
          set({ isLoading: false, initialized: true });
        }
      },

      // Reset
      reset: () => {
        set({
          collections: [],
          initialized: false,
          isLoading: false,
          error: null,
        });
      },

      // Create
      createCollection: async (data) => {
        try {
          const result = await collectionService.createCollection({
            name: data.name || 'New Collection',
            description: data.description || '',
            color: data.color,
            icon: data.icon,
          });

          set((state) => ({
            collections: [...state.collections, result],
          }));

          return result;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to create collection';
          set({ error: message });
          throw err;
        }
      },

      // Update
      updateCollection: async (id, data) => {
        try {
          const updated = await collectionService.updateCollection(id, data);
          set((state) => ({
            collections: state.collections.map((c) => (c.id === id ? updated : c)),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to update collection';
          set({ error: message });
          throw err;
        }
      },

      // Delete
      deleteCollection: async (id) => {
        try {
          await collectionService.deleteCollection(id);
          set((state) => ({
            collections: state.collections.filter((c) => c.id !== id),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to delete collection';
          set({ error: message });
          throw err;
        }
      },

      // Update prompt count (local only)
      updatePromptCount: (id, delta) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id
              ? { ...c, promptCount: Math.max(0, c.promptCount + delta) }
              : c
          ),
        }));
      },

      // Get by ID
      getCollectionById: (id) => {
        return get().collections.find((c) => c.id === id) || null;
      },
    }),
    {
      name: 'prompt-studio-collections',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Collection } from '@/types';
import { mockCollections } from '@/data/mockData';
import { generateId } from '@/utils';
import { COLLECTION_COLORS } from '@/constants';

interface CollectionState {
  collections: Collection[];
  
  // Actions
  createCollection: (data: Partial<Collection>) => Collection;
  updateCollection: (id: string, data: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  updatePromptCount: (id: string, delta: number) => void;
  getCollectionById: (id: string) => Collection | null;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collections: mockCollections,

      createCollection: (data) => {
        const now = new Date().toISOString();
        const id = generateId();
        const colorIndex = get().collections.length % COLLECTION_COLORS.length;
        
        const newCollection: Collection = {
          id,
          name: data.name || 'New Collection',
          description: data.description || '',
          color: data.color || COLLECTION_COLORS[colorIndex],
          icon: data.icon || 'Folder',
          promptCount: 0,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          collections: [...state.collections, newCollection],
        }));

        return newCollection;
      },

      updateCollection: (id, data) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id
              ? { ...c, ...data, updatedAt: new Date().toISOString() }
              : c
          ),
        }));
      },

      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        }));
      },

      updatePromptCount: (id, delta) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id
              ? { ...c, promptCount: Math.max(0, c.promptCount + delta) }
              : c
          ),
        }));
      },

      getCollectionById: (id) => {
        return get().collections.find((c) => c.id === id) || null;
      },
    }),
    {
      name: 'prompt-studio-collections',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Collection } from '@/types';
import { mockCollections } from '@/data/mockData';
import { generateId } from '@/utils';
import { COLLECTION_COLORS } from '@/constants';
import { collectionService } from '@/services/collectionService';

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

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

      // Initialize - 加载用户数据
      initialize: async (_userId?: string) => {
        if (get().initialized) return;

        set({ isLoading: true, error: null });

        try {
          if (USE_MOCK) {
            // Mock 模式：使用本地数据或初始化 mock 数据
            const storedCollections = get().collections;
            if (storedCollections.length === 0) {
              set({ collections: mockCollections });
            }
          } else {
            // 真实模式：从 API 加载
            const collections = await collectionService.getAllCollections();
            set({ collections });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to load collections';
          set({ error: message });
        } finally {
          set({ isLoading: false, initialized: true });
        }
      },

      // Reset - 用户登出时清理数据
      reset: () => {
        set({
          collections: [],
          initialized: false,
          isLoading: false,
          error: null,
        });
      },

      createCollection: async (data) => {
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

        try {
          if (USE_MOCK) {
            // Mock 模式：本地创建
            set((state) => ({
              collections: [...state.collections, newCollection],
            }));
          } else {
            // 真实模式：调用 API
            const created = await collectionService.createCollection({
              name: newCollection.name,
              description: newCollection.description,
              color: newCollection.color,
              icon: newCollection.icon,
            });
            set((state) => ({
              collections: [...state.collections, created],
            }));
            return created;
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to create collection';
          set({ error: message });
          throw err;
        }

        return newCollection;
      },

      updateCollection: async (id, data) => {
        try {
          if (USE_MOCK) {
            // Mock 模式：本地更新
            set((state) => ({
              collections: state.collections.map((c) =>
                c.id === id
                  ? { ...c, ...data, updatedAt: new Date().toISOString() }
                  : c
              ),
            }));
          } else {
            // 真实模式：调用 API
            const updated = await collectionService.updateCollection(id, data);
            set((state) => ({
              collections: state.collections.map((c) => (c.id === id ? updated : c)),
            }));
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to update collection';
          set({ error: message });
          throw err;
        }
      },

      deleteCollection: async (id) => {
        try {
          if (!USE_MOCK) {
            await collectionService.deleteCollection(id);
          }
          set((state) => ({
            collections: state.collections.filter((c) => c.id !== id),
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to delete collection';
          set({ error: message });
          throw err;
        }
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

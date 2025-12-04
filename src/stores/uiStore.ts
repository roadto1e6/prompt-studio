import { create } from 'zustand';
import { TabType, ModalType } from '@/types';

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Detail Panel
  detailPanelOpen: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  openDetailPanel: () => void;
  closeDetailPanel: () => void;
  toggleDetailPanel: () => void;
  
  // Modals
  modals: Record<ModalType, boolean>;
  openModal: (modal: ModalType) => void;
  closeModal: (modal: ModalType) => void;
  closeAllModals: () => void;
  
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  // Detail Panel
  detailPanelOpen: true,
  activeTab: 'editor',
  setActiveTab: (tab) => set({ activeTab: tab }),
  openDetailPanel: () => set({ detailPanelOpen: true }),
  closeDetailPanel: () => set({ detailPanelOpen: false }),
  toggleDetailPanel: () => set((state) => ({ detailPanelOpen: !state.detailPanelOpen })),
  
  // Modals
  modals: {
    createPrompt: false,
    createCollection: false,
    settings: false,
    deleteConfirm: false,
  },
  openModal: (modal) => set((state) => ({
    modals: { ...state.modals, [modal]: true }
  })),
  closeModal: (modal) => set((state) => ({
    modals: { ...state.modals, [modal]: false }
  })),
  closeAllModals: () => set({
    modals: {
      createPrompt: false,
      createCollection: false,
      settings: false,
      deleteConfirm: false,
    }
  }),
  
  // Theme
  theme: 'dark',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'dark' ? 'light' : 'dark'
  })),
}));

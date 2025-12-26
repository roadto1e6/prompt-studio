import { create } from 'zustand';
import { TabType, ModalType, SharedPromptData } from '@/types';

interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

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

  // Confirm Dialog
  confirmConfig: ConfirmConfig | null;
  showConfirm: (config: ConfirmConfig) => void;
  hideConfirm: () => void;

  // Share/Import
  pendingImportData: SharedPromptData | null;
  setPendingImportData: (data: SharedPromptData | null) => void;

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
    sharePrompt: false,
    importPrompt: false,
    modelConfig: false,
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
      sharePrompt: false,
      importPrompt: false,
      modelConfig: false,
    }
  }),

  // Confirm Dialog
  confirmConfig: null,
  showConfirm: (config) => set({ confirmConfig: config }),
  hideConfirm: () => set({ confirmConfig: null }),

  // Share/Import
  pendingImportData: null,
  setPendingImportData: (data) => set({ pendingImportData: data }),

}));

import React, { useEffect, useRef, useCallback } from 'react';
import { MainLayout } from '@/components/layout';
import { PromptGrid, PromptDetailPanel, CreatePromptModal, SharePromptModal, ImportPromptModal } from '@/features/prompts/components';
import { CreateCollectionModal } from '@/features/collections/components';
import { ConfirmModal, KeyboardShortcutsModal } from '@/components/ui';
import { SettingsModal } from '@/components/settings';
import { useUIStore, useAuthStore } from '@/stores';
import { usePromptStore } from '@/stores/promptStore';
import { useCollectionStore } from '@/stores/collectionStore';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { getShareCodeFromUrl, decodeShareData, isShareCode } from '@/utils';
import { SharedPromptData } from '@/types';

export const HomePage: React.FC = () => {
  const { openModal, closeModal, setPendingImportData, modals } = useUIStore();
  const { user } = useAuthStore();
  const initializePrompts = usePromptStore((state) => state.initialize);
  const initializeCollections = useCollectionStore((state) => state.initialize);
  const lastClipboardContent = useRef<string>('');
  const isProcessing = useRef<boolean>(false);

  // 全局快捷键
  const { showShortcutsHelp, setShowShortcutsHelp } = useGlobalShortcuts();

  // Parse and handle share code
  const handleShareCode = useCallback((code: string) => {
    // Use modal state instead of timeout to prevent race condition
    if (isProcessing.current || modals.importPrompt) return;

    // Check if it's a URL with share parameter
    let codeToParse = code.trim();
    if (codeToParse.includes('?share=')) {
      try {
        const url = new URL(codeToParse);
        const shareParam = url.searchParams.get('share');
        if (shareParam) {
          codeToParse = decodeURIComponent(shareParam);
        }
      } catch {
        // Not a valid URL, try as code directly
      }
    }

    if (!isShareCode(codeToParse)) return;

    const data = decodeShareData<SharedPromptData>(codeToParse);
    if (data) {
      isProcessing.current = true;
      setPendingImportData(data);
      openModal('importPrompt');
    }
  }, [openModal, setPendingImportData, modals.importPrompt]);

  // Initialize user data on mount
  useEffect(() => {
    if (user) {
      initializePrompts(user.id);
      initializeCollections(user.id);
    }
  }, [user, initializePrompts, initializeCollections]);

  // Check for share code in URL on mount
  useEffect(() => {
    const shareCode = getShareCodeFromUrl();
    if (shareCode) {
      const data = decodeShareData<SharedPromptData>(shareCode);
      if (data) {
        setPendingImportData(data);
        openModal('importPrompt');
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [openModal, setPendingImportData]);

  // Reset processing flag when import modal closes
  useEffect(() => {
    if (!modals.importPrompt) {
      isProcessing.current = false;
    }
  }, [modals.importPrompt]);

  // Clipboard monitoring - listen for paste event
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't check if import modal is already open
      if (modals.importPrompt) return;

      const text = e.clipboardData?.getData('text');
      if (!text) return;

      // Check if it's a share code or share URL
      if (isShareCode(text.trim()) || text.includes('?share=PS-')) {
        e.preventDefault(); // Prevent default paste if it's a share code
        handleShareCode(text);
      }
    };

    // Check clipboard when window gains focus (user might have copied from elsewhere)
    const handleVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') return;
      if (modals.importPrompt) return;

      try {
        if (!navigator.clipboard?.readText) return;
        const text = await navigator.clipboard.readText();

        if (text && text !== lastClipboardContent.current) {
          lastClipboardContent.current = text;
          if (isShareCode(text.trim()) || text.includes('?share=PS-')) {
            handleShareCode(text);
          }
        }
      } catch {
        // Clipboard access denied - silently ignore
      }
    };

    document.addEventListener('paste', handlePaste);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleShareCode, modals.importPrompt]);

  return (
    <MainLayout detailPanel={<PromptDetailPanel />}>
      <PromptGrid />

      {/* Modals */}
      <CreatePromptModal />
      <CreateCollectionModal />
      <SharePromptModal />
      <ImportPromptModal />
      <ConfirmModal />
      <SettingsModal
        isOpen={modals.settings}
        onClose={() => closeModal('settings')}
      />
      <KeyboardShortcutsModal
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </MainLayout>
  );
};

import React from 'react';
import { MainLayout } from '@/components/layout';
import { PromptGrid, PromptDetailPanel, CreatePromptModal } from '@/features/prompts/components';
import { CreateCollectionModal } from '@/features/collections/components';

export const HomePage: React.FC = () => {
  return (
    <MainLayout detailPanel={<PromptDetailPanel />}>
      <PromptGrid />
      
      {/* Modals */}
      <CreatePromptModal />
      <CreateCollectionModal />
    </MainLayout>
  );
};

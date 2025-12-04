import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import { usePromptStore, useUIStore } from '@/stores';
import { PromptCard } from './PromptCard';
import { EmptyState } from '@/components/shared';

export const PromptGrid: React.FC = () => {
  const { getFilteredPrompts, activePromptId, setActivePrompt } = usePromptStore();
  const { openModal, openDetailPanel } = useUIStore();
  
  const prompts = getFilteredPrompts();

  const handleSelectPrompt = (id: string) => {
    setActivePrompt(id);
    openDetailPanel();
  };

  const handleDownloadSource = () => {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-studio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (prompts.length === 0) {
    return (
      <div className="p-6 h-full">
        <EmptyState
          title="No prompts found"
          description="Create a new prompt to get started."
          action={{
            label: 'New Prompt',
            onClick: () => openModal('createPrompt'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 relative h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isSelected={activePromptId === prompt.id}
              onClick={() => handleSelectPrompt(prompt.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Download Button */}
      <button
        onClick={handleDownloadSource}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 animate-float"
      >
        <Download className="w-5 h-5" />
        <span className="font-bold pr-1">Download Source Code</span>
      </button>
    </div>
  );
};

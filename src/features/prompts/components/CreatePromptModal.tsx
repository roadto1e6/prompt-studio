import React, { useState } from 'react';
import { FileText, Image, AudioLines, Video } from 'lucide-react';
import { usePromptStore, useCollectionStore, useUIStore } from '@/stores';
import { Modal, Input, Textarea, Select, Button } from '@/components/ui';
import { AI_MODELS, CATEGORIES } from '@/constants';
import { Category } from '@/types';
import { cn } from '@/utils';

const categoryIcons: Record<Category, React.FC<{ className?: string }>> = {
  text: FileText,
  image: Image,
  audio: AudioLines,
  video: Video,
};

export const CreatePromptModal: React.FC = () => {
  const { createPrompt, setActivePrompt } = usePromptStore();
  const { collections } = useCollectionStore();
  const { modals, closeModal, openDetailPanel } = useUIStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('text');
  const [model, setModel] = useState('gpt-4-turbo');
  const [collectionId, setCollectionId] = useState<string>('');
  const [systemPrompt, setSystemPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPrompt = createPrompt({
      title: title.trim() || 'Untitled Prompt',
      description,
      category,
      model,
      collectionId: collectionId || null,
      systemPrompt,
    });

    // Select the new prompt and open detail panel
    setActivePrompt(newPrompt.id);
    openDetailPanel();
    
    // Reset form and close modal
    resetForm();
    closeModal('createPrompt');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('text');
    setModel('gpt-4-turbo');
    setCollectionId('');
    setSystemPrompt('');
  };

  const handleClose = () => {
    resetForm();
    closeModal('createPrompt');
  };

  // Prepare model options
  const modelGroups = AI_MODELS.map(group => ({
    label: group.group,
    options: group.models.map(m => ({ value: m.id, label: m.name })),
  }));

  return (
    <Modal
      isOpen={modals.createPrompt}
      onClose={handleClose}
      title="Create New Prompt"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter prompt title..."
          autoFocus
        />

        {/* Description */}
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of what this prompt does..."
        />

        {/* Category Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Category
          </label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat.id as Category];
              const isSelected = category === cat.id;
              
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as Category)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border transition-all',
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-700 bg-dark-900 hover:border-slate-600'
                  )}
                >
                  <Icon className={cn('w-5 h-5', cat.color)} />
                  <span className={cn(
                    'text-xs font-medium',
                    isSelected ? 'text-indigo-400' : 'text-slate-400'
                  )}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Model & Collection Row */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="AI Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            groups={modelGroups}
          />
          <Select
            label="Collection"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            options={[
              { value: '', label: 'No Collection' },
              ...collections.map(c => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            System Prompt (Optional)
          </label>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter your system prompt here... You can add more details later."
            className="h-32"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Prompt
          </Button>
        </div>
      </form>
    </Modal>
  );
};

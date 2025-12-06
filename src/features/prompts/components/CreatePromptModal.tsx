import React, { useState } from 'react';
import { FileText, Image, AudioLines, Video } from 'lucide-react';
import { usePromptStore, useCollectionStore, useUIStore, useI18nStore } from '@/stores';
import { Modal, Input, Textarea, Select, Button } from '@/components/ui';
import { MODELS_BY_CATEGORY, DEFAULT_MODEL_BY_CATEGORY, CATEGORIES } from '@/constants';
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
  const { t } = useI18nStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('text');
  const [model, setModel] = useState(DEFAULT_MODEL_BY_CATEGORY['text']);
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
    setModel(DEFAULT_MODEL_BY_CATEGORY['text']);
    setCollectionId('');
    setSystemPrompt('');
  };

  const handleClose = () => {
    resetForm();
    closeModal('createPrompt');
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setModel(DEFAULT_MODEL_BY_CATEGORY[newCategory]);
  };

  // Prepare model options based on selected category
  const modelGroups = MODELS_BY_CATEGORY[category].map(group => ({
    label: group.group,
    options: group.models.map(m => ({ value: m.id, label: m.name })),
  }));

  return (
    <Modal
      isOpen={modals.createPrompt}
      onClose={handleClose}
      title={t.createPrompt.title}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label={t.createPrompt.titleLabel}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.createPrompt.titlePlaceholder}
          autoFocus
        />

        {/* Description */}
        <Input
          label={t.createPrompt.descriptionLabel}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.createPrompt.descriptionPlaceholder}
        />

        {/* Category Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.createPrompt.categoryLabel}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat.id as Category];
              const isSelected = category === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id as Category)}
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
                    {t.categories[cat.id as keyof typeof t.categories]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Model & Collection Row */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label={t.editor.model}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            groups={modelGroups}
          />
          <Select
            label={t.createPrompt.collectionLabel}
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            options={[
              { value: '', label: t.metadata.noCollection },
              ...collections.map(c => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.editor.systemPrompt}
          </label>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder={t.editor.systemPromptPlaceholder}
            className="h-32"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={handleClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" variant="primary">
            {t.createPrompt.createButton}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

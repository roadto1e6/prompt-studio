import React, { useState, useEffect } from 'react';
import { FileText, Image, AudioLines, Video } from 'lucide-react';
import { usePromptStore, useCollectionStore, useUIStore, useI18nStore, useModelStore } from '@/stores';
import { Modal, Input, Textarea, Select, Button } from '@/components/ui';
import { CATEGORIES } from '@/constants';
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
  const { getModelOptions, getDefaultModelId, initialized, initialize } = useModelStore();

  // 初始化模型数据
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('text');
  const [model, setModel] = useState(() => getDefaultModelId('text'));
  const [collectionId, setCollectionId] = useState<string>('');
  const [systemPrompt, setSystemPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPrompt = await createPrompt({
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
    setModel(getDefaultModelId('text'));
    setCollectionId('');
    setSystemPrompt('');
  };

  const handleClose = () => {
    resetForm();
    closeModal('createPrompt');
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setModel(getDefaultModelId(newCategory));
  };

  // Prepare model options based on selected category
  const modelOptions = getModelOptions(category);
  const modelGroups = modelOptions.map(group => ({
    label: group.providerName,
    options: group.options.map(m => ({ value: m.value, label: m.label })),
  }));

  return (
    <Modal
      isOpen={modals.createPrompt}
      onClose={handleClose}
      title={t.createPrompt.title}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Description Row */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t.createPrompt.titleLabel}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.createPrompt.titlePlaceholder}
            autoFocus
          />
          <Input
            label={t.createPrompt.descriptionLabel}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.createPrompt.descriptionPlaceholder}
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-xs font-bold text-theme-text-label uppercase tracking-wider mb-2.5">
            {t.createPrompt.categoryLabel}
          </label>
          <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat.id as Category];
              const isSelected = category === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id as Category)}
                  className={cn(
                    'flex flex-col items-center gap-2 py-3 px-4 rounded-xl border-2 transition-all',
                    isSelected
                      ? 'border-theme-accent bg-theme-accent/10 shadow-lg shadow-theme-accent/20'
                      : 'border-theme-border bg-theme-card-bg hover:border-theme-card-hover-border hover:bg-theme-bg-hover'
                  )}
                >
                  <Icon className={cn('w-5 h-5', cat.color)} />
                  <span className={cn(
                    'text-sm font-medium',
                    isSelected ? 'text-theme-accent' : 'text-theme-text-secondary'
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
            searchable
            searchPlaceholder={t.common?.search || 'Search models...'}
            placeholder="Select a model..."
          />
          <Select
            label={t.createPrompt.collectionLabel}
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            options={[
              { value: '', label: t.metadata.noCollection },
              ...collections.map(c => ({ value: c.id, label: c.name })),
            ]}
            placeholder={t.metadata?.noCollection || 'No collection'}
          />
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-xs font-bold text-theme-text-label uppercase tracking-wider mb-2.5">
            {t.editor.systemPrompt}
          </label>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder={t.editor.systemPromptPlaceholder}
            className="h-40 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
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

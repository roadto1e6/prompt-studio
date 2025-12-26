import React, { useState } from 'react';
import { Folder } from 'lucide-react';
import { useCollectionStore, useUIStore, useI18nStore } from '@/stores';
import { Modal, Input, Button } from '@/components/ui';
import { COLLECTION_COLORS } from '@/constants';
import { cn } from '@/utils';

export const CreateCollectionModal: React.FC = () => {
  const { createCollection } = useCollectionStore();
  const { modals, closeModal } = useUIStore();
  const { t } = useI18nStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<typeof COLLECTION_COLORS[number]>(COLLECTION_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createCollection({
      name: name.trim() || t.createCollection?.nameLabel || 'New Collection',
      description,
      color,
    });

    resetForm();
    closeModal('createCollection');
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setColor(COLLECTION_COLORS[0]);
  };

  const handleClose = () => {
    resetForm();
    closeModal('createCollection');
  };

  return (
    <Modal
      isOpen={modals.createCollection}
      onClose={handleClose}
      title={t.createCollection?.title || 'Create Collection'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preview */}
        <div className="flex items-center gap-3 p-4 bg-theme-bg-primary rounded-lg border border-theme-border">
          <Folder className={cn('w-8 h-8', color)} />
          <div>
            <p className="font-medium text-theme-text-primary">
              {name || t.createCollection?.nameLabel || 'Collection Name'}
            </p>
            <p className="text-xs text-theme-text-muted">
              0 {t.createCollection?.promptsCount?.replace('{count}', '0') || 'prompts'}
            </p>
          </div>
        </div>

        {/* Name */}
        <Input
          label={t.createCollection?.nameLabel || 'Name'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.createCollection?.namePlaceholder || 'Enter collection name...'}
          autoFocus
        />

        {/* Description */}
        <Input
          label={t.createCollection?.descriptionLabel || 'Description (Optional)'}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.createCollection?.descriptionPlaceholder || 'Brief description...'}
        />

        {/* Color Selection */}
        <div>
          <label className="block text-xs font-bold text-theme-text-label uppercase tracking-wider mb-2">
            {t.createCollection?.colorLabel || 'Color'}
          </label>
          <div className="flex gap-2 flex-wrap">
            {COLLECTION_COLORS.map((c) => {
              const isSelected = color === c;
              // Extract the color name from the class
              const colorValue = c.replace('text-', '').replace('-500', '');

              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-all',
                    `bg-${colorValue}-500`,
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-offset-theme-bg-secondary ring-theme-text-primary scale-110'
                      : 'hover:scale-105'
                  )}
                  style={{
                    backgroundColor: getColorValue(colorValue),
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
          <Button type="button" variant="ghost" onClick={handleClose}>
            {t.common?.cancel || 'Cancel'}
          </Button>
          <Button type="submit" variant="primary">
            {t.createCollection?.createButton || 'Create Collection'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Helper to get actual color values
function getColorValue(color: string): string {
  const colors: Record<string, string> = {
    pink: '#ec4899',
    emerald: '#10b981',
    blue: '#3b82f6',
    amber: '#f59e0b',
    purple: '#a855f7',
    cyan: '#06b6d4',
    red: '#ef4444',
    lime: '#84cc16',
  };
  return colors[color] || '#6366f1';
}

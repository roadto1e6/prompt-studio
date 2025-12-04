import React, { useState } from 'react';
import { Folder } from 'lucide-react';
import { useCollectionStore, useUIStore } from '@/stores';
import { Modal, Input, Button } from '@/components/ui';
import { COLLECTION_COLORS } from '@/constants';
import { cn } from '@/utils';

export const CreateCollectionModal: React.FC = () => {
  const { createCollection } = useCollectionStore();
  const { modals, closeModal } = useUIStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLLECTION_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createCollection({
      name: name.trim() || 'New Collection',
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
      title="Create Collection"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preview */}
        <div className="flex items-center gap-3 p-4 bg-dark-900 rounded-lg border border-slate-800">
          <Folder className={cn('w-8 h-8', color)} />
          <div>
            <p className="font-medium text-white">
              {name || 'Collection Name'}
            </p>
            <p className="text-xs text-slate-500">0 prompts</p>
          </div>
        </div>

        {/* Name */}
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter collection name..."
          autoFocus
        />

        {/* Description */}
        <Input
          label="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description..."
        />

        {/* Color Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Color
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
                      ? 'ring-2 ring-offset-2 ring-offset-dark-800 ring-white scale-110'
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
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Collection
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

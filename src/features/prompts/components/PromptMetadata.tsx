import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { usePromptStore, useCollectionStore } from '@/stores';
import { Select, Slider, Input, Badge } from '@/components/ui';
import { MODELS_BY_CATEGORY } from '@/constants';

export const PromptMetadata: React.FC = () => {
  const { getActivePrompt, updatePrompt } = usePromptStore();
  const { collections } = useCollectionStore();
  const prompt = getActivePrompt();

  const [model, setModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync with selected prompt
  useEffect(() => {
    if (prompt) {
      setModel(prompt.model);
      setTemperature(prompt.temperature);
      setMaxTokens(prompt.maxTokens);
      setTags(prompt.tags);
      setCollectionId(prompt.collectionId);
    }
  }, [prompt?.id]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setModel(newModel);
    if (prompt) {
      updatePrompt(prompt.id, { model: newModel });
    }
  };

  const handleTemperatureChange = (value: number) => {
    setTemperature(value);
    if (prompt) {
      updatePrompt(prompt.id, { temperature: value });
    }
  };

  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMaxTokens(value);
    if (prompt) {
      updatePrompt(prompt.id, { maxTokens: value });
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      const tag = newTag.trim().toLowerCase().replace(/\s+/g, '-');
      if (!tags.includes(tag)) {
        const newTags = [...tags, tag];
        setTags(newTags);
        if (prompt) {
          updatePrompt(prompt.id, { tags: newTags });
        }
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    setTags(newTags);
    if (prompt) {
      updatePrompt(prompt.id, { tags: newTags });
    }
  };

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || null;
    setCollectionId(value);
    if (prompt) {
      updatePrompt(prompt.id, { collectionId: value });
    }
  };

  if (!prompt) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <p>Select a prompt to view metadata</p>
      </div>
    );
  }

  // Prepare model options for Select based on prompt category
  const modelGroups = MODELS_BY_CATEGORY[prompt.category].map(group => ({
    label: group.group,
    options: group.models.map(m => ({ value: m.id, label: m.name })),
  }));

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Model Selection */}
        <Select
          label="AI Model"
          value={model}
          onChange={handleModelChange}
          groups={modelGroups}
        />

        {/* Temperature Slider */}
        <Slider
          label="Temperature"
          value={temperature}
          onChange={handleTemperatureChange}
          min={0}
          max={2}
          step={0.1}
          minLabel="Precise"
          maxLabel="Creative"
        />

        {/* Max Tokens */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Max Tokens
            </label>
            <span className="text-xs text-indigo-400 font-mono">{maxTokens}</span>
          </div>
          <Input
            type="number"
            value={maxTokens}
            onChange={handleMaxTokensChange}
            min={1}
            max={128000}
          />
        </div>

        {/* Collection */}
        <Select
          label="Collection"
          value={collectionId || ''}
          onChange={handleCollectionChange}
          options={[
            { value: '', label: 'No Collection' },
            ...collections.map(c => ({ value: c.id, label: c.name })),
          ]}
        />

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <Badge
                key={tag}
                variant="primary"
                size="md"
                removable
                onRemove={() => handleRemoveTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add a tag..."
          />
        </div>

        {/* Advanced Settings (Collapsible) */}
        <div className="border-t border-slate-800 pt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-left text-slate-400 hover:text-white transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider">
              Advanced Settings
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
            />
          </button>
          
          {showAdvanced && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-dark-900 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500">
                  Advanced settings like top_p, frequency_penalty, and presence_penalty
                  will be available in a future update.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { usePromptStore, useCollectionStore, useModelStore, useI18nStore } from '@/stores';
import { Select, Slider, Input, Badge } from '@/components/ui';

export const PromptMetadata: React.FC = () => {
  const { getActivePrompt, updatePrompt } = usePromptStore();
  const { collections } = useCollectionStore();
  const { getModelOptions, initialized, initialize } = useModelStore();
  const { t } = useI18nStore();
  const prompt = getActivePrompt();

  // 初始化模型数据
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

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

  const handleModelChange = (e: { target: { value: string } }) => {
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

  const handleCollectionChange = (e: { target: { value: string } }) => {
    const value = e.target.value || null;
    setCollectionId(value);
    if (prompt) {
      updatePrompt(prompt.id, { collectionId: value });
    }
  };

  if (!prompt) {
    return (
      <div className="h-full flex items-center justify-center text-theme-text-muted">
        <p>{t.metadata.selectPrompt}</p>
      </div>
    );
  }

  // Prepare model options for Select based on prompt category
  const modelOptions = getModelOptions(prompt.category);
  const modelGroups = modelOptions.map(group => ({
    label: group.providerName,
    options: group.options.map(m => ({ value: m.value, label: m.label })),
  }));

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Model Selection */}
        <Select
          label={t.metadata.aiModel}
          value={model}
          onChange={handleModelChange}
          groups={modelGroups}
          searchable
          searchPlaceholder={t.metadata.searchModels}
          placeholder={t.metadata.selectModel}
        />

        {/* Temperature Slider */}
        <Slider
          label={t.metadata.temperature}
          value={temperature}
          onChange={handleTemperatureChange}
          min={0}
          max={2}
          step={0.1}
          minLabel={t.metadata.precise}
          maxLabel={t.metadata.creative}
        />

        {/* Max Tokens */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-theme-text-label uppercase tracking-wider">
              {t.metadata.maxTokens}
            </label>
            <span className="text-xs text-theme-accent font-mono">{maxTokens}</span>
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
          label={t.metadata.collection}
          value={collectionId || ''}
          onChange={handleCollectionChange}
          options={[
            { value: '', label: t.metadata.noCollection },
            ...collections.map(c => ({ value: c.id, label: c.name })),
          ]}
          placeholder={t.metadata.noCollection}
        />

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-theme-text-label uppercase tracking-wider mb-2">
            {t.metadata.tags}
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
            placeholder={t.metadata.addTag}
          />
        </div>

        {/* Advanced Settings (Collapsible) */}
        <div className="border-t border-theme-border pt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-left text-theme-text-secondary hover:text-theme-text-primary transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.metadata.advancedSettings}
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
            />
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-theme-bg-secondary rounded-lg border border-theme-border">
                <p className="text-xs text-theme-text-muted">
                  {t.metadata.advancedSettingsHint}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

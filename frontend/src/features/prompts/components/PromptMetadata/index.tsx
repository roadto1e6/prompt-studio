/**
 * PromptMetadata 组件 - 视图层
 * 提示词元数据编辑
 */

import { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { useI18nStore } from '@/stores';
import { Select, Slider, Input, Badge } from '@/components/ui';
import { usePromptMetadata } from './usePromptMetadata';
import type { PromptMetadataProps } from './types';

/**
 * PromptMetadata 组件
 */
export const PromptMetadata = memo<PromptMetadataProps>(() => {
  const { t } = useI18nStore();
  const metadata = usePromptMetadata();

  if (!metadata.prompt) {
    return (
      <div className="h-full flex items-center justify-center text-theme-text-muted">
        <p>{t.metadata.selectPrompt}</p>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Model Selection */}
        <Select
          label={t.metadata.aiModel}
          value={metadata.model}
          onChange={metadata.handleModelChange}
          groups={metadata.modelGroups}
          searchable
          searchPlaceholder={t.metadata.searchModels}
          placeholder={t.metadata.selectModel}
        />

        {/* Temperature Slider */}
        <Slider
          label={t.metadata.temperature}
          value={metadata.temperature}
          onChange={metadata.handleTemperatureChange}
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
            <span className="text-xs text-theme-accent font-mono">{metadata.maxTokens}</span>
          </div>
          <Input
            type="number"
            value={metadata.maxTokens}
            onChange={metadata.handleMaxTokensChange}
            min={1}
            max={128000}
          />
        </div>

        {/* Collection */}
        <Select
          label={t.metadata.collection}
          value={metadata.collectionId || ''}
          onChange={metadata.handleCollectionChange}
          options={metadata.collectionOptions}
          placeholder={t.metadata.noCollection}
        />

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-theme-text-label uppercase tracking-wider mb-2">
            {t.metadata.tags}
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {metadata.tags.map((tag) => (
              <Badge
                key={tag}
                variant="primary"
                size="md"
                removable
                onRemove={() => metadata.handleRemoveTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Input
            type="text"
            value={metadata.newTag}
            onChange={metadata.handleNewTagChange}
            onKeyDown={metadata.handleAddTag}
            placeholder={t.metadata.addTag}
          />
        </div>

        {/* Advanced Settings */}
        <div className="border-t border-theme-border pt-4">
          <button
            onClick={metadata.toggleAdvanced}
            className="flex items-center justify-between w-full text-left text-theme-text-secondary hover:text-theme-text-primary transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.metadata.advancedSettings}
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${metadata.showAdvanced ? 'rotate-90' : ''}`}
            />
          </button>

          {metadata.showAdvanced && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-theme-bg-secondary rounded-lg border border-theme-border">
                <p className="text-xs text-theme-text-muted">{t.metadata.advancedSettingsHint}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PromptMetadata.displayName = 'PromptMetadata';

export default PromptMetadata;

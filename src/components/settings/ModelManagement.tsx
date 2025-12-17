/**
 * Model Management Component
 * 用户自定义模型管理组件
 *
 * 设计原则：
 * 1. 简洁清晰的列表布局
 * 2. 便捷的筛选功能
 * 3. 流畅的交互体验
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Server,
  X,
  Check,
  Loader2,
  AlertCircle,
  Settings2,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { SettingsSection } from './shared';
import { useModelStore } from '@/stores/modelStore';
import { useI18nStore } from '@/stores/i18nStore';
import { cn } from '@/utils';
import type { UserCustomModel, ModelCapability } from '@/types';

// ============ Types ============

interface ModelFormData {
  id: string;
  name: string;
  providerId: string;
  capabilities: ModelCapability[];
  maxTokens: number;
  contextWindow: number | null;
  description: string;
}

const defaultFormData: ModelFormData = {
  id: '',
  name: '',
  providerId: '',
  capabilities: ['text'],
  maxTokens: 4096,
  contextWindow: null,
  description: '',
};

// ============ Component ============

export function ModelManagement() {
  const { t } = useI18nStore();
  const {
    providers,
    userModels,
    createUserModel,
    updateUserModel,
    deleteUserModel,
    isModelIdExists,
  } = useModelStore();

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [editingModel, setEditingModel] = useState<UserCustomModel | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedCapability, setSelectedCapability] = useState<ModelCapability | ''>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<ModelFormData>(defaultFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Capabilities options
  const capabilityOptions: { value: ModelCapability; label: string; color: string }[] = [
    { value: 'text', label: t.categories?.text || 'Text', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    {
      value: 'image',
      label: t.categories?.image || 'Image',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
    {
      value: 'audio',
      label: t.categories?.audio || 'Audio',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    {
      value: 'video',
      label: t.categories?.video || 'Video',
      color: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    },
  ];

  // Filter models
  const filteredUserModels = useMemo(() => {
    return userModels.filter((model) => {
      const matchesProvider = !selectedProvider || model.providerId === selectedProvider;
      const matchesCapability = !selectedCapability || model.capabilities.includes(selectedCapability);
      return matchesProvider && matchesCapability;
    });
  }, [userModels, selectedProvider, selectedCapability]);

  // Reset form when closing
  useEffect(() => {
    if (!showForm) {
      setFormData(defaultFormData);
      setEditingModel(null);
      setFormError(null);
    }
  }, [showForm]);

  // Handle edit model
  const handleEditModel = (model: UserCustomModel) => {
    setEditingModel(model);
    setFormData({
      id: model.id,
      name: model.name,
      providerId: model.providerId,
      capabilities: model.capabilities,
      maxTokens: model.maxTokens,
      contextWindow: model.contextWindow || null,
      description: model.description || '',
    });
    setShowForm(true);
  };

  // Handle delete model
  const handleDeleteModel = (id: string) => {
    deleteUserModel(id);
    setDeleteConfirm(null);
  };

  // Handle form submit
  const handleSubmit = () => {
    setFormError(null);

    // Validation
    if (!formData.id.trim()) {
      setFormError((t.settings?.modelId || 'Model ID') + ' is required');
      return;
    }
    if (!formData.name.trim()) {
      setFormError((t.settings?.modelName || 'Model Name') + ' is required');
      return;
    }
    if (!formData.providerId) {
      setFormError((t.settings?.provider || 'Provider') + ' is required');
      return;
    }
    if (formData.capabilities.length === 0) {
      setFormError((t.settings?.capabilities || 'Capabilities') + ' is required');
      return;
    }
    if (!formData.maxTokens || formData.maxTokens <= 0) {
      setFormError((t.settings?.maxTokens || 'Max Tokens') + ' is required');
      return;
    }

    // Check if ID exists (only for new models)
    if (!editingModel && isModelIdExists(formData.id.trim())) {
      setFormError(t.settings?.modelIdExists || 'Model ID already exists');
      return;
    }

    setIsSaving(true);

    try {
      if (editingModel) {
        // Update existing model
        updateUserModel(editingModel.id, {
          name: formData.name.trim(),
          capabilities: formData.capabilities,
          maxTokens: formData.maxTokens,
          contextWindow: formData.contextWindow || undefined,
          description: formData.description.trim() || undefined,
        });
      } else {
        // Create new model
        createUserModel({
          id: formData.id.trim(),
          name: formData.name.trim(),
          providerId: formData.providerId,
          capabilities: formData.capabilities,
          maxTokens: formData.maxTokens,
          contextWindow: formData.contextWindow || undefined,
          description: formData.description.trim() || undefined,
        });
      }
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save model');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle capability
  const toggleCapability = (cap: ModelCapability) => {
    setFormData((prev) => ({
      ...prev,
      capabilities: prev.capabilities.includes(cap)
        ? prev.capabilities.filter((c) => c !== cap)
        : [...prev.capabilities, cap],
    }));
  };

  // Get provider name
  const getProviderName = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId);
    return provider?.name || providerId;
  };

  // Get capability style
  const getCapabilityStyle = (cap: ModelCapability) => {
    return capabilityOptions.find((c) => c.value === cap)?.color || 'bg-slate-500/10 text-slate-400';
  };

  // Render model card
  const renderModelCard = (model: UserCustomModel) => {
    const isDeleting = deleteConfirm === model.id;

    return (
      <div
        key={model.id}
        className="group relative p-4 rounded-lg border transition-all duration-200 bg-theme-card-bg border-theme-card-border hover:border-theme-accent/30 hover:bg-theme-bg-hover"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold truncate text-theme-text-primary">
                {model.name}
              </h4>
              <span
                className={cn(
                  'px-2 py-0.5 text-[10px] font-semibold rounded-full border flex-shrink-0',
                  'bg-theme-accent/10 text-theme-accent border-theme-accent/30'
                )}
              >
                {t.settings?.customModelBadge || 'Custom'}
              </span>
            </div>

            {/* ID */}
            <p className="text-xs font-mono truncate text-theme-text-secondary">
              {model.id}
            </p>

            {/* Info */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-theme-text-secondary">
              <span className="flex items-center gap-1.5">
                <Server className="w-3 h-3 text-theme-text-muted" />
                {getProviderName(model.providerId)}
              </span>
              <span className="text-theme-text-muted">•</span>
              <span>{model.maxTokens.toLocaleString()} tokens</span>
              {model.contextWindow && (
                <>
                  <span className="text-theme-text-muted">•</span>
                  <span>{(model.contextWindow / 1000).toFixed(0)}K context</span>
                </>
              )}
            </div>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-1.5">
              {model.capabilities.map((cap) => (
                <span
                  key={cap}
                  className={cn('px-2 py-0.5 text-[10px] font-medium rounded-full border', getCapabilityStyle(cap))}
                >
                  {capabilityOptions.find((c) => c.value === cap)?.label || cap}
                </span>
              ))}
            </div>

            {/* Description */}
            {model.description && (
              <p className="text-xs line-clamp-2 text-theme-text-secondary">
                {model.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isDeleting ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteModel(model.id)}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(null)}
                  className="h-8 w-8 p-0 text-theme-text-secondary hover:text-theme-text-primary"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditModel(model)}
                  className="h-8 w-8 p-0 text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-bg-hover"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(model.id)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render form
  const renderForm = () => {
    return (
      <SettingsSection
        title={editingModel ? (t.settings?.editModel || 'Edit Model') : (t.settings?.addModel || 'Add Model')}
        description={editingModel ? 'Update your custom model settings' : 'Create a new custom AI model'}
        action={
          <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
            <X className="w-4 h-4" />
          </Button>
        }
      >
        <div className="space-y-4">
          {/* Error */}
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{formError}</p>
            </div>
          )}

          {/* Model ID & Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
                {t.settings?.modelId || 'Model ID'} *
              </label>
              <Input
                value={formData.id}
                onChange={(e) => setFormData((prev) => ({ ...prev, id: e.target.value }))}
                placeholder={t.settings?.modelIdPlaceholder || 'e.g., my-custom-gpt'}
                disabled={!!editingModel}
                className={editingModel ? 'opacity-50 cursor-not-allowed' : ''}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
                {t.settings?.modelName || 'Model Name'} *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={t.settings?.modelNamePlaceholder || 'e.g., My Custom GPT'}
              />
            </div>
          </div>

          {/* Provider */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
              {t.settings?.provider || 'Provider'} *
            </label>
            <select
              value={formData.providerId}
              onChange={(e) => setFormData((prev) => ({ ...prev, providerId: e.target.value }))}
              disabled={!!editingModel}
              className={cn(
                'w-full px-3.5 py-2.5 border rounded-lg text-sm bg-theme-input-bg border-theme-input-border text-theme-input-text',
                'focus:outline-none focus:ring-2 focus:ring-theme-accent/50 focus:border-theme-accent',
                editingModel ? 'opacity-50 cursor-not-allowed' : ''
              )}
            >
              <option value="">{t.settings?.selectProvider || 'Select provider'}</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          {/* Capabilities */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
              {t.settings?.capabilities || 'Capabilities'} *
            </label>
            <div className="flex flex-wrap gap-2">
              {capabilityOptions.map((cap) => (
                <button
                  key={cap.value}
                  type="button"
                  onClick={() => toggleCapability(cap.value)}
                  className={cn(
                    'px-3.5 py-2 text-sm rounded-lg border-2 transition-all duration-200 font-medium',
                    formData.capabilities.includes(cap.value)
                      ? 'bg-theme-accent/10 border-theme-accent/50 text-theme-accent'
                      : 'bg-theme-bg-secondary border-theme-border text-theme-text-secondary hover:border-theme-card-hover-border hover:text-theme-text-primary'
                  )}
                >
                  {cap.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Tokens & Context Window */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
                {t.settings?.maxTokens || 'Max Tokens'} *
              </label>
              <Input
                type="number"
                value={formData.maxTokens}
                onChange={(e) => setFormData((prev) => ({ ...prev, maxTokens: parseInt(e.target.value) || 0 }))}
                placeholder={t.settings?.maxTokensPlaceholder || 'e.g., 4096'}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
                {t.settings?.contextWindow || 'Context Window'}
              </label>
              <Input
                type="number"
                value={formData.contextWindow || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, contextWindow: parseInt(e.target.value) || null }))}
                placeholder={t.settings?.contextWindowPlaceholder || 'e.g., 128000'}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-theme-text-label">
              {t.settings?.description || 'Description'}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder={t.settings?.descriptionPlaceholder || 'Describe what this model is for...'}
              rows={3}
              className="w-full px-3.5 py-2.5 border rounded-lg text-sm resize-none bg-theme-input-bg border-theme-input-border text-theme-input-text placeholder:text-theme-input-placeholder focus:outline-none focus:ring-2 focus:ring-theme-accent/50 focus:border-theme-accent"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              {t.common?.cancel || 'Cancel'}
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.settings?.saving || 'Saving...'}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {editingModel ? t.common?.save || 'Save' : t.settings?.addModel || 'Add Model'}
                </>
              )}
            </Button>
          </div>
        </div>
      </SettingsSection>
    );
  };

  return (
    <div className="space-y-5">
      {/* Form or List */}
      {showForm ? (
        renderForm()
      ) : (
        <>
          {/* Header with filters */}
          <SettingsSection
            title={t.settings?.aiModels || 'AI Models'}
            description={t.settings?.customModelsDescription || 'Manage your custom AI models'}
            action={
              <Button onClick={() => setShowForm(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                {t.settings?.addModel || 'Add Model'}
              </Button>
            }
          >
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent/50 bg-theme-input-bg border-theme-input-border text-theme-input-text"
                >
                  <option value="">{t.settings?.allProviders || 'All Providers'}</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCapability}
                  onChange={(e) => setSelectedCapability(e.target.value as ModelCapability | '')}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theme-accent/50 bg-theme-input-bg border-theme-input-border text-theme-input-text"
                >
                  <option value="">{t.settings?.allCapabilities || 'All Types'}</option>
                  {capabilityOptions.map((cap) => (
                    <option key={cap.value} value={cap.value}>
                      {cap.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stats */}
              <div className="text-sm text-theme-text-secondary">
                {filteredUserModels.length === userModels.length ? (
                  <span>
                    {t.settings?.modelsCount?.replace('{count}', String(userModels.length)) || `${userModels.length} models`}
                  </span>
                ) : (
                  <span>
                    {t.settings?.showingModels?.replace('{shown}', String(filteredUserModels.length)).replace('{total}', String(userModels.length)) ||
                      `Showing ${filteredUserModels.length} of ${userModels.length} models`}
                  </span>
                )}
              </div>
            </div>
          </SettingsSection>

          {/* Models List */}
          <SettingsSection>
            {filteredUserModels.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-theme-bg-secondary">
                  <Settings2 className="w-7 h-7 text-theme-text-muted" />
                </div>
                <p className="text-sm font-medium text-theme-text-secondary">
                  {t.settings?.noCustomModels || 'No custom models yet'}
                </p>
                <p className="text-xs mt-1 mb-5 text-theme-text-muted">
                  {t.settings?.noCustomModelsDescription || 'Add your first custom model to get started'}
                </p>
                <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t.settings?.addModel || 'Add Model'}
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredUserModels.map((model) => renderModelCard(model))}
              </div>
            )}
          </SettingsSection>
        </>
      )}
    </div>
  );
}

export default ModelManagement;

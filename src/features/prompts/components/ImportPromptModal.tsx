import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Image, AudioLines, Video, AlertTriangle, Loader2, ArrowLeft, User } from 'lucide-react';
import { usePromptStore, useUIStore, useI18nStore } from '@/stores';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/utils';
import { shareService } from '@/services';
import { SharedPromptData, Category } from '@/types';

const categoryConfig: Record<Category, { icon: React.FC<{ className?: string }>; color: string; bg: string }> = {
  text: { icon: FileText, color: 'text-theme-accent', bg: 'bg-theme-accent/20' },
  image: { icon: Image, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  audio: { icon: AudioLines, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  video: { icon: Video, color: 'text-rose-400', bg: 'bg-rose-500/20' },
};

export const ImportPromptModal: React.FC = () => {
  const { createPrompt, prompts } = usePromptStore();
  const { modals, closeModal, pendingImportData, setPendingImportData } = useUIStore();
  const { t } = useI18nStore();

  const [inputCode, setInputCode] = useState('');
  const [parsedData, setParsedData] = useState<SharedPromptData | null>(pendingImportData);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isOpen = modals.importPrompt;

  const displayData = parsedData || pendingImportData;

  // Check if a similar prompt already exists
  const existingPrompt = useMemo(() => {
    if (!displayData) return null;
    return prompts.find(p =>
      p.title === displayData.title &&
      p.systemPrompt === displayData.systemPrompt &&
      p.status !== 'trash'
    );
  }, [displayData, prompts]);

  // 从输入中提取短码
  const extractCode = (input: string): string | null => {
    const trimmed = input.trim();

    // 检查是否是新的短链接格式 ?s=xxx
    if (trimmed.includes('?s=')) {
      try {
        const url = new URL(trimmed);
        const code = url.searchParams.get('s');
        if (code && shareService.isShortCode(code)) {
          return code;
        }
      } catch {
        // 不是有效 URL
      }
    }

    // 检查是否直接是短码
    if (shareService.isShortCode(trimmed)) {
      return trimmed;
    }

    return null;
  };

  const handleFetchShare = async () => {
    setError('');
    const code = extractCode(inputCode);

    if (!code) {
      setError(t.import.invalidCode);
      return;
    }

    setLoading(true);

    try {
      const result = await shareService.get(code);
      setParsedData(result.prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.import.decodeFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    const dataToImport = parsedData || pendingImportData;
    if (!dataToImport) return;

    createPrompt({
      title: dataToImport.title,
      description: dataToImport.description,
      category: dataToImport.category,
      systemPrompt: dataToImport.systemPrompt,
      userTemplate: dataToImport.userTemplate,
      model: dataToImport.model,
      temperature: dataToImport.temperature,
      maxTokens: dataToImport.maxTokens,
      tags: dataToImport.tags,
    });

    handleClose();
  };

  const handleClose = () => {
    closeModal('importPrompt');
    setInputCode('');
    setParsedData(null);
    setPendingImportData(null);
    setError('');
    setLoading(false);
  };

  const handleBack = () => {
    setParsedData(null);
    setPendingImportData(null);
    setInputCode('');
  };

  if (!isOpen) return null;

  const CategoryIcon = displayData ? categoryConfig[displayData.category]?.icon : null;
  const categoryStyle = displayData ? categoryConfig[displayData.category] : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-theme-card-bg border border-theme-border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-theme-border">
            <div className="flex items-center gap-2.5">
              {displayData ? (
                <button
                  onClick={handleBack}
                  className="p-1.5 text-theme-text-secondary hover:text-theme-text-primary rounded-lg hover:bg-theme-overlay transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                  <Download className="w-4 h-4 text-emerald-400" />
                </div>
              )}
              <h3 className="text-theme-text-primary font-medium">{t.import.title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 text-theme-text-secondary hover:text-theme-text-primary rounded-lg hover:bg-theme-overlay transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            {!displayData ? (
              <div className="space-y-4">
                {/* Input Field */}
                <div>
                  <label className="text-xs text-theme-text-muted mb-2 block">
                    {t.import.pasteLabel}
                  </label>
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      setError('');
                    }}
                    placeholder={t.import.pastePlaceholder}
                    autoFocus
                    className="w-full bg-theme-input-bg border border-theme-input-border rounded-lg px-3 py-2.5 font-mono text-sm text-theme-input-text focus:outline-none focus:border-theme-accent transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputCode.trim()) {
                        handleFetchShare();
                      }
                    }}
                  />
                  {error && (
                    <p className="text-xs text-red-400 mt-2">{error}</p>
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={handleFetchShare}
                  disabled={!inputCode.trim() || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t.import.fetching}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      {t.import.parseButton}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Duplicate Warning */}
                {existingPrompt && (
                  <div className="flex items-start gap-2.5 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="text-amber-400 font-medium">{t.import.duplicateTitle}</p>
                      <p className="text-amber-400/70 mt-0.5">{t.import.duplicateMessage}</p>
                    </div>
                  </div>
                )}

                {/* Preview Card */}
                <div className="bg-theme-bg-secondary border border-theme-border rounded-lg overflow-hidden">
                  {/* Header with category */}
                  <div className="flex items-center gap-3 p-3 border-b border-theme-border">
                    {CategoryIcon && categoryStyle && (
                      <div className={cn('p-2 rounded-lg', categoryStyle.bg)}>
                        <CategoryIcon className={cn('w-4 h-4', categoryStyle.color)} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-theme-text-primary font-medium text-sm truncate">{displayData.title}</h4>
                      <p className="text-xs text-theme-text-muted truncate">
                        {displayData.description || t.promptCard.noDescription}
                      </p>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="px-3 py-2 flex flex-wrap items-center gap-2 text-xs border-b border-theme-border">
                    <span className="bg-theme-bg-secondary text-theme-text-secondary px-2 py-0.5 rounded">{displayData.model}</span>
                    <span className="text-theme-text-muted">T: {displayData.temperature}</span>
                    <span className="text-theme-text-muted">Max: {displayData.maxTokens}</span>
                  </div>

                  {/* Tags */}
                  {displayData.tags.length > 0 && (
                    <div className="px-3 py-2 flex flex-wrap gap-1.5 border-b border-theme-border">
                      {displayData.tags.slice(0, 5).map((tag) => (
                        <Badge key={tag} variant="default" size="sm">
                          #{tag}
                        </Badge>
                      ))}
                      {displayData.tags.length > 5 && (
                        <span className="text-xs text-theme-text-muted">+{displayData.tags.length - 5}</span>
                      )}
                    </div>
                  )}

                  {/* System Prompt Preview */}
                  {displayData.systemPrompt && (
                    <div className="p-3 border-b border-theme-border">
                      <p className="text-[10px] font-medium text-theme-text-muted uppercase mb-1">{t.import.preview.systemPrompt}</p>
                      <p className="text-xs text-theme-text-secondary line-clamp-2 font-mono leading-relaxed">
                        {displayData.systemPrompt}
                      </p>
                    </div>
                  )}

                  {/* Shared by */}
                  <div className="px-3 py-2 flex items-center gap-2 text-xs text-theme-text-muted">
                    <User className="w-3 h-3" />
                    <span>{displayData.sharedBy}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant={existingPrompt ? "secondary" : "primary"}
                  onClick={handleImport}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {existingPrompt ? t.import.importAnyway : t.import.importButton}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

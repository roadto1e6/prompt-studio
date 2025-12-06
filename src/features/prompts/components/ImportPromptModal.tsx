import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Image, AudioLines, Video, AlertTriangle } from 'lucide-react';
import { usePromptStore, useUIStore, useI18nStore } from '@/stores';
import { Button, Badge } from '@/components/ui';
import { decodeShareData, isShareCode, cn } from '@/utils';
import { SharedPromptData, Category } from '@/types';

const categoryConfig: Record<Category, { icon: React.FC<{ className?: string }>; color: string }> = {
  text: { icon: FileText, color: 'text-indigo-400' },
  image: { icon: Image, color: 'text-emerald-400' },
  audio: { icon: AudioLines, color: 'text-amber-400' },
  video: { icon: Video, color: 'text-rose-400' },
};

export const ImportPromptModal: React.FC = () => {
  const { createPrompt, prompts } = usePromptStore();
  const { modals, closeModal, pendingImportData, setPendingImportData } = useUIStore();
  const { t } = useI18nStore();

  const [inputCode, setInputCode] = useState('');
  const [parsedData, setParsedData] = useState<SharedPromptData | null>(pendingImportData);
  const [error, setError] = useState('');

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

  const handleParseCode = () => {
    setError('');
    const trimmedInput = inputCode.trim();

    // Check if it's a URL with share parameter
    let codeToparse = trimmedInput;
    if (trimmedInput.includes('?share=')) {
      try {
        const url = new URL(trimmedInput);
        const shareParam = url.searchParams.get('share');
        if (shareParam) {
          codeToparse = decodeURIComponent(shareParam);
        }
      } catch {
        // Not a valid URL, try as code directly
      }
    }

    if (!isShareCode(codeToparse)) {
      setError(t.import.invalidCode);
      return;
    }

    const data = decodeShareData<SharedPromptData>(codeToparse);
    if (!data) {
      setError(t.import.decodeFailed);
      return;
    }

    setParsedData(data);
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
  };

  if (!isOpen) return null;

  const CategoryIcon = displayData ? categoryConfig[displayData.category]?.icon : null;

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
          className="bg-dark-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Download className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{t.import.title}</h3>
                <p className="text-xs text-slate-500">{t.import.subtitle}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {!displayData ? (
              <>
                {/* Input Field */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                    {t.import.pasteLabel}
                  </label>
                  <textarea
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      setError('');
                    }}
                    placeholder={t.import.pastePlaceholder}
                    className="w-full h-24 bg-dark-900 border border-slate-700 rounded-lg p-3 font-mono text-sm text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                  {error && (
                    <p className="text-xs text-red-400 mt-2">{error}</p>
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={handleParseCode}
                  disabled={!inputCode.trim()}
                  className="w-full"
                >
                  {t.import.parseButton}
                </Button>
              </>
            ) : (
              <>
                {/* Duplicate Warning */}
                {existingPrompt && (
                  <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="text-amber-400 font-medium">{t.import.duplicateTitle}</p>
                      <p className="text-amber-400/70">{t.import.duplicateMessage}</p>
                    </div>
                  </div>
                )}

                {/* Preview */}
                <div className="bg-dark-900 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {CategoryIcon && (
                      <div className={cn('p-2 rounded-lg bg-slate-800')}>
                        <CategoryIcon className={cn('w-5 h-5', categoryConfig[displayData.category].color)} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold truncate">{displayData.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {displayData.description || t.promptCard.noDescription}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {displayData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {displayData.tags.map((tag) => (
                        <Badge key={tag} variant="default" size="sm">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 text-[10px] text-slate-500">
                    <span className="bg-slate-800 px-2 py-0.5 rounded">{displayData.model}</span>
                    <span>{t.import.preview.temp}: {displayData.temperature}</span>
                    <span>{t.import.preview.maxTokens}: {displayData.maxTokens}</span>
                  </div>

                  {/* System Prompt Preview */}
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">{t.import.preview.systemPrompt}</p>
                    <p className="text-xs text-slate-400 line-clamp-3 font-mono">
                      {displayData.systemPrompt || t.import.preview.noSystemPrompt}
                    </p>
                  </div>

                  {/* Shared by */}
                  <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-600">
                    {t.import.preview.sharedBy} {displayData.sharedBy}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setParsedData(null);
                      setPendingImportData(null);
                    }}
                    className="flex-1"
                  >
                    {t.common.back}
                  </Button>
                  <Button
                    variant={existingPrompt ? "secondary" : "primary"}
                    onClick={handleImport}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {existingPrompt ? t.import.importAnyway : t.import.importButton}
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

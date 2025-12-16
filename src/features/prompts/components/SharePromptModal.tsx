import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Link2, Share2, Loader2, AlertCircle, RefreshCw, Copy } from 'lucide-react';
import { usePromptStore, useUIStore, useI18nStore, useAuthStore } from '@/stores';
import { Button } from '@/components/ui';
import { shareService } from '@/services';
import { SharedPromptData, CreateShareResponse } from '@/types';

export const SharePromptModal: React.FC = () => {
  const { getActivePrompt } = usePromptStore();
  const { modals, closeModal } = useUIStore();
  const { t } = useI18nStore();
  const { user } = useAuthStore();
  const prompt = getActivePrompt();

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareResult, setShareResult] = useState<CreateShareResponse | null>(null);

  const isOpen = modals.sharePrompt;

  // 生成分享链接
  const generateShare = async () => {
    if (!prompt) return;

    setLoading(true);
    setError(null);

    try {
      const shareData: SharedPromptData = {
        title: prompt.title,
        description: prompt.description,
        category: prompt.category,
        systemPrompt: prompt.systemPrompt,
        userTemplate: prompt.userTemplate,
        model: prompt.model,
        temperature: prompt.temperature,
        maxTokens: prompt.maxTokens,
        tags: prompt.tags,
        sharedAt: new Date().toISOString(),
        sharedBy: user?.name || 'Anonymous',
      };

      const result = await shareService.create({ prompt: shareData });
      setShareResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.share.generateError);
    } finally {
      setLoading(false);
    }
  };

  // 打开时自动生成分享链接
  useEffect(() => {
    if (isOpen && prompt && !shareResult && !loading) {
      generateShare();
    }
  }, [isOpen, prompt]);

  const handleCopyUrl = async () => {
    if (!shareResult) return;
    try {
      await navigator.clipboard.writeText(shareResult.shareUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyCode = async () => {
    if (!shareResult) return;
    try {
      await navigator.clipboard.writeText(shareResult.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClose = () => {
    closeModal('sharePrompt');
    setCopiedUrl(false);
    setCopiedCode(false);
    setShareResult(null);
    setError(null);
  };

  if (!isOpen || !prompt) return null;

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
          className="bg-dark-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                <Share2 className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-white font-medium">{t.share.title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-6 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-sm">{t.share.generating}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="p-2.5 bg-red-500/20 rounded-full mb-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-sm text-red-400 mb-3">{error}</p>
                <Button variant="secondary" size="sm" onClick={generateShare}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  {t.share.retry}
                </Button>
              </div>
            ) : shareResult ? (
              <div className="space-y-4">
                {/* Prompt Title Preview */}
                <div className="text-center pb-3 border-b border-slate-700/50">
                  <p className="text-sm text-slate-300 font-medium truncate">{prompt.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{prompt.model}</p>
                </div>

                {/* Short Code - Prominent Display */}
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-2">{t.share.shareCode}</p>
                  <div
                    className="inline-flex items-center gap-2 bg-dark-900 border border-slate-600 rounded-lg px-4 py-2.5 cursor-pointer hover:border-indigo-500/50 transition-colors group"
                    onClick={handleCopyCode}
                  >
                    <span className="font-mono text-xl tracking-widest text-indigo-400 font-semibold">
                      {shareResult.code}
                    </span>
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    )}
                  </div>
                  {copiedCode && (
                    <p className="text-xs text-emerald-400 mt-1.5">{t.common.copied}</p>
                  )}
                </div>

                {/* Full URL */}
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">{t.share.shareLink}</p>
                  <div
                    className="flex items-center gap-2 bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 cursor-pointer hover:border-slate-600 transition-colors group"
                    onClick={handleCopyUrl}
                  >
                    <Link2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="flex-1 text-xs text-slate-400 truncate font-mono">
                      {shareResult.shareUrl}
                    </span>
                    {copiedUrl ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 flex-shrink-0 transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          {shareResult && (
            <div className="px-5 py-3 border-t border-slate-700/50 bg-dark-900/50">
              <Button variant="primary" onClick={handleClose} className="w-full">
                {t.common.close}
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

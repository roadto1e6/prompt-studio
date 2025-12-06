import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Link, Share2 } from 'lucide-react';
import { usePromptStore, useUIStore, useI18nStore } from '@/stores';
import { Button } from '@/components/ui';
import { encodeShareData, getShareUrl } from '@/utils';
import { SharedPromptData } from '@/types';
import { mockUser } from '@/data/mockData';

export const SharePromptModal: React.FC = () => {
  const { getActivePrompt } = usePromptStore();
  const { modals, closeModal } = useUIStore();
  const { t } = useI18nStore();
  const prompt = getActivePrompt();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const isOpen = modals.sharePrompt;

  const shareData = useMemo<SharedPromptData | null>(() => {
    if (!prompt) return null;
    return {
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
      sharedBy: mockUser.name,
    };
  }, [prompt]);

  const shareCode = useMemo(() => {
    if (!shareData) return '';
    return encodeShareData(shareData);
  }, [shareData]);

  const shareUrl = useMemo(() => {
    if (!shareCode) return '';
    return getShareUrl(shareCode);
  }, [shareCode]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClose = () => {
    closeModal('sharePrompt');
    setCopiedCode(false);
    setCopiedUrl(false);
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
          className="bg-dark-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Share2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{t.share.title}</h3>
                <p className="text-xs text-slate-500">{t.share.subtitle}</p>
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
            {/* Share URL */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                {t.share.shareLink}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-xs text-slate-400 truncate">
                  {shareUrl}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="flex-shrink-0"
                  title={t.share.copyLink}
                >
                  {copiedUrl ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Link className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Share Code */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                {t.share.shareCode}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-xs text-slate-400 truncate">
                  {shareCode.slice(0, 50)}...
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyCode}
                  className="flex-shrink-0"
                  title={t.share.copyCode}
                >
                  {copiedCode ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-700 flex justify-end">
            <Button variant="primary" onClick={handleClose}>
              {t.common.close}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

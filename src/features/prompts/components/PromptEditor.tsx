import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { usePromptStore } from '@/stores';
import { Button } from '@/components/ui';
import { estimateTokens, countChars } from '@/utils';

export const PromptEditor: React.FC = () => {
  const { getActivePrompt, updatePrompt, createVersion } = usePromptStore();
  const prompt = getActivePrompt();

  const [systemPrompt, setSystemPrompt] = useState('');
  const [userTemplate, setUserTemplate] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync with selected prompt
  useEffect(() => {
    if (prompt) {
      setSystemPrompt(prompt.systemPrompt);
      setUserTemplate(prompt.userTemplate);
      setIsDirty(false);
    }
  }, [prompt?.id]);

  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
    setIsDirty(true);
  };

  const handleUserTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserTemplate(e.target.value);
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!prompt) return;

    // Update prompt
    updatePrompt(prompt.id, {
      systemPrompt,
      userTemplate,
    });

    // Create new version
    createVersion(prompt.id, 'Updated system prompt and user template.');

    setIsDirty(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(systemPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!prompt) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <p>Select a prompt to edit</p>
      </div>
    );
  }

  const charCount = countChars(systemPrompt);
  const tokenCount = estimateTokens(systemPrompt);
  const currentVersion = prompt.versions[0];

  return (
    <div className="h-full flex flex-col p-6">
      {/* System Prompt */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            System Prompt
          </label>
          <button
            onClick={handleCopy}
            disabled={!systemPrompt}
            className="p-1 rounded text-slate-500 hover:text-indigo-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <div className="flex gap-2">
          {currentVersion && (
            <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
              v{currentVersion.versionNumber} (Current)
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 relative mb-6 min-h-[200px]">
        <textarea
          value={systemPrompt}
          onChange={handleSystemPromptChange}
          className="w-full h-full bg-dark-800 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed transition-colors"
          placeholder="Enter your system prompt here... Use {{variable}} for dynamic inputs."
        />
        <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 bg-dark-900/80 px-2 py-1 rounded backdrop-blur-sm">
          {charCount} chars • {tokenCount} tokens
        </div>
      </div>

      {/* User Template */}
      <div className="mb-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
          User Template (Optional)
        </label>
        <textarea
          value={userTemplate}
          onChange={handleUserTemplateChange}
          className="w-full h-24 bg-dark-800 border border-slate-700 rounded-lg p-3 font-mono text-sm text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
          placeholder="User message template..."
        />
      </div>

      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!isDirty}
        >
          {isDirty ? 'Save Changes' : 'Saved'}
        </Button>
      </div>
    </div>
  );
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@/types';
import { en, zh, TranslationKeys } from '@/i18n';

const translations: Record<Language, TranslationKeys> = {
  en,
  zh,
};

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang, t: translations[lang] }),
      t: translations['en'],
    }),
    {
      name: 'prompt-studio-i18n',
      onRehydrate: () => (state) => {
        // Ensure translations are set after rehydration
        if (state) {
          state.t = translations[state.language];
        }
      },
    }
  )
);

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import bn from './locales/bn.json';
import hi from './locales/hi.json';

export type AppLanguage = 'en' | 'bn' | 'hi';
export const SUPPORTED_LANGUAGES: AppLanguage[] = ['bn', 'en', 'hi'];
export const LANGUAGE_KEY = 'pujapath_language';

// Detect initial saved language or fallback
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem(LANGUAGE_KEY) : null;
const initialLanguage: AppLanguage =
  savedLanguage && (SUPPORTED_LANGUAGES as string[]).includes(savedLanguage)
    ? (savedLanguage as AppLanguage)
    : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bn: { translation: bn },
      hi: { translation: hi },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Synchronize HTML lang attribute on init and change
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLanguage;
}

i18n.on('languageChanged', (lng: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_KEY, lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
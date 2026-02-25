'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { Dictionary } from './dictionaries/en';
import type { Locale } from './config';
import { i18n } from './config';

interface I18nContextType {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  locale,
  dict,
  setLocale,
}: {
  children: ReactNode;
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
}) {
  return (
    <I18nContext.Provider value={{ locale, dict, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useDict(): Dictionary {
  const { dict } = useI18n();
  return dict;
}

export function useLocale(): Locale {
  const { locale } = useI18n();
  return locale;
}
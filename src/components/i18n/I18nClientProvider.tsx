'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n/context';
import { i18n, getDirection } from '@/lib/i18n/config';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries/en';
import { getLocaleFromCookie, setLocaleCookie } from '@/lib/i18n/locale-cookie';
import en from '@/lib/i18n/dictionaries/en';

const dictionaryImports: Record<Locale, () => Promise<Dictionary>> = {
  en: () => Promise.resolve(en),
  de: () => import('@/lib/i18n/dictionaries/de').then((m) => m.default),
  ar: () => import('@/lib/i18n/dictionaries/ar').then((m) => m.default),
  tr: () => import('@/lib/i18n/dictionaries/tr').then((m) => m.default),
  uk: () => import('@/lib/i18n/dictionaries/uk').then((m) => m.default),
  fr: () => import('@/lib/i18n/dictionaries/fr').then((m) => m.default),
  es: () => import('@/lib/i18n/dictionaries/es').then((m) => m.default),
  ru: () => import('@/lib/i18n/dictionaries/ru').then((m) => m.default),
  zh: () => import('@/lib/i18n/dictionaries/zh').then((m) => m.default),
  hi: () => import('@/lib/i18n/dictionaries/hi').then((m) => m.default),
};

export default function I18nClientProvider({
  children,
  initialLocale,
  initialDict,
}: {
  children: ReactNode;
  initialLocale?: Locale;
  initialDict?: Dictionary;
}) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale || getLocaleFromCookie() || i18n.defaultLocale
  );
  const [dict, setDict] = useState<Dictionary>(initialDict || en);
  const [loaded, setLoaded] = useState(!!initialDict);

  const loadDict = useCallback(async (loc: Locale) => {
    try {
      const d = await dictionaryImports[loc]();
      setDict(d);
      setLoaded(true);
    } catch {
      setDict(en);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!initialDict) {
      loadDict(locale);
    }
  }, []);

  const setLocale = useCallback(
    async (newLocale: Locale) => {
      setLocaleState(newLocale);
      setLocaleCookie(newLocale);
      await loadDict(newLocale);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLocale;
        document.documentElement.dir = getDirection(newLocale);
      }
    },
    [loadDict]
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = getDirection(locale);
    }
  }, [locale]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <I18nProvider locale={locale} dict={dict} setLocale={setLocale}>
      {children}
    </I18nProvider>
  );
}
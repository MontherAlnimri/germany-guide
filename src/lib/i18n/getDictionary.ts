import type { Locale } from './config';
import type { Dictionary } from './dictionaries/en';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en').then((m) => m.default),
  de: () => import('./dictionaries/de').then((m) => m.default),
  ar: () => import('./dictionaries/ar').then((m) => m.default),
  tr: () => import('./dictionaries/tr').then((m) => m.default),
  uk: () => import('./dictionaries/uk').then((m) => m.default),
  fr: () => import('./dictionaries/fr').then((m) => m.default),
  es: () => import('./dictionaries/es').then((m) => m.default),
  ru: () => import('./dictionaries/ru').then((m) => m.default),
  zh: () => import('./dictionaries/zh').then((m) => m.default),
  hi: () => import('./dictionaries/hi').then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    return await dictionaries[locale]();
  } catch {
    // Fallback to English if locale not found
    return await dictionaries.en();
  }
}

// Synchronous version for client components (pre-loaded)
const cachedDictionaries: Partial<Record<Locale, Dictionary>> = {};

export async function preloadDictionary(locale: Locale): Promise<Dictionary> {
  if (!cachedDictionaries[locale]) {
    cachedDictionaries[locale] = await getDictionary(locale);
  }
  return cachedDictionaries[locale]!;
}

export function getCachedDictionary(locale: Locale): Dictionary | undefined {
  return cachedDictionaries[locale];
}
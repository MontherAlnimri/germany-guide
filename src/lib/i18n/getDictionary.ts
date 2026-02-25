import type { Dictionary } from './dictionaries/en';
import en from './dictionaries/en';

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => Promise.resolve(en),
  de: () => import('./dictionaries/de').then((m) => m.default),
  ar: () => import('./dictionaries/ar').then((m) => m.default),
  tr: () => import('./dictionaries/tr').then((m) => m.default),
  uk: () => import('./dictionaries/uk').then((m) => m.default),
  fr: () => import('./dictionaries/fr').then((m) => m.default),
  es: () => import('./dictionaries/es').then((m) => m.default),
  ru: () => import('./dictionaries/ru').then((m) => m.default),
  zh: () => import('./dictionaries/zh').then((m) => m.default),
  hi: () => import('./dictionaries/hi').then((m) => m.default),
  hu: () => import('./dictionaries/hu').then((m) => m.default),
};

function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    if (
      typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key]) &&
      typeof override[key] === 'object' && override[key] !== null && !Array.isArray(override[key])
    ) {
      result[key] = deepMerge(base[key] as Record<string, unknown>, override[key] as Record<string, unknown>);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

const cache = new Map<string, Dictionary>();

export async function getDictionary(locale: string): Promise<Dictionary> {
  if (cache.has(locale)) return cache.get(locale)!;

  const loader = dictionaries[locale] || dictionaries.en;
  const dict = await loader();

  // Merge with English as fallback so missing keys don't break
  const merged = locale === 'en' ? dict : deepMerge(en as unknown as Record<string, unknown>, dict as unknown as Record<string, unknown>) as unknown as Dictionary;

  cache.set(locale, merged);
  return merged;
}
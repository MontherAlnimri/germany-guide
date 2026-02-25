import type { Locale } from './config';
import { i18n } from './config';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export function getLocaleFromCookie(): Locale {
  if (typeof document === 'undefined') return i18n.defaultLocale;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === LOCALE_COOKIE && i18n.locales.includes(value as Locale)) {
      return value as Locale;
    }
  }
  return i18n.defaultLocale;
}

export function setLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;
  // Set cookie for 1 year
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = LOCALE_COOKIE + '=' + locale + ';path=/;max-age=' + maxAge + ';SameSite=Lax';
}

export function getLocaleFromHeaders(cookieHeader: string | null): Locale {
  if (!cookieHeader) return i18n.defaultLocale;
  
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === LOCALE_COOKIE && i18n.locales.includes(value as Locale)) {
      return value as Locale;
    }
  }
  return i18n.defaultLocale;
}
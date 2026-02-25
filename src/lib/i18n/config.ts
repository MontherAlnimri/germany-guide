export const i18n = {
  defaultLocale: "en",
  locales: ["en", "de", "ar", "tr", "uk", "fr", "es", "ru", "zh", "hi", "hu"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  ar: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
  tr: "T\u00FCrk\u00E7e",
  uk: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430",
  fr: "Fran\u00E7ais",
  es: "Espa\u00F1ol",
  ru: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
  zh: "\u4E2D\u6587",
  hi: "\u0939\u093F\u0928\u094D\u0926\u0940",
  hu: "Magyar",
};

export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}

export const localeFlags: Record<Locale, string> = {
  en: "\uD83C\uDDEC\uD83C\uDDE7",
  de: "\uD83C\uDDE9\uD83C\uDDEA",
  ar: "\uD83C\uDDF8\uD83C\uDDE6",
  tr: "\uD83C\uDDF9\uD83C\uDDF7",
  uk: "\uD83C\uDDFA\uD83C\uDDE6",
  fr: "\uD83C\uDDEB\uD83C\uDDF7",
  es: "\uD83C\uDDEA\uD83C\uDDF8",
  ru: "\uD83C\uDDF7\uD83C\uDDFA",
  zh: "\uD83C\uDDE8\uD83C\uDDF3",
  hi: "\uD83C\uDDEE\uD83C\uDDF3",
  hu: "\uD83C\uDDED\uD83C\uDDFA",
};
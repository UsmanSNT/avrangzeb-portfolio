import type { Locale } from "./types";

export const defaultLocale: Locale = "uz";

export const supportedLocales = ["uz", "en", "ko", "ru"] as const satisfies readonly Locale[];

export const languageStorageKey = "portfolio-language";

export const languageLabels: Record<Locale, { flag: string; name: string }> = {
  uz: { flag: "🇺🇿", name: "O'zbek" },
  en: { flag: "🇺🇸", name: "English" },
  ko: { flag: "🇰🇷", name: "한국어" },
  ru: { flag: "🇷🇺", name: "Русский" },
};

export function isSupportedLocale(value: string | null): value is Locale {
  return supportedLocales.includes(value as Locale);
}

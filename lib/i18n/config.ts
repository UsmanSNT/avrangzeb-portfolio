import type { Locale } from "./types";

export const defaultLocale: Locale = "uz";

export const supportedLocales = ["en", "ko", "uz", "ru"] as const satisfies readonly Locale[];

export const languageStorageKey = "portfolio-language";

export const languageLabels: Record<Locale, { flag: string; name: string }> = {
  en: { flag: "EN", name: "English" },
  ko: { flag: "KO", name: "Korean" },
  uz: { flag: "UZ", name: "Uzbek" },
  ru: { flag: "RU", name: "Russian" },
};

export function isSupportedLocale(value: string | null): value is Locale {
  return supportedLocales.includes(value as Locale);
}

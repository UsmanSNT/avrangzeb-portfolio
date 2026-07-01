import { en } from "./en";
import { ko } from "./ko";
import { ru } from "./ru";
import { uz } from "./uz";
import type { HomeDictionary, Locale } from "@/lib/i18n/types";

export const homeDictionaries = {
  uz,
  en,
  ko,
  ru,
} satisfies Record<Locale, HomeDictionary>;

export function getHomeDictionary(locale: Locale): HomeDictionary {
  return homeDictionaries[locale] ?? homeDictionaries.uz;
}

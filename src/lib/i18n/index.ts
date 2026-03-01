import { de } from "./de";
import { en } from "./en";
import { el } from "./el";

export type Locale = "de" | "en" | "el";
// Deep-map all leaf values to string so translations don't require literal matches
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};
export type Translations = DeepStringify<typeof de>;

export const locales: Locale[] = ["de", "en", "el"];
export const defaultLocale: Locale = "de";

export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  el: "Ελληνικά",
};

export const localeFlags: Record<Locale, string> = {
  de: "DE",
  en: "EN",
  el: "EL",
};

const dictionaries: Record<Locale, Translations> = { de, en, el };

export function getDictionary(locale: Locale): Translations {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

// Helper to get nested translation value by dot-path
export function getTranslation(dict: Translations, key: string): string {
  const keys = key.split(".");
  let result: unknown = dict;
  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key; // fallback to key if not found
    }
  }
  return typeof result === "string" ? result : key;
}

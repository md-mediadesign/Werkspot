"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { type Locale, type Translations, defaultLocale, getDictionary, locales } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [t, setT] = useState<Translations>(getDictionary(initialLocale));

  const setLocale = useCallback((newLocale: Locale) => {
    if (!locales.includes(newLocale)) return;
    setLocaleState(newLocale);
    setT(getDictionary(newLocale));
    // Set cookie for server-side detection
    document.cookie = `werkspot-locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    // Reload to update server components
    window.location.reload();
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

export function useTranslations() {
  return useLocale().t;
}

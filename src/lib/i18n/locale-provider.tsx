"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { ClientDictionary } from "@/lib/i18n/dictionaries";

interface LocaleContextValue {
  locale: Locale;
  dict: ClientDictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Fed by the `[locale]` layout — the only place the active locale is resolved.
 * Client components read it from here instead of parsing `usePathname()`, which
 * would be wrong for PT anyway: those URLs carry no locale prefix.
 */
export function LocaleProvider({
  locale,
  dict,
  children,
}: LocaleContextValue & { children: React.ReactNode }) {
  const value = useMemo(() => ({ locale, dict }), [locale, dict]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useI18n must be used within <LocaleProvider>");
  return ctx;
}

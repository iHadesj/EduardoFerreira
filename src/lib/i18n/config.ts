/**
 * Locale primitives. Kept free of any React/Next import so that
 * `next.config.ts`, route handlers, server components and client components can
 * all share the same source of truth.
 */

export const locales = ["pt", "en"] as const;

export type Locale = (typeof locales)[number];

/** PT is served from the bare URLs (`/`, `/projetos/…`) — see `routes.ts`. */
export const defaultLocale: Locale = "pt";

/** BCP-47 tags for `<html lang>` and `hreflang`. */
export const htmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

/** Tags for `Intl.*` — `formatDate`/`formatRelativeTime` accept these. */
export const intlLocale: Record<Locale, "pt-BR" | "en-US"> = {
  pt: "pt-BR",
  en: "en-US",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

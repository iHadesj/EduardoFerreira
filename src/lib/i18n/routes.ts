import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

/**
 * URL policy.
 *
 * Every page lives under the `[locale]` segment, but PT keeps the bare URLs the
 * site shipped with (`/`, `/projetos/levva-loja-e-sorte`): `next.config.ts`
 * rewrites those onto `/pt/…` server-side. EN is prefixed (`/en/…`).
 *
 * Markup must therefore NEVER emit a `/pt` prefix — that would expose a second
 * crawlable URL for the same document. Always build hrefs through these helpers
 * so the rule holds in one place.
 */
export function localePath(locale: Locale, path = "/"): string {
  const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return suffix === "" ? "/" : suffix;
  return `/${locale}${suffix}` || "/";
}

export function projectPath(locale: Locale, slug: string): string {
  return localePath(locale, `/projetos/${slug}`);
}

/**
 * Home href carrying a section hash — `/#sobre`, `/en#sobre`. Used by the
 * footer and by any nav link that has to work from a case-study page, where
 * there is no such section to scroll to.
 */
export function sectionPath(locale: Locale, hash: string): string {
  const fragment = hash.startsWith("#") ? hash : `#${hash}`;
  const base = localePath(locale, "/");
  return base === "/" ? `/${fragment}` : `${base}${fragment}`;
}

/**
 * Drop a leading locale segment so the remainder can be re-prefixed for another
 * locale. PT URLs carry no prefix, but `/pt/…` is still reachable directly, so
 * both are handled — otherwise switching from there would build `/en/pt/…`.
 */
export function stripLocalePrefix(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }
  return pathname;
}

/** The same page in another locale, preserving the current path. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localePath(target, stripLocalePrefix(pathname));
}

export function absoluteUrl(base: string, path: string): string {
  return new URL(path, base).toString();
}

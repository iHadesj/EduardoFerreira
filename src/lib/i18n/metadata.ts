import type { Metadata } from "next";
import { htmlLang, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { absoluteUrl, localePath, projectPath } from "@/lib/i18n/routes";
import { getProject, localizeProject } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";

/**
 * Metadata is built here rather than in the route files because each locale has
 * its own root layout — without a single source the two would drift, and the
 * `hreflang` pair is exactly the thing that has to stay in sync.
 */

function languageAlternates(
  toPath: (locale: Locale) => string,
): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of locales) {
    alternates[htmlLang[locale]] = toPath(locale);
  }
  // PT is the x-default because it is what the bare URLs serve.
  alternates["x-default"] = toPath("pt");
  return alternates;
}

export function rootMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const path = localePath(locale, "/");

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dict.meta.title,
      template: `%s · ${siteConfig.name}`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: path,
      languages: languageAlternates((l) => localePath(l, "/")),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: htmlLang[locale],
      url: absoluteUrl(siteConfig.url, path),
      title: dict.meta.title,
      description: dict.meta.description,
    },
    twitter: { card: "summary_large_image" },
  };
}

export function caseStudyMetadata(locale: Locale, slug: string): Metadata {
  const source = getProject(slug);
  if (!source) return {};

  const project = localizeProject(source, locale);
  const path = projectPath(locale, slug);

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: path,
      languages: languageAlternates((l) => projectPath(l, slug)),
    },
    openGraph: {
      type: "article",
      locale: htmlLang[locale],
      url: absoluteUrl(siteConfig.url, path),
      title: project.title,
      description: project.summary,
    },
  };
}

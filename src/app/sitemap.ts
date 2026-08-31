import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { locales } from "@/lib/i18n/config";
import { projects } from "@/lib/projects";
import { absoluteUrl, localePath, projectPath } from "@/lib/i18n/routes";

/**
 * Both locales, with `hreflang` alternates on every entry — the URL count
 * doubled when EN landed, and without the alternates a crawler reads the two
 * trees as duplicate content rather than translations of each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (path: string) => absoluteUrl(siteConfig.url, path);

  const homeAlternates = Object.fromEntries(
    locales.map((locale) => [locale, abs(localePath(locale, "/"))]),
  );

  const home: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: abs(localePath(locale, "/")),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages: homeAlternates },
  }));

  const caseStudies: MetadataRoute.Sitemap = projects.flatMap((project) => {
    const alternates = Object.fromEntries(
      locales.map((locale) => [locale, abs(projectPath(locale, project.slug))]),
    );
    return locales.map((locale) => ({
      url: abs(projectPath(locale, project.slug)),
      lastModified: project.date,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.8 : 0.6,
      alternates: { languages: alternates },
    }));
  });

  return [...home, ...caseStudies];
}

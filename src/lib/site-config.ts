/**
 * Single source of truth for identity, links and navigation.
 * TODO_EDU markers are resolved in Fase 11 (public e-mail, domain).
 */

export type Locale = "pt" | "en";

export interface NavItem {
  id: string;
  href: string;
  label: Record<Locale, string>;
}

export const siteConfig = {
  name: "Edu Ferreira",
  handle: "iHadesj",
  // Public-facing contact e-mail. Doubles as the default CONTACT_EMAIL inbox
  // for the contact form (see src/lib/env.ts).
  email: "edualexandre2017@outlook.com",
  // Canonical production URL — placeholder domain until Fase 11.
  url: "https://edu-ferreira-zeta.vercel.app",
  // CV PDF served straight from /public.
  cvUrl: "/Curriculo-Eduardo-Ferreira-2026.pdf",
  // Name the browser saves the download as.
  cvFileName: "Curriculo-Eduardo-Ferreira-2026.pdf",
  // Repository (for the footer "view source" link). TODO_EDU: confirm name.
  sourceUrl: "https://github.com/iHadesj/EduardoFerreira",
  role: {
    pt: "Desenvolvedor Fullstack — Java & React/TypeScript",
    en: "Fullstack Developer — Java & React/TypeScript",
  } satisfies Record<Locale, string>,
  headline: {
    pt: "Stack completa.",
    en: "Full stack, fully.",
  } satisfies Record<Locale, string>,
  description: {
    pt: "Backend em Java/Spring, frontend em React e TypeScript. Atualmente afiando arquitetura, testes e performance.",
    en: "Java/Spring on the back end, React and TypeScript on the front. Currently sharpening architecture, testing and performance.",
  } satisfies Record<Locale, string>,
  links: {
    github: "https://github.com/iHadesj",
    linkedin: "https://www.linkedin.com/in/eduardoalexandre-java/",
    // `mailto:` is required — these values are used directly as anchor hrefs.
    email: "mailto:edualexandre2017@outlook.com",
  },
} as const;

export const navItems: NavItem[] = [
  { id: "sobre", href: "#sobre", label: { pt: "Sobre", en: "About" } },
  { id: "stack", href: "#stack", label: { pt: "Stack", en: "Stack" } },
  {
    id: "projetos",
    href: "#projetos",
    label: { pt: "Projetos", en: "Projects" },
  },
  { id: "github", href: "#github", label: { pt: "GitHub", en: "GitHub" } },
  {
    id: "contato",
    href: "#contato",
    label: { pt: "Contato", en: "Contact" },
  },
];

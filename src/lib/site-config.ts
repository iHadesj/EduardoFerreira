/**
 * Single source of truth for identity, links and navigation.
 * TODO_EDU markers are resolved in Fase 11 (LinkedIn, public e-mail, domain).
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
  // Public-facing contact e-mail — TODO_EDU: confirmar endereço real (Fase 11).
  email: "ola@eduferreira.dev",
  // Canonical production URL — placeholder domain until Fase 11.
  url: "https://eduferreira.dev",
  // CV PDF lives in /public — file to be added in Fase 11 (TODO_EDU).
  cvUrl: "/cv-edu-ferreira.pdf",
  // Repository (for the footer "view source" link). TODO_EDU: confirm name.
  sourceUrl: "https://github.com/iHadesj/portfolio-hades",
  role: {
    pt: "Desenvolvedor Fullstack — Java & React/TypeScript",
    en: "Fullstack Developer — Java & React/TypeScript",
  } satisfies Record<Locale, string>,
  headline: {
    pt: "Construo sistemas do alicerce à interface.",
    en: "I build systems from the foundation to the interface.",
  } satisfies Record<Locale, string>,
  description: {
    pt: "Backend em Java/Spring, frontend em React e TypeScript. Arquitetura, testes e performance — documentados em case studies.",
    en: "Java/Spring on the back end, React and TypeScript on the front. Architecture, testing and performance — documented in case studies.",
  } satisfies Record<Locale, string>,
  links: {
    github: "https://github.com/iHadesj",
    linkedin: "https://linkedin.com/in/TODO_EDU", // TODO_EDU: handle do LinkedIn
    email: "mailto:ola@eduferreira.dev", // TODO_EDU: confirmar e-mail
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

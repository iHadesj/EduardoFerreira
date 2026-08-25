import { projects as raw, type Project } from "#site/content";

export type { Project };

/** Case studies sorted by `order` (Levva → StudyQuest → Raiz Pilates → API → Rota Dev → Portfolio → Change). */
export const projects: Project[] = [...raw].sort((a, b) => a.order - b.order);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

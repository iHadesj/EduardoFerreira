import { projects as raw, type Project } from "#site/content";

export type { Project };

/** Case studies sorted by `order` (DetranDiff → StudyQuest → Raiz Pilates → API → Consórcio → Portfolio). */
export const projects: Project[] = [...raw].sort((a, b) => a.order - b.order);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

import { OG_CONTENT_TYPE, OG_SIZE, caseStudyOgImage } from "@/lib/og-image";
import { projects } from "@/lib/projects";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Case study — Edu Ferreira";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return caseStudyOgImage("en", slug);
}

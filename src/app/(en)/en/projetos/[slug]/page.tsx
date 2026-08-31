import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/pages/case-study";
import { caseStudyMetadata } from "@/lib/i18n/metadata";
import { projects } from "@/lib/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return caseStudyMetadata("en", slug);
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  return <CaseStudyPage locale="en" slug={slug} />;
}

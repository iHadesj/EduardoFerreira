import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, projects } from "@/lib/projects";
import { MDXContent } from "@/components/mdx/mdx-content";
import { Badge } from "@/components/ui/badge";
import { GitHubIcon } from "@/components/icons";

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
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

const proseClass = [
  "prose prose-invert max-w-[68ch]",
  "prose-headings:font-display prose-headings:text-bone",
  "prose-h2:text-h3 prose-h2:mt-12 prose-h2:mb-3",
  "prose-p:text-smoke prose-li:text-smoke prose-strong:text-bone",
  "prose-a:text-molten prose-a:no-underline hover:prose-a:underline",
  "prose-code:text-styx prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
  "prose-blockquote:border-l-molten prose-blockquote:text-smoke prose-blockquote:not-italic",
].join(" ");

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const previous = index > 0 ? projects[index - 1] : undefined;
  const next = index < projects.length - 1 ? projects[index + 1] : undefined;

  return (
    <main id="conteudo" className="container-hades section-pad">
      <Link
        href="/#projetos"
        data-cursor="hover"
        className="text-smoke hover:text-molten mb-10 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.5} /> Voltar
      </Link>

      <header className="border-ash flex flex-col gap-5 border-b pb-10">
        <Badge variant={project.status === "in-progress" ? "ember" : "default"}>
          {project.status}
        </Badge>
        <h1 className="font-display text-hero text-bone">{project.title}</h1>
        <p className="prose-measure text-lead text-smoke">{project.summary}</p>

        {project.metrics.length > 0 ? (
          <dl className="flex flex-wrap gap-3">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="border-ash bg-basalt rounded-md border px-4 py-3"
              >
                <dt className="text-label text-smoke font-mono uppercase">
                  {metric.label}
                </dt>
                <dd className="font-display text-bone text-lg">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="flex flex-wrap items-center gap-4 text-sm">
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="text-smoke hover:text-bone inline-flex items-center gap-1.5 transition-colors"
            >
              <GitHubIcon className="size-[18px]" /> Repositório
            </a>
          ) : null}
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="text-smoke hover:text-bone inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowUpRight size={16} strokeWidth={1.5} /> Demo ao vivo
            </a>
          ) : null}
        </div>
      </header>

      {project.cover ? (
        <div className="border-ash relative mt-10 aspect-[16/9] overflow-hidden rounded-lg border">
          <Image
            src={project.cover}
            alt={`Tela do projeto ${project.title}`}
            fill
            priority
            sizes="(min-width: 1024px) 60rem, 100vw"
            className="object-cover object-top"
          />
        </div>
      ) : null}

      <article className={`mt-10 ${proseClass}`}>
        <MDXContent code={project.content} />
      </article>

      <nav className="border-ash mt-16 flex justify-between gap-4 border-t pt-8 text-sm">
        {previous ? (
          <Link
            href={previous.url}
            data-cursor="hover"
            className="text-smoke hover:text-molten inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={1.5} /> {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={next.url}
            data-cursor="hover"
            className="text-smoke hover:text-molten inline-flex items-center gap-2 text-right transition-colors"
          >
            {next.title} <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GitHubIcon } from "@/components/icons";
import type { Project } from "@/lib/projects";

/**
 * Wide card with the "card link" pattern: the title link stretches over the
 * whole card (::after inset-0); the secondary links sit above via relative z-10.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group border-ash bg-basalt hover:border-molten/40 hover:glow-molten relative grid gap-6 rounded-lg border p-5 transition-colors duration-200 md:grid-cols-[minmax(0,20rem)_1fr] md:p-6">
      <div className="border-ash/70 relative aspect-[16/10] overflow-hidden rounded-md border">
        <div
          className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.03]"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, color-mix(in oklab, var(--color-molten) 16%, transparent), transparent 60%), linear-gradient(160deg, #1b1622, #0f0b15)",
          }}
        />
        <span className="text-smoke absolute bottom-3 left-3 font-mono text-xs">
          {project.slug}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <Badge variant={project.status === "in-progress" ? "ember" : "default"}>
          {project.status}
        </Badge>

        <h3 className="font-display text-h3 text-bone">
          <Link
            href={`/projetos/${project.slug}`}
            data-cursor="hover"
            className="after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>

        <p className="text-smoke text-sm">{project.problem}</p>

        <ul className="text-smoke flex flex-col gap-1.5 text-sm">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span aria-hidden className="text-molten">
                →
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-1 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <div className="relative z-10 mt-2 flex items-center gap-4 text-sm">
          <Link
            href={`/projetos/${project.slug}`}
            data-cursor="hover"
            className="link-underline text-molten hover:bg-[length:100%_1px]"
          >
            Case study →
          </Link>
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Repositório de ${project.title}`}
              data-cursor="hover"
              className="text-smoke hover:text-bone transition-colors"
            >
              <GitHubIcon className="size-[18px]" />
            </a>
          ) : null}
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Demo de ${project.title}`}
              data-cursor="hover"
              className="text-smoke hover:text-bone transition-colors"
            >
              <ArrowUpRight size={18} strokeWidth={1.5} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

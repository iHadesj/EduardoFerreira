import { Star } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { RepoDTO } from "@/lib/github";

export function RepoCard({ repo }: { repo: RepoDTO }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      className="group hover:border-molten/40 hover:glow-molten flex flex-col gap-3 rounded-lg border border-ash bg-basalt p-5 transition-colors duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-bone group-hover:text-molten font-mono text-sm transition-colors">
          {repo.name}
        </h3>
        {repo.stars > 0 ? (
          <span className="text-smoke inline-flex items-center gap-1 text-xs">
            <Star size={12} strokeWidth={1.5} />
            {repo.stars}
          </span>
        ) : null}
      </div>

      <p className="text-smoke line-clamp-2 min-h-[2.5em] text-sm">
        {repo.description ?? "Sem descrição."}
      </p>

      <div className="text-smoke mt-auto flex items-center justify-between gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5">
          {repo.language ? (
            <>
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ background: repo.languageColor ?? "#9a92a8" }}
              />
              {repo.language}
            </>
          ) : null}
        </span>
        <span>{formatRelativeTime(repo.pushedAt)}</span>
      </div>
    </a>
  );
}

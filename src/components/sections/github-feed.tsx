"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { RepoCard } from "./repo-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReposPage } from "@/lib/github";

async function fetchReposPage(page: number): Promise<ReposPage> {
  const res = await fetch(`/api/github/repos?page=${page}&per_page=9`);
  if (!res.ok) throw new Error("GitHub indisponível");
  return res.json() as Promise<ReposPage>;
}

export function GithubFeed({ initialData }: { initialData: ReposPage }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isError,
  } = useInfiniteQuery({
    queryKey: ["repos"],
    queryFn: ({ pageParam }) => fetchReposPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialData: { pages: [initialData], pageParams: [1] },
    staleTime: 60 * 60 * 1000,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const repos = data?.pages.flatMap((page) => page.items) ?? [];

  // initialData is empty AND the query errored → upstream is down.
  if (status === "error" && repos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-ash bg-basalt p-10 text-center">
        <p className="text-smoke">O oráculo do GitHub não respondeu.</p>
        <button
          type="button"
          onClick={() => void refetch()}
          data-cursor="hover"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Tentar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <RepoCard key={repo.url} repo={repo} />
        ))}
      </div>

      {hasNextPage ? (
        <div ref={sentinelRef} className="flex justify-center">
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            data-cursor="hover"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {isFetchingNextPage ? "Carregando…" : "Carregar mais"}
          </button>
        </div>
      ) : (
        <p className="text-smoke text-center font-mono text-xs">
          {isError
            ? "não consegui carregar mais agora."
            : "fim do arquivo — por enquanto."}
        </p>
      )}
    </div>
  );
}

import { env } from "@/lib/env";

export interface RepoDTO {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string | null;
  topics: string[];
  pushedAt: string;
}

export interface ReposPage {
  items: RepoDTO[];
  nextPage: number | null;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionsData {
  total: number;
  days: ContributionDay[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  Java: "#b07219",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572a5",
  Shell: "#89e051",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00add8",
  Rust: "#dea584",
  Kotlin: "#a97bff",
  PHP: "#4f5d95",
  Ruby: "#701516",
  Dockerfile: "#384d54",
  Vue: "#41b883",
  SCSS: "#c6538c",
};

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

function mapRepo(repo: GitHubRepo): RepoDTO {
  return {
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    languageColor: repo.language
      ? (LANGUAGE_COLORS[repo.language] ?? "#9a92a8")
      : null,
    topics: repo.topics ?? [],
    pushedAt: repo.pushed_at,
  };
}

/**
 * Paginated repos, sorted by last push. Sends the token only if present
 * (without it: 60 req/h per IP — enough thanks to 1h caching). Throws on an
 * upstream error so the route can answer 502 and the client can show its error
 * state; the RSC initial fetch wraps this in try/catch.
 */
export async function fetchRepos(page = 1, perPage = 9): Promise<ReposPage> {
  const url = `https://api.github.com/users/${env.GITHUB_USERNAME}/repos?sort=pushed&per_page=${perPage}&page=${page}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;

  const res = await fetch(url, { headers, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub repos responded ${res.status}`);

  const data = (await res.json()) as GitHubRepo[];
  const items = data.filter((r) => !r.fork && !r.archived).map(mapRepo);
  const nextPage = data.length === perPage ? page + 1 : null;
  return { items, nextPage };
}

/** Contributions heatmap via a community API. Returns null on any failure so
 *  the UI can simply hide the heatmap. */
export async function fetchContributions(
  username = env.GITHUB_USERNAME,
): Promise<ContributionsData | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 21600 } },
    );
    if (!res.ok) throw new Error(`contributions responded ${res.status}`);
    const data = (await res.json()) as { contributions: ContributionDay[] };
    const days = data.contributions ?? [];
    const total = days.reduce((sum, day) => sum + day.count, 0);
    return { total, days };
  } catch (error) {
    console.error("[github] fetchContributions:", error);
    return null;
  }
}

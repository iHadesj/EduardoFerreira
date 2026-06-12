import { SectionHeading } from "@/components/ui/section-heading";
import { fetchContributions, fetchRepos, type ReposPage } from "@/lib/github";
import { GithubFeed } from "./github-feed";
import { ContributionsHeatmap } from "./contributions-heatmap";

/**
 * Server component: fetches page 1 + the heatmap directly via lib/github, so the
 * section never renders empty and the feed hydrates with initialData (no CLS).
 */
export async function GithubActivity() {
  let initial: ReposPage = { items: [], nextPage: null };
  try {
    initial = await fetchRepos(1, 9);
  } catch {
    // Graceful: the feed shows its error/empty state without breaking the page.
  }
  const contributions = await fetchContributions();

  return (
    <section id="github" className="container-hades section-pad scroll-mt-24">
      <SectionHeading
        eyebrow="arquivo vivo"
        title="Arquivo vivo"
        description="Repositórios recentes e contribuições — direto da API do GitHub, sem manutenção manual."
      />

      {contributions ? (
        <div className="mt-10">
          <ContributionsHeatmap data={contributions} />
        </div>
      ) : null}

      <div className="mt-10">
        <GithubFeed initialData={initial} />
      </div>
    </section>
  );
}

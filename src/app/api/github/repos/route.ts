import { fetchRepos } from "@/lib/github";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const perPage = Math.min(
    30,
    Math.max(1, Number(searchParams.get("per_page") ?? "9") || 9),
  );

  try {
    const data = await fetchRepos(page, perPage);
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[api/github/repos]", error);
    return Response.json(
      { error: "Falha ao consultar o GitHub." },
      { status: 502 },
    );
  }
}

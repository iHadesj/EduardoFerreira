import { defineConfig, defineCollection, s } from "velite";

/**
 * Case studies. Frontmatter is validated by this schema at build time — an
 * invalid file fails the build with a readable error (§F5 acceptance).
 */
const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      slug: s.slug("projects"),
      summary: s.string().max(200),
      problem: s.string(),
      date: s.isodate(),
      cover: s.string().optional(),
      stack: s.array(s.string()),
      repo: s.string().url().optional(),
      demo: s.string().url().optional(),
      featured: s.boolean().default(false),
      order: s.number().default(99),
      highlights: s.array(s.string()).max(4).default([]),
      metrics: s
        .array(s.object({ label: s.string(), value: s.string() }))
        .default([]),
      status: s.enum(["shipped", "in-progress", "archived"]),
      content: s.mdx(),
    })
    .transform((data) => ({ ...data, url: `/projetos/${data.slug}` })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { projects },
});

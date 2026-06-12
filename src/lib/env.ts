import { z } from "zod";

/**
 * Environment schema. Everything is optional in dev so onboarding never
 * breaks; secrets (GITHUB_TOKEN, RESEND_API_KEY) are only ever read here in
 * server contexts (route handlers / server actions) and never reach the client.
 */
const envSchema = z.object({
  // GitHub (Fase 6). Without a token: 60 req/h per IP — fine with caching.
  GITHUB_TOKEN: z.string().min(1).optional(),
  GITHUB_USERNAME: z.string().min(1).default("iHadesj"),

  // Contact form (Fase 4 / 11)
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_EMAIL: z.email().optional(),

  // Site
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Surface a readable error but don't crash dev onboarding.
  console.error(
    "⚠ Invalid environment variables:",
    z.flattenError(parsed.error).fieldErrors,
  );
}

export const env: Env = parsed.success
  ? parsed.data
  : envSchema.parse({ GITHUB_USERNAME: "iHadesj" });

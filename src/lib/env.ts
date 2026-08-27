import { z } from "zod";
import { siteConfig } from "@/lib/site-config";

/**
 * A key left blank in `.env.local` arrives as `""`, which would fail `min(1)`
 * and take the whole schema down with it. Treat blank as "not set".
 */
const blankAsUndefined = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), schema);

/**
 * Environment schema. Everything is optional in dev so onboarding never
 * breaks; secrets (GITHUB_TOKEN, RESEND_API_KEY) are only ever read here in
 * server contexts (route handlers / server actions) and never reach the client.
 */
const envSchema = z.object({
  // GitHub (Fase 6). Without a token: 60 req/h per IP — fine with caching.
  GITHUB_TOKEN: blankAsUndefined(z.string().min(1).optional()),
  GITHUB_USERNAME: blankAsUndefined(z.string().min(1).default("iHadesj")),

  // Contact form (Fase 4 / 11). Only RESEND_API_KEY is really required —
  // the inbox defaults to the public address in siteConfig.
  RESEND_API_KEY: blankAsUndefined(z.string().min(1).optional()),
  CONTACT_EMAIL: blankAsUndefined(z.email().default(siteConfig.email)),

  // Site
  NEXT_PUBLIC_SITE_URL: blankAsUndefined(
    z.url().default("http://localhost:3000"),
  ),
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

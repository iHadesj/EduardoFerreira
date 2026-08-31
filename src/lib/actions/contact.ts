"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { env } from "@/lib/env";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { fill } from "@/lib/i18n/format";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

// Naive in-memory rate limit — fine for a single Vercel function instance.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;

/**
 * Validation messages are part of the response, so the schema is built per
 * request from the submitted locale rather than defined once at module scope.
 */
function buildSchema(locale: Locale) {
  const t = getDictionary(locale).contactAction.validation;
  return z.object({
    name: z.string().min(2, t.nameShort),
    email: z.email(t.emailInvalid),
    message: z.string().min(10, t.messageShort),
    website: z.string().optional(), // honeypot
  });
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // The hidden `locale` field is attacker-controlled like any other input, so
  // it is validated rather than trusted — an unknown value just answers in PT.
  const rawLocale = String(formData.get("locale") ?? "");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale).contactAction;

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  // Honeypot: a filled hidden field means a bot → fake success.
  if (raw.website.trim().length > 0) {
    return { status: "success", message: t.success };
  }

  const parsed = buildSchema(locale).safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: t.invalid,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const hdrs = await headers();
  const ip = (hdrs.get("x-forwarded-for") ?? "local").split(",")[0]!.trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return { status: "error", message: t.rateLimited };
  }
  recent.push(now);
  hits.set(ip, recent);

  const { name, email, message } = parsed.data;

  // No key in dev → log and simulate success so onboarding never breaks.
  // NOTE: nothing is actually delivered in this branch.
  if (!env.RESEND_API_KEY) {
    console.warn(
      `[contact] RESEND_API_KEY ausente — NENHUM e-mail foi enviado para ${env.CONTACT_EMAIL}. Envio simulado:`,
      { name, email },
    );
    return { status: "success", message: t.successDev };
  }

  try {
    const { Resend } = await import("resend");
    const { ContactEmail } = await import("@/components/emails/contact-email");
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Portfolio Hades <onboarding@resend.dev>",
      to: env.CONTACT_EMAIL,
      replyTo: email,
      subject: fill(t.emailSubject, { name }),
      react: ContactEmail({ name, email, message }),
    });
    return { status: "success", message: t.success };
  } catch (error) {
    console.error("[contact] erro ao enviar:", error);
    return { status: "error", message: t.sendError };
  }
}

"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { env } from "@/lib/env";

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.email("E-mail inválido"),
  message: z.string().min(10, "Conte um pouco mais (mín. 10 caracteres)"),
  website: z.string().optional(), // honeypot
});

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

// Naive in-memory rate limit — fine for a single Vercel function instance.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  // Honeypot: a filled hidden field means a bot → fake success.
  if (raw.website.trim().length > 0) {
    return {
      status: "success",
      message: "Mensagem enviada. Respondo em até 48h.",
    };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Confira os campos destacados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const hdrs = await headers();
  const ip = (hdrs.get("x-forwarded-for") ?? "local").split(",")[0]!.trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return {
      status: "error",
      message: "Muitas tentativas. Tente novamente em alguns minutos.",
    };
  }
  recent.push(now);
  hits.set(ip, recent);

  const { name, email, message } = parsed.data;

  // No key in dev → log and simulate success so onboarding never breaks.
  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) {
    console.warn("[contact] sem RESEND_API_KEY — simulando envio:", {
      name,
      email,
    });
    return {
      status: "success",
      message: "Mensagem enviada (modo dev). Respondo em até 48h.",
    };
  }

  try {
    const { Resend } = await import("resend");
    const { ContactEmail } = await import("@/components/emails/contact-email");
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Portfolio Hades <onboarding@resend.dev>",
      to: env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Novo contato de ${name}`,
      react: ContactEmail({ name, email, message }),
    });
    return {
      status: "success",
      message: "Mensagem enviada. Respondo em até 48h.",
    };
  } catch (error) {
    console.error("[contact] erro ao enviar:", error);
    return {
      status: "error",
      message: "Não consegui enviar agora. Tente novamente em instantes.",
    };
  }
}

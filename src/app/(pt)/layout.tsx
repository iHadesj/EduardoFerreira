import type { Metadata } from "next";
import "../globals.css";
import { RootDocument } from "@/components/layout/root-document";
import { rootMetadata } from "@/lib/i18n/metadata";

/**
 * Portuguese root layout — owns `/`, `/projetos/*` and `/dev/ui`.
 *
 * The site has one root layout per locale (see also `(en)/layout.tsx`) instead
 * of a single `[locale]` segment. That costs a handful of thin route files and
 * buys three things a parameterised root layout cannot give:
 *
 * - `<html lang>` is server-rendered and static, never patched after hydration;
 * - `not-found.tsx` renders *inside* this layout, so a 404 keeps the stylesheet
 *   and the site chrome (a root layout that needs params cannot be built for a
 *   path that has none, and Next falls back to a bare document);
 * - the Portuguese URLs stay bare with no rewrite layer in front of them.
 *
 * Crossing between the two roots is a full page load, which is exactly what we
 * want for a language switch.
 */
export const metadata: Metadata = rootMetadata("pt");

export default function PtLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="pt">{children}</RootDocument>;
}

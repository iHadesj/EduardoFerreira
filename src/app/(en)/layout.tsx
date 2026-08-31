import type { Metadata } from "next";
import "../globals.css";
import { RootDocument } from "@/components/layout/root-document";
import { rootMetadata } from "@/lib/i18n/metadata";

/**
 * English root layout — owns everything under `/en`. See `(pt)/layout.tsx` for
 * why the locale is a route group rather than a `[locale]` segment.
 */
export const metadata: Metadata = rootMetadata("en");

export default function EnLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="en">{children}</RootDocument>;
}

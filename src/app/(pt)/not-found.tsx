import type { Metadata } from "next";
import { NotFoundView } from "@/components/sections/not-found-view";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  title: getDictionary("pt").notFound.metaTitle,
};

export default function NotFound() {
  return <NotFoundView />;
}

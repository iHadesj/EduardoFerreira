import { notFound } from "next/navigation";

/**
 * Keeps a miss under `/en/*` inside the English root layout — more specific
 * than the Portuguese catch-all at the site root, so an English visitor gets an
 * English 404 rather than being handed back to `/`.
 */
export default function CatchAll(): never {
  notFound();
}

import { notFound } from "next/navigation";

/**
 * Last resort for any path no real route claimed. Without it Next answers those
 * with its own bare 404 document — this keeps every miss inside the Portuguese
 * root layout, so the styled `not-found.tsx` renders with chrome and CSS.
 *
 * More specific routes always win over a catch-all, including the English tree,
 * which has a catch-all of its own for `/en/*`.
 */
export default function CatchAll(): never {
  notFound();
}

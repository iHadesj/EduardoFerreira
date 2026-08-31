"use client";

import { startTransition, useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

/**
 * Safety valve. `startViewTransition` holds a frozen screenshot over the page
 * until its callback settles; if a navigation never commits (offline, aborted,
 * an error boundary swallowing the route) the user would be staring at a dead
 * snapshot. Releasing after this budget degrades to a plain navigation instead.
 */
const COMMIT_TIMEOUT_MS = 1200;

/**
 * Navigate with the browser's View Transitions API driving the paint.
 *
 * The App Router has no built-in hook for this on stable React, and Next's
 * `experimental.viewTransition` flag pulls the whole app onto the experimental
 * React channel — too much to take on for one animation. Instead we own the
 * handshake: open a transition, push the route inside it, and resolve the
 * transition's promise once `usePathname()` reports the new route has
 * committed. Everything else (element pairing, timing) is CSS.
 *
 * Degrades to `router.push` when the API is missing (Firefox, older Safari) or
 * the user asked for reduced motion.
 */
export function useViewTransitionRouter(): (href: string) => void {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();
  const resolveRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const settle = useCallback(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    const resolve = resolveRef.current;
    resolveRef.current = null;
    resolve?.();
  }, []);

  // The new route has committed and React has painted it — hand control back to
  // the browser so it can animate the captured "old" state into what is now on
  // screen. Runs on mount too, where there is nothing pending: settle() no-ops.
  useEffect(() => {
    settle();
  }, [pathname, settle]);

  // Never leave a transition open across an unmount.
  useEffect(() => settle, [settle]);

  return useCallback(
    (href: string) => {
      if (reduced || typeof document.startViewTransition !== "function") {
        router.push(href);
        return;
      }

      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            resolveRef.current = resolve;
            timerRef.current = window.setTimeout(settle, COMMIT_TIMEOUT_MS);
            startTransition(() => router.push(href));
          }),
      );
    },
    [reduced, router, settle],
  );
}

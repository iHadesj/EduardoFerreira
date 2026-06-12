"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

/** Approx. fixed-nav height + breathing room, used as the anchor offset. */
const NAV_OFFSET = 80;

/**
 * Returns a function that scrolls to a `#hash` target through Lenis (smooth,
 * nav-offset aware) or falls back to native scrollIntoView when Lenis is
 * absent (reduced motion).
 */
export function useSmoothScroll(): (hash: string) => void {
  const lenis = useLenis();

  return useCallback(
    (hash: string) => {
      const id = hash.startsWith("#") ? hash.slice(1) : hash;
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el, { offset: -NAV_OFFSET });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenis],
  );
}

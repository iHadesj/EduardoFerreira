"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently in the "active band" of the viewport.
 * `ids` must be stable (memoize in the caller). setState lives in the observer
 * callback (not the effect body), so no set-state-in-effect.
 */
export function useScrollSpy(
  ids: string[],
  rootMargin = "-45% 0px -50% 0px",
): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return active;
}

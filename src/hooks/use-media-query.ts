"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe matchMedia hook built on useSyncExternalStore (no setState-in-effect).
 * Returns false during SSR/hydration, then the live match on the client.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

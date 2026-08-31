"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True once hydrated on the client, false during SSR/hydration — without
 * setState-in-effect. Use to defer client-only UI (theme icon, portals) and
 * avoid hydration mismatches.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

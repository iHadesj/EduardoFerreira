"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

/**
 * Smooth scroll (§F2). Disabled entirely under prefers-reduced-motion — native
 * scrolling is restored, and useLenis() consumers fall back to scrollIntoView.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotionSafe();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}

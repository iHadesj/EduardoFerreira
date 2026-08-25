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
    <ReactLenis
      root
      options={{
        autoRaf: true,
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        overscroll: false,
        stopInertiaOnNavigate: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}

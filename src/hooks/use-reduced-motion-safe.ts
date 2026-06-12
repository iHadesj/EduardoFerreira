"use client";

import { useReducedMotion } from "motion/react";

/**
 * prefers-reduced-motion as a boolean (false during SSR / before hydration).
 * Consumed by Lenis, the 3D hero, marquee, scramble, magnetic and the cursor
 * — the kill-switch of §2.7.
 */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() ?? false;
}

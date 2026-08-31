"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  /** Max travel toward the pointer, in px (§F1: ~12px). */
  radius?: number;
  /** Fraction of the pointer offset applied before clamping. */
  strength?: number;
}

/**
 * Pointer-fine only: the child eases toward the cursor within `radius`, then
 * springs back on leave. Disabled on touch and with reduced motion (renders a
 * plain wrapper). Reserved for hero CTAs and social icons.
 */
export function Magnetic({
  children,
  className,
  radius = 12,
  strength = 0.4,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotionSafe();
  const enabled = fine && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const clamp = (value: number) => Math.max(-radius, Math.min(radius, value));

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    x.set(clamp(relX * strength));
    y.set(clamp(relY * strength));
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}

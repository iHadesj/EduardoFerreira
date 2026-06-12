"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

/**
 * Overlay cursor (pointer-fine only): an 8px molten dot tracks instantly while
 * a 28px ring lags (lerp 0.15) and grows over interactive targets. The native
 * cursor is NEVER hidden — this is purely additive. Hidden over text inputs.
 * Disabled on touch and with reduced motion.
 *
 * Outer nodes carry the JS translate; inner nodes self-center and scale, so the
 * transform set in JS and the hover scale (a class) never collide.
 */
export function CustomCursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotionSafe();
  const enabled = fine && !reduced;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const overInput = target?.closest(
        "input, textarea, select, [contenteditable='true']",
      );
      const opacity = overInput ? "0" : "1";
      dot.style.opacity = opacity;
      ring.style.opacity = opacity;
      const hovering = target?.closest('a, button, [data-cursor="hover"]');
      ring.dataset.hovering = hovering ? "true" : "false";
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[var(--z-cursor)]"
        style={{ willChange: "transform" }}
      >
        <span className="bg-molten block size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>
      <div
        ref={ringRef}
        aria-hidden
        data-hovering="false"
        className="group pointer-events-none fixed top-0 left-0 z-[var(--z-cursor)] transition-opacity duration-200"
        style={{ willChange: "transform" }}
      >
        <span className="border-molten/60 group-data-[hovering=true]:border-molten block size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-transform duration-200 group-data-[hovering=true]:scale-150" />
      </div>
    </>
  );
}

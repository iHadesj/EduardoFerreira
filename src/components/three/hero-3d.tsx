"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HeroPoster } from "./hero-poster";
import type { SceneTier } from "./hero-scene";
import { ErrorBoundary } from "@/components/error-boundary";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  { ssr: false },
);

interface Gates {
  ok: boolean;
  /** "full" = pointer-driven desktop scene; "lite" = touch-driven phone scene. */
  tier: SceneTier;
  highDpr: boolean;
}

const BLOCKED: Gates = { ok: false, tier: "lite", highDpr: false };

/**
 * Capability gates. Phones are no longer excluded outright — they clear a
 * lower bar and get the `lite` tier, which is budgeted for them. The hard
 * blockers (saveData, 2G, no WebGL2, very low memory) still drop to the poster.
 */
function evaluateGates(): Gates {
  if (typeof window === "undefined") return BLOCKED;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  // Never spend the user's data or battery against their wishes.
  if (nav.connection?.saveData === true) return BLOCKED;
  if (/(^|-)2g$/.test(nav.connection?.effectiveType ?? "")) return BLOCKED;

  let webgl2 = false;
  try {
    webgl2 = document.createElement("canvas").getContext("webgl2") !== null;
  } catch {
    webgl2 = false;
  }
  if (!webgl2) return BLOCKED;

  const tier: SceneTier =
    window.matchMedia("(pointer: fine)").matches || window.innerWidth >= 1024
      ? "full"
      : "lite";

  // Desktop keeps the ≥4GB bar; the lite tier is cheap enough to clear 3GB.
  const memFloor = tier === "full" ? 4 : 3;
  const mem = nav.deviceMemory;
  if (mem !== undefined && mem < memFloor) return BLOCKED;
  if (tier === "lite" && navigator.hardwareConcurrency < 4) return BLOCKED;

  return { ok: true, tier, highDpr: (window.devicePixelRatio || 1) >= 1.5 };
}

/**
 * Gates → lazy (post-idle) load of the WebGL scene → crossfade over the poster.
 * On reduced motion, failed gates or a runtime error the static poster simply
 * stays — no three.js bytes downloaded.
 */
export function Hero3D({ className }: { className?: string }) {
  const reduced = useReducedMotionSafe();
  const containerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [tier, setTier] = useState<SceneTier>("full");
  const [highDpr, setHighDpr] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const gates = evaluateGates();
    if (!gates.ok) return;

    const start = () => {
      setTier(gates.tier);
      setHighDpr(gates.highDpr);
      setEnabled(true);
    };

    const win = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    // Phones get a longer leash so the shader compile never lands on LCP.
    const timeout = gates.tier === "lite" ? 3000 : 2000;
    let handle = 0;
    if (win.requestIdleCallback) {
      handle = win.requestIdleCallback(start, { timeout });
    } else {
      handle = window.setTimeout(start, gates.tier === "lite" ? 1400 : 800);
    }
    return () => {
      if (win.cancelIdleCallback) win.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;
    let inView = true;
    let visible = !document.hidden;
    const update = () => setActive(inView && visible);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? false;
      update();
    });
    io.observe(el);
    const onVisibility = () => {
      visible = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  // `reduced` flips to true one tick after hydration. The effect above cancels
  // the pending idle callback, but deriving here also covers the race where it
  // already fired — reduced motion never keeps a live canvas.
  const showScene = enabled && !reduced;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Persistent ambient glow (compensates for dropped postprocessing bloom). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 46%, color-mix(in oklab, var(--color-molten) 16%, transparent), transparent 62%)",
        }}
      />
      <HeroPoster
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          showScene && ready ? "opacity-0" : "opacity-100",
        )}
      />
      {showScene ? (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <ErrorBoundary fallback={null}>
            <HeroScene
              active={active}
              tier={tier}
              highDpr={highDpr}
              onReady={() => setReady(true)}
            />
          </ErrorBoundary>
        </div>
      ) : null}
    </div>
  );
}

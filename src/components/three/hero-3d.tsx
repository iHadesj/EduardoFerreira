"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HeroPoster } from "./hero-poster";
import { ErrorBoundary } from "@/components/error-boundary";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  { ssr: false },
);

interface Gates {
  ok: boolean;
  highDpr: boolean;
}

function evaluateGates(): Gates {
  if (typeof window === "undefined") return { ok: false, highDpr: false };
  const fineOrWide =
    window.matchMedia("(pointer: fine)").matches || window.innerWidth >= 1024;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const memOk = nav.deviceMemory === undefined || nav.deviceMemory >= 4;
  const saveDataOk = nav.connection?.saveData !== true;
  let webgl2 = false;
  try {
    webgl2 = document.createElement("canvas").getContext("webgl2") !== null;
  } catch {
    webgl2 = false;
  }
  const dpr = window.devicePixelRatio || 1;
  return {
    ok: fineOrWide && memOk && saveDataOk && webgl2,
    highDpr: dpr >= 1.5,
  };
}

/**
 * Gates → lazy (post-idle) load of the WebGL scene → crossfade over the poster.
 * On reduced motion, failed gates (mobile/low-memory/saveData/no-WebGL2) or a
 * runtime error, the static poster simply stays — no three.js bytes downloaded.
 */
export function Hero3D({ className }: { className?: string }) {
  const reduced = useReducedMotionSafe();
  const containerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [highDpr, setHighDpr] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const gates = evaluateGates();
    if (!gates.ok) return;

    const start = () => {
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
    let handle = 0;
    if (win.requestIdleCallback) {
      handle = win.requestIdleCallback(start, { timeout: 2000 });
    } else {
      handle = window.setTimeout(start, 800);
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
          enabled && ready ? "opacity-0" : "opacity-100",
        )}
      />
      {enabled ? (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <ErrorBoundary fallback={null}>
            <HeroScene
              active={active}
              highDpr={highDpr}
              onReady={() => setReady(true)}
            />
          </ErrorBoundary>
        </div>
      ) : null}
    </div>
  );
}

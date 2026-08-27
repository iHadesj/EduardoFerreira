"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { HeroPoster } from "./hero-poster";
import type { SceneTier } from "./hero-scene";
import type { MobiusLightState } from "./liquid-obsidian-mobius";
import { ErrorBoundary } from "@/components/error-boundary";
import { useMounted } from "@/hooks/use-mounted";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

const MOBIUS_HINT_KEY = "mobius-interaction-discovered";

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
const ECONOMY_GPU_PATTERN =
  /adreno(?:\s+\(tm\))?\s+(?:[45]\d{2}|6(?:0\d|1\d|20))|mali-(?:t\d+|g(?:31|51|52|57|68))|powervr/i;

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
  let renderer = "";
  try {
    const context = document.createElement("canvas").getContext("webgl2");
    webgl2 = context !== null;
    if (context) {
      const debugInfo = context.getExtension("WEBGL_debug_renderer_info");
      renderer = String(
        context.getParameter(
          debugInfo?.UNMASKED_RENDERER_WEBGL ?? context.RENDERER,
        ),
      );
    }
  } catch {
    webgl2 = false;
  }
  if (!webgl2) return BLOCKED;

  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const phone = !finePointer && window.innerWidth < 1024;
  const mem = nav.deviceMemory;
  const cores = navigator.hardwareConcurrency || 4;
  const dpr = window.devicePixelRatio || 1;
  // Browsers do not expose benchmark scores. This combines the signals that
  // correlate best with sub-500k AnTuTu Androids, including common low/mid GPUs.
  const economyPhone =
    phone &&
    (ECONOMY_GPU_PATTERN.test(renderer) ||
      (mem !== undefined && mem <= 4) ||
      cores <= 4 ||
      (/Android/i.test(navigator.userAgent) &&
        dpr >= 2.5 &&
        (mem ?? 4) <= 6 &&
        cores <= 8));
  const tier: SceneTier =
    finePointer || window.innerWidth >= 1024
      ? "full"
      : economyPhone
        ? "economy"
        : "lite";

  return { ok: true, tier, highDpr: tier === "full" && dpr >= 1.5 };
}

/**
 * Gates → lazy (post-idle) load of the WebGL scene → crossfade over the poster.
 * On reduced motion, failed gates or a runtime error the static poster simply
 * stays — no three.js bytes downloaded.
 */
export function Hero3D({ className }: { className?: string }) {
  const reduced = useReducedMotionSafe();
  const { theme } = useTheme();
  const themeMounted = useMounted();
  const underworld = themeMounted && theme === "underworld";
  const containerRef = useRef<HTMLDivElement>(null);
  const lightHostRef = useRef<HTMLElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [tier, setTier] = useState<SceneTier>("full");
  const [highDpr, setHighDpr] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [showHint, setShowHint] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(MOBIUS_HINT_KEY) !== "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (reduced) return;
    const gates = evaluateGates();
    if (!gates.ok) return;
    const capabilityFrame = requestAnimationFrame(() => {
      setTier(gates.tier);
      setHighDpr(gates.highDpr);
    });

    const win = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    // Phones get a longer leash so the shader compile never lands on LCP.
    const timeout =
      gates.tier === "economy" ? 3600 : gates.tier === "lite" ? 3000 : 2000;
    const fallbackDelay =
      gates.tier === "economy" ? 1800 : gates.tier === "lite" ? 1400 : 800;
    let idleHandle = 0;
    let fallbackHandle = 0;
    let scrollSettleHandle = 0;
    let started = false;

    const cancelScheduledStart = () => {
      if (idleHandle && win.cancelIdleCallback) {
        win.cancelIdleCallback(idleHandle);
        idleHandle = 0;
      }
      if (fallbackHandle) {
        window.clearTimeout(fallbackHandle);
        fallbackHandle = 0;
      }
    };

    const start = () => {
      if (started) return;
      started = true;
      window.removeEventListener("scroll", handleEarlyScroll);
      setEnabled(true);
    };

    const scheduleStart = () => {
      cancelScheduledStart();
      if (win.requestIdleCallback) {
        idleHandle = win.requestIdleCallback(start, { timeout });
      } else {
        fallbackHandle = window.setTimeout(start, fallbackDelay);
      }
    };

    function handleEarlyScroll() {
      if (started) return;
      cancelScheduledStart();
      window.clearTimeout(scrollSettleHandle);
      scrollSettleHandle = window.setTimeout(scheduleStart, 260);
    }

    window.addEventListener("scroll", handleEarlyScroll, { passive: true });
    scheduleStart();
    return () => {
      cancelAnimationFrame(capabilityFrame);
      cancelScheduledStart();
      window.clearTimeout(scrollSettleHandle);
      window.removeEventListener("scroll", handleEarlyScroll);
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

  useEffect(() => {
    const host = containerRef.current?.closest("#hero") as HTMLElement | null;
    if (!host) return;
    host.dataset.mobiusTier = tier;
    return () => {
      if (host.dataset.mobiusTier === tier) delete host.dataset.mobiusTier;
    };
  }, [tier]);

  function handleFirstInteraction() {
    setShowHint(false);
    try {
      localStorage.setItem(MOBIUS_HINT_KEY, "true");
    } catch {
      // Storage can be unavailable in private/restricted browser contexts.
    }
  }

  function handleLightChange({ x, y, energy, angle }: MobiusLightState) {
    const host =
      lightHostRef.current ??
      (containerRef.current?.closest("#hero") as HTMLElement | null);
    if (!host) return;
    lightHostRef.current = host;
    host.style.setProperty("--mobius-light-x", `${x.toFixed(2)}%`);
    host.style.setProperty("--mobius-light-y", `${y.toFixed(2)}%`);
    host.style.setProperty("--mobius-light-energy", energy.toFixed(3));
    host.style.setProperty("--mobius-light-angle", `${angle.toFixed(2)}deg`);
    host.style.setProperty(
      "--mobius-aura-opacity",
      (0.62 + energy * 0.38).toFixed(3),
    );
    host.style.setProperty(
      "--mobius-caustic-opacity",
      (0.3 + energy * 0.42).toFixed(3),
    );
    host.style.setProperty(
      "--mobius-title-opacity",
      (0.16 + energy * 0.5).toFixed(3),
    );
    host.style.setProperty(
      "--mobius-title-blur",
      `${(5 + energy * 10).toFixed(2)}px`,
    );
    host.style.setProperty(
      "--mobius-cta-blur",
      `${(3 + energy * 10).toFixed(2)}px`,
    );
    host.style.setProperty(
      "--mobius-social-blur",
      `${(2 + energy * 8).toFixed(2)}px`,
    );
  }

  // `reduced` flips to true one tick after hydration. The effect above cancels
  // the pending idle callback, but deriving here also covers the race where it
  // already fired — reduced motion never keeps a live canvas.
  const showScene = enabled && !reduced;

  return (
    <div
      ref={containerRef}
      data-mobius-tier={tier}
      className={cn("relative", className)}
    >
      {/* Persistent ambient glow (compensates for dropped postprocessing bloom). */}
      <div
        aria-hidden
        className="mobius-ambient-glow pointer-events-none absolute -inset-1/4"
      />
      <HeroPoster
        underworld={underworld}
        className={cn(
          "absolute inset-0",
          showScene && ready ? "opacity-0" : "opacity-100",
        )}
      />
      {showScene ? (
        <div
          className={cn(
            "absolute inset-y-0",
            // A wider render surface expands the camera's horizontal frustum
            // without changing the sculpture's on-screen size. This prevents
            // fast rotations from exposing the hard edge of the WebGL canvas.
            tier === "full" ? "inset-x-[-24%]" : "inset-x-[-12%]",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <ErrorBoundary fallback={null}>
            <HeroScene
              active={active}
              tier={tier}
              highDpr={highDpr}
              underworld={underworld}
              onReady={() => setReady(true)}
              onFirstInteraction={handleFirstInteraction}
              onLightChange={handleLightChange}
            />
          </ErrorBoundary>
        </div>
      ) : null}
      {showScene && ready && tier !== "full" && showHint ? (
        <div
          className={cn(
            "text-smoke pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/8 px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.08em] whitespace-nowrap",
            tier === "economy" ? "bg-black/70" : "bg-black/35 backdrop-blur-sm",
          )}
        >
          <span className="text-molten" aria-hidden>
            ↔
          </span>
          Arraste · toque · segure
        </div>
      ) : null}
    </div>
  );
}

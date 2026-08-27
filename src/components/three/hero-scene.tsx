"use client";

import { useEffect, useState } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { LiquidObsidianMobius } from "./liquid-obsidian-mobius";
import type { MobiusLightState } from "./liquid-obsidian-mobius";

/** Full desktop, regular touch phone, or budgeted low-end touch phone. */
export type SceneTier = "full" | "lite" | "economy";

const DPR_BY_TIER: Record<SceneTier, [number, number]> = {
  full: [1, 1.75],
  // 1.5 DPR costs 2.25x the pixels of DPR 1. Android keeps a modest ceiling
  // and can still fall back to DPR 1 when the monitor detects pressure.
  lite: [1, 1.25],
  // Rendering at DPR 0.75 costs about 44% of the pixels of DPR 1.
  economy: [0.75, 0.9],
};

function EconomyFrameLoop({ active }: { active: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let lastFrame = 0;
    const frameInterval = 1000 / 30;

    const tick = (now: number) => {
      if (now - lastFrame >= frameInterval) {
        lastFrame = now;
        invalidate();
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, invalidate]);

  return null;
}

interface HeroSceneProps {
  /** In-view and tab-visible: render frames; otherwise pause to save battery. */
  active: boolean;
  tier: SceneTier;
  /** High-density screens receive smoother geometry until performance declines. */
  highDpr: boolean;
  underworld: boolean;
  onReady?: () => void;
  onFirstInteraction?: () => void;
  onLightChange?: (state: MobiusLightState) => void;
}

export function HeroScene({
  active,
  tier,
  highDpr,
  underworld,
  onReady,
  onFirstInteraction,
  onLightChange,
}: HeroSceneProps) {
  const [degrade, setDegrade] = useState(0);
  const economy = tier === "economy";
  const frozen = degrade >= 2;
  const highDetail = tier === "full" && highDpr && degrade === 0;
  const dpr: [number, number] =
    degrade >= 1 ? (economy ? [0.7, 0.8] : [1, 1]) : DPR_BY_TIER[tier];
  const sculpture = (
    <LiquidObsidianMobius
      economy={economy}
      frozen={frozen}
      highDetail={highDetail}
      touch={tier !== "full"}
      underworld={underworld}
      onFirstInteraction={onFirstInteraction}
      onLightChange={onLightChange}
    />
  );

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 4.45], fov: 42 }}
      gl={{
        alpha: true,
        antialias: tier === "full",
        powerPreference: "high-performance",
        stencil: false,
      }}
      frameloop={economy ? "demand" : active ? "always" : "never"}
      onCreated={() => onReady?.()}
      style={{
        width: "100%",
        height: "100%",
        // Preserve vertical page scrolling while reserving horizontal swipes
        // for rotating the sculpture on touch-first devices.
        touchAction: tier !== "full" ? "pan-y" : "auto",
      }}
    >
      {economy ? <EconomyFrameLoop active={active} /> : null}
      {economy ? (
        sculpture
      ) : (
        <PerformanceMonitor
          onDecline={() => setDegrade((value) => Math.min(2, value + 1))}
        >
          {sculpture}
        </PerformanceMonitor>
      )}
    </Canvas>
  );
}

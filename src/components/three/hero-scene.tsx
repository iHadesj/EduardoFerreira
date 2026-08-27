"use client";

import { useState } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { LiquidObsidianMobius } from "./liquid-obsidian-mobius";

/** "full" = pointer-driven desktop scene; "lite" = touch-driven phone scene. */
export type SceneTier = "full" | "lite";

const DPR_BY_TIER: Record<SceneTier, [number, number]> = {
  full: [1, 1.75],
  // 1.5 DPR costs 2.25x the pixels of DPR 1. Android keeps a modest ceiling
  // and can still fall back to DPR 1 when the monitor detects pressure.
  lite: [1, 1.25],
};

interface HeroSceneProps {
  /** In-view and tab-visible: render frames; otherwise pause to save battery. */
  active: boolean;
  tier: SceneTier;
  /** High-density screens receive smoother geometry until performance declines. */
  highDpr: boolean;
  underworld: boolean;
  onReady?: () => void;
  onFirstInteraction?: () => void;
}

export function HeroScene({
  active,
  tier,
  highDpr,
  underworld,
  onReady,
  onFirstInteraction,
}: HeroSceneProps) {
  const [degrade, setDegrade] = useState(0);
  const frozen = degrade >= 2;
  const highDetail = tier === "full" && highDpr && degrade === 0;
  const dpr: [number, number] = degrade >= 1 ? [1, 1] : DPR_BY_TIER[tier];

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 4.45], fov: 42 }}
      gl={{
        alpha: true,
        antialias: tier === "full",
        powerPreference: "high-performance",
      }}
      frameloop={active ? "always" : "never"}
      onCreated={() => onReady?.()}
      style={{
        width: "100%",
        height: "100%",
        // Preserve vertical page scrolling while reserving horizontal swipes
        // for rotating the sculpture on touch-first devices.
        touchAction: tier === "lite" ? "pan-y" : "auto",
      }}
    >
      <PerformanceMonitor
        onDecline={() => setDegrade((value) => Math.min(2, value + 1))}
      >
        <LiquidObsidianMobius
          frozen={frozen}
          highDetail={highDetail}
          touch={tier === "lite"}
          underworld={underworld}
          onFirstInteraction={onFirstInteraction}
        />
      </PerformanceMonitor>
    </Canvas>
  );
}

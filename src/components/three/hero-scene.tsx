"use client";

import { useState } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { LiquidObsidianMobius } from "./liquid-obsidian-mobius";

/** "full" = pointer-driven desktop scene; "lite" = touch-driven phone scene. */
export type SceneTier = "full" | "lite";

const DPR_BY_TIER: Record<SceneTier, [number, number]> = {
  full: [1, 1.75],
  lite: [1, 1.5],
};

interface HeroSceneProps {
  /** In-view and tab-visible: render frames; otherwise pause to save battery. */
  active: boolean;
  tier: SceneTier;
  /** High-density screens receive smoother geometry until performance declines. */
  highDpr: boolean;
  underworld: boolean;
  onReady?: () => void;
}

export function HeroScene({
  active,
  tier,
  highDpr,
  underworld,
  onReady,
}: HeroSceneProps) {
  const [degrade, setDegrade] = useState(0);
  const frozen = degrade >= 2;
  const highDetail = tier === "full" && highDpr && degrade === 0;

  return (
    <Canvas
      dpr={DPR_BY_TIER[tier]}
      camera={{ position: [0, 0, 4.45], fov: 42 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      frameloop={active ? "always" : "never"}
      onCreated={() => onReady?.()}
      style={{ width: "100%", height: "100%" }}
    >
      <PerformanceMonitor
        onDecline={() => setDegrade((value) => Math.min(2, value + 1))}
      >
        <LiquidObsidianMobius
          frozen={frozen}
          highDetail={highDetail}
          touch={tier === "lite"}
          underworld={underworld}
        />
      </PerformanceMonitor>
    </Canvas>
  );
}

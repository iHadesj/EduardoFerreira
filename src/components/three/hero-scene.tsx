"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { ObsidianShard } from "./obsidian-shard";
import { EmberParticles } from "./ember-particles";

/** "full" = pointer-driven desktop scene; "lite" = touch-driven phone scene. */
export type SceneTier = "full" | "lite";

interface TierProfile {
  dpr: [number, number];
  /** Particle budget by degradation step (index = degrade level, capped at 2). */
  particles: readonly [number, number, number];
  /** Extra budget when devicePixelRatio ≥ 1.5. */
  highDprBonus: number;
}

/**
 * Phones render the same scene, not a lesser one: same shard, same rim, same
 * embers — only the pixel and particle budgets shrink. The visual language
 * survives the downgrade; the frame cost doesn't.
 */
const PROFILES: Record<SceneTier, TierProfile> = {
  full: { dpr: [1, 1.75], particles: [600, 400, 260], highDprBonus: 600 },
  lite: { dpr: [1, 1.5], particles: [340, 220, 140], highDprBonus: 180 },
};

interface HeroSceneProps {
  /** In-view & tab-visible → render frames; otherwise pause (battery). */
  active: boolean;
  tier: SceneTier;
  /** devicePixelRatio ≥ 1.5 → full particle baseline. */
  highDpr: boolean;
  onReady?: () => void;
}

export function HeroScene({
  active,
  tier,
  highDpr,
  onReady,
}: HeroSceneProps) {
  // Progressive degradation: 0 full → 1 fewer particles → 2 freeze rotation.
  const [degrade, setDegrade] = useState(0);
  const profile = PROFILES[tier];
  const step = Math.min(2, degrade) as 0 | 1 | 2;
  const particleCount =
    profile.particles[step] + (highDpr && step === 0 ? profile.highDprBonus : 0);
  const frozen = degrade >= 2;

  return (
    <Canvas
      dpr={profile.dpr}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      onCreated={() => onReady?.()}
      style={{ width: "100%", height: "100%" }}
    >
      <PerformanceMonitor
        onDecline={() => setDegrade((d) => Math.min(2, d + 1))}
      >
        <ambientLight intensity={0.4} />
        {/* warm key light from the front so every facet reads */}
        <directionalLight
          position={[1.5, 3, 4]}
          intensity={0.6}
          color="#f2c14e"
        />
        {/* molten rim light behind/below the shard */}
        <pointLight position={[-2.5, -2, 2]} intensity={32} color="#e8a33d" />
        {/* faint cold counter-light */}
        <pointLight position={[3, 2.5, -2]} intensity={8} color="#3e7c8c" />
        <ObsidianShard frozen={frozen} touch={tier === "lite"} />
        <EmberParticles count={particleCount} />
      </PerformanceMonitor>
    </Canvas>
  );
}

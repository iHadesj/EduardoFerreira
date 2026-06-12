"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { ObsidianShard } from "./obsidian-shard";
import { EmberParticles } from "./ember-particles";

interface HeroSceneProps {
  /** In-view & tab-visible → render frames; otherwise pause (battery). */
  active: boolean;
  /** devicePixelRatio ≥ 1.5 → full particle baseline. */
  highDpr: boolean;
  onReady?: () => void;
}

export function HeroScene({ active, highDpr, onReady }: HeroSceneProps) {
  // Progressive degradation: 0 full → 1 fewer particles → 2 freeze rotation.
  const [degrade, setDegrade] = useState(0);
  const particleCount = degrade >= 1 ? 400 : highDpr ? 1200 : 600;
  const frozen = degrade >= 2;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      onCreated={() => onReady?.()}
      style={{ width: "100%", height: "100%" }}
    >
      <PerformanceMonitor
        onDecline={() => setDegrade((d) => Math.min(2, d + 1))}
      >
        <ambientLight intensity={0.25} />
        {/* molten rim light behind/below the shard */}
        <pointLight position={[-2.5, -2, 2]} intensity={18} color="#e8a33d" />
        {/* faint cold counter-light */}
        <pointLight position={[3, 2.5, -2]} intensity={4} color="#3e7c8c" />
        <ObsidianShard frozen={frozen} />
        <EmberParticles count={particleCount} />
      </PerformanceMonitor>
    </Canvas>
  );
}

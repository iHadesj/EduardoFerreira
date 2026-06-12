"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const SHARD_COLOR = "#141019";
const MOLTEN = "#e8a33d";
const EMISSIVE_ON = new THREE.Color("#3a230a");
const EMISSIVE_OFF = new THREE.Color("#000000");

interface ObsidianShardProps {
  /** Freeze pointer-parallax rotation (final perf-degradation step). */
  frozen?: boolean;
}

export function ObsidianShard({ frozen = false }: ObsidianShardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);
  const hovered = useRef(false);
  const pulse = useRef(0);
  const clickTimes = useRef<number[]>([]);
  const { pointer } = useThree();

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.6, 1);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      // Deterministic pseudo-noise (seed-stable) → chipped-stone silhouette.
      const n =
        Math.sin(x * 3.1 + 1.3) *
        Math.cos(y * 2.7 + 0.5) *
        Math.sin(z * 3.7 + 2.1);
      const scale = 1 + n * 0.12;
      pos.setXYZ(i, x * scale, y * scale, z * scale);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const edgeGeometry = useMemo(
    () => new THREE.EdgesGeometry(geometry),
    [geometry],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const k = Math.min(1, delta * 6); // ~250ms feel, frame-rate independent

    if (!frozen) {
      const targetX = pointer.y * 0.35;
      const targetY = pointer.x * 0.35;
      group.rotation.x += (targetX - group.rotation.x) * 0.06;
      group.rotation.y += (targetY - group.rotation.y) * 0.06;
    }

    if (matRef.current) {
      matRef.current.emissive.lerp(
        hovered.current ? EMISSIVE_ON : EMISSIVE_OFF,
        k,
      );
    }
    if (edgeMatRef.current) {
      const target = hovered.current ? 0.8 : 0.15;
      edgeMatRef.current.opacity += (target - edgeMatRef.current.opacity) * k;
    }

    if (pulse.current > 0) {
      pulse.current = Math.max(0, pulse.current - delta * 3);
      group.scale.setScalar(1 + Math.sin((1 - pulse.current) * Math.PI) * 0.04);
    } else {
      group.scale.setScalar(1);
    }
  });

  function handleClick() {
    pulse.current = 1;
    const now = performance.now();
    const recent = clickTimes.current.filter((t) => now - t < 2000);
    recent.push(now);
    clickTimes.current = recent;
    if (recent.length >= 5) {
      clickTimes.current = [];
      console.warn(
        '%c🔥 Você encontrou uma brasa. Digite "hades" (fora de um campo) para descer ao submundo.',
        "color:#e8a33d",
      );
    }
  }

  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={groupRef}>
        <mesh
          geometry={geometry}
          onPointerOver={() => (hovered.current = true)}
          onPointerOut={() => (hovered.current = false)}
          onClick={handleClick}
        >
          <meshStandardMaterial
            ref={matRef}
            color={SHARD_COLOR}
            emissive="#000000"
            flatShading
            roughness={0.35}
            metalness={0.55}
          />
        </mesh>
        <lineSegments geometry={edgeGeometry}>
          <lineBasicMaterial
            ref={edgeMatRef}
            color={MOLTEN}
            transparent
            opacity={0.15}
          />
        </lineSegments>
      </group>
    </Float>
  );
}

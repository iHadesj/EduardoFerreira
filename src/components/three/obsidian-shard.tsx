"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const SHARD_COLOR = "#1c1526";
const MOLTEN = "#e8a33d";
const EMISSIVE_HOVER = new THREE.Color("#4a2c0c");
/* Faint always-on molten core so the stone never reads as a black hole. */
const EMISSIVE_BASE = new THREE.Color("#180c03");

/** Silhouette glow. Additive, so it only ever lightens — no dark halo. */
const rimVertexShader = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const rimFragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    float facing = clamp(dot(normalize(vNormalW), normalize(vViewDir)), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, 3.0);
    gl_FragColor = vec4(uColor * fresnel * uIntensity, fresnel * uIntensity);
  }
`;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

interface ObsidianShardProps {
  /** Freeze rotation (final perf-degradation step). */
  frozen?: boolean;
  /** Touch device → drag-to-spin with inertia instead of hover parallax. */
  touch?: boolean;
}

export function ObsidianShard({
  frozen = false,
  touch = false,
}: ObsidianShardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);
  const rimMatRef = useRef<THREE.ShaderMaterial>(null);
  const hovered = useRef(false);
  const pulse = useRef(0);
  const spin = useRef(0);
  const clickTimes = useRef<number[]>([]);
  const { pointer } = useThree();

  /* Drag state: the finger spins the shard and keeps spinning it after release. */
  const drag = useRef({ active: false, x: 0, y: 0, travel: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  /** 0..1 — how hard the shard is being thrown; drives the rim heat. */
  const heat = useRef(0);

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

  const rimUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(MOLTEN) },
      uIntensity: { value: 0.5 },
    }),
    [],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const k = Math.min(1, delta * 6); // ~250ms feel, frame-rate independent
    const d = drag.current;

    if (!frozen) {
      // Slow idle spin so the flat-shaded facets sweep through the rim light.
      spin.current += delta * 0.12;

      if (!d.active) {
        // Inertia: keep the throw going, then settle back to the idle axis.
        offset.current.y += velocity.current.y;
        offset.current.x = clamp(
          offset.current.x + velocity.current.x,
          -0.7,
          0.7,
        );
        const decay = Math.pow(0.94, delta * 60);
        velocity.current.x *= decay;
        velocity.current.y *= decay;
        // Tilt re-centres; the spin offset is free to keep drifting.
        offset.current.x += (0 - offset.current.x) * Math.min(1, delta * 0.7);
      }

      // Hover parallax is pointer-only: on touch the pointer would stick at
      // the last tap position and hold a permanent tilt.
      const parallaxX = touch ? 0 : pointer.y * 0.35;
      const parallaxY = touch ? 0 : pointer.x * 0.35;
      const targetX = parallaxX + offset.current.x;
      const targetY = spin.current + parallaxY + offset.current.y;
      group.rotation.x += (targetX - group.rotation.x) * 0.06;
      group.rotation.y += (targetY - group.rotation.y) * 0.06;
    }

    const throwHeat = clamp(Math.abs(velocity.current.y) * 26, 0, 1);
    heat.current += (throwHeat - heat.current) * k;
    const lit = hovered.current || d.active;

    if (matRef.current) {
      matRef.current.emissive.lerp(lit ? EMISSIVE_HOVER : EMISSIVE_BASE, k);
    }
    if (edgeMatRef.current) {
      const target = lit ? 1 : 0.45;
      edgeMatRef.current.opacity += (target - edgeMatRef.current.opacity) * k;
    }
    if (rimMatRef.current) {
      // Rests at a soft glow, flares on touch and on a hard spin.
      const target = (lit ? 1.15 : 0.5) + heat.current * 0.9;
      const u = rimMatRef.current.uniforms.uIntensity;
      if (u) u.value += (target - u.value) * k;
    }

    if (pulse.current > 0) {
      pulse.current = Math.max(0, pulse.current - delta * 3);
      group.scale.setScalar(1 + Math.sin((1 - pulse.current) * Math.PI) * 0.04);
    } else {
      group.scale.setScalar(1);
    }
  });

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    (event.target as Element).setPointerCapture?.(event.pointerId);
    drag.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      travel: 0,
    };
    velocity.current.x = 0;
    velocity.current.y = 0;
  }

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    const d = drag.current;
    if (!d.active) return;
    const dx = event.clientX - d.x;
    const dy = event.clientY - d.y;
    d.x = event.clientX;
    d.y = event.clientY;
    d.travel += Math.abs(dx) + Math.abs(dy);
    // px → radians. Never preventDefault: vertical page scroll stays the
    // browser's, so dragging the shard can't trap the page.
    const spinDelta = dx * 0.006;
    const tiltDelta = dy * 0.004;
    offset.current.y += spinDelta;
    offset.current.x = clamp(offset.current.x + tiltDelta, -0.7, 0.7);
    velocity.current.y = spinDelta;
    velocity.current.x = tiltDelta;
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    if (!drag.current.active) return;
    drag.current.active = false;
    (event.target as Element).releasePointerCapture?.(event.pointerId);
    if (touch) hovered.current = false;
  }

  function handleClick() {
    // A drag that ends on the shard isn't a tap — don't pulse on release.
    if (drag.current.travel > 8) return;
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
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleClick}
        >
          <meshStandardMaterial
            ref={matRef}
            color={SHARD_COLOR}
            emissive="#180c03"
            flatShading
            roughness={0.3}
            metalness={0.35}
          />
        </mesh>

        {/* Fresnel halo, slightly inflated. raycast off so it never eats a tap. */}
        <mesh geometry={geometry} scale={1.02} raycast={() => null}>
          <shaderMaterial
            ref={rimMatRef}
            uniforms={rimUniforms}
            vertexShader={rimVertexShader}
            fragmentShader={rimFragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <lineSegments geometry={edgeGeometry} raycast={() => null}>
          <lineBasicMaterial
            ref={edgeMatRef}
            color={MOLTEN}
            transparent
            opacity={0.45}
          />
        </lineSegments>
      </group>
    </Float>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const MOLTEN = new THREE.Color("#e8a33d");
const EMBER = new THREE.Color("#e04e2f");

/** Seeded PRNG (mulberry32) — deterministic, so the useMemo factory stays pure. */
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aSpeed;
  attribute float aPhase;
  varying float vAlpha;
  varying float vLife;
  void main() {
    vec3 p = position;
    float t = uTime * aSpeed + aPhase;
    float life = fract(t);
    p.y += life * 4.0;
    p.x += sin(life * 6.2831 + aPhase) * 0.35;
    vLife = life;
    vAlpha = smoothstep(0.0, 0.08, life) * smoothstep(1.0, 0.55, life);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPixelRatio * (140.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vLife;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float core = 1.0 - d * 2.0;
    vec3 color = mix(uColorA, uColorB, vLife);
    gl_FragColor = vec4(color, vAlpha * core);
  }
`;

interface EmberParticlesProps {
  count?: number;
}

/** Embers rising from a disc beneath the shard; animated in the vertex shader. */
export function EmberParticles({ count = 1200 }: EmberParticlesProps) {
  const { gl } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const rng = makeRng(0x5eed + count);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = Math.sqrt(rng()) * 2.2;
      const angle = rng() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -1.8 + rng() * 0.4;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      scales[i] = 4 + rng() * 10;
      speeds[i] = 0.06 + rng() * 0.12;
      phases[i] = rng() * 10;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    const u = {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uColorA: { value: MOLTEN.clone() },
      uColorB: { value: EMBER.clone() },
    };
    return { geometry: geo, uniforms: u };
  }, [count, gl]);

  // Advance time on the material instance (the ref), not the memoized object.
  useFrame((_, delta) => {
    const u = matRef.current?.uniforms.uTime;
    if (u) u.value += delta;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { Float } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

const VERTEX_SHADER = /* glsl */ `
  uniform float uActivity;
  uniform vec2 uPointer;
  uniform float uPulse;
  uniform float uTime;

  varying float vDeformation;
  varying vec2 vLoop;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vec4 baseViewPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 baseClipPosition = projectionMatrix * baseViewPosition;
    vec2 screenPosition = baseClipPosition.xy / baseClipPosition.w;
    float pointerDistance = distance(screenPosition, uPointer);
    float proximity = smoothstep(0.72, 0.05, pointerDistance) * uActivity;

    float travelingWave = sin(uv.x * 18.8496 - uTime * 2.4);
    float crossWave = cos(uv.x * 31.4159 + uTime * 1.45) * cos(uv.y * 12.5664);
    float breath = sin(uv.x * 6.2832 - uTime * 1.35) * 0.022;
    float nervousTwitch = sin(uv.x * 43.9823 + uTime * 2.8) * 0.006;
    float idleFlow = travelingWave * 0.026 + crossWave * 0.013 + breath + nervousTwitch;
    float cursorFlow = proximity * (travelingWave * 0.11 + crossWave * 0.035);
    float pulseWave = sin(uv.x * 37.6991 - uTime * 7.0) * uPulse * 0.06;
    float displacement = idleFlow + cursorFlow + pulseWave;

    vec3 transformed = position + normal * displacement;
    vec2 radialDirection = normalize(position.xy);
    float livingStretch = sin(uv.x * 12.5664 + uTime * 1.65) * 0.018;
    transformed.xy += radialDirection * (livingStretch + proximity * 0.045);
    transformed.z += proximity * cos(uv.y * 12.5664) * 0.048;
    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);

    vDeformation = proximity + abs(idleFlow) * 8.0 + uPulse * 0.35;
    vLoop = vec2(cos(uv.x * 6.2832), sin(uv.x * 6.2832));
    vWorldPosition = worldPosition.xyz;
    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uActivity;
  uniform float uTime;

  varying float vDeformation;
  varying vec2 vLoop;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
    normal = faceforward(normal, -viewDirection, normal);

    float facing = max(dot(normal, viewDirection), 0.0);
    float fresnel = pow(1.0 - facing, 2.15);
    float edgeDistance = abs(cos(vUv.y * 6.2832));
    float goldEdge = smoothstep(0.91, 0.99, edgeDistance);

    float loopAngle = atan(vLoop.y, vLoop.x);
    float liquidBand = sin(
      loopAngle * 2.0 +
      cos(vUv.y * 12.5664) * 1.2 -
      uTime * 1.05
    ) * 0.5 + 0.5;
    liquidBand = smoothstep(0.42, 0.95, liquidBand);

    vec2 glintDirection = vec2(cos(uTime * 0.75), sin(uTime * 0.75));
    float glintAlignment = dot(normalize(vLoop), glintDirection);
    float travelingGlint = smoothstep(0.64, 1.0, glintAlignment);

    float veinField = abs(sin(
      loopAngle * 5.0 -
      uTime * 1.8 +
      sin(loopAngle * 2.0 + uTime * 1.1) * 1.35 +
      cos(vUv.y * 12.5664) * 1.8
    ));
    float livingVein = smoothstep(0.91, 0.985, veinField);
    float veinPulse = sin(uTime * 2.4 - loopAngle * 3.0) * 0.5 + 0.5;

    vec3 sweepDirection = normalize(vec3(
      sin(uTime * 0.72),
      0.68,
      cos(uTime * 0.72) + 0.72
    ));
    float movingSpecular = pow(max(
      dot(reflect(-sweepDirection, normal), viewDirection),
      0.0
    ), 18.0);

    vec3 obsidian = vec3(0.006, 0.005, 0.009);
    vec3 graphite = vec3(0.055, 0.065, 0.075);
    vec3 coldReflection = vec3(0.13, 0.34, 0.38);
    vec3 molten = vec3(0.91, 0.54, 0.18);
    vec3 brightGold = vec3(1.0, 0.76, 0.34);

    vec3 color = mix(obsidian, graphite, fresnel * 0.8 + liquidBand * 0.16);
    color += coldReflection * fresnel * (0.34 + liquidBand * 0.2);
    color += molten * liquidBand * fresnel * 0.2;
    color += mix(coldReflection, molten, edgeDistance) * liquidBand * 0.075;
    color += mix(coldReflection, brightGold, travelingGlint) * movingSpecular * 0.62;
    color += mix(coldReflection, brightGold, veinPulse) * livingVein * (0.14 + uActivity * 0.12);
    color += coldReflection * liquidBand * (0.035 + veinPulse * 0.04);
    color += graphite * vDeformation * 0.32;

    vec3 edgeColor = mix(molten, brightGold, travelingGlint);
    color = mix(color, edgeColor, goldEdge * (0.72 + travelingGlint * 0.28));
    color += brightGold * goldEdge * travelingGlint * (0.45 + uActivity * 0.22);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function createMobiusGeometry(uSegments: number, vSegments: number) {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const radius = 1;
  const halfWidth = 0.36;
  const halfThickness = 0.035;

  for (let uIndex = 0; uIndex < uSegments; uIndex += 1) {
    const uRatio = uIndex / uSegments;
    const u = uRatio * Math.PI * 2;
    const halfTwist = u * 0.5;
    const organicRadius =
      radius + Math.sin(u * 3 + 0.4) * 0.038 + Math.sin(u * 7) * 0.017;
    const organicWidth =
      halfWidth * (1 + Math.sin(u * 5 - 0.6) * 0.11 + Math.sin(u * 9) * 0.045);

    for (let vIndex = 0; vIndex < vSegments; vIndex += 1) {
      const vRatio = vIndex / vSegments;
      const crossSection = vRatio * Math.PI * 2;
      const across = organicWidth * Math.cos(crossSection);
      const depth =
        halfThickness *
        (1 + Math.sin(u * 4 + 1.1) * 0.16) *
        Math.sin(crossSection);
      const radialOffset =
        across * Math.cos(halfTwist) - depth * Math.sin(halfTwist);
      const height = across * Math.sin(halfTwist) + depth * Math.cos(halfTwist);

      positions.push(
        (organicRadius + radialOffset) * Math.cos(u),
        (organicRadius + radialOffset) * Math.sin(u),
        height,
      );
      uvs.push(uRatio, vRatio);
    }
  }

  const row = vSegments;
  const halfTurn = vSegments / 2;
  for (let uIndex = 0; uIndex < uSegments; uIndex += 1) {
    for (let vIndex = 0; vIndex < vSegments; vIndex += 1) {
      const a = uIndex * row + vIndex;
      const nextV = (vIndex + 1) % vSegments;
      const d = uIndex * row + nextV;
      const closesLoop = uIndex === uSegments - 1;
      const nextRow = closesLoop ? 0 : (uIndex + 1) * row;
      const b = closesLoop
        ? nextRow + ((vIndex + halfTurn) % vSegments)
        : nextRow + vIndex;
      const c = closesLoop
        ? nextRow + ((nextV + halfTurn) % vSegments)
        : nextRow + nextV;
      indices.push(a, b, d, b, c, d);
    }
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

interface LiquidObsidianMobiusProps {
  /** Freeze ornamental motion after the final performance degradation step. */
  frozen?: boolean;
  /** Adds geometry only on capable, high-density desktop screens. */
  highDetail?: boolean;
  /** Touch devices use drag inertia instead of pointer parallax. */
  touch?: boolean;
}

export function LiquidObsidianMobius({
  frozen = false,
  highDetail = false,
  touch = false,
}: LiquidObsidianMobiusProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sculptureRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const hovered = useRef(false);
  const elapsed = useRef(0);
  const pulse = useRef(0);
  const clickTimes = useRef<number[]>([]);
  const { pointer } = useThree();

  const drag = useRef({ active: false, x: 0, y: 0, travel: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const geometry = useMemo(
    () => createMobiusGeometry(highDetail ? 180 : 120, highDetail ? 34 : 24),
    [highDetail],
  );
  const uniforms = useMemo(
    () => ({
      uActivity: { value: 0 },
      uPointer: { value: new THREE.Vector2(3, 3) },
      uPulse: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    const sculpture = sculptureRef.current;
    const material = materialRef.current;
    if (!group || !sculpture || !material) return;

    const dragState = drag.current;
    const response = Math.min(1, delta * 7);

    if (!frozen) {
      elapsed.current += delta;

      if (!dragState.active) {
        offset.current.x = clamp(
          offset.current.x + velocity.current.x,
          -0.38,
          0.38,
        );
        offset.current.y += velocity.current.y;
        const decay = Math.pow(0.91, delta * 60);
        velocity.current.x *= decay;
        velocity.current.y *= decay;
        offset.current.x += (0 - offset.current.x) * Math.min(1, delta * 0.9);
        offset.current.y += (0 - offset.current.y) * Math.min(1, delta * 0.18);
      }

      const pointerTiltX = touch ? 0 : pointer.y * 0.14;
      const pointerTiltY = touch ? 0 : pointer.x * 0.2;
      const targetX = 0.7 + pointerTiltX + offset.current.x;
      const targetY = -0.34 + pointerTiltY + offset.current.y;
      group.rotation.x += (targetX - group.rotation.x) * 0.045;
      group.rotation.y += (targetY - group.rotation.y) * 0.045;
      const targetPositionX = touch ? 0 : pointer.x * 0.12;
      const targetPositionY = touch ? -0.1 : pointer.y * 0.09;
      group.position.x += (targetPositionX - group.position.x) * 0.035;
      group.position.y += (targetPositionY - group.position.y) * 0.035;

      sculpture.rotation.z += delta * (0.34 + pulse.current * 0.18);
      sculpture.rotation.x =
        Math.sin(elapsed.current * 0.86) * 0.18 +
        Math.sin(elapsed.current * 1.9) * 0.035;
      sculpture.rotation.y = Math.cos(elapsed.current * 0.68) * 0.15;
    }

    pulse.current = Math.max(0, pulse.current - delta * 0.95);
    const targetActivity = hovered.current || dragState.active ? 1 : 0;
    const pointerUniform = material.uniforms.uPointer!.value as THREE.Vector2;
    pointerUniform.lerp(pointer, response);
    material.uniforms.uTime!.value = elapsed.current;
    material.uniforms.uPulse!.value = pulse.current;
    material.uniforms.uActivity!.value +=
      (targetActivity - material.uniforms.uActivity!.value) * response;
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
    const dragState = drag.current;
    if (!dragState.active) return;

    const dx = event.clientX - dragState.x;
    const dy = event.clientY - dragState.y;
    dragState.x = event.clientX;
    dragState.y = event.clientY;
    dragState.travel += Math.abs(dx) + Math.abs(dy);

    const yaw = dx * 0.0045;
    const tilt = dy * 0.0032;
    offset.current.y += yaw;
    offset.current.x = clamp(offset.current.x + tilt, -0.38, 0.38);
    velocity.current.y = yaw;
    velocity.current.x = tilt;
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    if (!drag.current.active) return;
    drag.current.active = false;
    (event.target as Element).releasePointerCapture?.(event.pointerId);
    if (touch) hovered.current = false;
  }

  function handleClick() {
    if (drag.current.travel > 8) return;
    pulse.current = 1;

    const now = performance.now();
    const recent = clickTimes.current.filter((time) => now - time < 2000);
    recent.push(now);
    clickTimes.current = recent;
    if (recent.length >= 5) {
      clickTimes.current = [];
      console.warn(
        '%c🔥 A fita não tem começo nem fim. Digite "hades" (fora de um campo) para descer ao submundo.',
        "color:#e8a33d",
      );
    }
  }

  return (
    <Float
      speed={frozen ? 0 : 1.15}
      rotationIntensity={frozen ? 0 : 0.09}
      floatIntensity={frozen ? 0 : 0.25}
    >
      <group
        ref={groupRef}
        rotation={[0.7, -0.34, -0.14]}
        scale={touch ? 1.04 : 1}
      >
        <group ref={sculptureRef}>
          <mesh geometry={geometry} raycast={() => null}>
            <shaderMaterial
              ref={materialRef}
              uniforms={uniforms}
              vertexShader={VERTEX_SHADER}
              fragmentShader={FRAGMENT_SHADER}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        <mesh
          onPointerOver={() => (hovered.current = true)}
          onPointerOut={() => (hovered.current = false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleClick}
        >
          <sphereGeometry args={[1.62, 24, 18]} />
          <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
        </mesh>
      </group>
    </Float>
  );
}

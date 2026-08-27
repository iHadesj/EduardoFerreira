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
  uniform float uUnderworld;

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

    float loopPhase = uv.x * 6.2832;
    float crossSectionPhase = uv.y * 6.2832 + uv.x * 3.1416;
    float surfaceBreath = sin(uTime * 1.38);
    float predatorBreath = sin(uTime * 2.72 + sin(uTime * 0.74) * 0.58);
    float breathingCycle = mix(surfaceBreath, predatorBreath, uUnderworld);
    float surfaceUndertow = sin(uTime * 0.57 + 1.4);
    float predatorUndertow = sin(uTime * 1.31 + 0.8);
    float breathingUndertow = mix(
      surfaceUndertow,
      predatorUndertow,
      uUnderworld
    );
    float bodyBreath =
      (
        breathingCycle * mix(0.027, 0.048, uUnderworld) +
        breathingUndertow * mix(0.011, 0.018, uUnderworld)
      ) *
      (0.78 + cos(loopPhase * 2.0 - 0.35) * 0.22);

    float travelingWave = sin(loopPhase * 3.0 - uTime * 2.4);
    float crossWave =
      cos(loopPhase * 5.0 + uTime * 1.45) * cos(crossSectionPhase * 2.0);
    float contraction =
      pow(sin(loopPhase * 2.0 - uTime * 1.62) * 0.5 + 0.5, 3.0) *
      (0.026 + cos(crossSectionPhase) * 0.01);
    float predatoryContraction =
      pow(sin(loopPhase * 3.0 - uTime * 4.35) * 0.5 + 0.5, 5.0) *
      (0.057 + cos(crossSectionPhase * 2.0) * 0.016) *
      uUnderworld;
    float crawlingRipple = sin(
      loopPhase * 4.0 -
      uTime * 2.15 +
      sin(loopPhase - uTime * 0.42) * 0.82
    ) * mix(0.016, 0.029, uUnderworld);
    float violentRipple =
      sin(
        loopPhase * 7.0 -
        uTime * 5.4 +
        sin(loopPhase * 2.0 + uTime * 1.7) * 1.15
      ) *
      0.022 *
      uUnderworld;
    float nervousTwitch =
      sin(loopPhase * 7.0 + uTime * 2.8) *
      mix(0.006, 0.017, uUnderworld);
    float idleFlow =
      travelingWave * 0.024 +
      crossWave * 0.012 +
      bodyBreath +
      contraction +
      predatoryContraction +
      crawlingRipple +
      violentRipple +
      nervousTwitch;
    float cursorFlow =
      proximity *
      (travelingWave * 0.11 + crossWave * 0.035) *
      mix(1.0, 1.45, uUnderworld);
    float pulseWave =
      sin(loopPhase * 6.0 - uTime * 7.0) *
      uPulse *
      mix(0.06, 0.105, uUnderworld);
    float displacement = idleFlow + cursorFlow + pulseWave;

    vec3 transformed = position + normal * displacement;
    vec2 radialDirection = normalize(position.xy);
    float livingStretch =
      sin(loopPhase * 2.0 + uTime * 1.65) * 0.025 +
      sin(loopPhase * 5.0 - uTime * 0.92) * 0.009;
    transformed.xy += radialDirection * (
      livingStretch +
      bodyBreath * 0.48 +
      proximity * 0.05
    );
    transformed.z *= 1.0 + breathingCycle * 0.075;
    transformed.z +=
      sin(loopPhase * 2.0 - uTime * 1.08) * 0.018 +
      sin(
        loopPhase * 3.0 +
        uTime * 3.7 +
        sin(loopPhase * 5.0 - uTime * 1.4)
      ) *
      0.034 *
      uUnderworld +
      proximity * cos(crossSectionPhase * 2.0) * 0.048;
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
  uniform float uUnderworld;

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
    float surfaceBreathLight = sin(uTime * 1.38) * 0.5 + 0.5;
    float predatorBreathLight =
      sin(uTime * 3.05 + sin(uTime * 0.9) * 0.7) * 0.5 + 0.5;
    float breathLight = mix(
      surfaceBreathLight,
      predatorBreathLight,
      uUnderworld
    );

    float loopAngle = atan(vLoop.y, vLoop.x);
    float surfaceBand = sin(
      loopAngle * 2.0 +
      cos(vUv.y * 12.5664) * 1.2 -
      uTime * 1.05
    ) * 0.5 + 0.5;
    float predatorBand = sin(
      loopAngle * 3.0 +
      cos(vUv.y * 18.8496) * 1.45 -
      uTime * 3.15 +
      sin(loopAngle * 5.0 + uTime * 1.7) * 0.72
    ) * 0.5 + 0.5;
    float liquidBand = mix(surfaceBand, predatorBand, uUnderworld);
    liquidBand = smoothstep(0.42, 0.95, liquidBand);

    vec2 glintDirection = mix(
      vec2(cos(uTime * 0.75), sin(uTime * 0.75)),
      vec2(cos(uTime * 1.85), sin(uTime * 1.85)),
      uUnderworld
    );
    float glintAlignment = dot(normalize(vLoop), glintDirection);
    float travelingGlint = smoothstep(0.64, 1.0, glintAlignment);

    float surfaceVein = abs(sin(
      loopAngle * 5.0 -
      uTime * 1.8 +
      sin(loopAngle * 2.0 + uTime * 1.1) * 1.35 +
      cos(vUv.y * 12.5664) * 1.8
    ));
    float predatorVein = abs(sin(
      loopAngle * 8.0 -
      uTime * 5.4 +
      sin(loopAngle * 3.0 + uTime * 2.2) * 1.7 +
      cos(vUv.y * 18.8496) * 2.15
    ));
    float veinField = mix(surfaceVein, predatorVein, uUnderworld);
    float livingVein = smoothstep(0.91, 0.985, veinField);
    float veinPulse =
      sin(uTime * mix(2.4, 5.8, uUnderworld) - loopAngle * 3.0) *
      0.5 +
      0.5;

    vec3 sweepDirection = normalize(vec3(
      sin(uTime * 0.72),
      0.68,
      cos(uTime * 0.72) + 0.72
    ));
    float movingSpecular = pow(max(
      dot(reflect(-sweepDirection, normal), viewDirection),
      0.0
    ), 18.0);

    vec3 obsidian = mix(
      vec3(0.006, 0.005, 0.009),
      vec3(0.0015, 0.0002, 0.0005),
      uUnderworld
    );
    vec3 graphite = mix(
      vec3(0.055, 0.065, 0.075),
      vec3(0.052, 0.0025, 0.007),
      uUnderworld
    );
    vec3 coldReflection = mix(
      vec3(0.13, 0.34, 0.38),
      vec3(0.38, 0.006, 0.016),
      uUnderworld
    );
    vec3 molten = mix(
      vec3(0.91, 0.54, 0.18),
      vec3(0.79, 0.018, 0.009),
      uUnderworld
    );
    vec3 brightGold = mix(
      vec3(1.0, 0.76, 0.34),
      vec3(1.0, 0.075, 0.022),
      uUnderworld
    );

    vec3 color = mix(obsidian, graphite, fresnel * 0.8 + liquidBand * 0.16);
    color += coldReflection * fresnel * (0.34 + liquidBand * 0.2);
    color += molten * liquidBand * fresnel * (0.17 + breathLight * 0.07);
    color += mix(coldReflection, molten, edgeDistance) * liquidBand * 0.075;
    color += mix(coldReflection, brightGold, travelingGlint) * movingSpecular * 0.62;
    color += mix(coldReflection, brightGold, veinPulse) * livingVein * (0.14 + uActivity * 0.12);
    color += coldReflection * liquidBand * (0.035 + veinPulse * 0.04);
    color += graphite * vDeformation * 0.32;
    color +=
      brightGold *
      livingVein *
      uUnderworld *
      (0.13 + predatorBreathLight * 0.18);

    vec3 edgeColor = mix(molten, brightGold, travelingGlint);
    color = mix(
      color,
      edgeColor,
      goldEdge * (0.68 + travelingGlint * 0.26 + breathLight * 0.08)
    );
    color +=
      brightGold *
      goldEdge *
      travelingGlint *
      (0.4 + breathLight * 0.1 + uActivity * 0.22);

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
  /** Turns the sculpture into its faster black-and-red underworld form. */
  underworld?: boolean;
}

export function LiquidObsidianMobius({
  frozen = false,
  highDetail = false,
  touch = false,
  underworld = false,
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
      uUnderworld: { value: 0 },
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
    material.uniforms.uUnderworld!.value +=
      ((underworld ? 1 : 0) - material.uniforms.uUnderworld!.value) *
      Math.min(1, delta * 2.8);
    const aggression = material.uniforms.uUnderworld!.value as number;

    if (!frozen) {
      elapsed.current += delta * (1 + aggression * 0.42);
    }

    // Performance degradation may pause the ornamental animation, but direct
    // manipulation must stay responsive on lower-powered Android devices.
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
    const rotationResponse =
      1 - Math.exp(-delta * (touch && dragState.active ? 13 : 2.8));
    group.rotation.x += (targetX - group.rotation.x) * rotationResponse;
    group.rotation.y += (targetY - group.rotation.y) * rotationResponse;
    const targetPositionX = touch ? 0 : pointer.x * 0.12;
    const targetPositionY = touch ? 0 : pointer.y * 0.09;
    const positionResponse = 1 - Math.exp(-delta * 2.15);
    group.position.x += (targetPositionX - group.position.x) * positionResponse;
    group.position.y += (targetPositionY - group.position.y) * positionResponse;

    if (!frozen) {
      const breath = Math.sin(elapsed.current * 1.38);
      const undertow = Math.sin(elapsed.current * 0.57 + 1.4);
      const predatorPulse = Math.sin(
        elapsed.current * 3.85 + Math.sin(elapsed.current * 1.13) * 0.9,
      );
      const livingScale =
        breath * 0.038 + undertow * 0.013 + predatorPulse * 0.032 * aggression;

      sculpture.rotation.z +=
        delta *
        (0.31 +
          Math.sin(elapsed.current * 0.39) * 0.055 +
          aggression * (0.2 + Math.sin(elapsed.current * 2.45) * 0.09) +
          pulse.current * (0.2 + aggression * 0.16));
      sculpture.rotation.x =
        Math.sin(elapsed.current * 0.81) * 0.22 +
        Math.sin(elapsed.current * 1.93) * 0.052 +
        Math.sin(elapsed.current * 3.42) * 0.095 * aggression;
      sculpture.rotation.y =
        Math.cos(elapsed.current * 0.66) * 0.19 +
        Math.sin(elapsed.current * 1.47) * 0.038 +
        Math.cos(elapsed.current * 4.18) * 0.072 * aggression;
      sculpture.position.x =
        Math.sin(elapsed.current * 0.72) * 0.045 +
        Math.sin(elapsed.current * 1.71) * 0.012 +
        Math.sin(elapsed.current * 3.6) * 0.026 * aggression;
      sculpture.position.y =
        Math.cos(elapsed.current * 0.59) * 0.034 +
        Math.sin(elapsed.current * 1.34) * 0.014 +
        Math.cos(elapsed.current * 3.15) * 0.021 * aggression;
      sculpture.position.z =
        Math.sin(elapsed.current * 0.91) * 0.026 +
        Math.sin(elapsed.current * 4.7) * 0.018 * aggression;
      sculpture.scale.set(
        1 + livingScale * (0.72 + aggression * 0.25),
        1 + livingScale * (1.12 + aggression * 0.42),
        1 - livingScale * (0.46 + aggression * 0.28),
      );
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
    hovered.current = true;
    pulse.current = Math.max(pulse.current, 0.3);
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

    const yaw = dx * (touch ? 0.0062 : 0.0045);
    const tilt = dy * (touch ? 0.0044 : 0.0032);
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
      speed={frozen ? 0 : underworld ? 2.15 : 1.15}
      rotationIntensity={frozen ? 0 : underworld ? 0.16 : 0.09}
      floatIntensity={frozen ? 0 : underworld ? 0.36 : 0.25}
    >
      <group
        ref={groupRef}
        rotation={[0.7, -0.34, -0.14]}
        scale={touch ? 1.18 : 1}
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

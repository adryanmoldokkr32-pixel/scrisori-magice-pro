"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createHeartShape(s: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, s * 0.3);
  shape.bezierCurveTo(0, s * 0.45, -s * 0.1, s * 0.65, -s * 0.5, s * 0.65);
  shape.bezierCurveTo(-s, s * 0.65, -s, s * 0.3, -s, s * 0.3);
  shape.bezierCurveTo(-s, 0, -s * 0.65, -s * 0.35, 0, -s * 0.7);
  shape.bezierCurveTo(s * 0.65, -s * 0.35, s, 0, s, s * 0.3);
  shape.bezierCurveTo(s, s * 0.3, s, s * 0.65, s * 0.5, s * 0.65);
  shape.bezierCurveTo(s * 0.1, s * 0.65, 0, s * 0.45, 0, s * 0.3);
  return shape;
}

const HEART_EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 0.15,
  bevelEnabled: true,
  bevelThickness: 0.06,
  bevelSize: 0.04,
  bevelSegments: 2,
  curveSegments: 8,
};

interface HeartConfig {
  position: [number, number, number];
  scale: number;
  speed: number;
  rotSpeed: number;
  phase: number;
  color: string;
}

function FloatingHeart({ config }: { config: HeartConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const shape = createHeartShape(0.4);
    return new THREE.ExtrudeGeometry(shape, HEART_EXTRUDE);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * config.speed + config.phase;
    meshRef.current.position.y = config.position[1] + Math.sin(t) * 0.6;
    meshRef.current.position.x = config.position[0] + Math.sin(t * 0.7) * 0.15;
    meshRef.current.rotation.y += config.rotSpeed * 0.008;
    meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
  });

  return (
    <mesh ref={meshRef} position={config.position} scale={config.scale} geometry={geo}>
      <meshStandardMaterial
        color={config.color}
        emissive={config.color}
        emissiveIntensity={0.35}
        roughness={0.4}
        metalness={0.1}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function FloatingEnvelope() {
  const groupRef = useRef<THREE.Group>(null);
  const flapRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.25;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.08;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.15;
    if (flapRef.current) {
      flapRef.current.rotation.x = Math.sin(t * 0.4) * 0.12 - 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.1}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.4, 0.08]} />
        <meshStandardMaterial color="#c9302c" roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.35, 0.045]}>
        <boxGeometry args={[2.18, 0.7, 0.01]} />
        <meshStandardMaterial color="#a52020" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.15, -0.01]}>
        <boxGeometry args={[1.9, 1.1, 0.04]} />
        <meshStandardMaterial color="#faf3e8" roughness={0.9} />
      </mesh>
      <mesh ref={flapRef} position={[0, 0.7, 0.04]} rotation={[-0.05, 0, 0]}>
        <coneGeometry args={[1.12, 0.75, 4]} />
        <meshStandardMaterial color="#e04040" roughness={0.6} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.0, 0.06]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
        <meshStandardMaterial color="#d4a853" emissive="#d4a853" emissiveIntensity={0.3} roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.02, 0.1]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color="#b8912e" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

const DUST_COUNT = 80;

function SparklingDust() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: DUST_COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 6 - 2,
      speed: 0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      scale: 0.015 + Math.random() * 0.03,
      idx: i,
    }))
  , []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    particles.forEach((p) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 0.3,
        p.y + Math.cos(t * p.speed * 0.7 + p.phase) * 0.4,
        p.z
      );
      const s = p.scale * (0.7 + 0.3 * Math.sin(t * 2 + p.phase));
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(p.idx, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, DUST_COUNT]}>
      <sphereGeometry args={[1, 6, 4]} />
      <meshBasicMaterial color="#d4a853" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function LandingScene() {
  const hearts = useMemo<HeartConfig[]>(() => [
    { position: [-4.5, 2.0, -3], scale: 0.6, speed: 0.6, rotSpeed: 0.8, phase: 0, color: "#e8457a" },
    { position: [4.8, 1.5, -2.5], scale: 0.45, speed: 0.7, rotSpeed: -0.6, phase: 1.2, color: "#ff6b9d" },
    { position: [-3.5, -2.0, -4], scale: 0.35, speed: 0.5, rotSpeed: 0.5, phase: 2.5, color: "#ffb7c5" },
    { position: [3.5, -1.8, -3.5], scale: 0.5, speed: 0.55, rotSpeed: -0.7, phase: 3.8, color: "#e8457a" },
    { position: [-1.5, 3.2, -5], scale: 0.3, speed: 0.45, rotSpeed: 0.4, phase: 5, color: "#d4a853" },
    { position: [1.8, -3.0, -4.5], scale: 0.25, speed: 0.65, rotSpeed: -0.9, phase: 0.7, color: "#ff6b9d" },
    { position: [5.5, -0.5, -5], scale: 0.2, speed: 0.5, rotSpeed: 0.6, phase: 4.1, color: "#ffb7c5" },
    { position: [-5.2, -0.8, -4.2], scale: 0.28, speed: 0.55, rotSpeed: -0.5, phase: 2.0, color: "#d4a853" },
  ], []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 4]} intensity={0.8} color="#d4a853" />
      <pointLight position={[-4, -2, 3]} intensity={0.4} color="#e8457a" />
      <pointLight position={[4, -2, 3]} intensity={0.4} color="#ff6b9d" />
      <FloatingEnvelope />
      {hearts.map((h, i) => <FloatingHeart key={i} config={h} />)}
      <SparklingDust />
    </>
  );
}

export default function ThreeBackground() {
  const handleCreated = useCallback((state: { gl: THREE.WebGLRenderer }) => {
    state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        onCreated={handleCreated}
        style={{ background: "transparent" }}
      >
        <LandingScene />
      </Canvas>
    </div>
  );
}

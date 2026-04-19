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

function LandingScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 4]} intensity={0.8} color="#d4a853" />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.4, 0.08]} />
        <meshStandardMaterial color="#c9302c" />
      </mesh>
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} style={{ background: "transparent" }}>
        <LandingScene />
      </Canvas>
    </div>
  );
}

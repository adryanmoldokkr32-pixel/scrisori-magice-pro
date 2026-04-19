"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 200;
const COLORS = [0xe8457a, 0xd4a853, 0xffb7c5, 0xff6b9d, 0xffd700, 0x00ff88, 0x7b68ee, 0xff4500];

function CelebrationParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      const elevation = (Math.random() - 0.3) * Math.PI;
      return {
        vx: Math.cos(angle) * Math.cos(elevation) * speed,
        vy: Math.sin(elevation) * speed + 1.5,
        vz: Math.sin(angle) * Math.cos(elevation) * speed,
        scale: 0.02 + Math.random() * 0.06,
        life: 0,
        maxLife: 2 + Math.random() * 3,
        gravity: 0.6 + Math.random() * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 1.5,
        x: 0, y: 0, z: 0,
        trail: Math.random() > 0.5,
      };
    });
  }, []);

  const colorArray = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    particles.forEach((p, i) => {
      const c = new THREE.Color(p.color);
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    });
    return arr;
  }, [particles]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.05);

    particles.forEach((p, i) => {
      if (p.delay > 0) {
        p.delay -= dt;
        dummy.scale.set(0, 0, 0);
      } else {
        p.life += dt;
        if (p.life > p.maxLife) {
          dummy.scale.set(0, 0, 0);
        } else {
          p.x += p.vx * dt;
          p.vy -= p.gravity * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          p.vx *= 0.995;
          p.vz *= 0.995;

          const progress = p.life / p.maxLife;
          const fade = progress < 0.1 ? progress * 10 : Math.max(0, 1 - (progress - 0.5) * 2);
          const s = p.scale * fade;

          dummy.position.set(p.x, p.y, p.z);
          dummy.scale.set(s, s, s);
        }
      }
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 4]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </sphereGeometry>
      <meshBasicMaterial vertexColors transparent opacity={0.9} toneMapped={false} />
    </instancedMesh>
  );
}

export default function ThreeCelebration({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <CelebrationParticles />
      </Canvas>
    </div>
  );
}

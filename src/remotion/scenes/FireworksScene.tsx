import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { FIREWORK_COLORS, VIDEO_WIDTH, VIDEO_HEIGHT } from '../constants';

interface FireworkBurst {
  cx: number;
  cy: number;
  startFrame: number;
  particleCount: number;
  colors: string[];
}

interface Particle {
  angle: number;
  distance: number;
  size: number;
  color: string;
}

const FireworkBurstComponent: React.FC<{
  burst: FireworkBurst;
  particles: Particle[];
}> = ({ burst, particles }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - burst.startFrame;

  if (localFrame < 0) return null;

  return (
    <>
      {particles.map((p, i) => {
        const progress = interpolate(localFrame, [0, 40], [0, 1], {
          extrapolateRight: 'clamp',
        });
        const x = burst.cx + Math.cos(p.angle) * p.distance * progress;
        const y = burst.cy + Math.sin(p.angle) * p.distance * progress + progress * progress * 30;
        const opacity = interpolate(localFrame, [0, 10, 35, 45], [0, 1, 0.8, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const scale = interpolate(localFrame, [0, 5, 40], [0.2, 1, 0.3], {
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              opacity,
              transform: `scale(${scale})`,
            }}
          />
        );
      })}
    </>
  );
};

export const FireworksScene: React.FC = () => {
  const { fps } = useVideoConfig();

  const bursts = useMemo<FireworkBurst[]>(() => [
    { cx: VIDEO_WIDTH * 0.2, cy: VIDEO_HEIGHT * 0.15, startFrame: 0, particleCount: 28, colors: FIREWORK_COLORS },
    { cx: VIDEO_WIDTH * 0.8, cy: VIDEO_HEIGHT * 0.12, startFrame: fps * 0.5, particleCount: 32, colors: FIREWORK_COLORS },
    { cx: VIDEO_WIDTH * 0.5, cy: VIDEO_HEIGHT * 0.08, startFrame: fps * 1, particleCount: 35, colors: FIREWORK_COLORS },
    { cx: VIDEO_WIDTH * 0.3, cy: VIDEO_HEIGHT * 0.2, startFrame: fps * 1.5, particleCount: 25, colors: FIREWORK_COLORS },
    { cx: VIDEO_WIDTH * 0.7, cy: VIDEO_HEIGHT * 0.25, startFrame: fps * 2, particleCount: 30, colors: FIREWORK_COLORS },
    { cx: VIDEO_WIDTH * 0.15, cy: VIDEO_HEIGHT * 0.3, startFrame: fps * 2.5, particleCount: 22, colors: FIREWORK_COLORS },
    { cx: VIDEO_WIDTH * 0.85, cy: VIDEO_HEIGHT * 0.2, startFrame: fps * 3, particleCount: 26, colors: FIREWORK_COLORS },
    { cx: VIDEO_WIDTH * 0.5, cy: VIDEO_HEIGHT * 0.18, startFrame: fps * 3.5, particleCount: 35, colors: FIREWORK_COLORS },
    { cx: VIDEO_WIDTH * 0.35, cy: VIDEO_HEIGHT * 0.1, startFrame: fps * 4, particleCount: 30, colors: FIREWORK_COLORS },
    { cx: VIDEO_WIDTH * 0.65, cy: VIDEO_HEIGHT * 0.15, startFrame: fps * 4.5, particleCount: 28, colors: FIREWORK_COLORS },
  ], [fps]);

  const burstParticles = useMemo(() =>
    bursts.map((burst) => {
      return Array.from({ length: burst.particleCount }, (_, i) => {
        const angle = (Math.PI * 2 * i) / burst.particleCount + ((i * 0.3) % 0.5 - 0.25);
        return {
          angle,
          distance: 60 + (i % 5) * 25,
          size: 4 + (i % 4) * 2,
          color: burst.colors[i % burst.colors.length],
        };
      });
    }),
    [bursts]
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {bursts.map((burst, i) => (
        <FireworkBurstComponent
          key={i}
          burst={burst}
          particles={burstParticles[i]}
        />
      ))}
    </AbsoluteFill>
  );
};

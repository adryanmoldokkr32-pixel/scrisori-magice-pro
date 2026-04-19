import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { PETAL_COLORS, VIDEO_WIDTH, VIDEO_HEIGHT } from '../constants';

interface Petal {
  startX: number;
  size: number;
  color: string;
  speed: number;
  swayAmount: number;
  swaySpeed: number;
  rotation: number;
  delay: number;
  opacity: number;
}

export const FallingPetals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const petals = useMemo<Petal[]>(() =>
    Array.from({ length: 35 }, (_, i) => ({
      startX: ((i * 47 + 13) % 100) / 100 * VIDEO_WIDTH,
      size: 8 + (i % 5) * 3,
      color: PETAL_COLORS[i % PETAL_COLORS.length],
      speed: 2 + (i % 4) * 0.8,
      swayAmount: 30 + (i % 3) * 20,
      swaySpeed: 0.03 + (i % 5) * 0.008,
      rotation: (i * 37) % 360,
      delay: (i * 5) % 60,
      opacity: 0.5 + (i % 4) * 0.15,
    })),
    []
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {petals.map((petal, i) => {
        const adjustedFrame = frame - petal.delay;
        if (adjustedFrame < 0) return null;

        const y = adjustedFrame * petal.speed;
        const cycleY = y % (VIDEO_HEIGHT + 100);
        const x = petal.startX + Math.sin(adjustedFrame * petal.swaySpeed) * petal.swayAmount;
        const rot = petal.rotation + adjustedFrame * 3;

        const fadeIn = interpolate(adjustedFrame, [0, 15], [0, petal.opacity], {
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: cycleY - 50,
              width: petal.size,
              height: petal.size * 1.3,
              backgroundColor: petal.color,
              borderRadius: '50% 50% 50% 0',
              transform: `rotate(${rot}deg)`,
              opacity: fadeIn,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

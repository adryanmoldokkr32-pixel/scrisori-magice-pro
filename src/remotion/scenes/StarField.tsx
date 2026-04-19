import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const StarField: React.FC = () => {
  const frame = useCurrentFrame();

  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        x: ((i * 37 + 13) % 100),
        y: ((i * 53 + 7) % 100),
        size: 1 + (i % 3) * 1.2,
        baseOpacity: 0.15 + (i % 5) * 0.1,
        twinkleSpeed: 0.02 + (i % 7) * 0.005,
        phase: (i * 2.1) % (Math.PI * 2),
      })),
    []
  );

  return (
    <AbsoluteFill>
      {stars.map((star, i) => {
        const opacity =
          star.baseOpacity +
          Math.sin(frame * star.twinkleSpeed + star.phase) * 0.15;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255,255,255,${opacity}) 0%, transparent 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, PETAL_COLORS } from '../constants';

const BRANCH_DATA = [
  { bottom: '65%', xOffset: 0, width: 110, rotate: -35 },
  { bottom: '65%', xOffset: 0, width: 100, rotate: 30 },
  { bottom: '50%', xOffset: 0, width: 130, rotate: -45 },
  { bottom: '50%', xOffset: 0, width: 120, rotate: 40 },
  { bottom: '38%', xOffset: 0, width: 90, rotate: -30 },
  { bottom: '38%', xOffset: 0, width: 80, rotate: 35 },
  { bottom: '78%', xOffset: 0, width: 80, rotate: -25 },
  { bottom: '78%', xOffset: 0, width: 70, rotate: 20 },
  { bottom: '28%', xOffset: 0, width: 65, rotate: -40 },
  { bottom: '28%', xOffset: 0, width: 55, rotate: 45 },
];

const BLOSSOM_POSITIONS = [
  { bottom: '62%', left: -30 }, { bottom: '67%', left: -55 },
  { bottom: '60%', left: 45 }, { bottom: '68%', left: 70 },
  { bottom: '48%', left: -70 }, { bottom: '52%', left: -95 },
  { bottom: '47%', left: 60 }, { bottom: '53%', left: 85 },
  { bottom: '36%', left: -40 }, { bottom: '40%', left: -65 },
  { bottom: '35%', left: 30 }, { bottom: '41%', left: 55 },
  { bottom: '75%', left: -25 }, { bottom: '80%', left: -50 },
  { bottom: '76%', left: 20 }, { bottom: '81%', left: 40 },
  { bottom: '26%', left: -30 }, { bottom: '30%', left: -50 },
  { bottom: '25%', left: 20 }, { bottom: '29%', left: 40 },
  { bottom: '55%', left: -80 }, { bottom: '44%', left: 80 },
  { bottom: '70%', left: -70 }, { bottom: '33%', left: 65 },
  { bottom: '85%', left: -15 }, { bottom: '85%', left: 18 },
  { bottom: '58%', left: 95 }, { bottom: '45%', left: -90 },
];

export const TreeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Trunk grows from bottom
  const trunkScaleY = interpolate(frame, [0, fps * 2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Branches appear staggered
  const getBranchOpacity = (index: number) =>
    interpolate(frame, [fps * 1.5 + index * 3, fps * 2 + index * 3], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const getBranchScale = (index: number) =>
    interpolate(frame, [fps * 1.5 + index * 3, fps * 2 + index * 3], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  // Blossoms pop in staggered
  const getBlossomScale = (index: number) =>
    spring({
      frame: frame - (fps * 2.5 + index * 1.5),
      fps,
      config: { damping: 8, stiffness: 120 },
    });

  // Bloom glow pulse
  const glowOpacity = frame > fps * 4
    ? 0.3 + Math.sin(frame * 0.05) * 0.15
    : interpolate(frame, [fps * 3, fps * 4], [0, 0.3], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: 320,
          height: 500,
          marginBottom: '8%',
        }}
      >
        {/* Bloom glow */}
        <div
          style={{
            position: 'absolute',
            inset: -60,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(255,183,197,${glowOpacity}) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Trunk */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: `translateX(-50%) scaleY(${trunkScaleY})`,
            transformOrigin: 'bottom center',
            width: 22,
            height: 360,
            background: `linear-gradient(to top, ${COLORS.TRUNK}, #6b4030, ${COLORS.BRANCH})`,
            borderRadius: 4,
          }}
        />

        {/* Branches */}
        {BRANCH_DATA.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: b.bottom,
              left: '50%',
              width: b.width,
              height: 8,
              background: `linear-gradient(${b.rotate < 0 ? 'to left' : 'to right'}, ${COLORS.BRANCH}, #7a5035)`,
              borderRadius: 4,
              transform: `rotate(${b.rotate}deg) scaleX(${getBranchScale(i)})`,
              transformOrigin: 'center center',
              opacity: getBranchOpacity(i),
            }}
          />
        ))}

        {/* Blossoms */}
        {BLOSSOM_POSITIONS.map((pos, i) => {
          const color = PETAL_COLORS[i % PETAL_COLORS.length];
          const size = 14 + ((i * 7 + 3) % 10);
          const scale = getBlossomScale(i);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: pos.bottom,
                left: `calc(50% + ${pos.left}px)`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: `radial-gradient(circle, white 15%, ${color} 50%, ${color}90 100%)`,
                boxShadow: `0 0 ${size / 2}px ${color}80`,
                transform: `scale(${scale})`,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

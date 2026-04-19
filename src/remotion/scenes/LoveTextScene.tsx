import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS } from '../constants';

export const LoveTextScene: React.FC<{ recipientName: string }> = ({
  recipientName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Elastic pop-in
  const scale = spring({
    frame,
    fps,
    config: { damping: 6, stiffness: 60, mass: 1.2 },
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Pulsing glow
  const glowIntensity = frame > 20
    ? 0.6 + Math.sin(frame * 0.08) * 0.25
    : interpolate(frame, [10, 20], [0, 0.6], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${scale})`,
          opacity,
          position: 'relative',
        }}
      >
        {/* Glow behind text */}
        <div
          style={{
            position: 'absolute',
            inset: -80,
            background: `radial-gradient(ellipse, rgba(232,69,122,${glowIntensity * 0.3}) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <p
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 80,
            fontWeight: 700,
            color: COLORS.ACCENT_ROSE,
            textShadow: `0 0 ${20 * glowIntensity}px rgba(232,69,122,0.8), 0 0 ${40 * glowIntensity}px rgba(232,69,122,0.5), 0 0 ${80 * glowIntensity}px rgba(232,69,122,0.3)`,
            whiteSpace: 'nowrap',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Te iubesc,
        </p>
        <p
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 90,
            fontWeight: 700,
            color: COLORS.ACCENT_ROSE,
            textShadow: `0 0 ${20 * glowIntensity}px rgba(232,69,122,0.8), 0 0 ${40 * glowIntensity}px rgba(232,69,122,0.5), 0 0 ${80 * glowIntensity}px rgba(232,69,122,0.3)`,
            whiteSpace: 'nowrap',
            position: 'relative',
            zIndex: 1,
            marginTop: -10,
          }}
        >
          {recipientName}! 💕
        </p>
      </div>
    </AbsoluteFill>
  );
};

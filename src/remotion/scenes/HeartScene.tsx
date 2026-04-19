import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS } from '../constants';

export const HeartScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Half hearts move toward center
  const leftHeartX = interpolate(frame, [0, fps * 1], [250, 490], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rightHeartX = interpolate(frame, [0, fps * 1], [830, 590], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const halfHeartY = interpolate(frame, [0, fps * 1], [1400, 1200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Half hearts fade
  const halfOpacity = interpolate(frame, [fps * 0.8, fps * 1.2], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Full heart appears with spring
  const fullHeartScale = spring({
    frame: frame - fps * 1,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  // Heart pulse
  const pulse = frame > fps * 1.5
    ? 1 + Math.sin((frame - fps * 1.5) * 0.3) * 0.15
    : 1;

  // Heart moves down and fades after pulse
  const heartY = interpolate(frame, [fps * 2.2, fps * 3], [850, 1100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const heartFade = interpolate(frame, [fps * 2.2, fps * 3], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const showFullHeart = frame > fps * 1;

  return (
    <AbsoluteFill>
      {/* Left half heart */}
      {frame < fps * 1.5 && (
        <svg
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            left: leftHeartX,
            top: halfHeartY,
            width: 55,
            height: 55,
            opacity: halfOpacity,
            transform: 'translateX(-50%)',
          }}
          fill={COLORS.ACCENT_ROSE}
        >
          <path d="M12 21.35C12 21.35 2 14 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09L12 21.35Z" />
        </svg>
      )}

      {/* Right half heart */}
      {frame < fps * 1.5 && (
        <svg
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            left: rightHeartX,
            top: halfHeartY,
            width: 55,
            height: 55,
            opacity: halfOpacity,
            transform: 'translateX(-50%)',
          }}
          fill={COLORS.ACCENT_ROSE}
        >
          <path d="M12 21.35C12 21.35 22 14 22 8.5C22 5.42 19.58 3 16.5 3C14.76 3 13.09 3.81 12 5.09L12 21.35Z" />
        </svg>
      )}

      {/* Full heart */}
      {showFullHeart && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: heartY,
            transform: `translate(-50%, -50%) scale(${fullHeartScale * pulse})`,
            opacity: heartFade,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            style={{
              width: 120,
              height: 120,
              filter: `drop-shadow(0 0 30px ${COLORS.ACCENT_ROSE}90)`,
            }}
            fill={COLORS.ACCENT_ROSE}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};

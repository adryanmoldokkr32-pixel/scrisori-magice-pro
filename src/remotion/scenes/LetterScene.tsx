import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS } from '../constants';

export const LetterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Envelope appearance: fade + scale in
  const envelopeScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const envelopeOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  // Flap opens (rotateX from 0 to -180)
  const flapRotation = interpolate(frame, [fps * 0.5, fps * 1.8], [0, -180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Paper rises up
  const paperY = interpolate(frame, [fps * 1.2, fps * 2.2], [0, -80], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const paperOpacity = interpolate(frame, [fps * 1.2, fps * 1.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Whole envelope shrinks and fades out
  const exitScale = interpolate(frame, [fps * 2.3, fps * 3], [1, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [fps * 2.3, fps * 3], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const envelopeWidth = 500;
  const envelopeHeight = 350;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          transform: `scale(${envelopeScale * exitScale})`,
          opacity: envelopeOpacity * exitOpacity,
          perspective: 1200,
          width: envelopeWidth,
          height: envelopeHeight,
          position: 'relative',
        }}
      >
        {/* Envelope body */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(to bottom, ${COLORS.ENVELOPE_RED}, ${COLORS.ENVELOPE_DARK})`,
            borderRadius: 8,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}
        >
          {/* Gold seal */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(to bottom, ${COLORS.ACCENT_GOLD}, #b8912e)`,
              boxShadow: `0 0 20px ${COLORS.ACCENT_GOLD}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              zIndex: 20,
            }}
          >
            💌
          </div>

          {/* Bottom folds */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 0,
              height: 0,
              borderLeft: `${envelopeWidth / 2}px solid transparent`,
              borderBottom: `${envelopeHeight * 0.4}px solid #a52020`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 0,
              height: 0,
              borderRight: `${envelopeWidth / 2}px solid transparent`,
              borderBottom: `${envelopeHeight * 0.4}px solid #a52020`,
            }}
          />
        </div>

        {/* Letter paper */}
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '5%',
            width: '90%',
            height: '85%',
            backgroundColor: COLORS.PAPER,
            borderRadius: 4,
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${paperY}px)`,
            opacity: paperOpacity,
          }}
        >
          <p
            style={{
              color: '#8b4513',
              fontFamily: "'Dancing Script', cursive",
              fontSize: 28,
              textAlign: 'center',
              padding: 20,
            }}
          >
            O scrisoare de dragoste magică...
          </p>
        </div>

        {/* Flap (triangle) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transformOrigin: 'top center',
            transform: `rotateX(${flapRotation}deg)`,
            zIndex: flapRotation < -90 ? 1 : 15,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              margin: '0 auto',
              borderLeft: `${envelopeWidth / 2}px solid transparent`,
              borderRight: `${envelopeWidth / 2}px solid transparent`,
              borderTop: `${envelopeHeight * 0.45}px solid ${COLORS.ENVELOPE_FLAP}`,
            }}
          />
        </div>
      </div>

      {/* Tap prompt text */}
      {frame < fps * 0.5 && (
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            textAlign: 'center',
            color: COLORS.TEXT_MUTED,
            fontSize: 22,
            opacity: interpolate(frame, [0, 15], [0, 0.7], { extrapolateRight: 'clamp' }),
          }}
        >
          Se deschide scrisoarea... ✨
        </div>
      )}
    </AbsoluteFill>
  );
};

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS } from '../constants';

const Character: React.FC<{
  gender: 'boy' | 'girl';
  x: number;
  walkFrame: number;
  armRotation: number;
}> = ({ gender, x, walkFrame, armRotation }) => {
  const isBoy = gender === 'boy';
  const shirtColor = isBoy ? COLORS.BOY_SHIRT : COLORS.GIRL_DRESS;
  const pantsColor = isBoy ? COLORS.BOY_PANTS : COLORS.GIRL_PANTS;
  const hairColor = isBoy ? COLORS.HAIR_BOY : COLORS.HAIR_GIRL;

  // Walking leg animation
  const legSwing = Math.sin(walkFrame * 0.4) * 18;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '8%',
        left: x,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Head */}
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          backgroundColor: COLORS.SKIN,
          position: 'relative',
        }}
      >
        {/* Hair */}
        <div
          style={{
            position: 'absolute',
            top: -2,
            left: 0,
            width: '100%',
            height: isBoy ? '45%' : '50%',
            backgroundColor: hairColor,
            borderRadius: '50% 50% 0 0',
          }}
        />
        {/* Side hair (girl) */}
        {!isBoy && (
          <>
            <div style={{ position: 'absolute', top: '30%', left: -6, width: 8, height: '70%', backgroundColor: hairColor, borderRadius: '0 0 8px 8px' }} />
            <div style={{ position: 'absolute', top: '30%', right: -6, width: 8, height: '70%', backgroundColor: hairColor, borderRadius: '0 0 8px 8px' }} />
          </>
        )}
        {/* Eyes */}
        <div style={{ position: 'absolute', top: '42%', left: '25%', width: 5, height: 7, backgroundColor: '#333', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '42%', right: '25%', width: 5, height: 7, backgroundColor: '#333', borderRadius: '50%' }} />
        {/* Smile */}
        <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', width: 12, height: 6, borderBottom: '3px solid #c9302c', borderRadius: '0 0 50% 50%' }} />
      </div>

      {/* Body */}
      <div
        style={{
          width: 58,
          height: 80,
          backgroundColor: shirtColor,
          borderRadius: '12px 12px 6px 6px',
          marginTop: -8,
          position: 'relative',
        }}
      >
        {/* Left arm */}
        <div
          style={{
            position: 'absolute',
            top: 5,
            left: -10,
            width: 12,
            height: 50,
            backgroundColor: shirtColor,
            borderRadius: 6,
            transformOrigin: 'top center',
            transform: `rotate(${isBoy ? 0 : armRotation}deg)`,
          }}
        >
          {/* Girl's half heart on left arm */}
          {!isBoy && (
            <svg
              viewBox="0 0 24 24"
              style={{
                width: 35,
                height: 35,
                position: 'absolute',
                top: -15,
                left: -15,
              }}
              fill={COLORS.ACCENT_ROSE}
            >
              <path d="M12 21.35C12 21.35 22 14 22 8.5C22 5.42 19.58 3 16.5 3C14.76 3 13.09 3.81 12 5.09L12 21.35Z" />
            </svg>
          )}
        </div>

        {/* Right arm */}
        <div
          style={{
            position: 'absolute',
            top: 5,
            right: -10,
            width: 12,
            height: 50,
            backgroundColor: shirtColor,
            borderRadius: 6,
            transformOrigin: 'top center',
            transform: `rotate(${isBoy ? armRotation : 0}deg)`,
          }}
        >
          {/* Boy's half heart on right arm */}
          {isBoy && (
            <svg
              viewBox="0 0 24 24"
              style={{
                width: 35,
                height: 35,
                position: 'absolute',
                top: -15,
                right: -15,
              }}
              fill={COLORS.ACCENT_ROSE}
            >
              <path d="M12 21.35C12 21.35 2 14 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09L12 21.35Z" />
            </svg>
          )}
        </div>
      </div>

      {/* Legs */}
      <div style={{ display: 'flex', gap: 6, marginTop: -3 }}>
        <div
          style={{
            width: 16,
            height: 55,
            backgroundColor: pantsColor,
            borderRadius: 6,
            transformOrigin: 'top center',
            transform: `rotate(${legSwing}deg)`,
          }}
        />
        <div
          style={{
            width: 16,
            height: 55,
            backgroundColor: pantsColor,
            borderRadius: 6,
            transformOrigin: 'top center',
            transform: `rotate(${-legSwing}deg)`,
          }}
        />
      </div>
    </div>
  );
};

export const CharactersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Boy slides in from left
  const boyX = interpolate(frame, [0, fps * 1.5], [-200, 340], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Girl slides in from right
  const girlX = interpolate(frame, [fps * 0.3, fps * 1.8], [1280, 740], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Arms reach out
  const armRotation = interpolate(frame, [fps * 2, fps * 2.7], [0, -55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Walking stops when characters reach position
  const boyWalking = frame < fps * 1.5;
  const girlWalking = frame < fps * 1.8;

  // Opacity for the whole scene
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity }}>
      <Character
        gender="boy"
        x={boyX}
        walkFrame={boyWalking ? frame : 0}
        armRotation={armRotation}
      />
      <Character
        gender="girl"
        x={girlX}
        walkFrame={girlWalking ? frame : 0}
        armRotation={-armRotation}
      />
    </AbsoluteFill>
  );
};

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion';
import { SCENES, COLORS, VIDEO_FPS } from './constants';
import { LetterScene } from './scenes/LetterScene';
import { CharactersScene } from './scenes/CharactersScene';
import { HeartScene } from './scenes/HeartScene';
import { TreeScene } from './scenes/TreeScene';
import { FireworksScene } from './scenes/FireworksScene';
import { LoveTextScene } from './scenes/LoveTextScene';
import { StarField } from './scenes/StarField';
import { FallingPetals } from './scenes/FallingPetals';

export type LoveLetterProps = {
  recipientName: string;
};

export const LoveLetterVideo: React.FC<LoveLetterProps> = ({ recipientName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient shifts subtly over time
  const bgOpacity = interpolate(frame, [0, fps * 2], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.BG_PRIMARY,
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Star field always visible */}
      <StarField />

      {/* Ambient radial glow */}
      <AbsoluteFill
        style={{
          opacity: bgOpacity,
          background: `radial-gradient(ellipse at 50% 40%, ${COLORS.ACCENT_GOLD}15 0%, ${COLORS.ACCENT_ROSE}10 40%, transparent 70%)`,
        }}
      />

      {/* Letter opening scene */}
      <Sequence from={SCENES.LETTER_START} durationInFrames={SCENES.LETTER_END - SCENES.LETTER_START}>
        <LetterScene />
      </Sequence>

      {/* Characters walking in */}
      <Sequence from={SCENES.CHARACTERS_START} durationInFrames={SCENES.CHARACTERS_END - SCENES.CHARACTERS_START}>
        <CharactersScene />
      </Sequence>

      {/* Heart merge */}
      <Sequence from={SCENES.HEART_START} durationInFrames={SCENES.HEART_END - SCENES.HEART_START}>
        <HeartScene />
      </Sequence>

      {/* Cherry blossom tree */}
      <Sequence from={SCENES.TREE_START} durationInFrames={SCENES.TREE_END - SCENES.TREE_START}>
        <TreeScene />
      </Sequence>

      {/* Falling petals (start with tree, continue) */}
      <Sequence from={SCENES.TREE_START + VIDEO_FPS * 3} durationInFrames={SCENES.TEXT_END - SCENES.TREE_START - VIDEO_FPS * 3}>
        <FallingPetals />
      </Sequence>

      {/* Fireworks */}
      <Sequence from={SCENES.FIREWORKS_START} durationInFrames={SCENES.FIREWORKS_END - SCENES.FIREWORKS_START}>
        <FireworksScene />
      </Sequence>

      {/* Love text */}
      <Sequence from={SCENES.TEXT_START} durationInFrames={SCENES.TEXT_END - SCENES.TEXT_START}>
        <LoveTextScene recipientName={recipientName} />
      </Sequence>

      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: "'Playfair Display', serif",
          fontSize: 20,
          color: 'rgba(255,255,255,0.15)',
          letterSpacing: 2,
        }}
      >
        ScrisoriMagice
      </div>
    </AbsoluteFill>
  );
};

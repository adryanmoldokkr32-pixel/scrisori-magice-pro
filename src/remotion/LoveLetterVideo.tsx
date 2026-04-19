import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from './constants';

export const LoveLetterVideo: React.FC<{ recipientName: string }> = ({ recipientName }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.BG_PRIMARY, color: 'white', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ opacity, fontSize: 80 }}>Te iubesc, {recipientName}!</h1>
    </AbsoluteFill>
  );
};

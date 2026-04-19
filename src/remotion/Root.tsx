import React from 'react';
import { Composition } from 'remotion';
import { LoveLetterVideo } from './LoveLetterVideo';
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS, DURATION_IN_FRAMES } from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LoveLetter"
      component={LoveLetterVideo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={{ recipientName: 'Dragostea Mea' }}
    />
  );
};

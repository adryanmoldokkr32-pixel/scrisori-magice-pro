export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;
export const DURATION_IN_SECONDS = 28;
export const DURATION_IN_FRAMES = DURATION_IN_SECONDS * VIDEO_FPS;

// Scene timing (in frames)
export const SCENES = {
  // Letter opens: 0-3s
  LETTER_START: 0,
  LETTER_END: 3 * VIDEO_FPS,

  // Characters walk in: 3-6s
  CHARACTERS_START: 3 * VIDEO_FPS,
  CHARACTERS_END: 6 * VIDEO_FPS,

  // Heart merge: 6-9s
  HEART_START: 6 * VIDEO_FPS,
  HEART_END: 9 * VIDEO_FPS,

  // Cherry blossom tree growth: 9-16s
  TREE_START: 9 * VIDEO_FPS,
  TREE_END: 16 * VIDEO_FPS,

  // Fireworks: 16-22s
  FIREWORKS_START: 16 * VIDEO_FPS,
  FIREWORKS_END: 22 * VIDEO_FPS,

  // Love text: 20-28s
  TEXT_START: 20 * VIDEO_FPS,
  TEXT_END: 28 * VIDEO_FPS,
} as const;

export const COLORS = {
  BG_PRIMARY: '#0a0a0f',
  BG_SECONDARY: '#12121a',
  ACCENT_GOLD: '#d4a853',
  ACCENT_ROSE: '#e8457a',
  ACCENT_PINK: '#ffb7c5',
  ACCENT_BLUSH: '#ff6b9d',
  TEXT_PRIMARY: '#f0e6d3',
  TEXT_MUTED: '#8a8a9a',
  ENVELOPE_RED: '#c9302c',
  ENVELOPE_DARK: '#8b1a1a',
  ENVELOPE_FLAP: '#e04040',
  SKIN: '#f5d0a9',
  BOY_SHIRT: '#2563eb',
  BOY_PANTS: '#1e3a5f',
  GIRL_DRESS: '#e8457a',
  GIRL_PANTS: '#d63384',
  HAIR_BOY: '#3a2518',
  HAIR_GIRL: '#5a2d0c',
  PAPER: '#faf3e8',
  TRUNK: '#4a2c1a',
  BRANCH: '#5a3523',
} as const;

export const PETAL_COLORS = ['#ffb7c5', '#ff9eb5', '#ffc0cb', '#ffaec0', '#ffd1dc', '#ff85a2'];
export const FIREWORK_COLORS = ['#d4a853', '#e8457a', '#ffb7c5', '#ff6b9d', '#ffd700', '#ff4500', '#00ff88', '#7b68ee'];

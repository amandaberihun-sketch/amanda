import React, { useState } from 'react';

export type AvatarMood = 'friendly' | 'chill' | 'winking' | 'blissful' | 'starry';

export interface AvatarPalette {
  id: string;
  name: string;
  bgGradient: string;
  faceColor: string;
  blushColor: string;
}

export const AVATAR_PALETTES: Record<string, AvatarPalette> = {
  mint: {
    id: 'mint',
    name: 'Mint Breeze',
    bgGradient: 'radial-gradient(circle at 35% 30%, #f0fdf4 0%, #bbf7d0 50%, #86efac 100%)',
    faceColor: '#14532d',
    blushColor: 'rgba(239, 68, 68, 0.16)',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Peach',
    bgGradient: 'radial-gradient(circle at 35% 30%, #fff1f2 0%, #fecdd3 50%, #fda4af 100%)',
    faceColor: '#881337',
    blushColor: 'rgba(225, 29, 72, 0.18)',
  },
  sky: {
    id: 'sky',
    name: 'Celestial Sky',
    bgGradient: 'radial-gradient(circle at 35% 30%, #f0f9ff 0%, #bae6fd 50%, #7dd3fc 100%)',
    faceColor: '#0c4a6e',
    blushColor: 'rgba(56, 189, 248, 0.22)',
  },
  lavender: {
    id: 'lavender',
    name: 'Twilight Lavender',
    bgGradient: 'radial-gradient(circle at 35% 30%, #faf5ff 0%, #e9d5ff 50%, #c084fc 100%)',
    faceColor: '#3b0764',
    blushColor: 'rgba(168, 85, 247, 0.2)',
  },
  warm: {
    id: 'warm',
    name: 'Solar Amber',
    bgGradient: 'radial-gradient(circle at 35% 30%, #fffbeb 0%, #fde68a 50%, #fcd34d 100%)',
    faceColor: '#78350f',
    blushColor: 'rgba(245, 158, 11, 0.25)',
  },
};

export const DEFAULT_AVATAR_PALETTE = 'mint';
export const DEFAULT_AVATAR_MOOD: AvatarMood = 'friendly';

interface SmileyAvatarProps {
  paletteId?: string;
  mood?: AvatarMood;
  size?: number;
  className?: string;
  onClick?: () => void;
  interactiveHover?: boolean;
}

export const SmileyAvatar: React.FC<SmileyAvatarProps> = ({
  paletteId = DEFAULT_AVATAR_PALETTE,
  mood = DEFAULT_AVATAR_MOOD,
  size = 34,
  className = '',
  onClick,
  interactiveHover = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const palette = AVATAR_PALETTES[paletteId] || AVATAR_PALETTES.mint;

  // Eye and mouth geometry - original, clean vector character design
  const currentMood = isHovered && interactiveHover ? 'winking' : mood;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-full flex items-center justify-center shrink-0 select-none transition-transform duration-200 active:scale-95 relative overflow-hidden shadow-xs border border-white/20 ${className}`}
      style={{
        width: size,
        height: size,
        background: palette.bgGradient,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: `inset 0 1px 2px rgba(255, 255, 255, 0.6), 0 2px 6px rgba(0, 0, 0, 0.12)`,
      }}
      role="img"
      aria-label="Creator Avatar"
    >
      {/* Top subtle gloss highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full pointer-events-none opacity-40"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, transparent 100%)',
        }}
      />

      {/* SVG Face Features: Original, copyright-safe, charming minimalist creator companion */}
      <svg
        viewBox="0 0 36 36"
        className="w-full h-full relative z-10 transition-transform duration-200"
        style={{
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
        fill="none"
      >
        {/* Soft Blushing Cheeks */}
        <circle cx="10" cy="22" r="2.8" fill={palette.blushColor} />
        <circle cx="26" cy="22" r="2.8" fill={palette.blushColor} />

        {/* Eyes based on mood */}
        {currentMood === 'friendly' && (
          <>
            {/* Left Eye: rounded pill with tiny top catchlight */}
            <rect
              x="11.5"
              y="13"
              width="2.8"
              height="4.2"
              rx="1.4"
              fill={palette.faceColor}
            />
            {/* Right Eye */}
            <rect
              x="21.7"
              y="13"
              width="2.8"
              height="4.2"
              rx="1.4"
              fill={palette.faceColor}
            />
          </>
        )}

        {currentMood === 'chill' && (
          <>
            {/* Calm horizontal pill eyes */}
            <rect
              x="11"
              y="14.5"
              width="3.5"
              height="2.2"
              rx="1.1"
              fill={palette.faceColor}
            />
            <rect
              x="21.5"
              y="14.5"
              width="3.5"
              height="2.2"
              rx="1.1"
              fill={palette.faceColor}
            />
          </>
        )}

        {currentMood === 'winking' && (
          <>
            {/* Left Eye: playful arc wink */}
            <path
              d="M 10.5 16.5 C 11.5 13.5, 14.5 13.5, 15.5 16.5"
              stroke={palette.faceColor}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Right Eye: wide open rounded pill */}
            <rect
              x="21.7"
              y="13"
              width="2.8"
              height="4.2"
              rx="1.4"
              fill={palette.faceColor}
            />
          </>
        )}

        {currentMood === 'blissful' && (
          <>
            {/* Happy closed eyes ^ ^ */}
            <path
              d="M 10.5 16 C 11.5 13, 14 13, 15 16"
              stroke={palette.faceColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 21 16 C 22 13, 24.5 13, 25.5 16"
              stroke={palette.faceColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )}

        {currentMood === 'starry' && (
          <>
            {/* Left Eye spark */}
            <path
              d="M 13 12 L 13 18 M 10 15 L 16 15"
              stroke={palette.faceColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Right Eye spark */}
            <path
              d="M 23 12 L 23 18 M 20 15 L 26 15"
              stroke={palette.faceColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Mouth: Sweet subtle curve */}
        <path
          d="M 15.2 21.2 C 16.2 23.2, 19.8 23.2, 20.8 21.2"
          stroke={palette.faceColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

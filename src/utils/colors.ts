import { AppTheme, BallColor } from '../types';

export function getBallColor(num: number, maxNumber: number = 75, theme: AppTheme = 'dark-stage'): BallColor {
  // Determine segment index (0 to 4)
  let segment: number;

  if (maxNumber === 75) {
    if (num <= 15) segment = 0; // Blue
    else if (num <= 30) segment = 1; // Red
    else if (num <= 45) segment = 2; // Green
    else if (num <= 60) segment = 3; // Orange
    else segment = 4; // Purple
  } else {
    // Proportional ratio for custom max limits
    const ratio = (num - 1) / Math.max(1, maxNumber);
    segment = Math.min(4, Math.floor(ratio * 5));
  }

  // Theme variation colors
  if (theme === 'gold-luxury') {
    const goldPalette: BallColor[] = [
      {
        bgGradient: 'radial-gradient(circle at 35% 35%, #fef08a, #ca8a04 60%, #854d0e 100%)',
        borderColor: '#fde047',
        textColor: '#1e1b4b',
        glowColor: 'rgba(234, 179, 8, 0.8)',
        name: 'Champagne Gold'
      },
      {
        bgGradient: 'radial-gradient(circle at 35% 35%, #fed7aa, #ea580c 60%, #7c2d12 100%)',
        borderColor: '#fdba74',
        textColor: '#fff',
        glowColor: 'rgba(249, 115, 22, 0.8)',
        name: 'Amber Bronze'
      },
      {
        bgGradient: 'radial-gradient(circle at 35% 35%, #e9d5ff, #9333ea 60%, #581c87 100%)',
        borderColor: '#d8b4fe',
        textColor: '#fff',
        glowColor: 'rgba(168, 85, 247, 0.8)',
        name: 'Royal Amethyst'
      },
      {
        bgGradient: 'radial-gradient(circle at 35% 35%, #93c5fd, #2563eb 60%, #1e3a8a 100%)',
        borderColor: '#60a5fa',
        textColor: '#fff',
        glowColor: 'rgba(59, 130, 246, 0.8)',
        name: 'Sapphire'
      },
      {
        bgGradient: 'radial-gradient(circle at 35% 35%, #f472b6, #db2777 60%, #831843 100%)',
        borderColor: '#f472b6',
        textColor: '#fff',
        glowColor: 'rgba(236, 72, 153, 0.8)',
        name: 'Rose Quartz'
      }
    ];
    return goldPalette[segment];
  }

  if (theme === 'neon-cyber') {
    const neonPalette: BallColor[] = [
      {
        bgGradient: 'radial-gradient(circle at 35% 35%, #67e8f9, #0891b2 60%, #164e63 100%)',
        borderColor: '#22d3ee',
        textColor: '#0f172a',
        glowColor: 'rgba(6, 182, 212, 0.9)',
        name: 'Cyan'
      },
      {
        bgGradient: 'radial-gradient(circle at 35% 35%, #f472b6, #e11d48 60%, #881337 100%)',
        borderColor: '#fb7185',
        textColor: '#ffffff',
        glowColor: 'rgba(244, 63, 94, 0.9)',
        name: 'Neon Pink'
      },
      {
        bgGradient: 'radial-gradient(circle at 35% 35%, #4ade80, #16a34a 60%, #14532d 100%)',
        borderColor: '#86efac',
        textColor: '#052e16',
        glowColor: 'rgba(34, 197, 94, 0.9)',
        name: 'Lime Green'
      },
      {
        bgGradient: 'radial-gradient(circle at 35% 35%, #facc15, #ca8a04 60%, #713f12 100%)',
        borderColor: '#fde047',
        textColor: '#1c1917',
        glowColor: 'rgba(234, 179, 8, 0.9)',
        name: 'Electric Yellow'
      },
      {
        bgGradient: 'radial-gradient(circle at 35% 35%, #a855f7, #7e22ce 60%, #3b0764 100%)',
        borderColor: '#c084fc',
        textColor: '#ffffff',
        glowColor: 'rgba(168, 85, 247, 0.9)',
        name: 'Neon Purple'
      }
    ];
    return neonPalette[segment];
  }

  // Standard Stage / Dark Stage / Classic Royal Palette
  const standardPalette: BallColor[] = [
    {
      // 1 ~ 15: Blue
      bgGradient: 'radial-gradient(circle at 35% 35%, #60a5fa, #2563eb 60%, #1e3a8a 100%)',
      borderColor: '#93c5fd',
      textColor: '#ffffff',
      glowColor: 'rgba(59, 130, 246, 0.85)',
      name: 'Blue'
    },
    {
      // 16 ~ 30: Red
      bgGradient: 'radial-gradient(circle at 35% 35%, #f87171, #dc2626 60%, #7f1d1d 100%)',
      borderColor: '#fca5a5',
      textColor: '#ffffff',
      glowColor: 'rgba(239, 68, 68, 0.85)',
      name: 'Red'
    },
    {
      // 31 ~ 45: Green
      bgGradient: 'radial-gradient(circle at 35% 35%, #34d399, #059669 60%, #064e3b 100%)',
      borderColor: '#6ee7b7',
      textColor: '#ffffff',
      glowColor: 'rgba(16, 185, 129, 0.85)',
      name: 'Green'
    },
    {
      // 46 ~ 60: Orange
      bgGradient: 'radial-gradient(circle at 35% 35%, #fbbf24, #d97706 60%, #78350f 100%)',
      borderColor: '#fde68a',
      textColor: '#ffffff',
      glowColor: 'rgba(245, 158, 11, 0.85)',
      name: 'Orange'
    },
    {
      // 61+: Purple
      bgGradient: 'radial-gradient(circle at 35% 35%, #c084fc, #7e22ce 60%, #4c1d95 100%)',
      borderColor: '#e9d5ff',
      textColor: '#ffffff',
      glowColor: 'rgba(168, 85, 247, 0.85)',
      name: 'Purple'
    }
  ];

  return standardPalette[segment];
}

/**
 * Get simple solid HEX or Tailwind color for ball preview
 */
export function getBallHexColor(segment: number): string {
  const hexes = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  return hexes[segment % hexes.length];
}

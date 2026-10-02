import { Campaign } from '../types/campaign';

export interface CampaignTheme {
  primary: string;
  secondary: string;
  accentHover: string;
  glow: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
}

// Curated distinctive palettes for campaigns
const KNOWN_THEMES: Record<string, { primary: string; secondary: string; hover?: string }> = {
  atelier: { primary: '#c084fc', secondary: '#1e1b2e', hover: '#d8b4fe' },
  palazzo: { primary: '#2ed3b7', secondary: '#132622', hover: '#5eead4' },
  tessera: { primary: '#4ade80', secondary: '#162a22', hover: '#86efac' },
  pixelpop: { primary: '#ff6fa8', secondary: '#281620', hover: '#f472b6' },
  pennywise: { primary: '#5aa9ff', secondary: '#16222c', hover: '#7dd3fc' },
  stride: { primary: '#ff9a5c', secondary: '#291d17', hover: '#fdba74' },
  focusly: { primary: '#2dd4bf', secondary: '#152424', hover: '#5eead4' },
  chatterbox: { primary: '#fb923c', secondary: '#2a1a14', hover: '#fdba74' },
  snapnest: { primary: '#60a5fa', secondary: '#1a1d2e', hover: '#93c5fd' },
  melodia: { primary: '#e879f9', secondary: '#27162e', hover: '#f0abfc' },
  wayfarer: { primary: '#818cf8', secondary: '#181b30', hover: '#a5b4fc' },
  solis: { primary: '#fcd34d', secondary: '#292416', hover: '#fde68a' },
  prism: { primary: '#c084fc', secondary: '#25182e', hover: '#d8b4fe' },
  zenith: { primary: '#38bdf8', secondary: '#18222e', hover: '#7dd3fc' },
  hyperion: { primary: '#f87171', secondary: '#28181a', hover: '#fca5a5' },
};

/** Convert hex to rgba */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const clean = hex.replace('#', '');
  let r = 0, g = 0, b = 0;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length >= 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Get rich reactive color theme for any campaign */
export function getCampaignTheme(campaign: Campaign): CampaignTheme {
  const known = KNOWN_THEMES[campaign.id];
  const primary = known?.primary || campaign.hue?.[0] || '#38bdf8';
  const secondary = known?.secondary || campaign.hue?.[1] || '#1a1a24';
  const accentHover = known?.hover || primary;

  return {
    primary,
    secondary,
    accentHover,
    glow: hexToRgba(primary, 0.22),
    border: hexToRgba(primary, 0.35),
    badgeBg: hexToRgba(primary, 0.16),
    badgeText: hexToRgba(primary, 0.95),
    gradient: `linear-gradient(135deg, ${primary}, ${secondary})`,
  };
}

/** Pre-set curated interactive palette swatches for creator experimentation */
export const INTERACTIVE_ACCENT_PRESETS = [
  { name: 'Native', primary: '', label: 'Original brand tint' },
  { name: 'Neon Electric', primary: '#38bdf8', secondary: '#082f49' },
  { name: 'Emerald Flux', primary: '#34d399', secondary: '#064e3b' },
  { name: 'Sunset Bloom', primary: '#fb7185', secondary: '#4c0519' },
  { name: 'Cyber Violet', primary: '#c084fc', secondary: '#2e1065' },
];

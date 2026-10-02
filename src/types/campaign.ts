export type PayoutType = 'fixed' | 'pct';

export interface CampaignRate {
  t: PayoutType;
  v: number;
  avg?: number;
}

export interface ReviewItem {
  author: string;
  rating: number;
  comment: string;
  role?: string;
  date?: string;
}

export interface Campaign {
  id: string;
  name: string;
  cat: string;
  host: string;
  icon: 'spark' | 'cube' | 'book' | 'globe' | 'clock' | 'bill' | 'users' | 'star' | 'game' | 'wallet' | 'heart' | 'bolt' | 'chat' | 'camera' | 'music' | 'map' | 'trophy' | 'trend';
  rate: CampaignRate;
  pay: string;
  posted: string;
  days: number;
  creators: number;
  rating: string;
  rc: string;
  share: number;
  desc: string;
  joined: boolean;
  hue: [string, string]; // [primaryColor, secondaryBgColor]
  platforms?: ('ios' | 'android')[];
  featured?: boolean;
}

export interface CampaignStats {
  days: number[];
  inst: number;
  clicks: number;
  conv: number;
  earned: number;
}

export type ThemeMode = 'studio' | 'oled' | 'midnight' | 'warm' | 'light';

export interface VisualComfortSettings {
  theme: ThemeMode;
  glareReduction: number; // 0 to 30 (percent reduction)
  contrastEnhance: boolean;
  reducedMotion: boolean;
}

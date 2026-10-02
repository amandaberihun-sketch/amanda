import { Campaign, CampaignStats } from '../types/campaign';

export const HP: [string, string][] = [
  ['#4f46e5', '#1e1b4b'], // Royal Indigo / Midnight
  ['#0284c7', '#082f49'], // Deep Cobalt Blue / Navy
  ['#059669', '#064e3b'], // Emerald Forest
  ['#d97706', '#451a03'], // Solid Warm Amber
  ['#db2777', '#500724'], // Deep Bordeaux Crimson
  ['#7c3aed', '#2e1065'], // Royal Violet
  ['#0d9488', '#042f2e'], // Deep Ocean Teal
  ['#ea580c', '#431407'], // Burnished Terracotta
  ['#2563eb', '#172554'], // Imperial Sapphire
  ['#9333ea', '#3b0764'], // Solid Velvet Purple
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'atelier',
    name: 'Atelier Craft',
    cat: 'Art and design',
    host: 'Maison des Beaux-Arts',
    icon: 'spark',
    rate: { t: 'fixed', v: 3.2 },
    pay: '<b>$3.20</b> per verified install',
    posted: '45 minutes ago',
    days: 30,
    creators: 184,
    rating: '4.8',
    rc: '2.1K',
    share: 0,
    desc: 'Atelier Craft is a studio app for artists to plan, sketch, and share work from their phone. Promote it to your patrons and earn a fixed payout for every verified install it brings in.',
    joined: false,
    hue: HP[0],
    platforms: ['ios', 'android'],
  },
  {
    id: 'palazzo',
    name: 'Palazzo Lens',
    cat: 'Art and design',
    host: 'Fondazione d’Arte',
    icon: 'cube',
    rate: { t: 'pct', v: 12, avg: 45 },
    pay: '<b>12%</b> of first payment',
    posted: '2 hours ago',
    days: 21,
    creators: 96,
    rating: '4.6',
    rc: '840',
    share: 12,
    desc: 'Palazzo Lens turns every art residency into a guided visual tour. Share it with your audience and earn 12% of each new user’s first payment.',
    joined: false,
    hue: HP[1],
    platforms: ['ios', 'android'],
  },
  {
    id: 'tessera',
    name: 'Tessera',
    cat: 'Education',
    host: 'Studio Linguae',
    icon: 'book',
    rate: { t: 'fixed', v: 2.4 },
    pay: '<b>$2.40</b> per verified install',
    posted: 'Yesterday',
    days: 14,
    creators: 412,
    rating: '4.7',
    rc: '5.3K',
    share: 0,
    desc: 'Tessera teaches languages in five-minute daily lessons. Earn a fixed payout for each learner who installs and finishes their first lesson.',
    joined: true,
    hue: HP[2],
    platforms: ['ios', 'android'],
  },
  {
    id: 'pixelpop',
    name: 'Pixel Pop',
    cat: 'Games',
    host: 'Nova Play Studio',
    icon: 'game',
    rate: { t: 'fixed', v: 1.8 },
    pay: '<b>$1.80</b> per verified install',
    posted: '3 days ago',
    days: 25,
    creators: 638,
    rating: '4.5',
    rc: '12K',
    share: 0,
    desc: 'Pixel Pop is a quick puzzle game with daily challenges. Earn a fixed payout for every player who installs and finishes the tutorial.',
    joined: false,
    hue: HP[3],
    platforms: ['ios', 'android'],
  },
  {
    id: 'pennywise',
    name: 'Pennywise',
    cat: 'Finance',
    host: 'Ledger & Co',
    icon: 'wallet',
    rate: { t: 'pct', v: 15, avg: 60 },
    pay: '<b>15%</b> of first payment',
    posted: '4 days ago',
    days: 40,
    creators: 274,
    rating: '4.7',
    rc: '3.9K',
    share: 15,
    desc: 'Pennywise helps people see where their money goes. Earn 15% of each new user’s first payment when they upgrade.',
    joined: true,
    hue: HP[4],
    platforms: ['ios', 'android'],
  },
  {
    id: 'stride',
    name: 'Stride',
    cat: 'Health',
    host: 'Northbeat Labs',
    icon: 'heart',
    rate: { t: 'fixed', v: 2.9 },
    pay: '<b>$2.90</b> per verified install',
    posted: '5 days ago',
    days: 18,
    creators: 351,
    rating: '4.6',
    rc: '6.2K',
    share: 0,
    desc: 'Stride turns daily walks into small, friendly goals. Earn a fixed payout for every verified install that completes a first walk.',
    joined: false,
    hue: HP[5],
    platforms: ['ios', 'android'],
  },
  {
    id: 'focusly',
    name: 'Focusly',
    cat: 'Productivity',
    host: 'Deepwork Inc.',
    icon: 'bolt',
    rate: { t: 'fixed', v: 2.1 },
    pay: '<b>$2.10</b> per verified install',
    posted: '1 week ago',
    days: 45,
    creators: 529,
    rating: '4.8',
    rc: '9.4K',
    share: 0,
    desc: 'Focusly blocks distractions and keeps deep-work sessions on track. Earn a fixed payout for every verified install.',
    joined: false,
    hue: HP[6],
    platforms: ['ios', 'android'],
  },
  {
    id: 'chatterbox',
    name: 'Chatterbox',
    cat: 'Social',
    host: 'Hello Loop',
    icon: 'chat',
    rate: { t: 'fixed', v: 1.5 },
    pay: '<b>$1.50</b> per verified install',
    posted: '1 week ago',
    days: 12,
    creators: 802,
    rating: '4.4',
    rc: '15K',
    share: 0,
    desc: 'Chatterbox is a friendly group chat for small communities. Earn a fixed payout for every verified install that joins a group.',
    joined: false,
    hue: HP[7],
    platforms: ['ios', 'android'],
  },
  {
    id: 'snapnest',
    name: 'Snapnest',
    cat: 'Art and design',
    host: 'Lumen Works',
    icon: 'camera',
    rate: { t: 'pct', v: 10, avg: 30 },
    pay: '<b>10%</b> of first payment',
    posted: '2 weeks ago',
    days: 33,
    creators: 143,
    rating: '4.6',
    rc: '1.7K',
    share: 10,
    desc: 'Snapnest organizes and edits photos in one calm place. Earn 10% of each new user’s first payment.',
    joined: false,
    hue: HP[8],
    platforms: ['ios', 'android'],
  },
  {
    id: 'melodia',
    name: 'Melodia',
    cat: 'Music',
    host: 'Sound Garden',
    icon: 'music',
    rate: { t: 'fixed', v: 2.6 },
    pay: '<b>$2.60</b> per verified install',
    posted: '2 weeks ago',
    days: 27,
    creators: 221,
    rating: '4.7',
    rc: '4.1K',
    share: 0,
    desc: 'Melodia helps beginners learn instruments with short daily practice. Earn a fixed payout for every verified install.',
    joined: false,
    hue: HP[9],
    platforms: ['ios', 'android'],
  },
  {
    id: 'wayfarer',
    name: 'Wayfarer',
    cat: 'Travel',
    host: 'Atlas Travel Co',
    icon: 'map',
    rate: { t: 'pct', v: 8, avg: 120 },
    pay: '<b>8%</b> of first payment',
    posted: '3 weeks ago',
    days: 60,
    creators: 167,
    rating: '4.5',
    rc: '2.8K',
    share: 8,
    desc: 'Wayfarer plans trips with friends in one shared itinerary. Earn 8% of each new user’s first booking.',
    joined: false,
    hue: HP[0],
    platforms: ['ios', 'android'],
  },
];

export const CATEGORIES = [
  'All',
  'Art and design',
  'Education',
  'Games',
  'Finance',
  'Health',
  'Productivity',
  'Social',
  'Music',
  'Travel',
];

export const CATEGORY_GROUPS = [
  {
    title: 'Create & share',
    categories: ['Art and design', 'Music', 'Social'],
  },
  {
    title: 'Work & learn',
    categories: ['Productivity', 'Education', 'Finance'],
  },
  {
    title: 'Live & connect',
    categories: ['Health', 'Travel', 'Games'],
  },
];

// Seeded pseudorandom number generator for consistent repeatable demo statistics
const rng = (seed: number) => {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const seedOf = (s: string): number =>
  [...s].reduce((a, ch) => ((a * 31 + ch.charCodeAt(0)) | 0), 7);

export const usd = (n: number): string =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const perInstall = (c: Campaign): number =>
  c.rate.t === 'fixed' ? c.rate.v : (c.rate.v / 100) * (c.rate.avg || 40);

export const plainPay = (c: Campaign): string =>
  c.pay.replace(/<\/?b>/g, '');

export const linkOf = (c: Campaign): string =>
  `kred.link/${c.id.slice(0, 2)}${((c.creators * 7919) % 100000).toString(36)}`;

export function getCampaignStats(c: Campaign): CampaignStats {
  const r = rng(seedOf(c.id));
  const days = [...Array(14)].map(() => Math.round(8 + r() * 38));
  const inst = days.reduce((a, b) => a + b, 0);
  const clicks = Math.round(inst * (2.6 + r() * 1.4));
  const conv = clicks > 0 ? inst / clicks : 0;
  const earned = inst * perInstall(c);
  return { days, inst, clicks, conv, earned };
}

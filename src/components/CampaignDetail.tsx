import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Campaign } from '../types/campaign';
import { linkOf, plainPay } from '../data/campaigns';
import { Icon } from './Icons';
import { getCampaignTheme, hexToRgba } from '../utils/campaignTheme';

interface CampaignDetailProps {
  campaign: Campaign;
  allCampaigns?: Campaign[];
  onJoin: (campaign: Campaign, targetEl?: HTMLElement) => void;
  onOpenQr: (campaign: Campaign) => void;
  onCopyLink: (campaign: Campaign) => void;
  onShare: (campaign: Campaign) => void;
  onNavigateDetail?: (id: string) => void;
  onNavigateAnalytics?: (id: string) => void;
  onBack: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Art and design': 'camera',
  'Music': 'music',
  'Social': 'chat',
  'Productivity': 'bolt',
  'Education': 'book',
  'Finance': 'wallet',
  'Health': 'heart',
  'Travel': 'map',
  'Games': 'game',
};

const PROMO_SCREENS: Record<string, { icon: string; title: string; subtitle: string }[]> = {
  atelier: [
    { icon: 'spark', title: 'Studio Canvas', subtitle: 'Pressure-sensitive vector ink' },
    { icon: 'sliders', title: 'Palette Engine', subtitle: 'Dynamic color harmonics' },
    { icon: 'camera', title: 'Live Capture', subtitle: 'Texture scanning from reality' },
    { icon: 'star', title: 'Patron Showcase', subtitle: 'Export 4K portfolio reel' },
  ],
  palazzo: [
    { icon: 'cube', title: 'Spatial Gallery', subtitle: '3D exhibition walking tours' },
    { icon: 'map', title: 'Curator Guide', subtitle: 'Audio navigation in residencies' },
    { icon: 'eye', title: 'Detail Zoom', subtitle: 'Ultra-resolution brushwork' },
    { icon: 'globe', title: 'Worldwide Sync', subtitle: 'Connect collectors globally' },
  ],
  pixelpop: [
    { icon: 'game', title: 'Arcade Rush', subtitle: 'Fast-paced tactical puzzles' },
    { icon: 'trophy', title: 'Global Ladder', subtitle: 'Seasonal creator tournaments' },
    { icon: 'spark', title: 'Daily Quests', subtitle: 'New mechanics unlocked daily' },
    { icon: 'star', title: 'Custom Themes', subtitle: 'Unlock retro pixel palettes' },
  ],
  pennywise: [
    { icon: 'wallet', title: 'Ledger Flow', subtitle: 'Zero-knowledge cash tracker' },
    { icon: 'trend', title: 'Forecast AI', subtitle: 'Recurring bill projection' },
    { icon: 'bill', title: 'Split Vaults', subtitle: 'Shared group expense pools' },
    { icon: 'check', title: 'Safe to Spend', subtitle: 'Live calculated budget limit' },
  ],
  stride: [
    { icon: 'heart', title: 'Cadence Tracker', subtitle: 'Gentle daily walk goals' },
    { icon: 'clock', title: 'Micro Streaks', subtitle: 'Mindful 10-minute pauses' },
    { icon: 'trend', title: 'Vigor Index', subtitle: 'Long-term stamina analytics' },
    { icon: 'trophy', title: 'Route Badges', subtitle: 'Neighborhood landmark logs' },
  ],
  tessera: [
    { icon: 'book', title: 'Bite Lessons', subtitle: '5-minute micro immersion' },
    { icon: 'globe', title: 'Cultural Notes', subtitle: 'Idiomatic expressions' },
    { icon: 'chat', title: 'Pronounce AI', subtitle: 'Live acoustic voice feedback' },
    { icon: 'star', title: 'Fluency Path', subtitle: 'Adaptive mastery checkpoints' },
  ],
};

export const CampaignDetail: React.FC<CampaignDetailProps> = ({
  campaign,
  onJoin,
  onOpenQr,
  onCopyLink,
  onShare,
  onNavigateAnalytics,
  onBack,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeScreenIndex, setActiveScreenIndex] = useState<number | null>(null);
  const actionRef = useRef<HTMLDivElement | null>(null);

  const baseTheme = getCampaignTheme(campaign);
  const activeColor = baseTheme.primary;

  const defaultScreens = [
    { icon: 'spark', title: 'Feature Spotlight', subtitle: 'Seamless creator onboarding' },
    { icon: 'cube', title: 'Real-time Sync', subtitle: 'Instant device pairing' },
    { icon: 'book', title: 'Resource Hub', subtitle: 'Curated workflow guides' },
    { icon: 'star', title: 'Verified Rewards', subtitle: 'Guaranteed attribution payout' },
  ];

  const promoScreens = PROMO_SCREENS[campaign.id] || defaultScreens;

  useEffect(() => {
    const handleScroll = () => {
      if (!actionRef.current) return;
      const rect = actionRef.current.getBoundingClientRect();
      setShowStickyBar(rect.top < 64);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (campaign.joined || isJoining) return;
    setIsJoining(true);
    setTimeout(() => {
      onJoin(campaign, e.currentTarget);
      setIsJoining(false);
    }, 250);
  };

  const handleCopy = () => {
    onCopyLink(campaign);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full max-w-[860px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 select-none">
      {/* Clean hairline linear top accent (strictly linear without huge fuzzy glow) */}
      <div
        className="w-full h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)`,
        }}
      />

      {/* Sticky top bar on scroll */}
      <motion.div
        animate={{ y: showStickyBar ? 0 : -80 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed top-16 left-0 right-0 z-30 px-6 py-2.5 backdrop-blur-md border-b flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(20, 20, 22, 0.95)',
          borderColor: hexToRgba(activeColor, 0.2),
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 border"
            style={{
              backgroundColor: baseTheme.secondary,
              borderColor: hexToRgba(activeColor, 0.3),
              color: activeColor,
            }}
          >
            <Icon name={campaign.icon} className="w-4 h-4" />
          </div>
          <b className="text-sm font-semibold text-white">{campaign.name}</b>
        </div>

        <div className="flex items-center gap-2">
          {campaign.joined && onNavigateAnalytics && (
            <button
              onClick={() => onNavigateAnalytics(campaign.id)}
              className="h-8 px-3.5 rounded-full text-xs font-semibold text-white border border-white/20 hover:border-white/40 cursor-pointer"
            >
              Analytics ↗
            </button>
          )}
          {campaign.joined ? (
            <button
              onClick={() => onOpenQr(campaign)}
              className="h-8 px-4 rounded-full text-xs font-semibold text-white cursor-pointer active:scale-95"
              style={{
                backgroundColor: activeColor,
              }}
            >
              Get link
            </button>
          ) : (
            <button
              onClick={handleJoinClick}
              disabled={isJoining}
              className="h-8 px-4 rounded-full text-xs font-semibold text-white cursor-pointer active:scale-95"
              style={{
                backgroundColor: activeColor,
              }}
            >
              {isJoining ? 'Joining…' : 'Join campaign'}
            </button>
          )}
        </div>
      </motion.div>

      {/* Breadcrumb with category icon & reactive campaign highlight */}
      <nav className="flex items-center gap-2 text-sm text-[var(--t2)]" aria-label="Breadcrumb">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 hover:text-white transition-colors group cursor-pointer"
        >
          <Icon name="navCampaigns" className="w-4 h-4 text-[#8e8e93] group-hover:text-white" />
          <span>Campaigns</span>
        </button>
        <span className="text-[#636366] font-mono select-none">&gt;</span>
        <div className="flex items-center gap-1.5 font-medium transition-colors" style={{ color: activeColor }}>
          <Icon name={CATEGORY_ICONS[campaign.cat] || campaign.icon} className="w-4 h-4" />
          <span>{campaign.name}</span>
        </div>
      </nav>

      {/* Main Campaign Header Card with clean linear top accent */}
      <article
        ref={actionRef}
        className="rounded-[22px] border p-6 sm:p-7 shadow-xs select-none relative overflow-hidden"
        style={{
          backgroundColor: '#1e1e22',
          borderColor: hexToRgba(activeColor, 0.3),
        }}
      >
        {/* Subtle accent hairline line at top of card */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)`,
          }}
        />

        <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-6 relative z-10">
          {/* Left content area */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title & Category */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                {campaign.name}
              </h1>
              <span className="text-xs sm:text-sm text-[#8e8e93] mt-0.5 block">
                {campaign.cat} · Worldwide · {campaign.days} days left
              </span>
            </div>

            {/* Host byline */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#8e8e93]">
              <span
                className="w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 transition-colors"
                style={{
                  backgroundColor: hexToRgba(activeColor, 0.2),
                  color: activeColor,
                }}
              >
                {campaign.host.charAt(0)}
              </span>
              <span className="truncate">By {campaign.host}</span>
            </div>

            {/* Payout & Store Icons */}
            <div className="flex items-center gap-2 text-sm text-[#8e8e93] flex-wrap pt-1">
              <Icon name="bill" className="w-4 h-4 text-white shrink-0 mr-0.5" />
              <span
                className="text-white font-semibold"
                dangerouslySetInnerHTML={{ __html: campaign.pay }}
              />
              <span className="w-5 h-5 rounded-full bg-[#2a2a30] flex items-center justify-center text-white ml-2 shrink-0">
                <Icon name="apple" className="w-3 h-3" fill />
              </span>
              <span className="w-5 h-5 rounded-full bg-[#2a2a30] flex items-center justify-center text-white ml-1 shrink-0">
                <Icon name="play" className="w-2.5 h-2.5" fill />
              </span>
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-3 pt-3 flex-wrap">
              {campaign.joined ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border"
                    style={{
                      backgroundColor: hexToRgba(activeColor, 0.15),
                      color: '#ffffff',
                      borderColor: hexToRgba(activeColor, 0.35),
                    }}
                  >
                    <Icon name="check" className="w-3.5 h-3.5 text-emerald-400" />
                    Joined
                  </span>
                  {onNavigateAnalytics && (
                    <button
                      onClick={() => onNavigateAnalytics(campaign.id)}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-95"
                      style={{
                        backgroundColor: activeColor,
                      }}
                    >
                      View analytics ↗
                    </button>
                  )}
                  <button
                    onClick={() => onOpenQr(campaign)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold text-white border border-white/20 hover:border-white/40 transition-colors cursor-pointer"
                  >
                    QR Code
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleJoinClick}
                  disabled={isJoining}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-white active:scale-95 transition-all cursor-pointer shadow-xs"
                  style={{
                    backgroundColor: activeColor,
                  }}
                >
                  {isJoining ? 'Joining…' : 'Join campaign'}
                </button>
              )}

              {/* Creator Avatars stack */}
              <div className="flex items-center ml-1">
                <div className="flex -space-x-1 overflow-hidden">
                  <span className="inline-block w-5 h-5 rounded-full ring-2 ring-[#1e1e22] text-[9px] font-bold text-white flex items-center justify-center bg-[#3a3a42]">
                    H
                  </span>
                  <span className="inline-block w-5 h-5 rounded-full ring-2 ring-[#1e1e22] text-[9px] font-bold text-white flex items-center justify-center bg-[#42424c]">
                    C
                  </span>
                  <span className="inline-block w-5 h-5 rounded-full ring-2 ring-[#1e1e22] text-[9px] font-bold text-white flex items-center justify-center bg-[#484854]">
                    F
                  </span>
                  <span className="inline-block w-5 h-5 rounded-full ring-2 ring-[#1e1e22] text-[9px] font-bold text-white flex items-center justify-center bg-[#525260]">
                    A
                  </span>
                </div>
                <span className="ml-2 text-xs font-mono text-[#8e8e93]">
                  +{campaign.creators} Creators
                </span>
              </div>

              <button
                onClick={() => onShare(campaign)}
                className="ml-auto p-2 text-[#8e8e93] hover:text-white transition-colors cursor-pointer"
                title="Share"
              >
                <Icon name="share" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Dark Square App Card */}
          <div
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-[22px] flex flex-col items-center justify-center text-center p-3 border shrink-0 transition-all relative group/tile shadow-xs"
            style={{
              backgroundColor: baseTheme.secondary,
              borderColor: hexToRgba(activeColor, 0.35),
            }}
          >
            <div style={{ color: activeColor }} className="mb-2.5 relative z-10">
              <Icon name={campaign.icon} className="w-9 h-9" />
            </div>
            <span className="text-xs font-bold text-white tracking-tight line-clamp-1 relative z-10">
              {campaign.name}
            </span>
          </div>
        </div>
      </article>

      {/* Promotional Features Container */}
      <section
        className="rounded-[22px] border border-white/5 p-6 sm:p-7 space-y-5"
        style={{ backgroundColor: '#1e1e22' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8e8e93] font-mono">
            WHAT YOU’LL BE PROMOTING
          </span>
          <span className="text-xs font-mono transition-colors" style={{ color: activeColor }}>
            ● Attribution Guaranteed
          </span>
        </div>

        <p className="text-sm text-[#d1d5db] leading-relaxed max-w-3xl">
          {campaign.desc}
        </p>

        {/* 4 Phone Mockup Screens */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {promoScreens.map((screen, idx) => (
            <div
              key={idx}
              onClick={() => setActiveScreenIndex(idx)}
              className="h-44 rounded-[20px] border p-3 flex flex-col justify-between shrink-0 shadow-xs cursor-pointer transition-colors relative group/phone"
              style={{
                backgroundColor: '#0e0e11',
                borderColor:
                  activeScreenIndex === idx
                    ? activeColor
                    : hexToRgba(activeColor, 0.25),
              }}
            >
              {/* Top Speaker / Camera Pill */}
              <div className="w-6 h-1 rounded-full bg-white/20 mx-auto" />

              {/* App Content Display with Feature Icon */}
              <div
                className="w-full h-22 rounded-xl flex flex-col items-center justify-center my-auto border border-white/5"
                style={{ backgroundColor: '#16161b' }}
              >
                <div style={{ color: activeColor }} className="mb-1">
                  <Icon name={screen.icon} className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold text-white px-1 truncate max-w-full">
                  {screen.title}
                </span>
              </div>

              {/* Bottom UI Bar and Placeholder */}
              <div className="space-y-1">
                <div className="h-1 rounded-full bg-white/15 w-3/4 mx-auto" />
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    backgroundColor: hexToRgba(activeColor, 0.8),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Selected Screen Subtitle Banner */}
        {activeScreenIndex !== null && (
          <div
            className="p-3 rounded-xl border flex items-center justify-between text-xs"
            style={{
              backgroundColor: hexToRgba(activeColor, 0.1),
              borderColor: hexToRgba(activeColor, 0.3),
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: activeColor }}>
                <Icon name={promoScreens[activeScreenIndex].icon} className="w-4 h-4" />
              </span>
              <span className="text-white font-semibold">
                {promoScreens[activeScreenIndex].title}:
              </span>
              <span className="text-[#d1d5db]">
                {promoScreens[activeScreenIndex].subtitle}
              </span>
            </div>
            <button
              onClick={() => setActiveScreenIndex(null)}
              className="text-[#8e8e93] hover:text-white cursor-pointer px-1"
            >
              ✕
            </button>
          </div>
        )}
      </section>

      {/* Campaign Attribution & Tracking Link Hub */}
      {campaign.joined && (
        <section
          className="rounded-[22px] border p-6 sm:p-7 space-y-4"
          style={{
            backgroundColor: '#1e1e22',
            borderColor: hexToRgba(activeColor, 0.25),
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Your tracking link &amp; QR code
            </h2>
            {onNavigateAnalytics && (
              <button
                onClick={() => onNavigateAnalytics(campaign.id)}
                className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
              >
                Open Analytics &rarr;
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#8e8e93]">
            Share this link across YouTube, TikTok, X, or email. Installs that complete verification automatically register in your Earnings balance.
          </p>

          <div
            className="flex items-center gap-2 p-2 rounded-xl border max-w-xl transition-all"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderColor: hexToRgba(activeColor, 0.3),
            }}
          >
            <code className="text-xs sm:text-sm font-mono text-white truncate px-2 flex-1">
              https://{linkOf(campaign)}
            </code>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer active:scale-95"
              style={{
                backgroundColor: activeColor,
              }}
            >
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={() => onOpenQr(campaign)}
              className="p-1.5 text-[#8e8e93] hover:text-white transition-colors shrink-0 cursor-pointer"
              title="QR Code"
            >
              <Icon name="qr" className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Key Terms & Specs Grid */}
      <section
        className="rounded-[22px] border border-white/5 p-6 sm:p-7 space-y-4"
        style={{ backgroundColor: '#1e1e22' }}
      >
        <h2 className="text-lg font-bold text-white tracking-tight">
          Campaign specifications
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-t border-white/5 text-xs text-[#8e8e93]">
          <div>
            <span className="block mb-1">Tracking Window</span>
            <strong className="text-white text-sm font-mono">30 Days</strong>
          </div>
          <div>
            <span className="block mb-1">Attribution Type</span>
            <strong className="text-white text-sm font-mono">
              {campaign.rate.t === 'pct' ? 'RevShare' : 'Fixed CPI'}
            </strong>
          </div>
          <div>
            <span className="block mb-1">App Store Rating</span>
            <strong className="text-white text-sm font-mono">
              ★ {campaign.rating} ({campaign.rc})
            </strong>
          </div>
          <div>
            <span className="block mb-1">Target Platforms</span>
            <strong className="text-white text-sm font-mono">iOS &amp; Android</strong>
          </div>
        </div>
      </section>
    </div>
  );
};

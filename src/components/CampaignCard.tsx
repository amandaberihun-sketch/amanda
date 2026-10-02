import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Campaign } from '../types/campaign';
import { Icon } from './Icons';
import { linkOf } from '../data/campaigns';
import { getCampaignTheme, hexToRgba } from '../utils/campaignTheme';

interface CampaignCardProps {
  campaign: Campaign;
  onJoin: (campaign: Campaign, targetEl?: HTMLElement) => void;
  onOpenQr: (campaign: Campaign) => void;
  onCopyLink: (campaign: Campaign) => void;
  onShare: (campaign: Campaign) => void;
  onNavigateDetail: (id: string) => void;
  onNavigateAnalytics?: (id: string) => void;
  redirectMode?: 'detail' | 'analytics' | 'created';
  isLast?: boolean;
}

const PROMO_SCREENS: Record<string, string[]> = {
  atelier: ['spark', 'sliders', 'camera', 'star'],
  palazzo: ['cube', 'map', 'eye', 'globe'],
  pixelpop: ['game', 'trophy', 'spark', 'star'],
  pennywise: ['wallet', 'trend', 'bill', 'check'],
  stride: ['heart', 'clock', 'trend', 'trophy'],
  tessera: ['book', 'globe', 'chat', 'star'],
  solis: ['sun', 'clock', 'spark', 'star'],
  prism: ['cube', 'sliders', 'camera', 'eye'],
  zenith: ['globe', 'map', 'search', 'star'],
  hyperion: ['bolt', 'game', 'trophy', 'spark'],
  focusly: ['bolt', 'clock', 'spark', 'star'],
  chatterbox: ['chat', 'users', 'spark', 'star'],
  snapnest: ['camera', 'sliders', 'eye', 'star'],
  melodia: ['music', 'sliders', 'spark', 'star'],
  wayfarer: ['map', 'globe', 'clock', 'star'],
};

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onJoin,
  onOpenQr,
  onCopyLink,
  onShare,
  onNavigateDetail,
  onNavigateAnalytics,
  redirectMode = campaign.joined ? 'analytics' : 'detail',
  isLast = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const baseTheme = getCampaignTheme(campaign);
  const activeColor = baseTheme.primary;
  const promoIcons = PROMO_SCREENS[campaign.id] || ['spark', 'cube', 'book', 'star'];

  const handleJoinClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (campaign.joined || isJoining) return;
    setIsJoining(true);
    setTimeout(() => {
      onJoin(campaign, e.currentTarget);
      setIsJoining(false);
    }, 250);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyLink(campaign);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrimaryRedirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (redirectMode === 'analytics' && onNavigateAnalytics) {
      onNavigateAnalytics(campaign.id);
    } else {
      onNavigateDetail(campaign.id);
    }
  };

  return (
    <div
      className="grid grid-cols-[85px_12px_1fr] sm:grid-cols-[120px_16px_1fr] gap-x-2.5 sm:gap-x-4 items-start group"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {/* Column 1: Category & Days remaining */}
      <div className="pt-2 text-left select-none">
        <span
          className="block text-[13px] sm:text-sm font-semibold transition-colors duration-200 leading-tight"
          style={{
            color: isCardHovered || isExpanded ? activeColor : '#ffffff',
          }}
        >
          {campaign.cat}
        </span>
        <span className="block text-xs text-[#8e8e93] mt-0.5 leading-tight">
          {campaign.days} days left
        </span>
      </div>

      {/* Column 2: Timeline Rail with Linear Gradient Accent */}
      <div className="relative flex justify-center h-full">
        {/* Dot indicator */}
        <div
          className="w-2.5 h-2.5 rounded-full mt-3 z-10 shrink-0 transition-colors duration-200"
          style={{
            backgroundColor: isCardHovered || isExpanded ? activeColor : '#8e8e93',
          }}
        />

        {/* Vertical connector line with linear gradient accent */}
        {!isLast && (
          <div
            className="absolute top-4 bottom-[-28px] sm:bottom-[-36px] w-px transition-colors duration-200"
            style={{
              background:
                isCardHovered || isExpanded
                  ? `linear-gradient(to bottom, ${activeColor}, rgba(255,255,255,0.08))`
                  : 'rgba(255,255,255,0.08)',
            }}
          />
        )}
      </div>

      {/* Column 3: The Card with clean linear top accent and no heavy glow */}
      <article
        onClick={() => setIsExpanded(!isExpanded)}
        className="rounded-[22px] border p-4 sm:p-5 sm:pl-6 transition-all duration-200 cursor-pointer shadow-xs select-none relative overflow-hidden"
        style={{
          backgroundColor: '#1e1e22',
          borderColor: isExpanded
            ? hexToRgba(activeColor, 0.45)
            : isCardHovered
            ? hexToRgba(activeColor, 0.28)
            : 'rgba(255, 255, 255, 0.07)',
        }}
      >
        {/* Clean top linear hairline accent */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-[1.5px] transition-opacity duration-200"
          style={{
            opacity: isCardHovered || isExpanded ? 1 : 0,
            background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)`,
          }}
        />

        <div className="flex items-start justify-between gap-4 relative z-10">
          {/* Left content area */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
              {campaign.name}
            </h2>

            {/* Host byline with dark initial square badge that tints subtly on hover */}
            <div className="flex items-center gap-1.5 text-xs text-[#8e8e93]">
              <span
                className="w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 transition-colors duration-200"
                style={{
                  backgroundColor: isCardHovered ? hexToRgba(activeColor, 0.2) : '#2c2c32',
                  color: isCardHovered ? activeColor : '#ffffff',
                }}
              >
                {campaign.host.charAt(0)}
              </span>
              <span className="truncate">By {campaign.host}</span>
            </div>

            {/* Payout & Store Icons Row */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#8e8e93] flex-wrap pt-0.5">
              <Icon name="bill" className="w-4 h-4 text-white shrink-0 mr-0.5" />
              <span
                className="text-white"
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
            <div
              className="flex items-center gap-3 pt-2.5 flex-wrap"
              onClick={(e) => e.stopPropagation()}
            >
              {campaign.joined ? (
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all"
                    style={{
                      backgroundColor: hexToRgba(activeColor, 0.15),
                      color: '#ffffff',
                      borderColor: hexToRgba(activeColor, 0.35),
                    }}
                  >
                    <Icon name="check" className="w-3.5 h-3.5 text-emerald-400" />
                    Joined
                  </span>
                  {redirectMode === 'analytics' && (
                    <button
                      onClick={handlePrimaryRedirect}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-95"
                      style={{
                        backgroundColor: activeColor,
                      }}
                    >
                      Analytics ↗
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleJoinClick}
                  disabled={isJoining}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all shadow-xs cursor-pointer active:scale-95"
                  style={{
                    backgroundColor: isCardHovered ? activeColor : '#1a8cff',
                  }}
                >
                  {isJoining ? 'Joining…' : 'Join campaign'}
                </button>
              )}

              {/* Creator Avatars stack */}
              <div className="flex items-center">
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
                  +{campaign.creators}
                </span>
              </div>

              {/* Chevron expand indicator with smooth spring rotation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="p-1 text-[#8e8e93] hover:text-white transition-colors ml-auto sm:ml-2 cursor-pointer"
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                <div
                  className={`transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                >
                  <Icon name="chev" className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Dark Colored App Card Tile */}
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex flex-col items-center justify-center text-center p-2.5 border shrink-0 transition-all duration-200 relative group/tile"
            style={{
              backgroundColor: baseTheme.secondary,
              borderColor: isCardHovered
                ? hexToRgba(activeColor, 0.35)
                : 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ color: activeColor }} className="mb-2 relative z-10">
              <Icon name={campaign.icon} className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-white tracking-tight line-clamp-1 relative z-10">
              {campaign.name}
            </span>
          </div>
        </div>

        {/* Expanded View: Animated Accordion */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
                {/* Two-Column Promotional Grid */}
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 items-start">
                  {/* Left Sidebar Metadata */}
                  <div className="space-y-3.5 text-xs text-[#8e8e93]">
                    <div className="flex items-center gap-2 text-white">
                      <Icon name="globe" className="w-4 h-4 text-[#8e8e93] shrink-0" />
                      <span className="text-xs font-medium">Worldwide</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Icon name="clock" className="w-4 h-4 text-[#8e8e93] shrink-0" />
                      <span className="text-xs font-medium">{campaign.days} days</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Icon name="bill" className="w-4 h-4 text-[#8e8e93] shrink-0" />
                      <span className="text-xs font-medium leading-tight">
                        {campaign.rate.t === 'pct' ? 'Paid per payment' : 'Paid per verified install'}
                      </span>
                    </div>
                    <div className="pt-2 text-[11px] text-[#636366] font-mono leading-tight">
                      Posted {campaign.posted}
                    </div>
                  </div>

                  {/* Right Promotion Column */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e93] font-mono block">
                        WHAT YOU’LL BE PROMOTING
                      </span>
                      <span
                        className="text-[11px] font-mono transition-colors"
                        style={{ color: activeColor }}
                      >
                        ● Verified Attribution
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#d1d5db] leading-relaxed">
                      {campaign.desc}
                    </p>

                    {/* 4 Phone Mockup Screens */}
                    <div className="grid grid-cols-4 gap-2.5 sm:gap-3 py-3">
                      {promoIcons.map((ic, idx) => (
                        <div
                          key={idx}
                          className="h-36 sm:h-40 rounded-[18px] border p-2 flex flex-col justify-between shrink-0 shadow-xs transition-colors relative overflow-hidden"
                          style={{
                            backgroundColor: '#0e0e11',
                            borderColor: hexToRgba(activeColor, 0.2),
                          }}
                        >
                          {/* Top Speaker / Camera Pill */}
                          <div className="w-5 h-1 rounded-full bg-white/20 mx-auto" />

                          {/* App Content Display with Feature Icon */}
                          <div
                            className="w-full h-16 sm:h-20 rounded-xl flex items-center justify-center my-auto border border-white/5"
                            style={{ backgroundColor: '#16161b' }}
                          >
                            <div style={{ color: activeColor }}>
                              <Icon name={ic} className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                          </div>

                          {/* Bottom UI Bar and Placeholder */}
                          <div className="space-y-1">
                            <div className="h-1 rounded-full bg-white/15 w-3/4 mx-auto" />
                            <div
                              className="h-2.5 sm:h-3 rounded-full"
                              style={{
                                backgroundColor: hexToRgba(activeColor, 0.8),
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Row: Tracking Link if joined + Dynamic Redirect Button */}
                    <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      {campaign.joined ? (
                        <div
                          className="flex items-center gap-2 flex-1 max-w-sm rounded-xl px-3 py-1.5 border transition-all"
                          style={{
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            borderColor: hexToRgba(activeColor, 0.35),
                          }}
                        >
                          <code className="text-xs font-mono text-white truncate flex-1">
                            https://{linkOf(campaign)}
                          </code>
                          <button
                            onClick={handleCopy}
                            className="px-2.5 py-1 text-white rounded-md text-xs font-semibold shrink-0 transition-all cursor-pointer active:scale-95"
                            style={{
                              backgroundColor: activeColor,
                            }}
                          >
                            {copiedLink ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            onClick={() => onOpenQr(campaign)}
                            className="p-1 text-[#8e8e93] hover:text-white transition-colors shrink-0 cursor-pointer"
                            title="QR Code"
                          >
                            <Icon name="qr" className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-[#8e8e93]">
                          Join to generate your custom tracking link &amp; QR code.
                        </div>
                      )}

                      <button
                        onClick={handlePrimaryRedirect}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold text-white transition-all cursor-pointer self-end sm:self-auto shrink-0 hover:bg-white/5 active:scale-95"
                        style={{
                          borderColor: hexToRgba(activeColor, 0.35),
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        }}
                      >
                        <span>
                          {redirectMode === 'analytics'
                            ? 'View analytics'
                            : redirectMode === 'created'
                            ? 'Campaign details'
                            : 'Go to campaign page'}
                        </span>
                        <span className="text-xs">↗</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </div>
  );
};

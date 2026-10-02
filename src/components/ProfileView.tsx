import React, { useState } from 'react';
import { Campaign } from '../types/campaign';
import { Icon } from './Icons';
import {
  SmileyAvatar,
  AvatarMood,
  AVATAR_PALETTES,
  DEFAULT_AVATAR_PALETTE,
  DEFAULT_AVATAR_MOOD,
} from './SmileyAvatar';
import { CampaignCard } from './CampaignCard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface ProfileViewProps {
  onBack: () => void;
  onNavigateEarnings: () => void;
  avatarPalette?: string;
  avatarMood?: AvatarMood;
  onSelectPalette?: (palette: string) => void;
  onSelectMood?: (mood: AvatarMood) => void;
  campaigns?: Campaign[];
  onNavigateCampaign?: (id: string) => void;
  onNavigateAnalytics?: (id: string) => void;
  onJoin?: (campaign: Campaign, targetEl?: HTMLElement) => void;
  onOpenQr?: (campaign: Campaign) => void;
  onCopyLink?: (campaign: Campaign) => void;
  onShare?: (campaign: Campaign) => void;
}

const CREATED_DAILY_ANALYTICS = [
  { date: 'Sep 24', installs: 14, spend: 44.8 },
  { date: 'Sep 25', installs: 22, spend: 70.4 },
  { date: 'Sep 26', installs: 31, spend: 99.2 },
  { date: 'Sep 27', installs: 28, spend: 89.6 },
  { date: 'Sep 28', installs: 45, spend: 144.0 },
  { date: 'Sep 29', installs: 53, spend: 169.6 },
  { date: 'Sep 30', installs: 68, spend: 217.6 },
  { date: 'Oct 01', installs: 85, spend: 272.0 },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  onBack,
  onNavigateEarnings,
  avatarPalette = DEFAULT_AVATAR_PALETTE,
  avatarMood = DEFAULT_AVATAR_MOOD,
  onSelectPalette,
  onSelectMood,
  campaigns = [],
  onNavigateCampaign,
  onNavigateAnalytics,
  onJoin = () => {},
  onOpenQr = () => {},
  onCopyLink = () => {},
  onShare = () => {},
}) => {
  // Dividing tabs: 'created' vs 'joined'
  const [profileTab, setProfileTab] = useState<'created' | 'joined'>('created');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);

  // Separate created vs joined campaigns
  const joinedCampaigns = campaigns.filter((c) => c.joined);
  // Default sample created campaigns by the user
  const createdCampaigns = campaigns.slice(0, 2);

  const totalCreatedInstalls = 346;
  const totalActiveCreators = 18;
  const totalSpend = '$1,107.20';

  const handleCopyProfile = () => {
    navigator.clipboard?.writeText('https://kred.me/nhatty');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const MOOD_OPTIONS: { id: AvatarMood; label: string }[] = [
    { id: 'friendly', label: 'Friendly' },
    { id: 'chill', label: 'Chill' },
    { id: 'winking', label: 'Winking' },
    { id: 'blissful', label: 'Blissful' },
    { id: 'starry', label: 'Starry' },
  ];

  return (
    <div className="w-full max-w-[880px] mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-[rise_0.3s_cubic-bezier(0.2,0.8,0.2,1)] space-y-8 select-none">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--t2)]" aria-label="Breadcrumb">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 hover:text-white transition-colors group cursor-pointer"
        >
          <Icon name="navCampaigns" className="w-4 h-4 text-[#8e8e93] group-hover:text-white" />
          <span>Campaigns</span>
        </button>
        <span className="text-[#636366] font-mono select-none">&gt;</span>
        <div className="flex items-center gap-1.5 text-white font-medium">
          <Icon name="users" className="w-4 h-4 text-[#1a8cff]" />
          <span>Profile</span>
        </div>
      </nav>

      {/* Profile Header matching Screenshot 3 & 1 with Avatar Orb */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 pt-2">
        <div
          className="relative group cursor-pointer"
          onClick={() => setShowAvatarCustomizer(!showAvatarCustomizer)}
          title="Click to customize avatar aura & expression"
        >
          <SmileyAvatar paletteId={avatarPalette} mood={avatarMood} size={84} />
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-black/80 border border-white/20 text-white text-[11px] flex items-center justify-center font-mono">
            ✎
          </span>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              nhatty
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold text-emerald-300 bg-[#064e3b] border border-emerald-600/40">
              <Icon name="check" className="w-3 h-3" />
              Verified Creator
            </span>
          </div>

          <div className="text-xs text-[#8e8e93] font-mono flex items-center justify-center sm:justify-start gap-2">
            <span>📅 Joined April 2026</span>
            <span>·</span>
            <span className="text-white font-semibold">{createdCampaigns.length} Created</span>
            <span>·</span>
            <span className="text-white font-semibold">{joinedCampaigns.length} Joined</span>
          </div>

          <p className="text-xs sm:text-sm text-[#d1d5db] leading-relaxed max-w-xl pt-1">
            Mobile growth engineer &amp; software developer. Distributing high-retention tools and acquiring verified organic app users.
          </p>

          {/* Avatar Customizer Dropdown / Panel */}
          {showAvatarCustomizer && (
            <div className="p-3.5 rounded-2xl border border-white/10 bg-[#1e1e22] space-y-3 mt-3 max-w-lg text-left">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8e8e93] block mb-1.5">
                  Pastel Orb Gradient:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {Object.values(AVATAR_PALETTES).map((pal) => (
                    <button
                      key={pal.id}
                      onClick={() => onSelectPalette?.(pal.id)}
                      className={`h-7 px-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        avatarPalette === pal.id
                          ? 'border-white text-white shadow-xs'
                          : 'border-white/10 text-[#8e8e93] hover:text-white'
                      }`}
                      style={{
                        background: avatarPalette === pal.id ? pal.bgGradient : 'transparent',
                        color: avatarPalette === pal.id ? pal.faceColor : undefined,
                      }}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: pal.bgGradient }}
                      />
                      <span>{pal.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8e8e93] block mb-1.5">
                  Expression:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => onSelectMood?.(m.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        avatarMood === m.id
                          ? 'bg-white text-black font-semibold shadow-xs'
                          : 'bg-white/5 text-[#8e8e93] hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-2 flex-wrap">
            <button
              onClick={handleCopyProfile}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-xs font-medium text-white bg-[#1a8cff] hover:bg-[#258cfb] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Icon name="copy" className="w-3 h-3" />
              <span>{copiedLink ? 'Copied kred.me/nhatty' : 'Share Profile'}</span>
            </button>
            <button
              onClick={onNavigateEarnings}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-xs font-medium text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
            >
              <Icon name="money" className="w-3 h-3 text-emerald-400" />
              <span>Earnings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dividing Tabs: Created vs Joined */}
      <div className="border-b border-white/10 flex items-center gap-6">
        <button
          onClick={() => setProfileTab('created')}
          className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
            profileTab === 'created'
              ? 'text-white'
              : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <span>Created ({createdCampaigns.length})</span>
          {profileTab === 'created' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a8cff] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setProfileTab('joined')}
          className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
            profileTab === 'joined'
              ? 'text-white'
              : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <span>Joined ({joinedCampaigns.length})</span>
          {profileTab === 'joined' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a8cff] rounded-full" />
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CREATED CAMPAIGNS (SAME CAMPAIGN CARDS AS HOME)    */}
      {/* ========================================================= */}
      {profileTab === 'created' && (
        <div className="space-y-8 animate-[rise_0.2s_ease-out]">
          {/* Summary counters for created campaigns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-b border-white/10">
            <div>
              <span className="text-xs text-[#8e8e93] block font-mono">Campaigns</span>
              <strong className="text-2xl font-bold text-white block mt-0.5 font-mono">
                {createdCampaigns.length}
              </strong>
              <span className="text-[11px] text-[#636366]">0 last week</span>
            </div>

            <div>
              <span className="text-xs text-[#8e8e93] block font-mono">Verified Installs</span>
              <strong className="text-2xl font-bold text-emerald-400 block mt-0.5 font-mono">
                {totalCreatedInstalls}
              </strong>
              <span className="text-[11px] text-emerald-500 font-mono">+28 last week</span>
            </div>

            <div>
              <span className="text-xs text-[#8e8e93] block font-mono">Active Creators</span>
              <strong className="text-2xl font-bold text-white block mt-0.5 font-mono">
                {totalActiveCreators}
              </strong>
              <span className="text-[11px] text-[#8e8e93] font-mono">+4 last week</span>
            </div>

            <div>
              <span className="text-xs text-[#8e8e93] block font-mono">Total Bounties</span>
              <strong className="text-2xl font-bold text-white block mt-0.5 font-mono">
                {totalSpend}
              </strong>
              <span className="text-[11px] text-[#636366]">Escrow settled</span>
            </div>
          </div>

          {/* Acquisition Velocity Chart */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Acquisition Velocity &amp; Daily Verified Installs
                </h3>
                <p className="text-xs text-[#8e8e93] mt-0.5">
                  Real-time SDK handshakes registered across your active developer campaigns.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-400">
                +31.4% MoM
              </span>
            </div>

            <div
              className="rounded-2xl border border-white/10 p-4 pt-6"
              style={{ backgroundColor: '#141416' }}
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={CREATED_DAILY_ANALYTICS}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.07)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1c1f',
                      borderColor: 'rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: any) => [
                      name === 'installs' ? `${value} verified users` : `$${value}`,
                      name === 'installs' ? 'Verified Installs' : 'Bounty Released',
                    ]}
                    labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="installs"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#10b981', stroke: '#141416', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* List of Created Campaigns as Campaign Cards */}
          <section className="space-y-6 pt-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              Your Created Campaigns
            </h3>

            <div className="space-y-6 sm:space-y-7">
              {createdCampaigns.map((c, index) => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  onJoin={onJoin}
                  onOpenQr={onOpenQr}
                  onCopyLink={onCopyLink}
                  onShare={onShare}
                  onNavigateDetail={onNavigateCampaign || (() => {})}
                  redirectMode="created"
                  isLast={index === createdCampaigns.length - 1}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: JOINED (SAME CAMPAIGN CARDS REDIRECTING TO ANALYTICS) */}
      {/* ========================================================= */}
      {profileTab === 'joined' && (
        <div className="space-y-6 animate-[rise_0.2s_ease-out]">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight">
              Joined Campaigns &amp; Performance
            </h3>
            <p className="text-xs text-[#8e8e93]">
              Active creator bounties with live tracking. Click Analytics to view realtime verified conversions and payout ledger.
            </p>
          </div>

          {joinedCampaigns.length > 0 ? (
            <div className="space-y-6 sm:space-y-7 pt-2">
              {joinedCampaigns.map((c, index) => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  onJoin={onJoin}
                  onOpenQr={onOpenQr}
                  onCopyLink={onCopyLink}
                  onShare={onShare}
                  onNavigateDetail={onNavigateCampaign || (() => {})}
                  onNavigateAnalytics={onNavigateAnalytics}
                  redirectMode="analytics"
                  isLast={index === joinedCampaigns.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#8e8e93] rounded-[22px] border border-white/5" style={{ backgroundColor: '#1e1e22' }}>
              You haven't joined any campaigns yet. Browse campaigns to start earning.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

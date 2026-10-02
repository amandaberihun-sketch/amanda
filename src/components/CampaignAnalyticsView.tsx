import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Campaign } from '../types/campaign';
import { linkOf, plainPay, usd, getCampaignStats } from '../data/campaigns';
import { Icon } from './Icons';
import { getCampaignTheme, hexToRgba } from '../utils/campaignTheme';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface CampaignAnalyticsViewProps {
  campaign: Campaign;
  onBack: () => void;
  onOpenQr: (campaign: Campaign) => void;
  onCopyLink: (campaign: Campaign) => void;
  onShare: (campaign: Campaign) => void;
}

export const CampaignAnalyticsView: React.FC<CampaignAnalyticsViewProps> = ({
  campaign,
  onBack,
  onOpenQr,
  onCopyLink,
  onShare,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const theme = getCampaignTheme(campaign);
  const stats = getCampaignStats(campaign);

  // Daily time series for this specific campaign's verified installs
  const chartData = stats.days.map((val, idx) => {
    const dayNum = idx + 17;
    const dateLabel = `Sep ${dayNum > 30 ? (dayNum - 30) : dayNum}`;
    return {
      date: dateLabel,
      installs: val,
      earnings: val * (campaign.rate.t === 'fixed' ? campaign.rate.v : (campaign.rate.v / 100) * 45),
    };
  });

  const handleCopy = () => {
    onCopyLink(campaign);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Mock attribution events for this campaign
  const recentEvents = [
    { id: 'att_9a8f2', device: 'iOS 18.2 (iPhone 16 Pro)', time: '4 mins ago', country: 'US', bounty: usd(campaign.rate.t === 'fixed' ? campaign.rate.v : 5.4) },
    { id: 'att_8b7e1', device: 'Android 15 (Pixel 9)', time: '22 mins ago', country: 'UK', bounty: usd(campaign.rate.t === 'fixed' ? campaign.rate.v : 5.4) },
    { id: 'att_7c6d0', device: 'iOS 18.1 (iPhone 15)', time: '1 hr ago', country: 'DE', bounty: usd(campaign.rate.t === 'fixed' ? campaign.rate.v : 5.4) },
    { id: 'att_6d5c9', device: 'Android 14 (Galaxy S24)', time: '3 hrs ago', country: 'CA', bounty: usd(campaign.rate.t === 'fixed' ? campaign.rate.v : 5.4) },
    { id: 'att_5e4b8', device: 'iOS 18.0 (iPhone 14)', time: '5 hrs ago', country: 'FR', bounty: usd(campaign.rate.t === 'fixed' ? campaign.rate.v : 5.4) },
  ];

  return (
    <div className="w-full max-w-[880px] mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-[rise_0.25s_cubic-bezier(0.2,0.8,0.2,1)] space-y-8 select-none">
      {/* Clean top hairline linear accent (strictly linear, no fuzzy radial glow) */}
      <div
        className="w-full h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
        }}
      />

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
        <button
          onClick={onBack}
          className="hover:text-white transition-colors cursor-pointer"
        >
          {campaign.name}
        </button>
        <span className="text-[#636366] font-mono select-none">&gt;</span>
        <div className="flex items-center gap-1.5 font-medium text-emerald-400">
          <Icon name="trend" className="w-4 h-4" />
          <span>Analytics</span>
        </div>
      </nav>

      {/* Header Banner: Clean linear accent border with zero heavy glow */}
      <div
        className="p-6 sm:p-7 rounded-[22px] border relative overflow-hidden"
        style={{
          backgroundColor: '#1c1c1f',
          borderColor: hexToRgba(theme.primary, 0.35),
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 border"
              style={{
                backgroundColor: theme.secondary,
                borderColor: hexToRgba(theme.primary, 0.4),
                color: theme.primary,
              }}
            >
              <Icon name={campaign.icon} className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {campaign.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ● Joined &amp; Tracking
                </span>
              </div>
              <p className="text-xs text-[#8e8e93] mt-1">
                By {campaign.host} · {campaign.cat} · {plainPay(campaign)}
              </p>
            </div>
          </div>

          {/* Quick Tracking Link Actions */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial h-9 px-4 rounded-full text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-95"
              style={{
                backgroundColor: theme.primary,
              }}
            >
              {copiedLink ? 'Copied Link' : 'Copy Tracking Link'}
            </button>
            <button
              onClick={() => onOpenQr(campaign)}
              className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Show QR Code"
            >
              <Icon name="qr" className="w-4 h-4" />
            </button>
            <button
              onClick={() => onShare(campaign)}
              className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Share Link"
            >
              <Icon name="share" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          className="p-4 sm:p-5 rounded-2xl border"
          style={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <span className="text-xs text-[#8e8e93] font-mono block">Verified Installs</span>
          <strong className="text-2xl sm:text-3xl font-bold text-white block mt-1 font-mono tabular-nums">
            {stats.inst}
          </strong>
          <span className="text-[11px] text-emerald-400 font-mono mt-0.5 block">
            +38 this week
          </span>
        </div>

        <div
          className="p-4 sm:p-5 rounded-2xl border"
          style={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <span className="text-xs text-[#8e8e93] font-mono block">Total Earned</span>
          <strong className="text-2xl sm:text-3xl font-bold text-emerald-400 block mt-1 font-mono tabular-nums">
            {usd(stats.earned)}
          </strong>
          <span className="text-[11px] text-[#8e8e93] font-mono mt-0.5 block">
            Escrow verified
          </span>
        </div>

        <div
          className="p-4 sm:p-5 rounded-2xl border"
          style={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <span className="text-xs text-[#8e8e93] font-mono block">Link Clicks</span>
          <strong className="text-2xl sm:text-3xl font-bold text-white block mt-1 font-mono tabular-nums">
            {stats.clicks}
          </strong>
          <span className="text-[11px] text-[#8e8e93] font-mono mt-0.5 block">
            Unique devices
          </span>
        </div>

        <div
          className="p-4 sm:p-5 rounded-2xl border"
          style={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <span className="text-xs text-[#8e8e93] font-mono block">Conversion Rate</span>
          <strong className="text-2xl sm:text-3xl font-bold text-white block mt-1 font-mono tabular-nums">
            {(stats.conv * 100).toFixed(1)}%
          </strong>
          <span className="text-[11px] text-emerald-400 font-mono mt-0.5 block">
            High intent
          </span>
        </div>
      </div>

      {/* Daily Installs Chart */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Daily verified install velocity
            </h2>
            <p className="text-xs text-[#8e8e93] mt-0.5">
              Unique device attribution verified through {campaign.name} SDK handshake.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-medium">
            Active Tracking
          </span>
        </div>

        <div
          className="rounded-2xl border p-4 pt-6"
          style={{
            backgroundColor: '#161619',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
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
                  name === 'installs' ? `${value} installs` : usd(Number(value)),
                  name === 'installs' ? 'Verified Installs' : 'Accrued Bounty',
                ]}
                labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
              />
              <Line
                type="monotone"
                dataKey="installs"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981', stroke: '#161619', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Attribution Traffic Channels & Devices */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Attribution Channels */}
        <div
          className="p-5 rounded-2xl border space-y-3"
          style={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-sm font-bold text-white tracking-tight">Traffic Breakdown</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8e8e93]">YouTube / Longform Description</span>
              <span className="font-mono text-white font-semibold">54%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '54%' }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[#8e8e93]">TikTok &amp; Reels Bio Links</span>
              <span className="font-mono text-white font-semibold">31%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-sky-400 rounded-full" style={{ width: '31%' }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[#8e8e93]">X (Twitter) &amp; Direct Messaging</span>
              <span className="font-mono text-white font-semibold">15%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: '15%' }} />
            </div>
          </div>
        </div>

        {/* Platform Share */}
        <div
          className="p-5 rounded-2xl border space-y-3"
          style={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-sm font-bold text-white tracking-tight">Platform OS Split</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-white">
                <Icon name="apple" className="w-3.5 h-3.5" fill />
                <span>Apple iOS App Store</span>
              </div>
              <span className="font-mono text-white font-semibold">68%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '68%' }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-white">
                <Icon name="play" className="w-3 h-3" fill />
                <span>Google Play Store</span>
              </div>
              <span className="font-mono text-white font-semibold">32%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '32%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Live Attribution Event Ledger */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight">Recent Verified Attribution Events</h3>

        <div
          className="rounded-2xl border divide-y divide-white/5 overflow-hidden"
          style={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          {recentEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 sm:px-4 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-mono text-white truncate">{evt.device}</span>
                <span className="text-[#8e8e93] font-mono text-[11px] shrink-0">({evt.country})</span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[#8e8e93] font-mono text-[11px] hidden sm:inline">{evt.time}</span>
                <span className="font-mono text-emerald-400 font-semibold">{evt.bounty}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Return to campaigns button */}
      <div className="pt-2 flex justify-start">
        <button
          onClick={onBack}
          className="h-10 px-5 rounded-full border border-white/15 hover:border-white/30 text-xs font-semibold text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          &larr; Back to Joined Campaigns
        </button>
      </div>
    </div>
  );
};

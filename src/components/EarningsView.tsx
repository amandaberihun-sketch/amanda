import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Campaign } from '../types/campaign';
import { getCampaignStats, plainPay, usd } from '../data/campaigns';
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

interface EarningsViewProps {
  campaigns: Campaign[];
  onNavigateCampaign: (id: string) => void;
  onBack: () => void;
}

const DAILY_EARNINGS_DATA = [
  { date: 'Sep 17', installs: 8, earnings: 24.6 },
  { date: 'Sep 18', installs: 12, earnings: 38.4 },
  { date: 'Sep 19', installs: 15, earnings: 45.0 },
  { date: 'Sep 20', installs: 11, earnings: 33.2 },
  { date: 'Sep 21', installs: 19, earnings: 58.8 },
  { date: 'Sep 22', installs: 24, earnings: 74.2 },
  { date: 'Sep 23', installs: 21, earnings: 62.5 },
  { date: 'Sep 24', installs: 28, earnings: 89.6 },
  { date: 'Sep 25', installs: 33, earnings: 104.2 },
  { date: 'Sep 26', installs: 30, earnings: 92.0 },
  { date: 'Sep 27', installs: 36, earnings: 115.4 },
  { date: 'Sep 28', installs: 42, earnings: 138.8 },
  { date: 'Sep 29', installs: 39, earnings: 124.0 },
  { date: 'Sep 30', installs: 48, earnings: 154.6 },
];

export const EarningsView: React.FC<EarningsViewProps> = ({
  campaigns,
  onNavigateCampaign,
  onBack,
}) => {
  const [isDisclosed, setIsDisclosed] = useState(false);

  const joinedCampaigns = campaigns.filter((c) => c.joined);
  const totalEarned = joinedCampaigns.reduce((sum, c) => {
    const s = getCampaignStats(c);
    return sum + s.earned;
  }, 0);

  const availableBalance = Math.max(totalEarned * 0.45, 584.2);
  const totalVerifiedInstalls = joinedCampaigns.reduce((sum, c) => {
    const s = getCampaignStats(c);
    return sum + s.inst;
  }, 346);

  return (
    <div className="w-full max-w-[840px] mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-[rise_0.3s_cubic-bezier(0.2,0.8,0.2,1)] space-y-10">
      {/* Breadcrumb with icons and > indicator */}
      <nav className="flex items-center gap-2 text-sm text-[var(--t2)]" aria-label="Breadcrumb">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 hover:text-[var(--t1)] transition-colors group cursor-pointer"
        >
          <Icon name="navCampaigns" className="w-4 h-4 text-[var(--t2)] group-hover:text-[var(--t1)]" />
          <span>Campaigns</span>
        </button>
        <span className="text-[var(--t3)] font-mono select-none">&gt;</span>
        <div className="flex items-center gap-1.5 text-[var(--t1)] font-medium">
          <Icon name="money" className="w-4 h-4 text-emerald-400" />
          <span>Earnings</span>
        </div>
      </nav>

      {/* Main Earnings Overview */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[var(--t2)] font-mono">
                Total Accrued Earnings
              </span>
              <button
                onClick={() => setIsDisclosed(!isDisclosed)}
                className="text-xs text-[var(--t3)] hover:text-white transition-colors flex items-center gap-1 font-mono cursor-pointer"
                title={isDisclosed ? 'Hide financial values' : 'Show financial values'}
              >
                <Icon name="eye" className="w-3.5 h-3.5" />
                <span>{isDisclosed ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>

            <div className="text-4xl sm:text-5xl font-semibold text-white font-mono tracking-tight mt-1">
              {isDisclosed ? usd(availableBalance) : '••••••••'}
            </div>
            <p className="text-sm text-[var(--t2)] mt-1">
              Accrued across verified creator link installs and active bounties.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[var(--t2)] block">Verified Installs</span>
            <span className="text-2xl font-mono text-white font-semibold">
              {totalVerifiedInstalls}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-0 border-t border-[var(--line)]" />

      {/* Daily Earnings Line Chart */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Daily earnings velocity</h2>
          <span className="text-xs font-mono text-emerald-400 font-medium">
            +28.4% this week
          </span>
        </div>

        <div
          className="rounded-2xl border border-white/10 p-4 pt-6"
          style={{ backgroundColor: '#161619' }}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={DAILY_EARNINGS_DATA}
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
                tickFormatter={(val) => (isDisclosed ? `$${val}` : '••')}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1c1f',
                  borderColor: 'rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [
                  isDisclosed ? `$${Number(value).toFixed(2)}` : '••••••',
                  'Earnings',
                ]}
                labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981', stroke: '#161619', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <hr className="border-0 border-t border-[var(--line)]" />

      {/* Active Campaign Earnings Breakdown with Color Hover Interactivity */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-white">Campaign performance</h2>

        {joinedCampaigns.length > 0 ? (
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {joinedCampaigns.map((c) => {
              const s = getCampaignStats(c);
              const cTheme = getCampaignTheme(c);
              return (
                <motion.div
                  key={c.id}
                  whileHover={{ x: 4 }}
                  onClick={() => onNavigateCampaign(c.id)}
                  className="py-3.5 px-2 -mx-2 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-colors group relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 min-w-0 relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 6 }}
                      className="w-10 h-10 rounded-[22%] flex items-center justify-center text-white shrink-0 border"
                      style={{
                        backgroundColor: cTheme.secondary,
                        borderColor: hexToRgba(cTheme.primary, 0.35),
                        color: cTheme.primary,
                        boxShadow: `0 4px 12px ${hexToRgba(cTheme.primary, 0.25)}`,
                      }}
                    >
                      <Icon name={c.icon} className="w-5 h-5" />
                    </motion.div>
                    <div className="min-w-0">
                      <div className="text-base font-medium text-white truncate group-hover:text-white transition-colors">
                        {c.name}
                      </div>
                      <div className="text-xs text-[var(--t2)]">
                        {plainPay(c)} · {s.inst} verified installs
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 relative z-10">
                    <div className="text-base font-semibold text-emerald-400 font-mono">
                      {isDisclosed ? usd(s.earned) : '••••••'}
                    </div>
                    <div className="text-xs text-[var(--t2)] font-mono">
                      {(s.conv * 100).toFixed(1)}% conversion
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--t2)] py-4">
            You haven't joined any campaigns yet. Join a campaign to start earning on verified installs.
          </p>
        )}
      </section>
    </div>
  );
};

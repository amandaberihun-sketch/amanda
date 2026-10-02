import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Campaign } from '../types/campaign';
import { CampaignCard } from './CampaignCard';

interface CampaignsListProps {
  campaigns: Campaign[];
  filterTab: 'open' | 'joined';
  setFilterTab: (tab: 'open' | 'joined') => void;
  onJoin: (campaign: Campaign, targetEl?: HTMLElement) => void;
  onOpenQr: (campaign: Campaign) => void;
  onCopyLink: (campaign: Campaign) => void;
  onShare: (campaign: Campaign) => void;
  onNavigateDetail: (id: string) => void;
  onNavigateAnalytics: (id: string) => void;
}

export const CampaignsList: React.FC<CampaignsListProps> = ({
  campaigns,
  filterTab,
  setFilterTab,
  onJoin,
  onOpenQr,
  onCopyLink,
  onShare,
  onNavigateDetail,
  onNavigateAnalytics,
}) => {
  const openCampaigns = campaigns.filter((c) => !c.joined);
  const joinedCampaigns = campaigns.filter((c) => c.joined);
  const visibleCampaigns = filterTab === 'open' ? openCampaigns : joinedCampaigns;

  return (
    <div className="w-full max-w-[940px] mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-[rise_0.3s_cubic-bezier(0.2,0.8,0.2,1)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Campaigns
          </h1>
          <p className="text-sm text-[#8e8e93] mt-2">
            Vetted mobile apps with real-time attribution and guaranteed creator bounties.
          </p>
        </div>

        {/* Clean Filter Capsule: No bulky numbers on Open and Joined */}
        <div
          className="inline-flex p-1 rounded-full border border-white/5 self-start sm:self-auto relative"
          style={{ backgroundColor: '#222226' }}
          role="tablist"
          aria-label="Campaign filter"
        >
          <button
            role="tab"
            aria-selected={filterTab === 'open'}
            onClick={() => setFilterTab('open')}
            className={`relative z-10 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              filterTab === 'open' ? 'text-black' : 'text-[#8e8e93] hover:text-white'
            }`}
          >
            <span>Open</span>
            {filterTab === 'open' && (
              <motion.div
                layoutId="campaignFilterPill"
                className="absolute inset-0 bg-white rounded-full -z-10 shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
          </button>

          <button
            role="tab"
            aria-selected={filterTab === 'joined'}
            onClick={() => setFilterTab('joined')}
            className={`relative z-10 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              filterTab === 'joined' ? 'text-black' : 'text-[#8e8e93] hover:text-white'
            }`}
          >
            <span>Joined</span>
            {filterTab === 'joined' && (
              <motion.div
                layoutId="campaignFilterPill"
                className="absolute inset-0 bg-white rounded-full -z-10 shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Timeline Campaign Cards with Animated Stagger */}
      <AnimatePresence mode="wait">
        {visibleCampaigns.length > 0 ? (
          <motion.div
            key={filterTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-6 sm:space-y-7"
          >
            {visibleCampaigns.map((campaign, index) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onJoin={onJoin}
                onOpenQr={onOpenQr}
                onCopyLink={onCopyLink}
                onShare={onShare}
                onNavigateDetail={onNavigateDetail}
                onNavigateAnalytics={onNavigateAnalytics}
                redirectMode={filterTab === 'joined' ? 'analytics' : 'detail'}
                isLast={index === visibleCampaigns.length - 1}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`empty-${filterTab}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="text-center py-16 px-4 rounded-[22px] border border-white/5"
            style={{ backgroundColor: '#1e1e22' }}
          >
            <h2 className="text-xl font-medium text-white">
              {filterTab === 'open' ? 'No open campaigns' : 'Nothing joined yet'}
            </h2>
            <p className="text-sm text-[#8e8e93] mt-2 max-w-sm mx-auto">
              {filterTab === 'open'
                ? 'Check back soon for new distribution bounties.'
                : 'Join any campaign from the Open tab to get your instant tracking link and start earning.'}
            </p>
            {filterTab === 'joined' && openCampaigns.length > 0 && (
              <button
                onClick={() => setFilterTab('open')}
                className="mt-4 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#1a8cff] hover:bg-[#258cfb] transition-colors cursor-pointer"
              >
                Browse open campaigns
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

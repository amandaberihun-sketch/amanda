import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icons';
import { SmileyAvatar, AvatarMood, DEFAULT_AVATAR_PALETTE, DEFAULT_AVATAR_MOOD } from './SmileyAvatar';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationsDropdown } from './NotificationsDropdown';

interface HeaderProps {
  currentTab: 'campaigns' | 'discover' | 'earnings' | 'profile' | 'create';
  onNavigate: (tab: 'campaigns' | 'discover' | 'earnings' | 'profile' | 'create') => void;
  onCreateClick: () => void;
  onNavigateCampaign: (id: string) => void;
  avatarPalette?: string;
  avatarMood?: AvatarMood;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onCreateClick,
  onNavigateCampaign,
  avatarPalette = DEFAULT_AVATAR_PALETTE,
  avatarMood = DEFAULT_AVATAR_MOOD,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 h-16 w-full border-b transition-colors px-4 sm:px-6 flex items-center justify-between"
      style={{
        backgroundColor: 'var(--bg)',
        borderColor: 'var(--line)',
      }}
    >
      {/* Zone 1: Asterisk / Brand Logo */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.08, rotate: 12 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => onNavigate('campaigns')}
          className="w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer shadow-xs border border-white/5"
          style={{
            backgroundColor: '#1e1e22',
            color: '#1a8cff',
          }}
          aria-label="KRED home"
        >
          <Icon name="kredLogo" className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Zone 2: Navigation Pills with Smooth Sliding Indicator */}
      <nav className="flex items-center gap-2 relative" aria-label="Primary">
        <button
          onClick={() => onNavigate('campaigns')}
          className={`relative z-10 flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            currentTab === 'campaigns' ? 'text-white' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <Icon name="navCampaigns" className="w-4 h-4" />
          <span>Campaigns</span>
          {currentTab === 'campaigns' && (
            <motion.div
              layoutId="headerNavTab"
              className="absolute inset-0 bg-[#252528] border border-white/10 rounded-full -z-10 shadow-xs"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
        </button>

        <button
          onClick={() => onNavigate('discover')}
          className={`relative z-10 flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            currentTab === 'discover' ? 'text-white' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <Icon name="navDiscover" className="w-4 h-4" />
          <span>Discover</span>
          {currentTab === 'discover' && (
            <motion.div
              layoutId="headerNavTab"
              className="absolute inset-0 bg-[#252528] border border-white/10 rounded-full -z-10 shadow-xs"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
        </button>
      </nav>

      {/* Zone 3: Time, + Create campaign, Notifications & Profile with Pastel Avatar Orb */}
      <div className="flex items-center gap-2 sm:gap-3 relative">
        {/* Time display */}
        <span className="text-xs text-[#8e8e93] font-mono hidden lg:inline mr-1">
          7:44 PM GMT+3
        </span>

        {/* + Create Campaign pill */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCreateClick}
          className={`flex items-center gap-1.5 h-9 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs ${
            currentTab === 'create'
              ? 'bg-white text-black'
              : 'bg-[#1a8cff] hover:bg-[#3d9eff] text-white shadow-[0_0_12px_rgba(26,140,255,0.35)]'
          }`}
        >
          <span>+ Create campaign</span>
        </motion.button>

        {/* Notifications Bell Trigger */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors text-[#8e8e93] hover:text-white border border-white/5 cursor-pointer"
            style={{ backgroundColor: '#1e1e22' }}
            aria-label="Notifications"
          >
            <Icon name="bell" className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </motion.button>

          {/* Notifications Dropdown */}
          <NotificationsDropdown
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
            onNavigateCampaign={onNavigateCampaign}
          />
        </div>

        {/* Account Avatar Orb Button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center focus:outline-none cursor-pointer p-0.5"
            aria-label="User profile menu"
          >
            <SmileyAvatar paletteId={avatarPalette} mood={avatarMood} size={34} />
          </motion.button>

          {/* Profile Dropdown */}
          <ProfileDropdown
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            avatarPalette={avatarPalette}
            avatarMood={avatarMood}
            onNavigateProfile={() => onNavigate('profile')}
            onNavigateEarnings={() => onNavigate('earnings')}
          />
        </div>
      </div>
    </header>
  );
};

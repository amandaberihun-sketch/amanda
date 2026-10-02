import React, { useRef, useEffect } from 'react';
import { SmileyAvatar, AvatarMood, DEFAULT_AVATAR_PALETTE, DEFAULT_AVATAR_MOOD } from './SmileyAvatar';
import { Icon } from './Icons';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  avatarPalette?: string;
  avatarMood?: AvatarMood;
  onNavigateProfile: () => void;
  onNavigateEarnings: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  avatarPalette = DEFAULT_AVATAR_PALETTE,
  avatarMood = DEFAULT_AVATAR_MOOD,
  onNavigateProfile,
  onNavigateEarnings,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-white/10 shadow-2xl py-2 animate-[pop_0.18s_cubic-bezier(0.16,1,0.3,1)] select-none text-left"
      style={{ backgroundColor: '#1c1c1f' }}
    >
      {/* Top Header: Avatar Orb, Name & Email matching screenshot exactly */}
      <div className="px-4 py-3 flex items-center gap-3">
        <SmileyAvatar paletteId={avatarPalette} mood={avatarMood} size={44} />
        <div className="min-w-0">
          <div className="text-base font-semibold text-white tracking-tight leading-snug truncate">
            nhatty
          </div>
          <div className="text-xs text-[var(--t2)] truncate">
            nathanielber8@gmail.com
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 my-1" />

      {/* Menu Actions */}
      <div className="py-1">
        <button
          onClick={() => {
            onNavigateProfile();
            onClose();
          }}
          className="w-full px-4 py-2.5 text-sm font-medium text-[var(--t1)] hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer"
        >
          <span>View Profile</span>
          <span className="text-[var(--t3)] group-hover:text-[var(--t1)] text-xs font-mono">&gt;</span>
        </button>

        {/* Earning in the dropdown: only 'Earnings', no payouts, no disclosed balance */}
        <button
          onClick={() => {
            onNavigateEarnings();
            onClose();
          }}
          className="w-full px-4 py-2.5 text-sm font-medium text-[var(--t1)] hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span>Earnings</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[var(--t3)] group-hover:text-[var(--t1)] text-xs font-mono">&gt;</span>
        </button>

        <button
          onClick={() => {
            onNavigateProfile();
            onClose();
          }}
          className="w-full px-4 py-2.5 text-sm font-medium text-[var(--t1)] hover:bg-white/5 transition-colors text-left cursor-pointer"
        >
          Settings
        </button>
      </div>

      <div className="border-t border-white/10 my-1" />

      {/* Sign Out with Red Color and Icon */}
      <div className="py-1">
        <button
          onClick={() => {
            onClose();
          }}
          className="w-full px-4 py-2 text-sm font-medium text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 text-left cursor-pointer"
        >
          <Icon name="logout" className="w-4 h-4 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

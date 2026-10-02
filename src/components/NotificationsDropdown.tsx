import React, { useRef, useEffect } from 'react';
import { Icon } from './Icons';

interface NotificationEntry {
  id: string;
  host: string;
  action: string;
  target: string;
  date: string;
  body?: string;
  type: 'campaign' | 'money';
  badgeColor: string;
  hostInitial: string;
  hostBg: string;
  thumbIcon: string;
  thumbBg: string;
  campaignId: string;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateCampaign: (id: string) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  onNavigateCampaign,
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

  const NOTIFICATIONS: NotificationEntry[] = [
    {
      id: 'notif-1',
      host: 'Maison des Beaux-Arts',
      action: 'invited you to',
      target: 'Atelier Craft: Creator Distribution',
      date: 'Sep 30',
      body: 'Hey creators, applications for verified installs are now open paying $3.20 per install with immediate attribution.',
      type: 'campaign',
      badgeColor: '#7c3aed',
      hostInitial: 'M',
      hostBg: '#1e1b4b',
      thumbIcon: 'spark',
      thumbBg: '#4f46e5',
      campaignId: 'atelier',
    },
    {
      id: 'notif-2',
      host: 'Studio Linguae',
      action: 'credited payout for',
      target: 'Tessera Installs',
      date: 'Sep 29',
      body: '14 verified installs from your custom tracking link finished their onboarding. $33.60 added to balance.',
      type: 'money',
      badgeColor: '#059669',
      hostInitial: 'S',
      hostBg: '#064e3b',
      thumbIcon: 'book',
      thumbBg: '#0284c7',
      campaignId: 'tessera',
    },
    {
      id: 'notif-3',
      host: 'Ledger & Co',
      action: 'updated bounty on',
      target: 'Pennywise Pro',
      date: 'Sep 27',
      body: 'New 15% recurring tier activated for creator links through this month.',
      type: 'money',
      badgeColor: '#d97706',
      hostInitial: 'P',
      hostBg: '#451a03',
      thumbIcon: 'wallet',
      thumbBg: '#d97706',
      campaignId: 'pennywise',
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute right-0 sm:right-6 top-12 z-50 w-[350px] sm:w-[400px] max-h-[500px] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl animate-[pop_0.18s_cubic-bezier(0.16,1,0.3,1)] select-none text-left p-3 space-y-2"
      style={{ backgroundColor: '#1c1c1f' }}
    >
      <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-white/10">
        <span className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
          Notifications
        </span>
        <button
          onClick={onClose}
          className="text-xs text-[var(--t2)] hover:text-white transition-colors"
        >
          Mark all read
        </button>
      </div>

      <div className="space-y-1">
        {NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              onNavigateCampaign(n.campaignId);
              onClose();
            }}
            className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3 group"
          >
            {/* Left: Host Avatar with mini bottom-right badge matching Screenshot 2 */}
            <div className="relative shrink-0 mt-0.5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                style={{ backgroundColor: n.hostBg }}
              >
                {n.hostInitial}
              </div>
              {/* Mini corner badge */}
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white border-2 border-[#1c1c1f]"
                style={{ backgroundColor: n.badgeColor }}
              >
                <Icon
                  name={n.type === 'money' ? 'money' : 'navCampaigns'}
                  className="w-2.5 h-2.5"
                />
              </div>
            </div>

            {/* Middle: Text details */}
            <div className="flex-1 min-w-0">
              <div className="text-xs leading-snug">
                <span className="font-semibold text-white">{n.host}</span>{' '}
                <span className="text-[var(--t2)]">{n.action}</span>{' '}
                <span className="font-semibold text-white">{n.target}</span>{' '}
                <span className="text-[var(--t3)] text-[11px] font-mono ml-1">{n.date}</span>
              </div>

              {n.body && (
                <p className="text-xs text-[var(--t2)] mt-1 leading-relaxed line-clamp-3">
                  {n.body}
                </p>
              )}
            </div>

            {/* Right: Square app artwork thumbnail matching Screenshot 2 */}
            <div
              className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
              style={{ backgroundColor: n.thumbBg }}
            >
              <Icon name={n.thumbIcon} className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

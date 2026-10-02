import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Campaign } from './types/campaign';
import { INITIAL_CAMPAIGNS, linkOf } from './data/campaigns';
import { Header } from './components/Header';
import { CampaignsList } from './components/CampaignsList';
import { DiscoverView } from './components/DiscoverView';
import { CampaignDetail } from './components/CampaignDetail';
import { CampaignAnalyticsView } from './components/CampaignAnalyticsView';
import { EarningsView } from './components/EarningsView';
import { ProfileView } from './components/ProfileView';
import { CreateCampaignView } from './components/CreateCampaignView';
import { QrCodeModal } from './components/QrCodeModal';
import { Toast } from './components/Toast';
import { Confetti } from './components/Confetti';
import {
  AvatarMood,
  DEFAULT_AVATAR_PALETTE,
  DEFAULT_AVATAR_MOOD,
} from './components/SmileyAvatar';
import { getCampaignTheme } from './utils/campaignTheme';

const STORAGE_KEY = 'kred_campaigns_app_v6';

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.campaigns) && parsed.campaigns.length > 0) {
          return parsed.campaigns;
        }
      }
    } catch (e) {
      console.warn('Failed to load campaigns from storage', e);
    }
    return INITIAL_CAMPAIGNS;
  });

  // Profile avatar orb palette and mood
  const [avatarPalette, setAvatarPalette] = useState<string>(() => {
    try {
      return localStorage.getItem('kred_avatar_palette') || DEFAULT_AVATAR_PALETTE;
    } catch {
      return DEFAULT_AVATAR_PALETTE;
    }
  });

  const [avatarMood, setAvatarMood] = useState<AvatarMood>(() => {
    try {
      return (localStorage.getItem('kred_avatar_mood') as AvatarMood) || DEFAULT_AVATAR_MOOD;
    } catch {
      return DEFAULT_AVATAR_MOOD;
    }
  });

  const handleSelectPalette = (pal: string) => {
    setAvatarPalette(pal);
    try {
      localStorage.setItem('kred_avatar_palette', pal);
    } catch {}
  };

  const handleSelectMood = (mood: AvatarMood) => {
    setAvatarMood(mood);
    try {
      localStorage.setItem('kred_avatar_mood', mood);
    } catch {}
  };

  // Ambient profile color for user
  const [ambientColor] = useState<string>('#252528');

  // Navigation tabs: 'campaigns' | 'discover' | 'earnings' | 'profile' | 'create'
  const [currentTab, setCurrentTab] = useState<'campaigns' | 'discover' | 'earnings' | 'profile' | 'create'>('campaigns');
  // Campaign Filter: strictly 'open' | 'joined'
  const [filterTab, setFilterTab] = useState<'open' | 'joined'>('open');
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);
  const [activeAnalyticsId, setActiveAnalyticsId] = useState<string | null>(null);

  // Modals & Feedback
  const [qrCampaign, setQrCampaign] = useState<Campaign | null>(null);
  const [isFreshJoin, setIsFreshJoin] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confettiOrigin, setConfettiOrigin] = useState<{ x: number; y: number } | null>(null);
  const [confettiColors, setConfettiColors] = useState<string[] | undefined>(undefined);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          campaigns,
        })
      );
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  }, [campaigns]);

  // Handle URL Hash Routing
  const parseHash = useCallback(() => {
    const hash = window.location.hash || '#/';
    if (hash.startsWith('#/analytics/')) {
      const id = hash.replace('#/analytics/', '');
      setActiveAnalyticsId(id);
      setActiveDetailId(null);
    } else if (hash.startsWith('#/c/')) {
      const id = hash.replace('#/c/', '');
      setActiveDetailId(id);
      setActiveAnalyticsId(null);
    } else if (hash.startsWith('#/create')) {
      setActiveDetailId(null);
      setActiveAnalyticsId(null);
      setCurrentTab('create');
    } else if (hash.startsWith('#/discover')) {
      setActiveDetailId(null);
      setActiveAnalyticsId(null);
      setCurrentTab('discover');
    } else if (hash.startsWith('#/earnings')) {
      setActiveDetailId(null);
      setActiveAnalyticsId(null);
      setCurrentTab('earnings');
    } else if (hash.startsWith('#/profile')) {
      setActiveDetailId(null);
      setActiveAnalyticsId(null);
      setCurrentTab('profile');
    } else {
      setActiveDetailId(null);
      setActiveAnalyticsId(null);
      setCurrentTab('campaigns');
    }
  }, []);

  useEffect(() => {
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, [parseHash]);

  const handleNavigateTab = (tab: 'campaigns' | 'discover' | 'earnings' | 'profile' | 'create') => {
    setActiveDetailId(null);
    setActiveAnalyticsId(null);
    setCurrentTab(tab);
    if (tab === 'discover') {
      window.location.hash = '#/discover';
    } else if (tab === 'earnings') {
      window.location.hash = '#/earnings';
    } else if (tab === 'profile') {
      window.location.hash = '#/profile';
    } else if (tab === 'create') {
      window.location.hash = '#/create';
    } else {
      window.location.hash = '#/';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateDetail = (id: string) => {
    setActiveAnalyticsId(null);
    setActiveDetailId(id);
    window.location.hash = `#/c/${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAnalytics = (id: string) => {
    setActiveDetailId(null);
    setActiveAnalyticsId(id);
    window.location.hash = `#/analytics/${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setActiveDetailId(null);
    setActiveAnalyticsId(null);
    window.location.hash =
      currentTab === 'discover'
        ? '#/discover'
        : currentTab === 'earnings'
        ? '#/earnings'
        : currentTab === 'profile'
        ? '#/profile'
        : currentTab === 'create'
        ? '#/create'
        : '#/';
  };

  // Join Campaign Flow
  const handleJoin = (campaign: Campaign, targetEl?: HTMLElement) => {
    const cTheme = getCampaignTheme(campaign);
    setConfettiColors([
      cTheme.primary,
      cTheme.accentHover,
      '#ffffff',
      cTheme.secondary,
      '#fcd34d',
    ]);

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      setConfettiOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      setConfettiOrigin({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    }

    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaign.id ? { ...c, joined: true, creators: c.creators + 1 } : c
      )
    );

    setIsFreshJoin(true);
    setQrCampaign(campaign);
    setToastMessage(`Joined ${campaign.name}! Tracking link ready.`);
  };

  // Copy Link Handler
  const handleCopyLink = async (campaign: Campaign) => {
    const url = `https://${linkOf(campaign)}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setToastMessage('Link copied');
    } catch {
      setToastMessage(`Link: ${linkOf(campaign)}`);
    }
  };

  // Share Handler
  const handleShare = async (campaign: Campaign) => {
    const url = `https://${linkOf(campaign)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.name,
          text: `Try ${campaign.name}`,
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink(campaign);
    }
  };

  // Create Campaign Callback
  const handleCreateCampaign = (newCamp: Campaign) => {
    setCampaigns((prev) => [newCamp, ...prev]);
    setToastMessage(`Campaign launched! Attribution live.`);
    handleNavigateTab('campaigns');
  };

  const activeCampaign = activeDetailId
    ? campaigns.find((c) => c.id === activeDetailId) || null
    : null;

  const activeAnalyticsCampaign = activeAnalyticsId
    ? campaigns.find((c) => c.id === activeAnalyticsId) || null
    : null;

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden">
        {/* Clean top hairline linear accent (strictly linear without heavy glow) */}
        <div
          className="pointer-events-none fixed top-0 left-0 right-0 h-[1.5px] -z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          }}
        />

        <Header
          currentTab={currentTab}
          onNavigate={handleNavigateTab}
          onCreateClick={() => handleNavigateTab('create')}
          onNavigateCampaign={handleNavigateDetail}
          avatarPalette={avatarPalette}
          avatarMood={avatarMood}
        />

        <main className="flex-1">
          {activeAnalyticsCampaign ? (
            <CampaignAnalyticsView
              campaign={activeAnalyticsCampaign}
              onBack={() => {
                setActiveAnalyticsId(null);
                setFilterTab('joined');
                handleNavigateTab('campaigns');
              }}
              onOpenQr={(c) => {
                setIsFreshJoin(false);
                setQrCampaign(c);
              }}
              onCopyLink={handleCopyLink}
              onShare={handleShare}
            />
          ) : activeCampaign ? (
            <CampaignDetail
              campaign={activeCampaign}
              allCampaigns={campaigns}
              onJoin={handleJoin}
              onOpenQr={(c) => {
                setIsFreshJoin(false);
                setQrCampaign(c);
              }}
              onCopyLink={handleCopyLink}
              onShare={handleShare}
              onNavigateDetail={handleNavigateDetail}
              onNavigateAnalytics={handleNavigateAnalytics}
              onBack={handleBackFromDetail}
            />
          ) : currentTab === 'create' ? (
            <CreateCampaignView
              onBack={() => handleNavigateTab('campaigns')}
              onCreate={handleCreateCampaign}
            />
          ) : currentTab === 'discover' ? (
            <DiscoverView
              campaigns={campaigns}
              onJoin={handleJoin}
              onNavigateDetail={handleNavigateDetail}
              onSelectCategory={() => {
                handleNavigateTab('campaigns');
              }}
            />
          ) : currentTab === 'earnings' ? (
            <EarningsView
              campaigns={campaigns}
              onNavigateCampaign={handleNavigateDetail}
              onBack={() => handleNavigateTab('campaigns')}
            />
          ) : currentTab === 'profile' ? (
            <ProfileView
              onBack={() => handleNavigateTab('campaigns')}
              onNavigateEarnings={() => handleNavigateTab('earnings')}
              avatarPalette={avatarPalette}
              avatarMood={avatarMood}
              onSelectPalette={handleSelectPalette}
              onSelectMood={handleSelectMood}
              campaigns={campaigns}
              onNavigateCampaign={handleNavigateDetail}
              onNavigateAnalytics={handleNavigateAnalytics}
              onJoin={handleJoin}
              onOpenQr={(c) => {
                setIsFreshJoin(false);
                setQrCampaign(c);
              }}
              onCopyLink={handleCopyLink}
              onShare={handleShare}
            />
          ) : (
            <CampaignsList
              campaigns={campaigns}
              filterTab={filterTab}
              setFilterTab={setFilterTab}
              onJoin={handleJoin}
              onOpenQr={(c) => {
                setIsFreshJoin(false);
                setQrCampaign(c);
              }}
              onCopyLink={handleCopyLink}
              onShare={handleShare}
              onNavigateDetail={handleNavigateDetail}
              onNavigateAnalytics={handleNavigateAnalytics}
            />
          )}
        </main>

        {/* Modals & Overlays */}
        <QrCodeModal
          campaign={qrCampaign}
          isOpen={!!qrCampaign}
          onClose={() => setQrCampaign(null)}
          onCopy={handleCopyLink}
          onShare={handleShare}
          isFreshJoin={isFreshJoin}
        />

        <Confetti
          origin={confettiOrigin}
          colors={confettiColors}
          onComplete={() => {
            setConfettiOrigin(null);
            setConfettiColors(undefined);
          }}
        />

        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
    </ThemeProvider>
  );
}

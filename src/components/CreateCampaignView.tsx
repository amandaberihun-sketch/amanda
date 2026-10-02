import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Campaign, PayoutType } from '../types/campaign';
import { HP } from '../data/campaigns';
import { Icon } from './Icons';

interface CreateCampaignViewProps {
  onBack: () => void;
  onCreate: (campaign: Campaign) => void;
}

const SAMPLE_POSTERS = [
  { bg: '#fbbf24', text: '#000000', label: "YOU'RE ON THE GUEST-LIST*" },
  { bg: '#10b981', text: '#ffffff', label: 'DESIGN CRAFT STUDIO 2026' },
  { bg: '#3b82f6', text: '#ffffff', label: 'AGENTIC MOBILE EXPERIENCES' },
  { bg: '#8b5cf6', text: '#ffffff', label: 'CREATOR DISTRIBUTION BOUNTY' },
  { bg: '#ec4899', text: '#ffffff', label: 'EXPEDITION TO NEW USERS' },
];

export const CreateCampaignView: React.FC<CreateCampaignViewProps> = ({
  onBack,
  onCreate,
}) => {
  // Campaign Form State (compacted exactly matching Screenshot 2026-09-13 150248.png)
  const [name, setName] = useState('');
  const [playStoreUrl, setPlayStoreUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);

  // Poster & Theme
  const [posterIdx, setPosterIdx] = useState(0);
  const [themeMode, setThemeMode] = useState<'Minimal' | 'Vibrant' | 'Midnight'>('Minimal');

  // Dates & Duration
  const [startDate, setStartDate] = useState('Thu, Oct 01');
  const [startTime, setStartTime] = useState('09:30 AM');
  const [durationDays, setDurationDays] = useState('30 days');

  // Options
  const [requireSdk, setRequireSdk] = useState(true);
  const [targetBudget, setTargetBudget] = useState('1,500');

  // Settlement & Bounty Sub-Page State ("when you click the money the others pages comes with it")
  const [settlementTab, setSettlementTab] = useState<'acquisition' | 'sdk' | 'settlement'>('acquisition');
  const [payoutType, setPayoutType] = useState<PayoutType>('fixed');
  const [cpiRate, setCpiRate] = useState('3.20');
  const [pctRate, setPctRate] = useState('15');
  const [sdkStatus, setSdkStatus] = useState<'idle' | 'checking' | 'verified'>('idle');
  const [sdkLogs, setSdkLogs] = useState<string[]>([]);
  const [sdkPlatform, setSdkPlatform] = useState<'android' | 'ios' | 'reactNative'>('android');

  // Extraction feedback
  const [extractedCategory, setExtractedCategory] = useState('Art and design');
  const [extractedHost, setExtractedHost] = useState('Maison des Beaux-Arts');
  const [extractedIcon, setExtractedIcon] = useState<Campaign['icon']>('spark');

  // Auto extract when Play Store link is entered
  const handlePlayStoreChange = (val: string) => {
    setPlayStoreUrl(val);
    if (val.includes('id=')) {
      const packageId = val.split('id=')[1].split('&')[0];
      if (packageId.includes('atelier')) {
        setName('Atelier Studio');
        setExtractedHost('Maison des Beaux-Arts');
        setExtractedCategory('Art and design');
        setExtractedIcon('spark');
        setDesc('Professional studio app for artists to plan, sketch, and share work from their phone.');
      } else if (packageId.includes('lingua') || packageId.includes('learn')) {
        setName('Lingua Flow');
        setExtractedHost('Hyperglot Labs');
        setExtractedCategory('Education');
        setExtractedIcon('book');
        setDesc('Accelerated language immersion through interactive dialogues and voice AI.');
      } else if (packageId.includes('wallet') || packageId.includes('finance')) {
        setName('Nova Ledger');
        setExtractedHost('Fintech Foundry');
        setExtractedCategory('Finance');
        setExtractedIcon('wallet');
        setDesc('Zero-knowledge encrypted cash flow tracking and recurring bill forecasting.');
      } else {
        const rawName = packageId.split('.')[1] || 'Mobile App';
        setName(rawName.charAt(0).toUpperCase() + rawName.slice(1));
      }
    }
  };

  const handleShufflePoster = () => {
    setPosterIdx((prev) => (prev + 1) % SAMPLE_POSTERS.length);
  };

  const handleVerifySdk = () => {
    setSdkStatus('checking');
    setSdkLogs(['Connecting to KRED Attribution Gateway (wss://gateway.kred.me/live)...']);
    setTimeout(() => {
      setSdkLogs((prev) => [
        ...prev,
        'Listening for device handshake on app token kred_live_79a4e21b8c...',
      ]);
    }, 500);
    setTimeout(() => {
      setSdkLogs((prev) => [
        ...prev,
        'Handshake ping detected from Android device (Pixel 9 Pro)...',
        'SDK Version: v2.4.0 verified.',
        'Deep link attribution confirmed (kred.me/c/app -> package launch).',
        'Attribution ledger ready for verified creator traffic.',
      ]);
      setSdkStatus('verified');
    }, 1200);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'New Campaign';
    const id = finalName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) || `camp_${Date.now()}`;
    const fixedVal = parseFloat(cpiRate) || 3.2;

    const newCampaign: Campaign = {
      id,
      name: finalName,
      host: extractedHost,
      cat: extractedCategory,
      icon: extractedIcon,
      rate: { t: 'fixed', v: fixedVal },
      pay: `<b>$${fixedVal.toFixed(2)}</b> per verified install`,
      posted: 'Just now',
      days: 30,
      creators: 1,
      rating: '4.8',
      rc: '1.2K',
      share: 0,
      desc: desc || 'Promote this mobile app to your patrons and earn a fixed bounty for every verified install.',
      joined: false,
      hue: HP[posterIdx % HP.length],
    };

    onCreate(newCampaign);
  };

  const currentPoster = SAMPLE_POSTERS[posterIdx];

  return (
    <div className="w-full max-w-[960px] mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-[rise_0.25s_cubic-bezier(0.2,0.8,0.2,1)] select-none">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--t2)] mb-6" aria-label="Breadcrumb">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 hover:text-white transition-colors group cursor-pointer"
        >
          <Icon name="navCampaigns" className="w-4 h-4 text-[#8e8e93] group-hover:text-white" />
          <span>Campaigns</span>
        </button>
        <span className="text-[#636366] font-mono select-none">&gt;</span>
        <div className="flex items-center gap-1.5 text-white font-medium">
          <Icon name="plus" className="w-4 h-4 text-[#1a8cff]" />
          <span>Create Campaign</span>
        </div>
      </nav>

      {/* Main Two-Column Layout directly matching Screenshot 1 (Screenshot 2026-09-13 150248.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: SQUARE ARTWORK POSTER & THEME DROPDOWN       */}
        {/* ========================================================= */}
        <div className="space-y-4">
          {/* Square Artwork Poster */}
          <motion.div
            key={posterIdx}
            initial={{ scale: 0.96, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-full aspect-square rounded-[24px] flex flex-col justify-between p-6 shadow-2xl relative overflow-hidden transition-all duration-300 border border-white/10"
            style={{
              backgroundColor: currentPoster.bg,
              color: currentPoster.text,
            }}
          >
            <div className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none max-w-[200px]">
              {name ? name.toUpperCase() : currentPoster.label}
            </div>

            <div className="flex items-end justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest font-mono">
                {extractedHost.toUpperCase()}
              </span>

              {/* Photo icon circle in corner from Screenshot 1 */}
              <motion.button
                whileHover={{ scale: 1.15, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleShufflePoster}
                className="w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center transition-transform cursor-pointer"
                title="Shuffle Poster Art"
              >
                <Icon name="camera" className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Theme Pill & Shuffle Action from Screenshot 1 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-11 px-3.5 rounded-xl border border-white/10 bg-[#161619] flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-md border border-white/20 bg-white/10" />
                <div className="text-left">
                  <span className="text-[10px] text-[#8e8e93] block leading-none">Theme</span>
                  <span className="font-semibold text-white leading-tight">{themeMode}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setThemeMode((m) =>
                    m === 'Minimal' ? 'Vibrant' : m === 'Vibrant' ? 'Midnight' : 'Minimal'
                  );
                }}
                className="text-xs text-[#8e8e93] hover:text-white cursor-pointer"
              >
                ⇕
              </button>
            </div>

            <motion.button
              whileHover={{ rotate: 90, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={handleShufflePoster}
              className="w-11 h-11 rounded-xl border border-white/10 bg-[#161619] hover:bg-white/5 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Shuffle palette"
            >
              <Icon name="spark" className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: SHORT & COMPACT FORM (FROM SCREENSHOT 1)    */}
        {/* ========================================================= */}
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {/* Header Pills: Personal Calendar & Public dropdowns */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-[#161619] text-xs text-white font-medium">
              <span className="w-3.5 h-3.5 rounded-full bg-[#1a8cff]" />
              <span>Personal Workspace ⌄</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-[#161619] text-xs text-white font-medium">
              <Icon name="globe" className="w-3 h-3 text-[#8e8e93]" />
              <span>Public ⌄</span>
            </div>
          </div>

          {/* Campaign / Event Name Input */}
          <div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Campaign / App Name"
              className="w-full text-2xl sm:text-3xl font-bold tracking-tight text-white bg-transparent placeholder-[#636366] focus:outline-none py-1"
            />
          </div>

          {/* Compact Date & Duration Card from Screenshot 1 */}
          <div className="p-3.5 rounded-xl border border-white/10 bg-[#161619] grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-white/40" />
                <span className="text-[#8e8e93] w-10">Start</span>
                <span className="font-semibold text-white font-mono">{startDate}</span>
                <span className="font-semibold text-white font-mono">{startTime}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full border border-white/40" />
                <span className="text-[#8e8e93] w-10">End</span>
                <span className="font-semibold text-white font-mono">{durationDays} later</span>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-white/10 sm:pl-3.5 text-xs text-[#8e8e93] font-mono">
              <div className="text-white font-semibold flex items-center justify-end gap-1">
                <Icon name="globe" className="w-3 h-3 text-[#8e8e93]" />
                <span>Worldwide</span>
              </div>
              <span className="text-[11px]">UTC+3 / Automatic</span>
            </div>
          </div>

          {/* Location row: Google Play Store link with metadata extraction */}
          <div className="p-3.5 rounded-xl border border-white/10 bg-[#161619] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <Icon name="play" className="w-4 h-4 text-[#8e8e93] shrink-0" fill />
              <input
                type="text"
                value={playStoreUrl}
                onChange={(e) => handlePlayStoreChange(e.target.value)}
                placeholder="Google Play Store Link (extracts metadata & screenshots)"
                className="w-full bg-transparent text-white placeholder-[#636366] focus:outline-none font-mono text-xs truncate"
              />
            </div>

            {playStoreUrl && (
              <span className="text-emerald-400 font-mono text-[11px] shrink-0">
                ✓ Extracted
              </span>
            )}
          </div>

          {/* Description Trigger from Screenshot 1 */}
          <div
            onClick={() => setIsDescModalOpen(true)}
            className="p-3.5 rounded-xl border border-white/10 bg-[#161619] hover:bg-white/5 flex items-center justify-between text-xs text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon name="book" className="w-4 h-4 text-[#8e8e93]" />
              <span className={desc ? 'text-white truncate' : 'text-[#8e8e93]'}>
                {desc ? desc : 'Add Description'}
              </span>
            </div>
            <span className="text-xs text-[#8e8e93] font-mono">✎</span>
          </div>

          {/* Event Options Header */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-[#8e8e93] block mb-2">
              Campaign Options
            </span>

            <div className="rounded-xl border border-white/10 bg-[#161619] divide-y divide-white/5 text-xs">
              {/* Row 1: Bounty Rate / Settlement (Clicking this opens the Settlement & SDK pages!) */}
              <div
                onClick={() => setIsSettlementOpen(true)}
                className="p-3.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                title="Click to configure bounty payout rate, SDK check, and settlement"
              >
                <div className="flex items-center gap-2.5">
                  <Icon name="money" className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-medium">Bounty Rate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white font-mono">
                    ${parseFloat(cpiRate).toFixed(2)} / verified install
                  </span>
                  <span className="text-xs text-[#1a8cff] font-mono">✎</span>
                </div>
              </div>

              {/* Row 2: Require SDK Handshake Verification */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Icon name="check" className="w-4 h-4 text-[#8e8e93]" />
                  <div>
                    <span className="text-white font-medium block">Require SDK Verification</span>
                    <span className="text-[10px] text-[#8e8e93]">Automated attribution handshake</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireSdk(!requireSdk)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    requireSdk ? 'bg-[#1a8cff]' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      requireSdk ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Row 3: Target Capacity / Budget */}
              <div
                onClick={() => setIsSettlementOpen(true)}
                className="p-3.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Icon name="sliders" className="w-4 h-4 text-[#8e8e93]" />
                  <span className="text-white font-medium">Escrow Budget</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-white font-semibold">${targetBudget}</span>
                  <span className="text-[#8e8e93]">(~468 installs)</span>
                  <span className="text-xs text-[#8e8e93]">✎</span>
                </div>
              </div>
            </div>
          </div>

          {/* Big Solid White Create Button from Screenshot 1 */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-white hover:bg-zinc-200 active:scale-[0.99] text-black font-bold text-sm transition-all cursor-pointer shadow-lg"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================= */}
      {/* POPUP MODAL: ADD DESCRIPTION (FROM SCREENSHOT 8)          */}
      {/* ========================================================= */}
      {isDescModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 p-5 space-y-4 shadow-2xl relative"
            style={{ backgroundColor: '#1c1c1f' }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Event Description
              </h3>
              <button
                type="button"
                onClick={() => setIsDescModalOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-[#8e8e93] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <textarea
              rows={5}
              autoFocus
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Who should come? What's the event about? (What problem does this app solve? Who is your ideal user?)"
              className="w-full p-3 rounded-xl border border-white/10 bg-transparent text-sm text-white placeholder-[#636366] focus:border-[#1a8cff] focus:outline-none"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setDesc(
                    `${name || 'Atelier'} is a studio app for creators to sketch, plan, and organize workflows on mobile. Promote it to your patrons and earn a verified payout per install.`
                  );
                }}
                className="text-xs text-[#1a8cff] hover:text-[#3d9eff] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Icon name="spark" className="w-3.5 h-3.5" />
                <span>Suggest with AI</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDescModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DRAWER / SUB-PAGE: BOUNTY, SDK CHECK & SETTLEMENT         */}
      {/* "when you click the money the others pages comes with it" */}
      {/* ========================================================= */}
      {isSettlementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 p-6 space-y-6 shadow-2xl relative"
            style={{ backgroundColor: '#141416' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Bounty Rate, SDK Handshake &amp; Settlement
                </h3>
                <p className="text-xs text-[#8e8e93]">
                  Configure payout rules, verify attribution SDK, and deposit escrow.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSettlementOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sub-Tabs: 1. Acquisition Rate | 2. SDK Check | 3. Settlement */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              {[
                { id: 'acquisition', label: '1. Payout Rate & Budget' },
                { id: 'sdk', label: '2. SDK Handshake Check' },
                { id: 'settlement', label: '3. Escrow Settlement' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSettlementTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    settlementTab === t.id
                      ? 'bg-white text-black shadow-xs'
                      : 'text-[#8e8e93] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* SUB-TAB 1: ACQUISITION / PAYOUT */}
            {settlementTab === 'acquisition' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">
                      Creator Bounty Rate ($)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      value={cpiRate}
                      onChange={(e) => setCpiRate(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-white/10 bg-transparent text-sm text-white font-mono focus:border-[#1a8cff] focus:outline-none"
                    />
                    <span className="text-[11px] text-[#8e8e93] mt-1 block">
                      Paid upon verified app install.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">
                      Total Escrow Budget ($)
                    </label>
                    <input
                      type="text"
                      value={targetBudget}
                      onChange={(e) => setTargetBudget(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-white/10 bg-transparent text-sm text-white font-mono focus:border-[#1a8cff] focus:outline-none"
                    />
                    <span className="text-[11px] text-[#8e8e93] mt-1 block">
                      Target ~{Math.floor(parseFloat(targetBudget.replace(',', '')) / parseFloat(cpiRate))} verified users.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSettlementTab('sdk')}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1a8cff] hover:bg-[#258cfb] cursor-pointer"
                  >
                    Next: SDK Handshake Check &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: SDK CHECK */}
            {settlementTab === 'sdk' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl border border-white/10 bg-[#161619] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">SDK Connection Status</span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        sdkStatus === 'verified'
                          ? 'text-emerald-400'
                          : sdkStatus === 'checking'
                          ? 'text-amber-400'
                          : 'text-[#8e8e93]'
                      }`}
                    >
                      {sdkStatus === 'verified'
                        ? '● Handshake Verified'
                        : sdkStatus === 'checking'
                        ? '◷ Listening for Ping…'
                        : '○ Unverified'}
                    </span>
                  </div>

                  <p className="text-xs text-[#8e8e93]">
                    Install <code className="text-white">com.kred.sdk:attribution:2.4.0</code> in your Android or iOS project and tap Verify below.
                  </p>

                  <button
                    type="button"
                    onClick={handleVerifySdk}
                    disabled={sdkStatus === 'checking'}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#1a8cff] hover:bg-[#258cfb] transition-all cursor-pointer"
                  >
                    {sdkStatus === 'checking'
                      ? 'Listening for Ping…'
                      : sdkStatus === 'verified'
                      ? 'Re-test Handshake'
                      : 'Test SDK Handshake'}
                  </button>
                </div>

                {sdkLogs.length > 0 && (
                  <div className="p-3 rounded-xl bg-black/80 border border-white/5 font-mono text-[11px] text-[#9ca3af] space-y-1">
                    {sdkLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[#1a8cff]">&gt;</span>
                        <span className={log.includes('verified') ? 'text-emerald-400 font-bold' : ''}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setSettlementTab('acquisition')}
                    className="text-xs text-[#8e8e93] hover:text-white cursor-pointer"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettlementTab('settlement')}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1a8cff] hover:bg-[#258cfb] cursor-pointer"
                  >
                    Next: Escrow Settlement &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: SETTLEMENT */}
            {settlementTab === 'settlement' && (
              <div className="space-y-4">
                <div className="divide-y divide-white/10 border-y border-white/10 py-2 text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#8e8e93]">Deposit Amount:</span>
                    <span className="text-white font-mono font-semibold">${targetBudget}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#8e8e93]">Platform Fee:</span>
                    <span className="text-emerald-400 font-mono font-semibold">$0.00 (Launch Promotion)</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#8e8e93]">Refund Policy:</span>
                    <span className="text-white">100% of unspent escrow refundable</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-white/10 bg-[#161619] flex items-center justify-between text-xs">
                  <span className="text-white font-medium">Chase Corporate Checking •••• 4821</span>
                  <span className="text-emerald-400 font-mono">Ready</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsSettlementOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Save &amp; Return to Campaign
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

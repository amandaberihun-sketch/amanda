import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Campaign } from '../types/campaign';
import { CATEGORIES, CATEGORY_GROUPS, perInstall, usd, plainPay } from '../data/campaigns';
import { Icon } from './Icons';
import { getCampaignTheme, hexToRgba } from '../utils/campaignTheme';

interface DiscoverViewProps {
  campaigns: Campaign[];
  onJoin: (campaign: Campaign, targetEl?: HTMLElement) => void;
  onNavigateDetail: (id: string) => void;
  onSelectCategory: (cat: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Art and design': 'camera',
  'Music': 'music',
  'Social': 'chat',
  'Productivity': 'bolt',
  'Education': 'book',
  'Finance': 'wallet',
  'Health': 'heart',
  'Travel': 'map',
  'Games': 'game',
};

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  campaigns,
  onJoin,
  onNavigateDetail,
  onSelectCategory,
}) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [isStageHovered, setIsStageHovered] = useState(false);

  const featured = campaigns.filter((c) => !c.joined).slice(0, 4);
  const currentFeatured = featured[slideIdx] || campaigns[0];
  const nextFeatured = featured[(slideIdx + 1) % featured.length] || campaigns[1];

  const currentTheme = getCampaignTheme(currentFeatured);

  useEffect(() => {
    if (isPaused || featured.length <= 1) return;
    const interval = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, featured.length]);

  // Search filtering
  const isFiltering = searchQuery.trim() !== '' || activeCat !== 'All';
  const filteredResults = isFiltering
    ? campaigns.filter((c) => {
        if (activeCat !== 'All' && c.cat !== activeCat) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            c.name.toLowerCase().includes(q) ||
            c.host.toLowerCase().includes(q) ||
            c.cat.toLowerCase().includes(q)
          );
        }
        return true;
      })
    : null;

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-[rise_0.3s_cubic-bezier(0.2,0.8,0.2,1)] space-y-12">
      {/* Search Bar with smooth focus transitions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-medium tracking-tight text-[var(--t1)] self-start sm:self-auto">
          Discover
        </h1>

        <div
          className="flex items-center gap-2.5 px-4 h-11 rounded-full w-full sm:w-80 border transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-[var(--bg)]"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--line)',
          }}
        >
          <Icon name="search" className="w-4 h-4 text-[var(--t2)] shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns or hosts"
            className="w-full bg-transparent text-sm text-[var(--t1)] placeholder:text-[var(--t2)] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[var(--t2)] hover:text-[var(--t1)] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Chips Bar */}
      {isFiltering && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`h-[34px] px-3.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeCat === cat
                  ? 'bg-[var(--inv)] text-[var(--ton)] shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--t1)] hover:bg-[var(--hover)]'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCat('All');
            }}
            className="text-xs text-[var(--blue)] px-2 hover:underline whitespace-nowrap cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {filteredResults ? (
        /* Filtered Grid with Campaign Color Accents */
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-[var(--t1)]">
            {filteredResults.length} campaign{filteredResults.length === 1 ? '' : 's'}
          </h2>

          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredResults.map((c) => {
                const cTheme = getCampaignTheme(c);
                return (
                  <motion.div
                    key={c.id}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigateDetail(c.id)}
                    className="p-3.5 rounded-[20px] transition-all cursor-pointer flex items-center gap-3 group border relative overflow-hidden"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'rgba(255, 255, 255, 0.07)',
                    }}
                  >
                    {/* Hover glow in campaign color */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(180px circle at left center, ${hexToRgba(
                          cTheme.primary,
                          0.15
                        )}, transparent 70%)`,
                      }}
                    />

                    <div
                      className="w-14 h-14 rounded-[22%] flex items-center justify-center text-white shrink-0 shadow-xs relative z-10 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: cTheme.secondary,
                        color: cTheme.primary,
                        boxShadow: `0 4px 12px ${hexToRgba(cTheme.primary, 0.25)}`,
                      }}
                    >
                      <Icon name={CATEGORY_ICONS[c.cat] || c.icon} className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="text-base font-medium text-[var(--t1)] truncate group-hover:text-white transition-colors">
                        {c.name}
                      </div>
                      <div className="text-xs text-[var(--t2)] truncate">{c.host}</div>
                      <div
                        className="text-xs mt-0.5 truncate font-medium"
                        style={{ color: cTheme.primary }}
                      >
                        {plainPay(c)} · {c.rating} ★
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div
              className="text-center py-16 px-4 rounded-3xl"
              style={{ backgroundColor: 'var(--surface)' }}
            >
              <h3 className="text-lg font-medium text-[var(--t1)]">Nothing matches yet</h3>
              <p className="text-sm text-[var(--t2)] mt-1">Try a different word or category.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCat('All');
                }}
                className="mt-4 h-9 px-4 rounded-full text-xs font-medium text-[var(--t1)] bg-[var(--hover)] hover:opacity-90 cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Normal Discover View: Hero with Morphing Campaign Colors & Motion Phones */
        <>
          {currentFeatured && (
            <div
              className="relative py-2"
              onMouseEnter={() => {
                setIsPaused(true);
                setIsStageHovered(true);
              }}
              onMouseLeave={() => {
                setIsPaused(false);
                setIsStageHovered(false);
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeatured.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-10 items-center"
                >
                  {/* Left Column: Text & Reactive Accent Actions */}
                  <div className="space-y-4">
                    {/* Category Pill with dynamic campaign color */}
                    <span
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold border transition-colors duration-300"
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderColor: hexToRgba(currentTheme.primary, 0.3),
                        color: currentTheme.primary,
                      }}
                    >
                      <Icon
                        name={CATEGORY_ICONS[currentFeatured.cat] || currentFeatured.icon}
                        className="w-4 h-4"
                      />
                      {currentFeatured.cat}
                    </span>

                    {/* Headline in Source Serif 4 */}
                    <h2
                      className="text-3xl sm:text-5xl font-medium tracking-tight text-[var(--t1)] leading-[1.05]"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {currentFeatured.name}
                    </h2>

                    <p className="text-base text-[var(--t2)] leading-relaxed max-w-lg">
                      {currentFeatured.desc.split('. ')[0]}.
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-[var(--t2)] pt-1 flex-wrap">
                      <span className="font-mono text-[var(--t1)]">{currentFeatured.host}</span>
                      <span>★ {currentFeatured.rating}</span>
                      <span>{currentFeatured.creators} creators</span>
                    </div>

                    {/* Payout & Badges */}
                    <div
                      className="inline-flex items-center gap-3 px-4 py-2 rounded-full border transition-all"
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderColor: hexToRgba(currentTheme.primary, 0.25),
                      }}
                    >
                      <span className="text-sm font-semibold text-[var(--t1)]">
                        {usd(perInstall(currentFeatured))} / install
                      </span>
                      <div className="flex items-center gap-1 pl-2 border-l border-[var(--line)]">
                        <Icon name="apple" className="w-3.5 h-3.5 text-[var(--t1)]" fill />
                        <Icon name="play" className="w-3 h-3 text-[var(--t1)]" fill />
                      </div>
                    </div>

                    {/* Actions with Campaign Color Halo */}
                    <div className="flex items-center gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={(e) => onJoin(currentFeatured, e.currentTarget)}
                        className="h-11 px-6 rounded-full text-sm font-medium text-white transition-all cursor-pointer shadow-md"
                        style={{
                          backgroundColor: currentTheme.primary,
                          boxShadow: `0 0 18px ${hexToRgba(currentTheme.primary, 0.45)}`,
                        }}
                      >
                        {currentFeatured.joined ? 'Joined' : 'Join campaign'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onNavigateDetail(currentFeatured.id)}
                        className="h-11 px-5 rounded-full text-sm font-medium text-[var(--t1)] hover:bg-[var(--hover)] transition-all border cursor-pointer"
                        style={{ borderColor: hexToRgba(currentTheme.primary, 0.3) }}
                      >
                        Details
                      </motion.button>
                    </div>

                    {/* Interactive Campaign Color Dots Carousel Navigation */}
                    <div className="flex items-center gap-3 pt-4 border-t border-[var(--line)] text-sm text-[var(--t2)]">
                      <div className="flex items-center gap-2">
                        {featured.map((f, idx) => {
                          const fTheme = getCampaignTheme(f);
                          return (
                            <button
                              key={f.id}
                              onClick={() => setSlideIdx(idx)}
                              className="w-3 h-3 rounded-full transition-all cursor-pointer"
                              style={{
                                backgroundColor: fTheme.primary,
                                transform: slideIdx === idx ? 'scale(1.4)' : 'scale(1)',
                                opacity: slideIdx === idx ? 1 : 0.45,
                                boxShadow:
                                  slideIdx === idx
                                    ? `0 0 8px ${fTheme.primary}`
                                    : 'none',
                              }}
                              title={f.name}
                            />
                          );
                        })}
                      </div>

                      <span className="truncate ml-2">
                        Up next — <strong className="text-[var(--t1)]">{nextFeatured?.name}</strong>
                      </span>

                      <button
                        onClick={() => setSlideIdx((prev) => (prev + 1) % featured.length)}
                        className="ml-auto text-xs font-semibold hover:underline cursor-pointer"
                        style={{ color: currentTheme.primary }}
                      >
                        Next &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Right Floating Phone Stage with Motion Oscillations & Clean Linear Background */}
                  <div
                    className="h-68 sm:h-80 rounded-[32px] border flex items-center justify-center gap-3 p-4 overflow-hidden relative transition-all duration-300 shadow-md"
                    style={{
                      background: 'linear-gradient(180deg, #18181b 0%, #101012 100%)',
                      borderColor: hexToRgba(currentTheme.primary, 0.35),
                    }}
                  >
                    {/* Left Phone Floating */}
                    <motion.div
                      animate={{
                        y: isStageHovered ? -12 : [-4, 4, -4],
                        rotate: isStageHovered ? -10 : -6,
                      }}
                      transition={{
                        y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 0.3 },
                      }}
                      className="w-20 h-44 rounded-[22px] border p-2 flex flex-col gap-1.5 shadow-xl transition-all"
                      style={{
                        backgroundColor: '#0a0a0a',
                        borderColor: hexToRgba(currentTheme.primary, 0.2),
                      }}
                    >
                      <div
                        className="flex-1 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: hexToRgba(currentTheme.primary, 0.15),
                          color: currentTheme.primary,
                        }}
                      >
                        <Icon name="book" className="w-6 h-6" />
                      </div>
                      <div className="h-1 rounded-full bg-[#383838] w-3/4" />
                    </motion.div>

                    {/* Center Dominant Phone Floating */}
                    <motion.div
                      animate={{
                        y: isStageHovered ? -18 : [4, -4, 4],
                        scale: isStageHovered ? 1.08 : 1.04,
                      }}
                      transition={{
                        y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                        scale: { duration: 0.3 },
                      }}
                      className="w-28 sm:w-34 h-56 sm:h-66 rounded-[28px] border p-2.5 sm:p-3 flex flex-col gap-2 shadow-2xl z-10 transition-all cursor-pointer"
                      onClick={() => onNavigateDetail(currentFeatured.id)}
                      style={{
                        backgroundColor: '#0a0a0a',
                        borderColor: hexToRgba(currentTheme.primary, 0.45),
                        boxShadow: `0 14px 40px ${hexToRgba(currentTheme.primary, 0.35)}`,
                      }}
                    >
                      <div
                        className="flex-1 rounded-[18px] flex flex-col items-center justify-center text-center p-2 relative overflow-hidden transition-colors"
                        style={{
                          backgroundColor: currentTheme.secondary,
                          color: '#ffffff',
                        }}
                      >
                        <motion.div
                          animate={{ rotate: isStageHovered ? 360 : 0 }}
                          transition={{ duration: 0.6 }}
                          style={{ color: currentTheme.primary }}
                        >
                          <Icon name={currentFeatured.icon} className="w-10 h-10 mb-1" />
                        </motion.div>
                        <span className="text-[11px] font-bold truncate max-w-full px-1">
                          {currentFeatured.name}
                        </span>
                        <span
                          className="text-[9px] font-mono mt-0.5"
                          style={{ color: currentTheme.primary }}
                        >
                          {usd(perInstall(currentFeatured))} / inst
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/20 w-2/3 mx-auto" />
                    </motion.div>

                    {/* Right Phone Floating */}
                    <motion.div
                      animate={{
                        y: isStageHovered ? -12 : [-2, 6, -2],
                        rotate: isStageHovered ? 10 : 6,
                      }}
                      transition={{
                        y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 0.3 },
                      }}
                      className="w-20 h-44 rounded-[22px] border p-2 flex flex-col gap-1.5 shadow-xl transition-all"
                      style={{
                        backgroundColor: '#0a0a0a',
                        borderColor: hexToRgba(currentTheme.primary, 0.2),
                      }}
                    >
                      <div
                        className="flex-1 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: hexToRgba(currentTheme.primary, 0.15),
                          color: currentTheme.primary,
                        }}
                      >
                        <Icon name="globe" className="w-6 h-6" />
                      </div>
                      <div className="h-1 rounded-full bg-[#383838] w-3/4" />
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          <hr className="border-0 border-t border-[var(--line)] my-6" />

          {/* Categories Section with Smooth Hover & Icon Accents */}
          <section className="space-y-4 pt-1">
            <h2
              className="text-2xl font-medium tracking-tight text-[var(--t1)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Categories
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
              {CATEGORY_GROUPS.map((grp) => (
                <div key={grp.title} className="space-y-1">
                  <h3 className="text-sm font-medium text-[var(--t2)] mb-2 px-3">
                    {grp.title}
                  </h3>
                  {grp.categories.map((cName) => {
                    const catIcon = CATEGORY_ICONS[cName] || 'spark';
                    return (
                      <motion.button
                        key={cName}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectCategory(cName)}
                        className="w-full flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-[var(--surface)] text-left text-base font-medium text-[var(--t1)] transition-colors group cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <Icon
                            name={catIcon}
                            className="w-5 h-5 text-[var(--t2)] group-hover:text-white transition-colors"
                          />
                          {cName}
                        </span>
                        <span className="text-sm text-[var(--t2)] group-hover:text-white font-medium transition-colors">
                          &gt;
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

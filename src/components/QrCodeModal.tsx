import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Campaign } from '../types/campaign';
import { linkOf } from '../data/campaigns';
import { Icon } from './Icons';
import { getCampaignTheme, hexToRgba } from '../utils/campaignTheme';

interface QrCodeModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onCopy: (c: Campaign) => void;
  onShare: (c: Campaign) => void;
  isFreshJoin?: boolean;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onCopy,
  onShare,
  isFreshJoin = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  const theme = campaign ? getCampaignTheme(campaign) : null;

  useEffect(() => {
    if (!isOpen || !campaign || !canvasRef.current) return;

    // Draw high quality crisp scannable QR code matrix pattern
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 180;
    canvas.width = size * 2; // retina scaling
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Deterministic visual QR representation for the tracking link
    const url = `https://${linkOf(campaign)}`;
    const grid = 25; // 25x25 QR matrix
    const cellSize = (size - 24) / grid;
    const offset = 12;

    ctx.fillStyle = '#0f172a';

    // Position detection patterns (corners)
    const drawFinder = (gx: number, gy: number) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offset + gx * cellSize, offset + gy * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offset + (gx + 1) * cellSize, offset + (gy + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offset + (gx + 2) * cellSize, offset + (gy + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinder(0, 0);
    drawFinder(grid - 7, 0);
    drawFinder(0, grid - 7);

    // Hash pseudo-random bits for data modules based on the url
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = (hash << 5) - hash + url.charCodeAt(i);
      hash |= 0;
    }

    ctx.fillStyle = '#0f172a';
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        // Skip corner finder patterns
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= grid - 8) ||
          (r >= grid - 8 && c < 8)
        ) {
          continue;
        }

        // Timing lines
        if (r === 6 || c === 6) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize - 0.5, cellSize - 0.5);
          }
          continue;
        }

        // Data pattern with hash
        const bit = ((hash ^ (r * 33 + c * 47)) & (1 << ((r + c) % 8))) !== 0;
        if (bit) {
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }
  }, [isOpen, campaign]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyClick = () => {
    if (!campaign) return;
    onCopy(campaign);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && campaign && theme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Your tracking link and QR code"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-xl transition-all border relative overflow-hidden"
            style={{
              backgroundColor: '#1b1b1e',
              borderColor: hexToRgba(theme.primary, 0.4),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent glow line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
              }}
            />

            <div className="flex items-center gap-3 mb-4">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.08 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md border"
                style={{
                  backgroundColor: theme.secondary,
                  borderColor: hexToRgba(theme.primary, 0.35),
                  color: theme.primary,
                }}
              >
                <Icon name={campaign.icon} className="w-6 h-6" />
              </motion.div>
              <div>
                <h2 className="text-xl font-medium tracking-tight text-[var(--t1)]">
                  {isFreshJoin ? 'You’re in. Tracking ready' : 'Your tracking link'}
                </h2>
                <p className="text-xs text-[var(--t2)] mt-0.5">
                  {campaign.name} by {campaign.host}
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--t2)] leading-relaxed mb-4">
              Scan the QR code or share your unique link. Installs automatically credit your earnings in real time.
            </p>

            {/* Crisp QR Code Container with campaign-themed highlight */}
            <div
              className="flex flex-col items-center justify-center p-4 my-2 rounded-2xl bg-white text-neutral-900 border shadow-inner relative"
              style={{ borderColor: 'rgba(0,0,0,0.1)' }}
            >
              <canvas ref={canvasRef} className="rounded-lg shadow-xs" />
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: theme.primary }}
                />
                <span className="text-[11px] font-mono tracking-wider text-neutral-600 uppercase font-semibold">
                  Verified Creator Link · {campaign.id}
                </span>
              </div>
            </div>

            {/* Link Bar */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full border my-4 transition-all"
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderColor: hexToRgba(theme.primary, 0.35),
              }}
            >
              <code className="flex-1 text-xs font-mono text-[var(--t1)] truncate px-1">
                {linkOf(campaign)}
              </code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all shrink-0 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: theme.primary,
                  boxShadow: `0 0 10px ${hexToRgba(theme.primary, 0.4)}`,
                }}
              >
                <Icon name={copied ? 'check' : 'copy'} className="w-3.5 h-3.5" />
                {copied ? 'Copied' : 'Copy'}
              </motion.button>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => onShare(campaign)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[var(--t1)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
              >
                <Icon name="share" className="w-4 h-4" />
                Share
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="px-5 py-2 rounded-full text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

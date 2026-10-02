import React, { useEffect } from 'react';
import { Icon } from './Icons';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed left-1/2 bottom-8 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-medium shadow-2xl border transition-all animate-[rise_0.25s_cubic-bezier(0.16,1,0.3,1)]"
      style={{
        backgroundColor: 'var(--inv)',
        color: 'var(--ton)',
        borderColor: 'var(--line)',
      }}
    >
      <Icon
        name={type === 'success' ? 'check' : 'spark'}
        className="w-4 h-4 shrink-0 text-[var(--blue)]"
      />
      <span>{message}</span>
    </div>
  );
};

'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] animate-fade-in-up">
      <div className="glass px-6 py-4 rounded-2xl shadow-premium flex items-center gap-4 border-white min-w-[280px]">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
          type === 'success' ? 'bg-green-50' : type === 'error' ? 'bg-red-50' : 'bg-blue-50'
        }`}>
          <span className="text-xl">
            {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
          </span>
        </div>
        <div>
          <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1">
            {type === 'success' ? 'BERHASIL' : type === 'error' ? 'GAGAL' : 'INFO'}
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{message}</p>
        </div>
      </div>
    </div>
  );
}

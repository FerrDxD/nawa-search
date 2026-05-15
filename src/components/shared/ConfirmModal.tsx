'use client';

import { useEffect, useState } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info' | 'success';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'info'
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />
      
      {/* Modal Card */}
      <div className="relative glass w-full max-w-sm rounded-[32px] p-8 shadow-premium animate-fade-in-up border-white">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${
            type === 'danger' ? 'bg-red-50' : type === 'success' ? 'bg-green-50' : 'bg-blue-50'
          }`}>
            <span className="text-3xl">
              {type === 'danger' ? '⚠️' : type === 'success' ? '✅' : '❓'}
            </span>
          </div>
          
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">{title}</h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
            {message}
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all hover:-translate-y-1 active:translate-y-0 ${
                type === 'danger' 
                  ? 'bg-red-500 text-white shadow-red-200' 
                  : 'bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              {confirmText}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

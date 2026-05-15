'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        // Beri jeda kecil agar cookie terpasang sempurna
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 500);
      }
    } catch (err: any) {
      setError('Terjadi kesalahan sistem. Coba lagi nanti.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <ellipse cx="50" cy="50" rx="42" ry="12" fill="none" stroke="#0f172a" strokeWidth="2" transform="rotate(30 50 50)" />
                <ellipse cx="50" cy="50" rx="42" ry="12" fill="none" stroke="#0f172a" strokeWidth="2" transform="rotate(-30 50 50)" />
                <path d="M50 12 L80 40 L50 88 L20 40 Z" fill="url(#crystalGrad)" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#0f172a]">
              NAWA<span className="text-blue-600">SEARCH</span>
            </span>
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang Kembali</h2>
          <p className="text-slate-400 font-medium text-sm mt-2">Masuk untuk mengelola barang temuan</p>
        </div>

        <div className="glass p-8 rounded-[40px] shadow-premium border-white/50 relative z-10">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl border border-red-100 animate-pulse">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Email Admin</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nawasearch.com"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-300"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-300"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? 'MENYINKRONKAN...' : 'MASUK KE DASHBOARD'}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          Powered by NAWASENA System
        </p>
      </div>
    </div>
  );
}

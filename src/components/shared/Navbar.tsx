'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Cek session saat ini
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    // Listen perubahan auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-4xl z-50 animate-fade-in-up">
      <div className="glass px-4 md:px-6 py-3 md:py-4 rounded-[24px] md:rounded-[32px] shadow-premium flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200/50 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
              <defs>
                <filter id="arcane-search-glow" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="3.8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <g transform="translate(0, 0)">
                <polygon 
                  points="60,35 70,60 60,85 50,60" 
                  fill="#FFFFFF" 
                  filter="url(#arcane-search-glow)" 
                />

                <g fill="rgba(255, 255, 255, 0.75)">
                  <polygon points="25,55 50,30 55,40 35,55" />
                  <polygon points="95,55 70,30 65,40 85,55" />
                  <polygon points="25,65 50,90 55,80 35,65" />
                  <polygon points="95,65 70,90 65,80 85,65" />
                </g>

                <g fill="rgba(255, 255, 255, 0.75)">
                  <polygon points="10,60 15,50 20,60 15,70" />
                  <polygon points="110,60 105,50 100,60 105,70" />
                </g>

                <g fill="rgba(255, 255, 255, 0.40)">
                  <polygon points="60,10 65,20 60,25 55,20" />
                  <polygon points="60,110 65,100 60,95 55,100" />
                </g>
              </g>
            </svg>
          </div>
          <span className="text-lg md:text-xl font-black tracking-tighter text-[#0f172a] group-hover:text-blue-600 transition-colors">
            NAWA<span className="text-blue-600">SEARCH</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-3 md:gap-6">
          {user ? (
            <>
              <Link href="/dashboard" className="hidden sm:block text-xs md:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                Admin
              </Link>
              <button 
                onClick={handleLogout}
                className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hidden sm:block text-xs md:text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
              Login
            </Link>
          )}
          
          <Link href="/upload">
            <button className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-widest md:tracking-normal md:capitalize shadow-xl shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
              <span className="hidden sm:inline">Lapor Temuan</span>
              <span className="sm:hidden">+ LAPOR</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
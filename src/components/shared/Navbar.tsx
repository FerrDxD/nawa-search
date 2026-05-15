import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-4xl z-50 animate-fade-in-up">
      <div className="glass px-4 md:px-6 py-3 md:py-4 rounded-[24px] md:rounded-[32px] shadow-premium flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
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
              
              <path d="M50 12 L50 88 L20 40 Z" fill="#000000" fillOpacity="0.15" />
              <path d="M50 12 L80 40 L50 45 Z" fill="#ffffff" fillOpacity="0.3" />
              <path d="M20 40 L80 40 L50 45 Z" fill="#ffffff" fillOpacity="0.15" />
              
              <circle cx="15" cy="20" r="3" fill="#8b5cf6" />
              <circle cx="85" cy="80" r="2" fill="#3b82f6" />
            </svg>
          </div>
          <span className="text-lg md:text-xl font-black tracking-tighter text-[#0f172a] group-hover:text-blue-600 transition-colors">
            NAWA<span className="text-blue-600">SEARCH</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/dashboard" className="hidden sm:block text-xs md:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
            Admin
          </Link>
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
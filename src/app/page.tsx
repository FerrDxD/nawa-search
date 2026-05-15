'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import ItemCard from '@/components/items/ItemCard';
import Navbar from '@/components/shared/Navbar';

const CATEGORIES = ['Semua', 'Elektronik', 'Atribut', 'Alat Tulis', 'Dompet/Kunci', 'Lainnya'];

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      
      // Ambil data yang statusnya hanya 'Tersedia'
      let query = supabase
        .from('items')
        .select('*')
        .eq('status', 'Tersedia')
        .order('created_at', { ascending: false });

      // Filter Pencarian Teks
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      // Filter Kategori
      if (activeCategory !== 'Semua') {
        query = query.eq('category', activeCategory);
      }

      const { data, error } = await query;
      
      if (!error) {
        setItems(data || []);
      }
      setLoading(false);
    };

    // Pakai sedikit delay (debounce) biar tidak spam request ke database tiap kali ngetik
    const delayDebounceFn = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-28 md:pt-36 pb-20 md:pb-32">
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-16 animate-fade-in-up px-2">
          <div className="inline-block px-4 py-1 bg-blue-50 rounded-full mb-4 md:mb-6">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-600">Solusi Kehilangan Barang</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-foreground mb-4 md:mb-6 tracking-tighter leading-[1.1]">
            Temukan Barangmu <br />
            <span className="text-gradient">Cepat & Mudah.</span>
          </h1>
          <p className="text-slate-500 max-w-sm md:max-w-md mx-auto text-xs md:text-sm font-medium leading-relaxed">
            Pusat informasi barang temuan di area sekolah. <br className="hidden sm:block" />
            Kehilangan sesuatu? Cari di sini sekarang.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="glass p-2 md:p-3 rounded-[24px] md:rounded-[32px] shadow-premium mb-8 md:mb-12 sticky top-20 md:top-24 z-40 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative mb-2 md:mb-3">
            <input 
              type="text"
              placeholder="Cari Barang..."
              className="w-full bg-background border border-slate-100 rounded-2xl md:rounded-3xl py-4 md:py-5 pl-12 md:pl-14 pr-4 md:pr-6 text-xs md:text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all shadow-inner text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-lg md:text-xl">🔍</span>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto px-1 md:px-2 pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-background text-slate-400 hover:bg-white hover:text-slate-900 border border-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Item Grid Section */}
        <div className="mb-6 md:mb-8 flex justify-between items-center px-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-[9px] md:text-xs font-black uppercase tracking-widest text-slate-400">
            {loading ? 'SINKRONISASI DATABASE...' : `DATA TERBARU (${items.length})`}
          </h2>
          <div className="h-px bg-slate-100 flex-grow mx-4 hidden sm:block" />
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white rounded-[32px] md:rounded-[40px] shadow-soft animate-pulse p-4 flex flex-col gap-4">
                 <div className="w-full h-56 bg-slate-50 rounded-[24px] md:rounded-[32px]" />
                 <div className="h-4 bg-slate-50 w-2/3 rounded-full" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 md:py-32 bg-white rounded-[32px] md:rounded-[48px] border-4 border-dashed border-slate-50 animate-fade-in-up">
            <div className="text-5xl md:text-6xl mb-6 grayscale opacity-20">🔎</div>
            <h3 className="text-lg md:text-xl font-black text-[#0f172a] mb-2 tracking-tight">Barang Belum Ditemukan</h3>
            <p className="text-slate-400 text-xs md:text-sm font-medium max-w-xs mx-auto">
              Sepertinya barang yang kamu cari belum ada di daftar kami. Tetap pantau ya!
            </p>
          </div>
        )}
      </main>

    </div>
  );
}
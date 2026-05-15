'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import ItemCard from '@/components/items/ItemCard';

export default function HomePage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      let query = supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data } = await query;
      setItems(data || []);
      setLoading(false);
    };

    fetchItems();
  }, [search]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header Section */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm border-b border-slate-100">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          NAWA-<span className="text-blue-600">SEARCH</span>
        </h1>
        <p className="text-slate-500 text-sm mb-6">Cari barangmu yang hilang di area sekolah.</p>
        
        {/* Search Bar */}
        <div className="relative">
          <input 
            type="text"
            placeholder="Cari kunci, dasi, atau hp..."
            className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        </div>
      </div>

      {/* Grid Barang */}
      <div className="px-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-slate-800">Barang Terbaru</h2>
          <span className="text-xs text-blue-600 font-medium">Lihat Semua</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm">Barang tidak ditemukan... 🔍</p>
          </div>
        )}
      </div>
    </main>
  );
}
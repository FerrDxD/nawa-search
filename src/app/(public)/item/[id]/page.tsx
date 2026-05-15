'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Toast from '@/components/shared/Toast';

export default function ItemDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const { data } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();
      
      setItem(data);
      setLoading(false);
    };

    fetchDetail();
  }, [id]);

  const handleClaim = async () => {
    if (!item) return;
    
    setClaiming(true);
    try {
      // 1. Update status di database
      const { error } = await supabase
        .from('items')
        .update({ status: 'Menunggu Persetujuan' })
        .eq('id', id);

      if (error) throw error;

      // 2. Siapkan pesan WhatsApp
      const message = `Halo GENESIS, saya ingin mengklaim barang berikut:\n\n` +
                      `Nama Barang: ${item.title}\n` +
                      `Lokasi: ${item.location_found}\n` +
                      `ID Barang: ${id}\n\n` +
                      `Saya akan segera ke ruang OSIS untuk verifikasi.`;
      
      const whatsappUrl = `https://wa.me/6285178233161?text=${encodeURIComponent(message)}`;

      // 3. Update local state
      setItem({ ...item, status: 'Menunggu Persetujuan' });
      
      // 4. Redirect ke WhatsApp
      window.open(whatsappUrl, '_blank');
      
      setToast({ message: 'Proses Klaim Berhasil!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal memproses klaim.', type: 'error' });
    } finally {
      setClaiming(false);
    }
  };


  if (loading) return <div className="p-8 text-center text-slate-500">Memuat data...</div>;
  if (!item) return <div className="p-8 text-center text-red-500">Barang tidak ditemukan.</div>;

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 px-6 transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-8 group">
            <span className="group-hover:-translate-x-1 transition-transform">⬅️</span> Kembali ke Beranda
          </button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <div className="relative h-[450px] w-full rounded-[48px] overflow-hidden shadow-premium animate-fade-in-up">
            {item.image_url ? (
              <Image 
                src={item.image_url} 
                alt={item.title} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" 
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-slate-100 text-slate-300 font-bold">NO IMAGE</div>
            )}
            
            <div className="absolute top-6 right-6 glass px-4 py-2 rounded-2xl shadow-lg">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                {item.status}
              </span>
            </div>
          </div>

          {/* Info Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-8 tracking-tighter leading-tight">
              {item.title}
            </h1>

            <div className="space-y-6 mb-10">
              <div className="glass p-6 rounded-[32px] shadow-soft border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Lokasi Penemuan</p>
                <p className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="text-xl">📍</span> {item.location_found}
                </p>
              </div>
              
              <div className="glass p-6 rounded-[32px] shadow-soft border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Ciri-ciri & Deskripsi</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description || 'Tidak ada deskripsi tambahan untuk barang ini.'}
                </p>
              </div>
            </div>

            {/* Action Card */}
            {item.status === 'Tersedia' ? (
              <div className="bg-slate-900 p-8 rounded-[40px] shadow-premium relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <h3 className="text-white text-xl font-black mb-2 tracking-tight">Barang Milikmu?</h3>
                  <p className="text-slate-400 text-xs mb-6 font-medium">Klik tombol di bawah untuk proses verifikasi via WhatsApp ke GENESIS.</p>
                  
                  <button 
                    onClick={handleClaim}
                    disabled={claiming}
                    className="w-full bg-blue-600 text-white font-black py-5 rounded-3xl hover:bg-blue-500 hover:-translate-y-1 active:translate-y-0 transition-all shadow-lg shadow-blue-900/20 disabled:bg-slate-700"
                  >
                    {claiming ? 'MEMPROSES...' : 'KLAIM SEKARANG'}
                  </button>
                  <p className="text-[9px] text-center text-slate-500 mt-4 font-bold uppercase tracking-widest">Wajib verifikasi di Ruang OSIS</p>
                </div>
              </div>
            ) : item.status === 'Menunggu Persetujuan' ? (
              <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-[40px] text-center shadow-soft animate-pulse">
                <p className="text-amber-700 font-black text-lg mb-2">⚠️ Sedang Diverifikasi</p>
                <p className="text-xs text-amber-600 font-medium leading-relaxed">
                  Seseorang sedang mengklaim barang ini. Status akan berubah jika verifikasi gagal atau selesai.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-100 p-8 rounded-[40px] text-center shadow-soft">
                <div className="text-3xl mb-3">✅</div>
                <p className="text-green-700 font-black text-xl mb-1">Berhasil Diklaim</p>
                <p className="text-xs text-green-600 font-medium">Barang ini sudah kembali ke pemiliknya.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </main>
  );
}

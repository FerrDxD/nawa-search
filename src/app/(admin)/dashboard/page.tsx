'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/shared/Navbar';
import ConfirmModal from '@/components/shared/ConfirmModal';
import Toast from '@/components/shared/Toast';

export default function AdminDashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Toast State
  const [modal, setModal] = useState<{ isOpen: boolean; id: string; status: string; message: string; title: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });
    
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateStatus = async (id: string, newStatus: string, title: string, message: string) => {
    setModal({ isOpen: true, id, status: newStatus, title, message });
  };

  const handleConfirmUpdate = async () => {
    if (!modal) return;
    const { id, status } = modal;
    setModal(null);

    const { error } = await supabase
      .from('items')
      .update({ status })
      .eq('id', id);
    
    if (!error) {
      fetchItems();
      setToast({ message: 'Status Berhasil Diperbarui', type: 'success' });
    } else {
      setToast({ message: 'Gagal Memperbarui Status', type: 'error' });
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6 transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-5xl mx-auto animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Manajemen Barang</h1>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Kelola database Nawa-Search secara real-time
            </p>
          </div>
          <Link href="/upload">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:translate-y-0">
              + Input Barang Baru
            </button>
          </Link>
        </div>

        <div className="glass rounded-[40px] shadow-premium overflow-hidden border-white/10">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/50 dark:bg-slate-900/50 border-b border-slate-50 dark:border-slate-800">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Info Barang</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Notifikasi</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-black uppercase tracking-widest text-slate-300">Sinkronisasi Database...</p>
                      </div>
                    </td>
                  </tr>
                ) : items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/50 dark:hover:bg-slate-900/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-background rounded-2xl overflow-hidden relative shadow-inner">
                           {item.image_url && <Image src={item.image_url} alt="" fill className="object-cover" />}
                        </div>
                        <div>
                          <p className="font-black text-foreground group-hover:text-blue-600 transition-colors">{item.title}</p>
                          <p className="text-[10px] font-bold text-slate-400">{item.category} • 📍 {item.location_found}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        item.status === 'Tersedia' 
                          ? 'bg-green-500 text-white' 
                          : item.status === 'Menunggu Persetujuan'
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.is_notified ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                          {item.is_notified ? 'Terkirim' : 'Menunggu'}
                        </p>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        {item.status === 'Menunggu Persetujuan' && (
                          <button 
                            onClick={() => updateStatus(item.id, 'Diklaim', 'Konfirmasi Klaim', 'Setujui klaim dan tandai sebagai sudah diambil?')}
                            className="bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-lg hover:bg-blue-600 transition-all"
                          >
                            Setujui
                          </button>
                        )}
                        {item.status === 'Tersedia' && (
                          <button 
                            onClick={() => updateStatus(item.id, 'Diklaim', 'Tandai Diambil', 'Tandai barang ini sebagai sudah diambil?')}
                            className="bg-background border border-slate-100 text-foreground font-black text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-soft hover:bg-slate-50 transition-all"
                          >
                            Tandai Diambil
                          </button>
                        )}
                        {item.status === 'Diklaim' && (
                          <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                            ✓
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal & Toast Components */}
      {modal && (
        <ConfirmModal
          isOpen={modal.isOpen}
          title={modal.title}
          message={modal.message}
          onConfirm={handleConfirmUpdate}
          onCancel={() => setModal(null)}
          type={modal.title === 'Konfirmasi Klaim' ? 'success' : 'info'}
        />
      )}
      
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
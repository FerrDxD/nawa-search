'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/shared/Navbar';
import Toast from '@/components/shared/Toast';

const CATEGORIES = ['Elektronik', 'Atribut', 'Alat Tulis', 'Dompet/Kunci', 'Lainnya'];

export default function AdminUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Bersihkan stream saat komponen ditutup agar kamera tidak nyala terus
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const triggerInput = (id: string) => {
    document.getElementById(id)?.click();
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error('Error access camera:', err);
      alert('Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    const video = document.getElementById('camera-view') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const photoFile = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setFile(photoFile);
          setPreview(URL.createObjectURL(photoFile));
          stopCamera();
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;

    try {
      let image_url = '';

      // 1. Upload Gambar ke Supabase Storage
      if (file) {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `nawa-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('item-image')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Gagal masuk bucket:', uploadError.message);
          alert('Gagal upload gambar ke storage.');
          setLoading(false);
          return;
        }

        // 3. Jika berhasil masuk, minta URL Publik dari Supabase
        const { data: urlData } = supabase.storage
          .from('item-image')
          .getPublicUrl(fileName);

        image_url = urlData.publicUrl;
      }

      // 2. Insert Data ke Table 'items'
      const { error } = await supabase.from('items').insert([{
        title,
        category,
        location_found: location,
        description,
        image_url,
        status: 'Tersedia',
        is_notified: false
      }]);

      if (error) throw error;
      
      setToast({ message: 'Barang Berhasil Diinput!', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      console.error(err);
      setToast({ message: 'Gagal: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6 transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-xl mx-auto glass rounded-[32px] md:rounded-[48px] p-6 md:p-10 shadow-premium animate-fade-in-up border-white">
        <header className="mb-8 md:mb-10 text-center">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-[20px] md:rounded-[24px] flex items-center justify-center mx-auto mb-4 md:mb-6">
            <span className="text-2xl md:text-3xl">📦</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter mb-2">Input Barang Temuan</h1>
          <p className="text-[10px] md:text-sm font-medium text-slate-400 dark:text-slate-500">Pastikan data yang diinput sudah sesuai dengan barang aslinya.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Upload Foto Section */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block">Foto Barang</label>
            
            {preview ? (
              <div className="relative h-72 w-full rounded-[32px] overflow-hidden shadow-soft group border-4 border-white dark:border-slate-800">
                <img src={preview} alt="Preview" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <button 
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-4 right-4 bg-red-500 text-white w-10 h-10 rounded-full shadow-xl flex items-center justify-center font-bold hover:scale-110 active:scale-95 transition-all"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={startCamera}
                  className="h-40 bg-background border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-soft mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📸</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kamera</p>
                </button>

                <button
                  type="button"
                  onClick={() => triggerInput('file-input')}
                  className="h-40 bg-background border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-soft mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📁</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Galeri</p>
                </button>
              </div>
            )}

            <input id="camera-input" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Nama Barang</label>
                <input name="title" type="text" placeholder="Contoh: Kunci Motor Honda" className="w-full bg-background border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-foreground" required />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Kategori</label>
                <select name="category" className="w-full bg-background border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-foreground appearance-none" required>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Lokasi Penemuan</label>
                <input name="location" type="text" placeholder="Contoh: Kantin Depan" className="w-full bg-background border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-foreground" required />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Deskripsi Ciri-ciri</label>
                <textarea name="description" rows={3} placeholder="Jelaskan detail barang..." className="w-full bg-background border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-foreground"></textarea>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all shadow-xl shadow-blue-200 disabled:bg-slate-300"
          >
            {loading ? 'MENYIMPAN DATA...' : 'SIMPAN & BROADCAST'}
          </button>
        </form>
      </div>

      {/* Camera Overlay */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6">
          <div className="relative w-full max-w-lg h-full max-h-[700px] rounded-[48px] overflow-hidden shadow-2xl">
            <video
              id="camera-view"
              autoPlay
              playsInline
              ref={(el) => {
                if (el && stream) el.srcObject = stream;
              }}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-6 px-10">
              <div className="flex items-center justify-between w-full">
                <button onClick={stopCamera} className="w-14 h-14 rounded-full glass flex items-center justify-center text-white text-xl shadow-xl">
                  ✕
                </button>
                
                <button onClick={takePhoto} className="w-24 h-24 rounded-full bg-white p-2 shadow-2xl hover:scale-105 active:scale-95 transition-transform">
                  <div className="w-full h-full rounded-full border-4 border-slate-900" />
                </button>

                <div className="w-14" />
              </div>
              <p className="text-white font-black text-[10px] uppercase tracking-widest opacity-70">Ambil Foto Barang</p>
            </div>
          </div>
        </div>
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

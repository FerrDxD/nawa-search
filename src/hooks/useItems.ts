// hooks/useItems.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export const useItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch awal
    const fetchItems = async () => {
      const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false });
      setItems(data);
    };

    fetchItems();

    // Subscribe ke perubahan
    const channel = supabase
      .channel('public:items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, (payload) => {
        // Logika update state saat ada data baru/berubah
        fetchItems(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { items };
};
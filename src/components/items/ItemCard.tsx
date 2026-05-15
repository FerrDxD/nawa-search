import Image from 'next/image';
import Link from 'next/link';

interface ItemCardProps {
  item: {
    id: string;
    title?: string;
    location_found?: string;
    status?: string;
    image_url?: string;
    category?: string;
}

export default function ItemCard({ item }: ItemCardProps) {
  const id = item?.id;
  const title = item?.title || 'Tanpa Nama';
  const location = item?.location_found || 'Lokasi tidak diketahui';
  const status = item?.status || 'Tersedia';
  const imageUrl = item?.image_url || '';

  const isTersedia = status.toLowerCase() === 'tersedia';

  return (
    <div className="group h-80 bg-background rounded-[32px] md:rounded-[40px] shadow-soft hover:shadow-premium transition-all duration-500 overflow-hidden border border-slate-100 flex flex-col">
      <div className="relative h-56 w-full overflow-hidden bg-slate-50">
        {item.image_url ? (
          <Image 
            src={item.image_url} 
            alt={item.title || 'Item'} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300 font-bold">NO IMAGE</div>
        )}
        
        <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-xl shadow-lg">
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">{item.category}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-black text-slate-900 tracking-tight leading-tight uppercase italic flex-1 pr-2">{item.title}</h3>
            <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest h-fit ${
              item.status === 'Tersedia' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
            }`}>
              {item.status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">📍</span>
            <p className="text-[10px] font-bold text-slate-400 tracking-wide line-clamp-1">{item.location_found}</p>
          </div>
          
          <Link href={`/item/${item.id}`}>
            <button className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline">
              Lihat Detail →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
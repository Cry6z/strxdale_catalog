import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { CatalogItem } from './types';

interface OverviewViewProps {
    totalItems: number;
    totalValue: number;
    categoriesCount: number;
    recentItems: CatalogItem[];
    setView: (view: 'overview' | 'catalog' | 'hero' | 'gallery') => void;
    setShowForm: (show: boolean) => void;
}

export default function OverviewView({
    totalItems,
    totalValue,
    categoriesCount,
    recentItems,
    setView,
    setShowForm
}: OverviewViewProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-charcoal">Ringkasan</h1>
                <p className="text-sm text-muted-foreground">Statistik umum dan aktivitas terbaru koleksi Anda.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-8xl!">inventory_2</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Item</span>
                    <p className="text-4xl font-bold mt-4 text-charcoal">{totalItems}</p>
                </div>
                <div className="p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-8xl!">payments</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nilai Koleksi</span>
                    <p className="text-4xl font-bold mt-4 text-charcoal">{formatPrice(totalValue)}</p>
                </div>
                <div className="p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-8xl!">category</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kategori</span>
                    <p className="text-4xl font-bold mt-4 text-charcoal">{categoriesCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Terbaru Ditambahkan</h3>
                        <button onClick={() => setView('catalog')} className="text-xs font-medium text-charcoal hover:underline">Lihat Semua</button>
                    </div>
                    <div className="space-y-3">
                        {recentItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm ring-1 ring-black/5 hover:ring-black/10 transition-all cursor-pointer group" onClick={() => setView('catalog')}>
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-secondary/50 border border-black/5">
                                    <Image src={item.image_url || '/placeholder.png'} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-charcoal truncate">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-sm! text-muted-foreground">chevron_right</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-muted-foreground">Aksi Cepat</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => { setView('catalog'); setShowForm(true); }}
                            className="p-6 rounded-2xl bg-charcoal/5 hover:bg-charcoal/10 transition-all text-left group border border-transparent hover:border-charcoal/10"
                        >
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-lg! text-charcoal">add_circle</span>
                            </div>
                            <p className="text-sm font-bold text-charcoal">Tambah Item</p>
                            <p className="text-xs text-muted-foreground mt-1">Upload produk baru</p>
                        </button>
                        <button
                            onClick={() => setView('catalog')}
                            className="p-6 rounded-2xl bg-charcoal/5 hover:bg-charcoal/10 transition-all text-left group border border-transparent hover:border-charcoal/10"
                        >
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-lg! text-charcoal">inventory</span>
                            </div>
                            <p className="text-sm font-bold text-charcoal">Kelola Katalog</p>
                            <p className="text-xs text-muted-foreground mt-1">Edit & hapus produk</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { CatalogItem } from './types';

interface OverviewViewProps {
    totalItems: number;
    totalValue: number;
    categoriesCount: number;
    recentItems: CatalogItem[];
    setView: (view: 'overview' | 'catalog' | 'hero' | 'gallery' | 'store') => void;
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
            <header className="mb-12 relative z-10">
                <h1 className="text-4xl font-black tracking-tight mb-3 text-slate-900">Ringkasan</h1>
                <p className="text-base text-slate-500 font-medium">Statistik umum dan aktivitas terbaru koleksi Anda.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
                <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all duration-700">
                        <span className="material-symbols-outlined text-[120px]!">inventory_2</span>
                    </div>
                    <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Item</span>
                    <p className="text-5xl font-black mt-4 text-slate-900 drop-shadow-sm">{totalItems}</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all duration-700">
                        <span className="material-symbols-outlined text-[120px]!">payments</span>
                    </div>
                    <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Nilai Koleksi</span>
                    <p className="text-4xl font-black mt-4 text-slate-900 drop-shadow-sm">{formatPrice(totalValue)}</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all duration-700">
                        <span className="material-symbols-outlined text-[120px]!">category</span>
                    </div>
                     <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Kategori</span>
                    <p className="text-5xl font-black mt-4 text-slate-900 drop-shadow-sm">{categoriesCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                            Terbaru Ditambahkan
                        </h3>
                        <button onClick={() => setView('catalog')} className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white/50 px-3 py-1.5 rounded-full hover:bg-white shadow-sm">Lihat Semua</button>
                    </div>
                    <div className="space-y-3">
                        {recentItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 hover:bg-white shadow-sm border border-white/60 hover:shadow-md transition-all duration-300 cursor-pointer group" onClick={() => setView('catalog')}>
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-inner">
                                    <Image src={item.image_url || '/placeholder.png'} alt={item.name} width={56} height={56} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-slate-900 truncate">{item.name}</p>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">{formatPrice(item.price)}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                                    <span className="material-symbols-outlined text-[16px]! text-slate-900">chevron_right</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-slate-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        Aksi Cepat
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => { setView('catalog'); setShowForm(true); }}
                            className="p-6 md:p-8 rounded-3xl bg-white/40 backdrop-blur-xl hover:bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 text-left group border border-white/40 hover:-translate-y-1 flex flex-col justify-between"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[20px] md:text-[24px]! text-white">add_circle</span>
                            </div>
                            <div>
                                <p className="text-sm md:text-base font-bold text-slate-900">Tambah Item</p>
                                <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-1 md:mt-2">Upload produk baru</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setView('catalog')}
                            className="p-6 md:p-8 rounded-3xl bg-white/40 backdrop-blur-xl hover:bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 text-left group border border-white/40 hover:-translate-y-1 flex flex-col justify-between"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white flex items-center justify-center mb-4 md:mb-6 shadow-md border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[20px] md:text-[24px]! text-slate-900">inventory</span>
                            </div>
                            <div>
                                <p className="text-sm md:text-base font-bold text-slate-900">Kelola Katalog</p>
                                <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-1 md:mt-2">Edit atau hapus produk</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setView('store')}
                            className="p-6 md:p-8 rounded-3xl bg-white/40 backdrop-blur-xl hover:bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 text-left group border border-white/40 hover:-translate-y-1 flex flex-col justify-between"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white flex items-center justify-center mb-4 md:mb-6 shadow-md border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[20px] md:text-[24px]! text-slate-900">storefront</span>
                            </div>
                            <div>
                                <p className="text-sm md:text-base font-bold text-slate-900">Status Toko</p>
                                <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-1 md:mt-2">Buka/tutup toko sementara</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setView('hero')}
                            className="p-6 md:p-8 rounded-3xl bg-white/40 backdrop-blur-xl hover:bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 text-left group border border-white/40 hover:-translate-y-1 flex flex-col justify-between"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white flex items-center justify-center mb-4 md:mb-6 shadow-md border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[20px] md:text-[24px]! text-slate-900">edit_document</span>
                            </div>
                            <div>
                                <p className="text-sm md:text-base font-bold text-slate-900">Pengaturan Hero</p>
                                <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-1 md:mt-2">Modifikasi teks dan background</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

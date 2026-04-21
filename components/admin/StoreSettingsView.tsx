import Image from 'next/image';

interface StoreSettingsViewProps {
    storeStatus?: 'open' | 'closed';
    toggleStoreStatus?: () => void;
    closedTitle?: string;
    setClosedTitle?: (v: string) => void;
    closedDescription?: string;
    setClosedDescription?: (v: string) => void;
    closedBackground?: string;
    uploadClosedBackground?: (file: File) => void;
    updateClosedStoreSettings?: () => void;
}

export default function StoreSettingsView({
    storeStatus = 'open',
    toggleStoreStatus,
    closedTitle,
    setClosedTitle,
    closedDescription,
    setClosedDescription,
    closedBackground,
    uploadClosedBackground,
    updateClosedStoreSettings
}: StoreSettingsViewProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-12 relative z-10">
                <h1 className="text-4xl font-black tracking-tight mb-3 text-slate-900">Status & Akses Toko</h1>
                <p className="text-base text-slate-500 font-medium">Kelola siapa saja yang bisa mengakses katalog beserta penyesuaian tampilannya.</p>
            </header>

            <div className="space-y-8 max-w-4xl relative z-10">
                {/* Main Toggles */}
                <div className="p-6 md:p-8 rounded-3xl bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200">
                                <span className="material-symbols-outlined text-[24px]!">storefront</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-bold text-slate-900">Status Katalog</h2>
                                    <span className={`px-3 py-1 text-[10px] uppercase font-bold tracking-[0.2em] rounded-full shadow-sm border ${storeStatus === 'open' ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                        {storeStatus === 'open' ? 'Buka' : 'Tutup Sementara'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-xl font-medium">
                            Jika dimatikan, semua pengguna yang mengunjungi halaman katalog dan cerita akan diarahkan ke layar khusus yang menginformasikan bahwa toko sedang ditutup sementara.
                        </p>
                    </div>
                    
                    <button
                        onClick={toggleStoreStatus}
                        className={`relative inline-flex h-10 w-[72px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none shadow-inner ${storeStatus === 'open' ? 'bg-slate-900 shadow-slate-900/10' : 'bg-slate-300'}`}
                        role="switch"
                        aria-checked={storeStatus === 'open'}
                    >
                        <span className="sr-only">Toggle store status</span>
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-9 w-9 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${storeStatus === 'open' ? 'translate-x-[32px]' : 'translate-x-0'}`}
                        />
                    </button>
                </div>

                {/* Additional Settings if closed */}
                <div className={`transition-all duration-500 overflow-hidden ${storeStatus === 'closed' ? 'opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-4'}`}>
                    <div className="p-6 md:p-8 rounded-3xl bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 space-y-8">
                        <div className="flex items-center gap-4 border-b border-white/40 pb-6">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                                <span className="material-symbols-outlined text-[20px]!">draw</span>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Penyesuaian Layar Tutup</h3>
                                <p className="text-xs text-slate-500 font-medium">Kustomisasi layar yang muncul saat toko tutup.</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 block">Judul Halaman</label>
                                    <input 
                                        type="text" 
                                        value={closedTitle || ''} 
                                        onChange={e => setClosedTitle?.(e.target.value)}
                                        placeholder="Contoh: Kami Sedang Tutup"
                                        className="w-full bg-white/50 backdrop-blur-md border border-white/60 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-500/10 rounded-2xl p-4 outline-none transition-all duration-300 text-sm font-medium text-slate-900 shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 block">Pesan Detail</label>
                                    <textarea 
                                        value={closedDescription || ''} 
                                        onChange={e => setClosedDescription?.(e.target.value)}
                                        rows={4}
                                        placeholder="Jelaskan kepada pelanggan kapan mereka bisa kembali..."
                                        className="w-full bg-white/50 backdrop-blur-md border border-white/60 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-500/10 rounded-2xl p-4 outline-none transition-all duration-300 text-sm font-medium text-slate-900 resize-none shadow-inner"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 block">Gambar Background (Opsional)</label>
                                    
                                    <div className="space-y-4">
                                        <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/40 px-6 py-8 hover:bg-white/80 hover:border-slate-400 transition-all text-center group">
                                            <div className="space-y-3 flex flex-col items-center">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-slate-600 transition-all duration-300 shadow-sm border border-slate-200">
                                                    <span className="material-symbols-outlined text-[24px]!">add_photo_alternate</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">
                                                    Klik untuk mengunggah gambar latar
                                                </p>
                                                <p className="text-[11px] text-slate-400 font-medium">
                                                    (Disarankan gambar landscape gelap/artistik)
                                                </p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const f = e.target.files?.[0];
                                                    if (f) uploadClosedBackground?.(f);
                                                }}
                                            />
                                        </label>

                                        {closedBackground && (
                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/40 shadow-md bg-slate-900 group/cb">
                                                <Image 
                                                    src={closedBackground} 
                                                    alt="Closed Background" 
                                                    fill 
                                                    className="object-cover opacity-60 group-hover/cb:scale-105 transition-transform duration-700" 
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center p-4 bg-linear-to-t from-black/40 to-transparent">
                                                    <p className="text-white font-serif italic text-2xl tracking-tight text-center max-w-[200px] wrap-break-word drop-shadow-md">
                                                        {closedTitle || 'Preview'}
                                                    </p>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => uploadClosedBackground?.(new File([], ''))}
                                                    className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 hover:bg-black backdrop-blur-md text-white transition-all shadow-lg"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]!">close</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-6 border-t border-white/40 mt-6 md:flex justify-end">
                            <button 
                                onClick={updateClosedStoreSettings}
                                className="w-full md:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-lg transition-all flex justify-center items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]!">save</span>
                                Simpan Kustomisasi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

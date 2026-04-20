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
            <header className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-charcoal">Status & Akses Toko</h1>
                <p className="text-sm text-muted-foreground">Kelola siapa saja yang bisa mengakses katalog beserta penyesuaian tampilannya.</p>
            </header>

            <div className="space-y-8 max-w-4xl">
                {/* Main Toggles */}
                <div className="p-6 md:p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-charcoal/50 text-2xl!">storefront</span>
                            <h2 className="text-lg font-bold text-charcoal">Status Katalog</h2>
                            <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${storeStatus === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {storeStatus === 'open' ? 'Buka' : 'Tutup Sementara'}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                            Jika dimatikan, semua pengguna yang mengunjungi halaman katalog dan cerita akan diarahkan ke layar khusus yang menginformasikan bahwa toko sedang ditutup sementara.
                        </p>
                    </div>
                    
                    <button
                        onClick={toggleStoreStatus}
                        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${storeStatus === 'open' ? 'bg-charcoal' : 'bg-gray-200'}`}
                        role="switch"
                        aria-checked={storeStatus === 'open'}
                    >
                        <span className="sr-only">Toggle store status</span>
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${storeStatus === 'open' ? 'translate-x-6' : 'translate-x-0'}`}
                        />
                    </button>
                </div>

                {/* Additional Settings if closed */}
                <div className={`transition-all duration-500 overflow-hidden ${storeStatus === 'closed' ? 'opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-4'}`}>
                    <div className="p-6 md:p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 space-y-8">
                        <div className="flex items-center gap-3 border-b border-border/40 pb-6">
                            <span className="material-symbols-outlined text-charcoal/50">draw</span>
                            <div>
                                <h3 className="text-base font-bold text-charcoal">Penyesuaian Layar Tutup</h3>
                                <p className="text-xs text-muted-foreground">Kustomisasi layar yang muncul saat toko tutup.</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Judul Halaman</label>
                                    <input 
                                        type="text" 
                                        value={closedTitle || ''} 
                                        onChange={e => setClosedTitle?.(e.target.value)}
                                        placeholder="Contoh: Kami Sedang Tutup"
                                        className="w-full px-4 py-3 rounded-lg border border-charcoal/10 text-sm focus:outline-none focus:ring-1 focus:ring-charcoal transition-shadow bg-charcoal/5"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Pesan Detail</label>
                                    <textarea 
                                        value={closedDescription || ''} 
                                        onChange={e => setClosedDescription?.(e.target.value)}
                                        rows={4}
                                        placeholder="Jelaskan kepada pelanggan kapan mereka bisa kembali..."
                                        className="w-full px-4 py-3 rounded-lg border border-charcoal/10 text-sm focus:outline-none focus:ring-1 focus:ring-charcoal resize-none transition-shadow bg-charcoal/5"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Gambar Background (Opsional)</label>
                                    
                                    <div className="space-y-4">
                                        <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-charcoal/20 bg-charcoal/5 px-6 py-8 hover:bg-charcoal/10 hover:border-charcoal/40 transition-all text-center">
                                            <div className="space-y-2 flex flex-col items-center">
                                                <span className="material-symbols-outlined text-3xl text-charcoal/50">add_photo_alternate</span>
                                                <p className="text-xs font-medium text-charcoal">
                                                    Klik untuk mengunggah gambar latar
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
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
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-charcoal/10 bg-charcoal">
                                                <Image 
                                                    src={closedBackground} 
                                                    alt="Closed Background" 
                                                    fill 
                                                    className="object-cover opacity-60" 
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                                    <p className="text-white font-serif italic text-xl tracking-tight text-center max-w-[200px] wrap-break-word">
                                                        {closedTitle || 'Preview'}
                                                    </p>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        uploadClosedBackground?.(new File([], '')); // dummy to clear or add clear fn
                                                        // or simply leave as is, since there isn't a delete yet.
                                                    }}
                                                    className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]!">close</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-6 border-t border-border/40 mt-6 md:flex justify-end">
                            <button 
                                onClick={updateClosedStoreSettings}
                                className="w-full md:w-auto px-8 py-3 bg-charcoal text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-charcoal"
                            >
                                Simpan Kustomisasi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

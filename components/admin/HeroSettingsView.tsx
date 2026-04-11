import Image from 'next/image';

interface HeroSettingsViewProps {
    heroTitle: string;
    setHeroTitle: (val: string) => void;
    heroDescription: string;
    setHeroDescription: (val: string) => void;
    heroImages: string[];
    setHeroImages: (arr: string[]) => void;
    uploadHeroImage: (file: File, index: number) => void;
    updateHeroSettings: () => void;
    loading: boolean;
}

export default function HeroSettingsView({
    heroTitle,
    setHeroTitle,
    heroDescription,
    setHeroDescription,
    heroImages,
    setHeroImages,
    uploadHeroImage,
    updateHeroSettings,
    loading
}: HeroSettingsViewProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-charcoal">Pengaturan Hero</h1>
                <p className="text-sm text-muted-foreground">Kelola teks utama dan background hero landing page.</p>
            </header>

            <div className="max-w-2xl space-y-8">
                <div className="space-y-6 p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2 pb-4 border-b border-border/40">
                        <span className="material-symbols-outlined text-xl! text-charcoal/40">edit_document</span>
                        <h3 className="text-sm font-bold text-charcoal">Konten Teks</h3>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Judul Hero</label>
                            <input
                                type="text"
                                className="w-full bg-charcoal/5 border border-transparent focus:bg-white focus:border-charcoal/20 focus:ring-4 focus:ring-charcoal/5 rounded-xl p-3 outline-none transition-all text-sm font-medium"
                                value={heroTitle}
                                onChange={(e) => setHeroTitle(e.target.value)}
                                placeholder="strxdale's catalog"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Deskripsi Hero</label>
                            <textarea
                                rows={3}
                                className="w-full bg-charcoal/5 border border-transparent focus:bg-white focus:border-charcoal/20 focus:ring-4 focus:ring-charcoal/5 rounded-xl p-4 outline-none transition-all text-sm font-medium resize-y"
                                value={heroDescription}
                                onChange={(e) => setHeroDescription(e.target.value)}
                                placeholder="A refined selection of timeless essentials..."
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2 pl-2">
                        <span className="material-symbols-outlined text-xl! text-charcoal/40">imagesmode</span>
                        <h3 className="text-sm font-bold text-charcoal">Background Images</h3>
                    </div>

                    {[0, 1, 2].map((i) => (
                        <div key={i} className="space-y-4 p-6 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 group hover:ring-black/10 transition-all">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center text-charcoal">{i + 1}</span>
                                    Slide {i + 1}
                                </span>
                                {heroImages[i] && (
                                    <div className="relative w-16 h-10 rounded-md ring-1 ring-black/10 overflow-hidden shadow-sm">
                                        <Image src={heroImages[i]} alt="" width={64} height={40} className="object-cover w-full h-full" />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="flex-1">
                                    <input
                                        type="url"
                                        placeholder="URL Gambar..."
                                        className="w-full bg-charcoal/5 border border-transparent focus:bg-white focus:border-charcoal/20 focus:ring-4 focus:ring-charcoal/5 rounded-xl p-3 outline-none transition-all text-xs font-medium"
                                        value={heroImages[i] || ''}
                                        onChange={(e) => {
                                            const newImages = [...heroImages];
                                            newImages[i] = e.target.value;
                                            setHeroImages(newImages);
                                        }}
                                    />
                                </div>
                                <label className="shrink-0 cursor-pointer group">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) uploadHeroImage(file, i);
                                        }}
                                    />
                                    <div className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-charcoal/20 rounded-lg group-hover:bg-charcoal/5 group-hover:border-charcoal/40 transition-all text-charcoal">
                                        <span className="material-symbols-outlined text-lg!">upload_file</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block">Upload</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-border/40 pb-12">
                    <button
                        onClick={updateHeroSettings}
                        disabled={loading}
                        className="bg-charcoal text-white px-8 py-3 rounded-xl font-bold text-sm w-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                    >
                        {loading ? (
                            'Menyimpan...'
                        ) : (
                            <><span className="material-symbols-outlined text-lg!">save</span> Simpan Pengaturan</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

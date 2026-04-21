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
            <header className="mb-12 relative z-10">
                <h1 className="text-4xl font-black tracking-tight mb-3 text-slate-900">Pengaturan Hero</h1>
                <p className="text-base text-slate-500 font-medium">Kelola teks utama dan background hero landing page.</p>
            </header>

            <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Left Column: Konten Teks */}
                    <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 self-start">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/40">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                                <span className="material-symbols-outlined text-[20px]!">edit_document</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">Konten Teks</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2.5">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Judul Hero</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-500/10 rounded-2xl p-4 outline-none transition-all duration-300 text-sm font-semibold text-slate-900 shadow-inner"
                                    value={heroTitle}
                                    onChange={(e) => setHeroTitle(e.target.value)}
                                    placeholder="strxdale's catalog"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Deskripsi Hero</label>
                                <textarea
                                    rows={5}
                                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-500/10 rounded-2xl p-4 outline-none transition-all duration-300 text-sm font-medium text-slate-900 resize-y shadow-inner"
                                    value={heroDescription}
                                    onChange={(e) => setHeroDescription(e.target.value)}
                                    placeholder="A refined selection of timeless essentials..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Background Images */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4 pl-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                                <span className="material-symbols-outlined text-[20px]!">imagesmode</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">Background Images</h3>
                        </div>

                        {[0, 1, 2].map((i) => (
                            <div key={i} className="p-6 rounded-3xl bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 group hover:bg-white/60 transition-all duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-900 border border-slate-100">{i + 1}</span>
                                        Slide {i + 1}
                                    </span>
                                    {heroImages[i] && (
                                        <div className="relative w-20 h-12 rounded-lg ring-1 ring-black/5 overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                                            <Image src={heroImages[i]} alt="" width={80} height={48} className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="flex-1">
                                        <input
                                            type="url"
                                            placeholder="URL Gambar..."
                                            className="w-full bg-white/50 backdrop-blur-md border border-white/60 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-500/10 rounded-xl p-3.5 outline-none transition-all duration-300 text-sm font-medium text-slate-900 shadow-inner"
                                            value={heroImages[i] || ''}
                                            onChange={(e) => {
                                                const newImages = [...heroImages];
                                                newImages[i] = e.target.value;
                                                setHeroImages(newImages);
                                            }}
                                        />
                                    </div>
                                    <label className="shrink-0 cursor-pointer group/upload">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) uploadHeroImage(file, i);
                                            }}
                                        />
                                        <div className="flex items-center gap-2 px-5 py-3.5 bg-white/50 border border-slate-200/60 rounded-xl group-hover/upload:bg-white group-hover/upload:border-slate-400 transition-all text-slate-600 group-hover/upload:text-slate-900 shadow-sm hover:shadow-md">
                                            <span className="material-symbols-outlined text-[20px]!">upload_file</span>
                                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] hidden sm:inline-block">Upload</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-8 border-t border-white/40 pb-12 flex justify-end">
                    <button
                        onClick={updateHeroSettings}
                        disabled={loading}
                        className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold text-sm w-full md:w-auto hover:bg-slate-800 hover:shadow-lg disabled:opacity-50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                             <><span className="material-symbols-outlined animate-spin text-[20px]!">sync</span> Menyimpan...</>
                        ) : (
                            <><span className="material-symbols-outlined text-[20px]!">save</span> Simpan Pengaturan</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

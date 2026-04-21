import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface GallerySettingsViewProps {
    landingGalleryImages: string[];
    setLandingGalleryImages: (images: string[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export default function GallerySettingsView({
    landingGalleryImages,
    setLandingGalleryImages,
    loading,
    setLoading
}: GallerySettingsViewProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-12 relative z-10">
                <h1 className="text-4xl font-black tracking-tight mb-3 text-slate-900">Pengaturan Galeri</h1>
                <p className="text-base text-slate-500 font-medium">Kelola koleksi foto yang akan ditampilkan pada halaman utama.</p>
            </header>

            <div className="space-y-8 relative z-10">
                <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 group">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/40">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                                <span className="material-symbols-outlined text-[20px]!">photo_library</span>
                            </div>
                            Daftar Foto Galeri
                        </h3>
                        <label className="cursor-pointer group/btn bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                    const files = Array.from(e.target.files || []);
                                    if (files.length === 0) return;
                                    setLoading(true);
                                    const newUrls = [...landingGalleryImages];

                                    for (const file of files) {
                                        const fileExt = file.name.split('.').pop();
                                        const fileName = `gallery-${Math.random()}.${fileExt}`;
                                        const filePath = `${fileName}`;

                                        const { error: uploadError } = await supabase.storage
                                            .from('hero-images')
                                            .upload(filePath, file);

                                        if (!uploadError) {
                                            const { data: { publicUrl } } = supabase.storage
                                                .from('hero-images')
                                                .getPublicUrl(filePath);
                                            newUrls.push(publicUrl);
                                        } else {
                                            console.error('Upload error:', uploadError);
                                        }
                                    }

                                    setLandingGalleryImages(newUrls);
                                    setLoading(false);
                                }}
                            />
                            <span className="material-symbols-outlined text-lg!">add_photo_alternate</span>
                            Tambah Foto
                        </label>
                    </div>

                    {landingGalleryImages.length === 0 ? (
                        <div className="py-24 text-center rounded-3xl bg-white/40 border border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group/empty">
                            <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-100/50" />
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6 relative z-10 group-hover/empty:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[40px]! text-slate-300">hide_image</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2 relative z-10">Galeri Kosong</h3>
                            <p className="text-sm text-slate-500 max-w-sm px-4 relative z-10 font-medium">Belum ada foto di galeri halaman utama. Klik tombol Tambah Foto untuk mulai menyusun galeri.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {landingGalleryImages.map((url, idx) => (
                                <div key={idx} className="relative aspect-3/4 group/img rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ring-1 ring-black/5 hover:ring-black/10 transition-all duration-300 bg-slate-100">
                                    <Image src={url} alt="" fill className="object-cover group-hover/img:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <button
                                            onClick={() => {
                                                const updated = landingGalleryImages.filter((_, i) => i !== idx);
                                                setLandingGalleryImages(updated);
                                            }}
                                            className="w-10 h-10 bg-black/80 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:bg-black transition-all ml-auto tooltip-delete border border-white/20"
                                        >
                                            <span className="material-symbols-outlined text-[20px]!">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-10 pt-8 border-t border-white/40 flex justify-end">
                        <button
                            onClick={async () => {
                                setLoading(true);
                                const { error } = await supabase
                                    .from('site_settings')
                                    .upsert({ key: 'landing_gallery', value: landingGalleryImages });
                                setLoading(false);
                                if (error) alert('Error: ' + error.message);
                                else alert('Galeri berhasil diperbarui!');
                            }}
                            disabled={loading}
                            className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-slate-800 hover:shadow-lg disabled:opacity-50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        >
                            {loading ? (
                                <><span className="material-symbols-outlined animate-spin text-[20px]!">sync</span> Menyimpan...</>
                            ) : (
                                <><span className="material-symbols-outlined text-[20px]!">save</span> Simpan Perubahan Galeri</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

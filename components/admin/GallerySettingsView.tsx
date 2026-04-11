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
            <header className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-charcoal">Pengaturan Galeri</h1>
                <p className="text-sm text-muted-foreground">Kelola koleksi foto yang akan ditampilkan pada halaman utama.</p>
            </header>

            <div className="space-y-8">
                <div className="p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/40">
                        <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl! text-charcoal/40">photo_library</span>
                            Daftar Foto Galeri
                        </h3>
                        <label className="cursor-pointer group bg-charcoal text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-charcoal/90 transition-all shadow-sm ring-1 ring-black/10 flex items-center gap-2">
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
                        <div className="py-24 text-center rounded-2xl bg-charcoal/5 border border-dashed border-charcoal/20 flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-4xl! text-charcoal/30 mb-4">hide_image</span>
                            <h3 className="text-lg font-bold text-charcoal mb-1">Galeri Kosong</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">Belum ada foto di galeri halaman utama. Klik tombol Tambah Foto untuk mulai menyusun galeri.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {landingGalleryImages.map((url, idx) => (
                                <div key={idx} className="relative aspect-3/4 group rounded-2xl overflow-hidden ring-1 ring-black/10 shadow-sm hover:ring-black/20 hover:shadow-md transition-all bg-charcoal/5">
                                    <Image src={url} alt="" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button
                                            onClick={() => {
                                                const updated = landingGalleryImages.filter((_, i) => i !== idx);
                                                setLandingGalleryImages(updated);
                                            }}
                                            className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:bg-red-600 transition-all tooltip-delete"
                                        >
                                            <span className="material-symbols-outlined text-lg!">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-10 pt-6 border-t border-border/40 flex justify-end">
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
                            className="bg-charcoal text-white px-10 py-4 rounded-xl font-bold text-sm hover:opacity-95 hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {loading ? (
                                <><span className="material-symbols-outlined animate-spin text-lg!">sync</span> Menyimpan...</>
                            ) : (
                                <><span className="material-symbols-outlined text-lg!">save</span> Simpan Perubahan Galeri</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

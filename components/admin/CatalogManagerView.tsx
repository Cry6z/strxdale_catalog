import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { CatalogItem } from './types';

interface CatalogManagerViewProps {
    items: CatalogItem[];
    loading: boolean;
    showForm: boolean;
    setShowForm: (show: boolean) => void;
    editingId: string | null;
    formData: any;
    setFormData: (data: any) => void;
    handleSubmit: (e: React.FormEvent) => void;
    resetForm: () => void;
    categories: string[];
    updateCategories: (cats: string[]) => void;
    deleteCategory: (cat: string) => void;
    itemImageFile: File | null;
    setItemImageFile: (file: File | null) => void;
    galleryImageFiles: File[];
    setGalleryImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
    galleryUrls: string[];
    setGalleryUrls: React.Dispatch<React.SetStateAction<string[]>>;
    handleEdit: (item: CatalogItem) => void;
    deleteItem: (id: string) => void;
}

export default function CatalogManagerView({
    items, loading, showForm, setShowForm, editingId, formData, setFormData,
    handleSubmit, resetForm, categories, updateCategories, deleteCategory,
    itemImageFile, setItemImageFile, galleryImageFiles, setGalleryImageFiles,
    galleryUrls, setGalleryUrls, handleEdit, deleteItem
}: CatalogManagerViewProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-12 relative z-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-3 text-slate-900">Katalog</h1>
                    <p className="text-base text-slate-500 font-medium">Kelola item koleksi Anda.</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        setShowForm(!showForm);
                    }}
                    className={`px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 ${showForm ? 'bg-white/60 backdrop-blur-md text-slate-700 hover:bg-white border border-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                    <span className="material-symbols-outlined text-[20px]!">{showForm ? 'close' : 'add'}</span>
                    {showForm ? 'Batal' : 'Tambah Item Baru'}
                </button>
            </div>

            {showForm && (
                <div className="mb-12 p-8 rounded-3xl bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 animate-in slide-in-from-top-4 duration-500 relative z-10">
                    <div className="flex items-center gap-4 border-b border-white/40 pb-6 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                             <span className="material-symbols-outlined text-[20px]!">{editingId ? 'edit' : 'add_circle'}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">{editingId ? 'Ubah Item' : 'Tambah Item Baru'}</h2>
                            <p className="text-xs text-slate-500 font-medium mt-1">Lengkapi detail produk di bawah ini.</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                Nama Item
                                <span className="text-slate-900">*</span>
                            </label>
                            <input required type="text" className="w-full bg-white/50 backdrop-blur-md border border-white/60 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-500/10 rounded-2xl p-4 outline-none transition-all duration-300 text-sm font-semibold text-slate-900 shadow-inner" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Cth: The Signature Totebag" />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    Harga (Rp)
                                    <span className="text-slate-900">*</span>
                                </label>
                                <input
                                    disabled={formData.is_preorder || formData.is_showcase}
                                    required={!formData.is_preorder && !formData.is_showcase}
                                    type="number"
                                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-500/10 rounded-2xl p-4 outline-none transition-all duration-300 text-sm font-semibold text-slate-900 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder={formData.is_showcase ? "Hanya Showcase" : formData.is_preorder ? "Hanya Pre-order" : "0"}
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-transparent hover:border-charcoal/10 hover:bg-charcoal/5 transition-all">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="peer hidden"
                                        checked={formData.is_preorder}
                                        onChange={(e) => setFormData({ ...formData, is_preorder: e.target.checked })}
                                    />
                                    <div className="w-5 h-5 border-2 border-charcoal/20 rounded peer-checked:bg-charcoal peer-checked:border-charcoal transition-all flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white! text-sm! peer-checked:block hidden">check</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-widest text-charcoal group-hover:text-charcoal transition-colors">Hanya Pre-order</span>
                                    <span className="text-[10px] text-muted-foreground">Tidak menampilkan harga tetap.</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-transparent hover:border-charcoal/10 hover:bg-charcoal/5 transition-all">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="peer hidden"
                                        checked={formData.is_showcase}
                                        onChange={(e) => setFormData({ ...formData, is_showcase: e.target.checked })}
                                    />
                                    <div className="w-5 h-5 border-2 border-charcoal/20 rounded peer-checked:bg-charcoal peer-checked:border-charcoal transition-all flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white! text-sm! peer-checked:block hidden">check</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-widest text-charcoal group-hover:text-charcoal transition-colors">Hanya Showcase</span>
                                    <span className="text-[10px] text-muted-foreground">Sembunyikan tombol order WhatsApp.</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-transparent hover:border-charcoal/10 hover:bg-charcoal/5 transition-all">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="peer hidden"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    />
                                    <div className="w-5 h-5 border-2 border-charcoal/20 rounded peer-checked:bg-charcoal peer-checked:border-charcoal transition-all flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white! text-sm! peer-checked:block hidden">check</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-widest text-charcoal group-hover:text-charcoal transition-colors">Item Unggulan</span>
                                    <span className="text-[10px] text-muted-foreground">Tampilkan di halaman depan.</span>
                                </div>
                            </label>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    Kategori
                                    <span className="text-slate-900">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const res = await fetch('/api/test-supabase');
                                        const data = await res.json();
                                        alert(data.message || (data.status === 'success' ? 'Database synced!' : 'Error syncing database'));
                                    }}
                                    className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-charcoal transition-colors px-2 py-1 rounded bg-black/5"
                                >
                                    Sinkronisasi DB
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <select className="flex-1 bg-white/50 backdrop-blur-md border border-white/60 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-500/10 rounded-2xl p-4 outline-none transition-all duration-300 text-sm font-semibold text-slate-900 shadow-inner" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                    {categories.map(cat => (
                                        <option key={cat}>{cat}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const cat = prompt('Masukkan nama kategori baru:');
                                        if (cat && !categories.includes(cat)) {
                                            const updated = [...categories, cat];
                                            updateCategories(updated);
                                            setFormData({ ...formData, category: cat });
                                        }
                                    }}
                                    className="px-4 bg-charcoal text-white rounded-xl hover:bg-charcoal/90 transition-colors shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-lg! align-middle">add</span>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {categories.map(cat => (
                                    <span key={cat} className="group flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full bg-white shadow-sm ring-1 ring-black/5 font-bold uppercase tracking-widest text-charcoal">
                                        {cat}
                                        <button
                                            type="button"
                                            onClick={() => deleteCategory(cat)}
                                            className="text-muted-foreground hover:text-slate-900 transition-colors opacity-50 group-hover:opacity-100"
                                        >
                                            <span className="material-symbols-outlined text-[14px]!">close</span>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                Foto Produk Utama
                                <span className="text-slate-900">*</span>
                            </label>
                            <div className="flex gap-4 items-center">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="URL Gambar (Opsional jika upload)"
                                        className="w-full bg-white/50 backdrop-blur-md border border-white/60 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-500/10 rounded-2xl p-4 outline-none transition-all duration-300 text-sm font-semibold text-slate-900 shadow-inner"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>
                                <label className="shrink-0 cursor-pointer group">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => setItemImageFile(e.target.files?.[0] || null)}
                                    />
                                    <div className={`flex items-center gap-2 px-6 py-3 border border-dashed rounded-xl transition-all ${itemImageFile ? 'bg-charcoal text-white border-charcoal shadow-md' : 'border-charcoal/20 hover:bg-charcoal/5 text-charcoal'}`}>
                                        <span className="material-symbols-outlined text-lg!">{itemImageFile ? 'check_circle' : 'upload_file'}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {itemImageFile ? 'Terpilih' : 'Upload'}
                                        </span>
                                    </div>
                                </label>
                            </div>
                            {itemImageFile && (
                                <p className="text-[10px] text-charcoal font-bold uppercase tracking-widest mt-2 bg-charcoal/5 p-2 rounded inline-block">
                                    <span className="opacity-50">Menunggu di-upload:</span> {itemImageFile.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Galeri Foto Tambahan (Opsional)</label>
                            <div className="flex gap-3 items-center overflow-x-auto pb-4 hide-scrollbar">
                                <label className="shrink-0 cursor-pointer group">
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            setGalleryImageFiles(prev => [...prev, ...files]);
                                        }}
                                    />
                                    <div className="flex flex-col items-center justify-center w-28 aspect-4/5 border border-dashed border-charcoal/20 rounded-xl hover:bg-charcoal/5 hover:border-charcoal/40 transition-all text-charcoal/50 hover:text-charcoal bg-white">
                                        <span className="material-symbols-outlined text-2xl! mb-1">add_photo_alternate</span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Tambah Foto</span>
                                    </div>
                                </label>
                                {galleryImageFiles.map((file, idx) => (
                                    <div key={idx} className="relative w-28 aspect-4/5 shrink-0 group">
                                        <div className="w-full h-full bg-white ring-1 ring-black/5 rounded-xl flex items-center justify-center p-3 text-center shadow-sm overflow-hidden">
                                            <span className="text-[10px] font-bold text-charcoal/60 truncate w-full wrap-break-word whitespace-normal leading-tight">{file.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setGalleryImageFiles(prev => prev.filter((_, i) => i !== idx))}
                                            className="absolute -top-2 -right-2 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                                        >
                                            <span className="material-symbols-outlined text-[16px]!">close</span>
                                        </button>
                                    </div>
                                ))}
                                {galleryUrls.map((url, idx) => (
                                    <div key={`url-${idx}`} className="relative w-28 aspect-4/5 shrink-0 group">
                                        <div className="w-full h-full bg-charcoal/5 rounded-xl overflow-hidden ring-1 ring-black/5 shadow-sm">
                                            <Image src={url} alt="" width={112} height={140} className="w-full h-full object-cover" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setGalleryUrls(prev => prev.filter((_, i) => i !== idx))}
                                            className="absolute -top-2 -right-2 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                                        >
                                            <span className="material-symbols-outlined text-[16px]!">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                Deskripsi Produk
                                <span className="text-slate-900">*</span>
                            </label>
                            <textarea required rows={4} className="w-full bg-white/50 backdrop-blur-md border border-white/60 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-500/10 rounded-2xl p-4 outline-none transition-all duration-300 text-sm font-semibold text-slate-900 shadow-inner resize-y" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Jelaskan detail produk Anda di sini..." />
                        </div>
                        <div className="md:col-span-2 pt-6 border-t border-white/40 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-slate-800 hover:shadow-lg transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5 flex items-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[20px]!">sync</span>
                                        Memproses...
                                    </>
                                ) : editingId ? (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]!">save</span>
                                        Simpan Perubahan
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]!">add_task</span>
                                        Simpan ke Katalog
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden relative z-10">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-black/5 backdrop-blur-sm border-b border-black/5">
                        <tr>
                            <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 w-1/2">Detail Produk</th>
                            <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Kategori</th>
                            <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Harga</th>
                            <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {loading ? (
                            <tr><td colSpan={4} className="p-12 text-center text-muted-foreground text-sm flex gap-2 justify-center items-center"><span className="material-symbols-outlined animate-spin text-muted-foreground">progress_activity</span> Memuat katalog...</td></tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-16 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/5 mb-4">
                                        <span className="material-symbols-outlined text-3xl! text-muted-foreground">inventory_2</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-charcoal mb-1">Katalog Kosong</h3>
                                    <p className="text-sm text-muted-foreground">Belum ada produk yang ditambahkan ke koleksi.</p>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="hover:bg-black/2 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-secondary/50 border border-black/5">
                                                <Image src={item.image_url || '/placeholder.png'} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
                                            </div>
                                            <div className="min-w-0 pr-4">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <Link
                                                        href={`/collection/${item.id}`}
                                                        target="_blank"
                                                        className="font-bold text-sm text-charcoal hover:underline truncate"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <span className="material-symbols-outlined text-[14px]! text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                                                    {item.is_featured && (
                                                        <span className="bg-charcoal text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest shrink-0">Unggulan</span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-muted-foreground line-clamp-1 break-all">{item.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/5 text-charcoal/70 uppercase font-bold tracking-widest whitespace-nowrap">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-sm text-charcoal whitespace-nowrap">
                                        {item.is_showcase ? (
                                            <span className="text-[10px] px-2 py-1 rounded border border-charcoal/20 text-charcoal/60 uppercase font-bold tracking-widest">Showcase</span>
                                        ) : item.price === 0 ? (
                                            <span className="text-[10px] px-2 py-1 rounded border border-charcoal/20 text-charcoal/60 uppercase font-bold tracking-widest">Pre Order</span>
                                        ) : (
                                            formatPrice(item.price)
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-charcoal transition-colors tooltip-edit">
                                                <span className="material-symbols-outlined text-lg!">edit</span>
                                            </button>
                                            <button onClick={() => deleteItem(item.id)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors tooltip-delete">
                                                <span className="material-symbols-outlined text-lg!">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

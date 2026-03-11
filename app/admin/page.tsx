'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface CatalogItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    gallery?: string[];
    is_showcase?: boolean;
    is_featured?: boolean;
}

export default function AdminDashboard() {
    const [view, setView] = useState<'overview' | 'catalog' | 'hero' | 'gallery'>('overview');
    const [items, setItems] = useState<CatalogItem[]>([]);
    const [heroImages, setHeroImages] = useState<string[]>(['', '', '']);
    const [landingGalleryImages, setLandingGalleryImages] = useState<string[]>([]);
    const [heroTitle, setHeroTitle] = useState("");
    const [heroDescription, setHeroDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState<string[]>(['Lifestyle', 'Accessories', 'Design', 'Vintage']);
    const [itemImageFile, setItemImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: 'Lifestyle',
        is_preorder: false,
        is_showcase: false,
        is_featured: false,
    });
    const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
    const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const router = useRouter();

    const fetchCategories = useCallback(async () => {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('key', 'catalog_categories')
            .single();

        if (data && data.value) {
            setCategories(data.value);
            if (data.value.length > 0) {
                setFormData(prev => ({ ...prev, category: data.value[0] }));
            }
        }
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching categories:', error);
        }
    }, []);

    const fetchHeroSettings = useCallback(async () => {
        const { data: images } = await supabase
            .from('site_settings')
            .select('*')
            .eq('key', 'hero_images')
            .single();
        if (images) setHeroImages(images.value);

        const { data: gallery } = await supabase
            .from('site_settings')
            .select('*')
            .eq('key', 'landing_gallery')
            .single();
        if (gallery) setLandingGalleryImages(gallery.value);

        const { data: title } = await supabase
            .from('site_settings')
            .select('*')
            .eq('key', 'hero_title')
            .single();
        if (title) setHeroTitle(title.value);

        const { data: desc } = await supabase
            .from('site_settings')
            .select('*')
            .eq('key', 'hero_description')
            .single();
        if (desc) setHeroDescription(desc.value);
    }, []);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('catalog_items')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error:', error);
        else setItems(data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = localStorage.getItem('admin_auth');
            if (!isAuth) {
                router.push('/access-portal');
                return;
            }

            // Diagnostic connection check
            try {
                const { error } = await supabase.from('catalog_items').select('count', { count: 'exact', head: true });
                if (error) {
                    console.error('Initial Connection Check Failed:', error);
                    if (error.message === 'Failed to fetch') {
                        alert('PERINGATAN: Tidak dapat terhubung ke Supabase. Periksa koneksi internet atau environment variables Anda.');
                    }
                } else {
                    console.log('Supabase connection verified successfully.');
                }
            } catch (err) {
                console.error('Connection check error:', err);
            }

            await Promise.all([
                fetchItems(),
                fetchHeroSettings(),
                fetchCategories()
            ]);
        };

        checkAuth();
    }, [router, fetchItems, fetchHeroSettings, fetchCategories]);

    async function updateCategories(newCategories: string[]) {
        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({ key: 'catalog_categories', value: newCategories });

            if (error) {
                console.error('Supabase Error:', error);
                alert('Error updating categories: ' + error.message);
            } else {
                setCategories(newCategories);
            }
        } catch (err: unknown) {
            console.error('Detailed Network Error:', err);
            if (err instanceof Error && err.message === 'Failed to fetch') {
                alert('Kesalahan Koneksi: Tidak dapat menghubungi Supabase. Pastikan environment variables sudah benar dan restart server Anda.');
            } else if (err instanceof Error) {
                alert('Error: ' + err.message);
            }
        }
    }

    const deleteCategory = (catToDelete: string) => {
        if (!confirm(`Are you sure you want to delete the category "${catToDelete}"?`)) return;
        const updated = categories.filter(c => c !== catToDelete);
        updateCategories(updated);
    };

    async function updateHeroSettings() {
        setLoading(true);
        try {
            const results = await Promise.all([
                supabase.from('site_settings').upsert({ key: 'hero_images', value: heroImages }, { onConflict: 'key' }),
                supabase.from('site_settings').upsert({ key: 'hero_title', value: heroTitle }, { onConflict: 'key' }),
                supabase.from('site_settings').upsert({ key: 'hero_description', value: heroDescription }, { onConflict: 'key' })
            ]);

            const errors = results.filter(r => r.error);

            if (errors.length > 0) {
                console.error('Errors updating hero settings:', errors);
                alert('Kesalahan saat menyimpan: ' + errors.map(e => e.error?.message).join(', '));
            } else {
                alert('Pengaturan hero berhasil diperbarui!');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('Terjadi kesalahan yang tidak terduga.');
        } finally {
            setLoading(false);
        }
    }

    async function uploadHeroImage(file: File, index: number) {
        setLoading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `hero-${index + 1}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('hero-images')
            .upload(filePath, file);

        if (uploadError) {
            alert('Upload error: ' + uploadError.message);
            setLoading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('hero-images')
            .getPublicUrl(filePath);

        const newImages = [...heroImages];
        newImages[index] = publicUrl;
        setHeroImages(newImages);
        setLoading(false);
    }

    // Stats calculations
    const totalItems = items.length;
    const totalValue = items.reduce((acc, item) => acc + (item.price || 0), 0);
    const recentItems = items.slice(0, 3);

    const handleEdit = (item: CatalogItem) => {
        setEditingId(item.id);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            image_url: item.image_url,
            category: item.category,
            is_preorder: item.price === 0,
            is_showcase: item.is_showcase || false,
            is_featured: item.is_featured || false,
        });
        setGalleryUrls(item.gallery || []);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            image_url: '',
            category: categories[0] || 'Lifestyle',
            is_preorder: false,
            is_showcase: false,
            is_featured: false
        });
        setItemImageFile(null);
        setGalleryImageFiles([]);
        setGalleryUrls([]);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        let finalImageUrl = formData.image_url;

        if (itemImageFile) {
            const fileExt = itemImageFile.name.split('.').pop();
            const fileName = `catalog-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('hero-images')
                .upload(filePath, itemImageFile);

            if (uploadError) {
                alert('Image upload error: ' + uploadError.message);
                setLoading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('hero-images')
                .getPublicUrl(filePath);

            finalImageUrl = publicUrl;
        }

        if (!finalImageUrl) {
            alert('Please provide an image URL or upload a file.');
            setLoading(false);
            return;
        }

        const finalGalleryUrls = [...galleryUrls];
        for (const file of galleryImageFiles) {
            const fileExt = file.name.split('.').pop();
            const fileName = `catalog-gallery-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('hero-images')
                .upload(filePath, file);

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('hero-images')
                    .getPublicUrl(filePath);
                finalGalleryUrls.push(publicUrl);
            }
        }

        const { is_preorder, is_showcase, is_featured, ...rest } = formData;
        const submitData = {
            ...rest,
            image_url: finalImageUrl,
            price: (is_preorder || is_showcase) ? 0 : parseFloat(formData.price),
            gallery: finalGalleryUrls,
            is_showcase: is_showcase,
            is_featured: is_featured
        };

        let result;
        if (editingId) {
            result = await supabase
                .from('catalog_items')
                .update(submitData)
                .eq('id', editingId);
        } else {
            result = await supabase
                .from('catalog_items')
                .insert([submitData]);
        }

        setLoading(false);
        if (result.error) {
            console.error('Error saving item detail:', JSON.stringify(result.error, null, 2));
            alert('Error saving item: ' + (result.error?.message || 'Unknown error'));
        } else {
            setShowForm(false);
            resetForm();
            fetchItems();
            alert(editingId ? 'Item updated successfully!' : 'Item added successfully!');
        }
    }

    async function deleteItem(id: string) {
        if (!confirm('Are you sure you want to delete this item?')) return;
        const { error } = await supabase
            .from('catalog_items')
            .delete()
            .eq('id', id);

        if (error) alert('Error deleting item: ' + error.message);
        else fetchItems();
    }

    return (
        <div className="flex min-h-screen bg-background font-sans">
            <aside className="w-64 border-r border-border/40 bg-white/50 backdrop-blur-3xl flex flex-col fixed inset-y-0 text-charcoal">
                <div className="p-8 pb-4">
                    <h2 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50 mb-1">Portal</h2>
                    <p className="text-xl font-bold tracking-tight">strxdale&apos;s catalog</p>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1.5">
                    <button
                        onClick={() => setView('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'overview' ? 'bg-black/5 text-charcoal font-bold shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:bg-black/5 hover:text-charcoal'}`}
                    >
                        <span className={`material-symbols-outlined !text-lg ${view === 'overview' ? 'opacity-100' : 'opacity-70'}`}>dashboard</span>
                        Ringkasan
                    </button>
                    <button
                        onClick={() => setView('catalog')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'catalog' ? 'bg-black/5 text-charcoal font-bold shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:bg-black/5 hover:text-charcoal'}`}
                    >
                        <span className={`material-symbols-outlined !text-lg ${view === 'catalog' ? 'opacity-100' : 'opacity-70'}`}>inventory_2</span>
                        Katalog
                    </button>
                    <button
                        onClick={() => setView('hero')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'hero' ? 'bg-black/5 text-charcoal font-bold shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:bg-black/5 hover:text-charcoal'}`}
                    >
                        <span className={`material-symbols-outlined !text-lg ${view === 'hero' ? 'opacity-100' : 'opacity-70'}`}>image_search</span>
                        Pengaturan Hero
                    </button>
                    <button
                        onClick={() => setView('gallery')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'gallery' ? 'bg-black/5 text-charcoal font-bold shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:bg-black/5 hover:text-charcoal'}`}
                    >
                        <span className={`material-symbols-outlined !text-lg ${view === 'gallery' ? 'opacity-100' : 'opacity-70'}`}>collections</span>
                        Galeri Landing
                    </button>
                    <div className="pt-4 mt-4 border-t border-border/40">
                        <Link
                            href="/"
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-black/5 hover:text-charcoal transition-all"
                        >
                            <span className="material-symbols-outlined !text-lg opacity-70">open_in_new</span>
                            Lihat Situs
                        </Link>
                    </div>
                </nav>
                <div className="p-8">
                    <p className="text-[10px] font-medium text-muted-foreground/40">v1.2.0-stable</p>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-12">
                <div className="max-w-6xl mx-auto">
                    {view === 'overview' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="mb-12">
                                <h1 className="text-3xl font-bold tracking-tight mb-2 text-charcoal">Ringkasan</h1>
                                <p className="text-sm text-muted-foreground">Statistik umum dan aktivitas terbaru koleksi Anda.</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <div className="p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                        <span className="material-symbols-outlined !text-8xl">inventory_2</span>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Item</span>
                                    <p className="text-4xl font-bold mt-4 text-charcoal">{totalItems}</p>
                                </div>
                                <div className="p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                        <span className="material-symbols-outlined !text-8xl">payments</span>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nilai Koleksi</span>
                                    <p className="text-4xl font-bold mt-4 text-charcoal">${totalValue.toLocaleString()}</p>
                                </div>
                                <div className="p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                        <span className="material-symbols-outlined !text-8xl">category</span>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kategori</span>
                                    <p className="text-4xl font-bold mt-4 text-charcoal">{categories.length}</p>
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
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/50 border border-black/5">
                                                    <Image src={item.image_url || '/placeholder.png'} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-charcoal truncate">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">${item.price}</p>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined !text-sm text-muted-foreground">chevron_right</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-muted-foreground">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => { setView('catalog'); setShowForm(true); }}
                                            className="p-6 rounded-2xl bg-charcoal/5 hover:bg-charcoal/10 transition-all text-left group border border-transparent hover:border-charcoal/10"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined !text-lg text-charcoal">add_circle</span>
                                            </div>
                                            <p className="text-sm font-bold text-charcoal">Tambah Item</p>
                                            <p className="text-xs text-muted-foreground mt-1">Upload produk baru</p>
                                        </button>
                                        <button
                                            onClick={() => setView('catalog')}
                                            className="p-6 rounded-2xl bg-charcoal/5 hover:bg-charcoal/10 transition-all text-left group border border-transparent hover:border-charcoal/10"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined !text-lg text-charcoal">inventory</span>
                                            </div>
                                            <p className="text-sm font-bold text-charcoal">Kelola Katalog</p>
                                            <p className="text-xs text-muted-foreground mt-1">Edit & hapus produk</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : view === 'hero' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="mb-12">
                                <h1 className="text-3xl font-bold tracking-tight mb-2 text-charcoal">Pengaturan Hero</h1>
                                <p className="text-sm text-muted-foreground">Kelola teks utama dan background hero landing page.</p>
                            </header>

                            <div className="max-w-2xl space-y-8">
                                <div className="space-y-6 p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 relative overflow-hidden">
                                    <div className="flex items-center gap-2 mb-2 pb-4 border-b border-border/40">
                                        <span className="material-symbols-outlined !text-xl text-charcoal/40">edit_document</span>
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
                                        <span className="material-symbols-outlined !text-xl text-charcoal/40">imagesmode</span>
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
                                                <label className="flex-shrink-0 cursor-pointer group">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) uploadHeroImage(file, i);
                                                        }}
                                                    />
                                                    <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white ring-1 ring-black/10 hover:bg-black/5 text-charcoal transition-all shadow-sm cursor-pointer">
                                                        <span className="material-symbols-outlined !text-lg text-charcoal/50">upload_file</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={updateHeroSettings}
                                            disabled={loading}
                                            className="bg-charcoal text-white px-10 py-4 rounded-xl font-bold text-sm hover:opacity-95 hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                                        >
                                            {loading ? (
                                                <><span className="material-symbols-outlined animate-spin !text-lg">sync</span> Menyimpan...</>
                                            ) : (
                                                <><span className="material-symbols-outlined !text-lg">save</span> Simpan Perubahan Hero</>
                                            )}
                                        </button>
                                    </div>

                                    <div className="p-5 bg-charcoal/5 rounded-xl flex items-start gap-3 text-charcoal/60">
                                        <span className="material-symbols-outlined !text-xl flex-shrink-0 mt-0.5">lightbulb</span>
                                        <p className="text-[11px] leading-relaxed font-medium">
                                            Tip: Gunakan gambar berkualitas tinggi berformat JPG atau PNG. Resolusi (16:9) landscape sangat disarankan untuk hero section layar penuh.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : view === 'gallery' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="mb-12">
                                <h1 className="text-3xl font-bold tracking-tight mb-2 text-charcoal">Galeri Landing</h1>
                                <p className="text-sm text-muted-foreground">Kelola koleksi foto yang akan ditampilkan pada halaman utama.</p>
                            </header>

                            <div className="space-y-8">
                                <div className="p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/40">
                                        <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                                            <span className="material-symbols-outlined !text-xl text-charcoal/40">photo_library</span>
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
                                            <span className="material-symbols-outlined !text-lg">add_photo_alternate</span>
                                            Tambah Foto
                                        </label>
                                    </div>

                                    {landingGalleryImages.length === 0 ? (
                                        <div className="py-24 text-center rounded-2xl bg-charcoal/5 border border-dashed border-charcoal/20 flex flex-col items-center justify-center">
                                            <span className="material-symbols-outlined !text-4xl text-charcoal/30 mb-4">hide_image</span>
                                            <h3 className="text-lg font-bold text-charcoal mb-1">Galeri Kosong</h3>
                                            <p className="text-sm text-muted-foreground max-w-sm">Belum ada foto di galeri halaman utama. Klik tombol Tambah Foto untuk mulai menyusun galeri.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                            {landingGalleryImages.map((url, idx) => (
                                                <div key={idx} className="relative aspect-[3/4] group rounded-2xl overflow-hidden ring-1 ring-black/10 shadow-sm hover:ring-black/20 hover:shadow-md transition-all bg-charcoal/5">
                                                    <Image src={url} alt="" fill className="object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                        <button
                                                            onClick={() => {
                                                                const updated = landingGalleryImages.filter((_, i) => i !== idx);
                                                                setLandingGalleryImages(updated);
                                                            }}
                                                            className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:bg-red-600 transition-all tooltip-delete"
                                                        >
                                                            <span className="material-symbols-outlined !text-lg">delete</span>
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
                                                <><span className="material-symbols-outlined animate-spin !text-lg">sync</span> Menyimpan...</>
                                            ) : (
                                                <><span className="material-symbols-outlined !text-lg">save</span> Simpan Perubahan Galeri</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h1 className="text-4xl font-bold tracking-tight mb-2">Catalog</h1>
                                    <p className="text-muted-foreground">Manage your collection items.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (showForm) resetForm();
                                        setShowForm(!showForm);
                                    }}
                                    className="bg-charcoal text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined !text-lg">{showForm ? 'close' : 'add'}</span>
                                    {showForm ? 'Cancel' : 'Add New Item'}
                                </button>
                            </div>

                            {showForm && (
                                <div className="mb-12 p-8 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 animate-in slide-in-from-top-4 duration-300">
                                    <div className="border-b border-border/40 pb-4 mb-6">
                                        <h2 className="text-xl font-bold text-charcoal">{editingId ? 'Edit Item' : 'Tambah Item Baru'}</h2>
                                        <p className="text-xs text-muted-foreground mt-1">Lengkapi detail produk di bawah ini.</p>
                                    </div>
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                Nama Item
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input required type="text" className="w-full bg-charcoal/5 border border-transparent focus:bg-white focus:border-charcoal/20 focus:ring-4 focus:ring-charcoal/5 rounded-xl p-3 outline-none transition-all text-sm font-medium" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Cth: The Signature Totebag" />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                    Harga ($)
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    disabled={formData.is_preorder || formData.is_showcase}
                                                    required={!formData.is_preorder && !formData.is_showcase}
                                                    type="number"
                                                    className="w-full bg-charcoal/5 border border-transparent focus:bg-white focus:border-charcoal/20 focus:ring-4 focus:ring-charcoal/5 rounded-xl p-3 outline-none transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                    placeholder={formData.is_showcase ? "Showcase only" : formData.is_preorder ? "Pre-order only" : "0.00"}
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
                                                        <span className="material-symbols-outlined !text-white !text-sm peer-checked:block hidden">check</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-charcoal group-hover:text-charcoal transition-colors">Pre-order Only</span>
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
                                                        <span className="material-symbols-outlined !text-white !text-sm peer-checked:block hidden">check</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-charcoal group-hover:text-charcoal transition-colors">Showcase Only</span>
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
                                                        <span className="material-symbols-outlined !text-white !text-sm peer-checked:block hidden">check</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-charcoal group-hover:text-charcoal transition-colors">Featured Item</span>
                                                    <span className="text-[10px] text-muted-foreground">Tampilkan di halaman depan.</span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                    Kategori
                                                    <span className="text-red-500">*</span>
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
                                                <select className="flex-1 bg-charcoal/5 border border-transparent focus:bg-white focus:border-charcoal/20 focus:ring-4 focus:ring-charcoal/5 rounded-xl p-3 outline-none transition-all text-sm font-medium" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
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
                                                    <span className="material-symbols-outlined !text-lg align-middle">add</span>
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {categories.map(cat => (
                                                    <span key={cat} className="group flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full bg-white shadow-sm ring-1 ring-black/5 font-bold uppercase tracking-widest text-charcoal">
                                                        {cat}
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteCategory(cat)}
                                                            className="text-muted-foreground hover:text-red-500 transition-colors opacity-50 group-hover:opacity-100"
                                                        >
                                                            <span className="material-symbols-outlined !text-[14px]">close</span>
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                Foto Produk Utama
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-4 items-center">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder="URL Gambar (Opsional jika upload)"
                                                        className="w-full bg-charcoal/5 border border-transparent focus:bg-white focus:border-charcoal/20 focus:ring-4 focus:ring-charcoal/5 rounded-xl p-3 outline-none transition-all text-sm font-medium"
                                                        value={formData.image_url}
                                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                    />
                                                </div>
                                                <label className="flex-shrink-0 cursor-pointer group">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => setItemImageFile(e.target.files?.[0] || null)}
                                                    />
                                                    <div className={`flex items-center gap-2 px-6 py-3 border border-dashed rounded-xl transition-all ${itemImageFile ? 'bg-charcoal text-white border-charcoal shadow-md' : 'border-charcoal/20 hover:bg-charcoal/5 text-charcoal'}`}>
                                                        <span className="material-symbols-outlined !text-lg">{itemImageFile ? 'check_circle' : 'upload_file'}</span>
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
                                                <label className="flex-shrink-0 cursor-pointer group">
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
                                                    <div className="flex flex-col items-center justify-center w-28 aspect-[4/5] border border-dashed border-charcoal/20 rounded-xl hover:bg-charcoal/5 hover:border-charcoal/40 transition-all text-charcoal/50 hover:text-charcoal bg-white">
                                                        <span className="material-symbols-outlined !text-2xl mb-1">add_photo_alternate</span>
                                                        <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Tambah Foto</span>
                                                    </div>
                                                </label>
                                                {galleryImageFiles.map((file, idx) => (
                                                    <div key={idx} className="relative w-28 aspect-[4/5] flex-shrink-0 group">
                                                        <div className="w-full h-full bg-white ring-1 ring-black/5 rounded-xl flex items-center justify-center p-3 text-center shadow-sm overflow-hidden">
                                                            <span className="text-[10px] font-bold text-charcoal/60 truncate w-full break-words whitespace-normal leading-tight">{file.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setGalleryImageFiles(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                                                        >
                                                            <span className="material-symbols-outlined !text-[16px]">close</span>
                                                        </button>
                                                    </div>
                                                ))}
                                                {galleryUrls.map((url, idx) => (
                                                    <div key={`url-${idx}`} className="relative w-28 aspect-[4/5] flex-shrink-0 group">
                                                        <div className="w-full h-full bg-charcoal/5 rounded-xl overflow-hidden ring-1 ring-black/5 shadow-sm">
                                                            <Image src={url} alt="" width={112} height={140} className="w-full h-full object-cover" />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setGalleryUrls(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                                                        >
                                                            <span className="material-symbols-outlined !text-[16px]">close</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                Deskripsi Produk
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <textarea required rows={4} className="w-full bg-charcoal/5 border border-transparent focus:bg-white focus:border-charcoal/20 focus:ring-4 focus:ring-charcoal/5 rounded-xl p-4 outline-none transition-all text-sm font-medium resize-y" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Jelaskan detail produk Anda di sini..." />
                                        </div>
                                        <div className="md:col-span-2 pt-4 border-t border-border/40 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-charcoal text-white px-10 py-4 rounded-xl font-bold text-sm hover:opacity-95 hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="material-symbols-outlined animate-spin !text-lg">sync</span>
                                                        Memproses...
                                                    </>
                                                ) : editingId ? (
                                                    <>
                                                        <span className="material-symbols-outlined !text-lg">save</span>
                                                        Simpan Perubahan
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined !text-lg">add_task</span>
                                                        Simpan ke Katalog
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-black/[0.02] border-b border-black/5">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-1/2">Detail Produk</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kategori</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Harga</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5">
                                        {loading ? (
                                            <tr><td colSpan={4} className="p-12 text-center text-muted-foreground text-sm flex gap-2 justify-center items-center"><span className="material-symbols-outlined animate-spin text-muted-foreground">progress_activity</span> Memuat katalog...</td></tr>
                                        ) : items.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-16 text-center">
                                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/5 mb-4">
                                                        <span className="material-symbols-outlined !text-3xl text-muted-foreground">inventory_2</span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-charcoal mb-1">Katalog Kosong</h3>
                                                    <p className="text-sm text-muted-foreground">Belum ada produk yang ditambahkan ke koleksi.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            items.map((item) => (
                                                <tr key={item.id} className="hover:bg-black/[0.02] transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/50 border border-black/5">
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
                                                                    <span className="material-symbols-outlined !text-[14px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                                                                    {item.is_featured && (
                                                                        <span className="bg-charcoal text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest flex-shrink-0">Featured</span>
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
                                                            `$${item.price.toLocaleString()}`
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-charcoal transition-colors tooltip-edit">
                                                                <span className="material-symbols-outlined !text-lg">edit</span>
                                                            </button>
                                                            <button onClick={() => deleteItem(item.id)} className="w-8 h-8 rounded-full hover:bg-red-500/10 flex items-center justify-center text-red-500 transition-colors tooltip-delete">
                                                                <span className="material-symbols-outlined !text-lg">delete</span>
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
                    )}
                </div>
            </main>
        </div>
    );
}

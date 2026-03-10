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
    const [view, setView] = useState<'overview' | 'catalog' | 'hero'>('overview');
    const [items, setItems] = useState<CatalogItem[]>([]);
    const [heroImages, setHeroImages] = useState<string[]>(['', '', '']);
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
        await supabase
            .from('site_settings')
            .upsert({ key: 'hero_images', value: heroImages });

        await supabase
            .from('site_settings')
            .upsert({ key: 'hero_title', value: heroTitle });

        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'hero_description', value: heroDescription });

        setLoading(false);
        if (error) alert('Error updating hero settings: ' + error.message);
        else alert('Hero settings updated successfully!');
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
        <div className="flex min-h-screen bg-background">
            <aside className="w-64 border-r border-border flex flex-col fixed inset-y-0">
                <div className="p-8 border-b border-border">
                    <h2 className="text-sm font-bold tracking-[0.3em] uppercase opacity-50">Portal</h2>
                    <p className="text-xl font-bold mt-2">strxdale&apos;s catalog</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setView('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${view === 'overview' ? 'bg-charcoal text-white' : 'hover:bg-charcoal/5'}`}
                    >
                        <span className="material-symbols-outlined !text-lg">dashboard</span>
                        Ringkasan
                    </button>
                    <button
                        onClick={() => setView('catalog')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${view === 'catalog' ? 'bg-charcoal text-white' : 'hover:bg-charcoal/5'}`}
                    >
                        <span className="material-symbols-outlined !text-lg">inventory_2</span>
                        Katalog
                    </button>
                    <button
                        onClick={() => setView('hero')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${view === 'hero' ? 'bg-charcoal text-white' : 'hover:bg-charcoal/5'}`}
                    >
                        <span className="material-symbols-outlined !text-lg">image_search</span>
                        Pengaturan Hero
                    </button>
                    <Link
                        href="/"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold hover:bg-charcoal/5 transition-all text-charcoal/60"
                    >
                        <span className="material-symbols-outlined !text-lg">open_in_new</span>
                        Lihat Situs
                    </Link>
                </nav>
                <div className="p-8 border-t border-border">
                    <p className="text-[10px] uppercase tracking-widest opacity-30">v1.2.0-stable</p>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-12">
                <div className="max-w-6xl mx-auto">
                    {view === 'overview' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="mb-12">
                                <h1 className="text-4xl font-bold tracking-tight mb-2">Ringkasan</h1>
                                <p className="text-muted-foreground">Statistik umum dan aktivitas terbaru.</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <div className="p-8 border border-border rounded-xl bg-white">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Total Item</span>
                                    <p className="text-4xl font-bold mt-4">{totalItems}</p>
                                </div>
                                <div className="p-8 border border-border rounded-xl bg-white">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Nilai Koleksi</span>
                                    <p className="text-4xl font-bold mt-4">${totalValue.toLocaleString()}</p>
                                </div>
                                <div className="p-8 border border-border rounded-xl bg-white">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Kategori</span>
                                    <p className="text-4xl font-bold mt-4">{categories.length}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-40 text-charcoal">Terbaru Ditambahkan</h3>
                                    <div className="space-y-4">
                                        {recentItems.map(item => (
                                            <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg bg-white/50">
                                                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-secondary">
                                                    <Image src={item.image_url || '/placeholder.png'} alt={item.name} width={48} height={48} className="object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">${item.price}</p>
                                                </div>
                                                <button onClick={() => setView('catalog')} className="text-[10px] font-bold uppercase tracking-widest hover:underline">Lihat</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-40 text-charcoal">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => { setView('catalog'); setShowForm(true); }}
                                            className="p-6 border border-dashed border-charcoal/20 rounded-xl hover:bg-charcoal/5 transition-all text-left group"
                                        >
                                            <span className="material-symbols-outlined !text-xl mb-4 group-hover:scale-110 transition-transform">add_circle</span>
                                            <p className="text-xs font-bold uppercase tracking-widest">Item Baru</p>
                                        </button>
                                        <button
                                            onClick={() => setView('catalog')}
                                            className="p-6 border border-dashed border-charcoal/20 rounded-xl hover:bg-charcoal/5 transition-all text-left group"
                                        >
                                            <span className="material-symbols-outlined !text-xl mb-4 group-hover:scale-110 transition-transform">inventory</span>
                                            <p className="text-xs font-bold uppercase tracking-widest">Kelola Item</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : view === 'hero' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="mb-12">
                                <h1 className="text-4xl font-bold tracking-tight mb-2">Hero Settings</h1>
                                <p className="text-muted-foreground">Manage your landing page content and background images.</p>
                            </header>

                            <div className="max-w-2xl space-y-12">
                                <div className="space-y-6 p-6 border border-border rounded-xl bg-white shadow-sm">
                                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Hero Content</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Hero Title</label>
                                            <input
                                                type="text"
                                                className="w-full bg-background border border-border rounded-lg p-3 focus:outline-none focus:border-charcoal transition-colors text-sm"
                                                value={heroTitle}
                                                onChange={(e) => setHeroTitle(e.target.value)}
                                                placeholder="strxdale's catalog"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Hero Description</label>
                                            <textarea
                                                rows={3}
                                                className="w-full bg-background border border-border rounded-lg p-3 focus:outline-none focus:border-charcoal transition-colors text-sm"
                                                value={heroDescription}
                                                onChange={(e) => setHeroDescription(e.target.value)}
                                                placeholder="A refined selection of timeless essentials..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Background Images</h3>
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className="space-y-4 p-6 border border-border rounded-xl bg-white shadow-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold uppercase tracking-widest opacity-40">Latar Belakang {i + 1}</span>
                                                {heroImages[i] && (
                                                    <div className="relative w-16 h-10 rounded border border-border overflow-hidden">
                                                        <Image src={heroImages[i]} alt="" width={64} height={40} className="object-cover w-full h-full" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <div className="flex-1">
                                                    <input
                                                        type="url"
                                                        placeholder="External URL or Upload..."
                                                        className="w-full bg-background border border-border rounded-lg p-3 focus:outline-none focus:border-charcoal transition-colors text-xs"
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
                                                    <div className="flex items-center gap-2 px-4 py-3 border border-dashed border-charcoal/20 rounded-lg hover:bg-charcoal/5 transition-all">
                                                        <span className="material-symbols-outlined !text-lg">upload_file</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Local</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={updateHeroSettings}
                                        disabled={loading}
                                        className="bg-charcoal text-white px-10 py-4 rounded-lg font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-charcoal/20"
                                    >
                                        {loading ? 'Saving...' : 'Save Hero Changes'}
                                    </button>

                                    <div className="p-6 bg-beige/50 border border-charcoal/5 rounded-xl">
                                        <p className="text-xs leading-relaxed text-charcoal/60 italic">
                                            Tip: Use high-quality JPG or PNG images. Landscape orientation (16:9) works best for the full-screen hero section.
                                        </p>
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
                                <div className="mb-12 p-8 rounded-2xl border border-charcoal/10 bg-white shadow-sm animate-in zoom-in-95 duration-300">
                                    <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Catalog Item' : 'Add New Catalog Item'}</h2>
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Item Name</label>
                                            <input required type="text" className="w-full bg-background border border-border rounded-lg p-3 focus:outline-none focus:border-charcoal transition-colors text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price ($)</label>
                                                <input
                                                    disabled={formData.is_preorder || formData.is_showcase}
                                                    required={!formData.is_preorder && !formData.is_showcase}
                                                    type="number"
                                                    className="w-full bg-background border border-border rounded-lg p-3 focus:outline-none focus:border-charcoal transition-colors text-sm disabled:opacity-50"
                                                    placeholder={formData.is_showcase ? "Showcase only" : formData.is_preorder ? "Pre-order only" : "0.00"}
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                />
                                            </div>
                                            <label className="flex items-center gap-3 cursor-pointer group">
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
                                                <span className="text-xs font-bold uppercase tracking-widest text-charcoal/60 group-hover:text-charcoal transition-colors">Open Pre-order only</span>
                                            </label>

                                            <label className="flex items-center gap-3 cursor-pointer group">
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
                                                <span className="text-xs font-bold uppercase tracking-widest text-charcoal/60 group-hover:text-charcoal transition-colors">Showcase Only (Hide WhatsApp)</span>
                                            </label>

                                            <label className="flex items-center gap-3 cursor-pointer group">
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
                                                <span className="text-xs font-bold uppercase tracking-widest text-charcoal/60 group-hover:text-charcoal transition-colors">Featured Item (Landing Page)</span>
                                            </label>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        const res = await fetch('/api/test-supabase');
                                                        const data = await res.json();
                                                        alert(data.message || (data.status === 'success' ? 'Database synced!' : 'Error syncing database'));
                                                    }}
                                                    className="text-[9px] font-bold uppercase tracking-widest text-charcoal/40 hover:text-charcoal transition-colors border border-charcoal/10 px-2 py-0.5 rounded"
                                                >
                                                    Fix & Sync
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <select className="flex-1 bg-background border border-border rounded-lg p-3 focus:outline-none focus:border-charcoal transition-colors text-sm" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                                    {categories.map(cat => (
                                                        <option key={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const cat = prompt('Enter new category name:');
                                                        if (cat && !categories.includes(cat)) {
                                                            const updated = [...categories, cat];
                                                            updateCategories(updated);
                                                            setFormData({ ...formData, category: cat });
                                                        }
                                                    }}
                                                    className="px-4 border border-charcoal/10 rounded-lg hover:bg-charcoal/5 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined !text-lg align-middle">add</span>
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {categories.map(cat => (
                                                    <span key={cat} className="group flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-charcoal/5 border border-charcoal/10 font-bold uppercase tracking-widest text-charcoal/60">
                                                        {cat}
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteCategory(cat)}
                                                            className="hover:text-red-500 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined !text-[12px]">close</span>
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Image</label>
                                            <div className="flex gap-4 items-center">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder="Image URL (optional if uploading)"
                                                        className="w-full bg-background border border-border rounded-lg p-3 focus:outline-none focus:border-charcoal transition-colors text-sm"
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
                                                    <div className={`flex items-center gap-2 px-4 py-3 border border-dashed rounded-lg transition-all ${itemImageFile ? 'bg-charcoal text-white border-charcoal' : 'border-charcoal/20 hover:bg-charcoal/5'}`}>
                                                        <span className="material-symbols-outlined !text-lg">{itemImageFile ? 'check_circle' : 'upload_file'}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                                            {itemImageFile ? 'Selected' : 'Local'}
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                            {itemImageFile && (
                                                <p className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest mt-1 italic">
                                                    Ready to upload: {itemImageFile.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gallery Images (Optional)</label>
                                            <div className="flex gap-2 items-center overflow-x-auto pb-2 hide-scrollbar">
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
                                                    <div className="flex flex-col items-center justify-center w-24 aspect-[4/5] border border-dashed border-charcoal/20 rounded-lg hover:bg-charcoal/5 transition-all">
                                                        <span className="material-symbols-outlined !text-lg text-charcoal/40">add_to_photos</span>
                                                        <span className="text-[8px] font-bold uppercase tracking-widest mt-2 text-charcoal/40">Add More</span>
                                                    </div>
                                                </label>
                                                {galleryImageFiles.map((file, idx) => (
                                                    <div key={idx} className="relative w-24 aspect-[4/5] flex-shrink-0 group">
                                                        <div className="w-full h-full bg-charcoal/5 rounded-lg flex items-center justify-center border border-charcoal/10 overflow-hidden">
                                                            <span className="text-[10px] font-bold text-charcoal/40 truncate p-2">{file.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setGalleryImageFiles(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <span className="material-symbols-outlined !text-xs">close</span>
                                                        </button>
                                                    </div>
                                                ))}
                                                {galleryUrls.map((url, idx) => (
                                                    <div key={`url-${idx}`} className="relative w-24 aspect-[4/5] flex-shrink-0 group">
                                                        <div className="w-full h-full bg-charcoal/5 rounded-lg overflow-hidden border border-charcoal/10">
                                                            <Image src={url} alt="" width={96} height={120} className="w-full h-full object-cover" />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setGalleryUrls(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <span className="material-symbols-outlined !text-xs">close</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                                            <textarea required rows={4} className="w-full bg-background border border-border rounded-lg p-3 focus:outline-none focus:border-charcoal transition-colors text-sm" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="md:col-span-2 bg-charcoal text-white py-4 rounded-lg font-bold text-sm hover:opacity-95 transition-all disabled:opacity-50"
                                        >
                                            {loading ? 'Processing...' : editingId ? 'Update Item' : 'Save Item to Catalog'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="border border-border rounded-2xl bg-white overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-charcoal/5 border-b border-border">
                                        <tr>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Item</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan={4} className="p-12 text-center text-muted-foreground italic">Loading collection...</td></tr>
                                        ) : items.length === 0 ? (
                                            <tr><td colSpan={4} className="p-12 text-center text-muted-foreground italic">No items in the catalog.</td></tr>
                                        ) : (
                                            items.map((item) => (
                                                <tr key={item.id} className="border-b border-border/50 hover:bg-charcoal/5 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-secondary border border-border">
                                                                <Image src={item.image_url || '/placeholder.png'} alt={item.name} width={40} height={40} className="object-cover" />
                                                            </div>
                                                            <div>
                                                                <Link
                                                                    href={`/collection/${item.id}`}
                                                                    target="_blank"
                                                                    className="font-bold text-sm tracking-tight hover:underline flex items-center gap-1 lowercase"
                                                                >
                                                                    {item.name}
                                                                    <span className="material-symbols-outlined !text-xs opacity-30">open_in_new</span>
                                                                    {item.is_featured && (
                                                                        <span className="bg-amber-100 text-amber-700 text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">Featured</span>
                                                                    )}
                                                                </Link>
                                                                <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-xs">{item.description}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-[10px] px-2 py-1 rounded-full border border-charcoal/10 text-charcoal/70 uppercase font-bold tracking-widest">
                                                            {item.category}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-bold text-sm">
                                                        {item.is_showcase ? (
                                                            <span className="text-charcoal/40 italic font-medium">showcase</span>
                                                        ) : item.price === 0 ? (
                                                            <span className="text-charcoal/40 italic font-medium">pre order</span>
                                                        ) : (
                                                            `$${item.price.toLocaleString()}`
                                                        )}
                                                    </td>
                                                    <td className="p-4 flex gap-4">
                                                        <button onClick={() => handleEdit(item)} className="text-charcoal hover:underline text-[10px] font-bold uppercase tracking-widest">Edit</button>
                                                        <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-600 text-[10px] font-bold uppercase tracking-widest">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-20 p-8 border border-dashed border-charcoal/20 rounded-2xl bg-beige/30">
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-charcoal/40">Database Connection Debugger</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[10px] font-mono">
                                    <div className="space-y-2">
                                        <p className="text-charcoal/40 uppercase">Target URL:</p>
                                        <p className="p-3 bg-white border border-border rounded truncate">
                                            {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Missing URL (Using Placeholder)'}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-charcoal/40 uppercase">Connection Status:</p>
                                        <div className="flex items-center gap-2 p-3 bg-white border border-border rounded">
                                            <div className={`w-2 h-2 rounded-full ${items.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <span>{items.length > 0 ? 'Connected & Data Loaded' : 'No Data / Disconnected'}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-6 text-[9px] text-charcoal/30 leading-relaxed italic">
                                    * Jika status berwarna merah, pastikan file .env.local Anda berisi URL Supabase yang benar dan restart server Next.js Anda.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

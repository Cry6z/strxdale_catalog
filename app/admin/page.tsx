'use client';

import { useState, useEffect } from 'react';
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
}

interface SiteSettings {
    key: string;
    value: string[];
}

export default function AdminDashboard() {
    const [view, setView] = useState<'overview' | 'catalog' | 'hero'>('overview');
    const [items, setItems] = useState<CatalogItem[]>([]);
    const [heroImages, setHeroImages] = useState<string[]>(['', '', '']);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState<string[]>(['Lifestyle', 'Accessories', 'Design', 'Vintage']);
    const [newCategory, setNewCategory] = useState('');
    const [itemImageFile, setItemImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: 'Lifestyle',
        is_preorder: false,
    });
    const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
    const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const isAuth = localStorage.getItem('admin_auth');
        if (!isAuth) {
            router.push('/access-portal');
        }
        fetchItems();
        fetchHeroSettings();
        fetchCategories();
    }, []);

    async function fetchCategories() {
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
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching categories:', error);
        }
    }

    async function updateCategories(newCategories: string[]) {
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'catalog_categories', value: newCategories });

        if (error) {
            alert('Error updating categories: ' + error.message);
        } else {
            setCategories(newCategories);
        }
    }

    const addCategory = () => {
        if (!newCategory.trim()) return;
        if (categories.includes(newCategory.trim())) {
            alert('Category already exists');
            return;
        }
        const updated = [...categories, newCategory.trim()];
        updateCategories(updated);
        setNewCategory('');
    };

    const deleteCategory = (catToDelete: string) => {
        if (!confirm(`Are you sure you want to delete the category "${catToDelete}"?`)) return;
        const updated = categories.filter(c => c !== catToDelete);
        updateCategories(updated);
    };

    async function fetchHeroSettings() {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('key', 'hero_images')
            .single();

        if (data) setHeroImages(data.value);
        if (error) console.error('Error fetching hero settings:', error);
    }

    async function updateHeroSettings() {
        setLoading(true);
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'hero_images', value: heroImages });

        setLoading(false);
        if (error) alert('Error updating hero images: ' + error.message);
        else alert('Hero images updated successfully!');
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

    async function fetchItems() {
        setLoading(true);
        const { data, error } = await supabase
            .from('catalog_items')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error:', error);
        else setItems(data || []);
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
            is_preorder: false
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
                .from('hero-images') // Using existing bucket for compatibility, or change to 'catalog-images'
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

        // Upload Gallery Images
        let finalGalleryUrls = [...galleryUrls];
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

        const { is_preorder, ...rest } = formData;
        const submitData = {
            ...rest,
            image_url: finalImageUrl,
            price: is_preorder ? 0 : parseFloat(formData.price),
            gallery: finalGalleryUrls
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
            console.error('Error saving item:', result.error);
            alert('Error saving item: ' + result.error.message);
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
            {/* Sidebar */}
            <aside className="w-64 border-r border-border flex flex-col fixed inset-y-0">
                <div className="p-8 border-b border-border">
                    <h2 className="text-sm font-bold tracking-[0.3em] uppercase opacity-50">Portal</h2>
                    <p className="text-xl font-bold mt-2">strxdale</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setView('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${view === 'overview' ? 'bg-charcoal text-white' : 'hover:bg-charcoal/5'}`}
                    >
                        <span className="material-symbols-outlined !text-lg">dashboard</span>
                        Overview
                    </button>
                    <button
                        onClick={() => setView('catalog')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${view === 'catalog' ? 'bg-charcoal text-white' : 'hover:bg-charcoal/5'}`}
                    >
                        <span className="material-symbols-outlined !text-lg">inventory_2</span>
                        Catalog
                    </button>
                    <button
                        onClick={() => setView('hero')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${view === 'hero' ? 'bg-charcoal text-white' : 'hover:bg-charcoal/5'}`}
                    >
                        <span className="material-symbols-outlined !text-lg">image_search</span>
                        Hero Settings
                    </button>
                    <a
                        href="/"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold hover:bg-charcoal/5 transition-all text-charcoal/60"
                    >
                        <span className="material-symbols-outlined !text-lg">open_in_new</span>
                        View Site
                    </a>
                </nav>
                <div className="p-8 border-t border-border">
                    <p className="text-[10px] uppercase tracking-widest opacity-30">v1.2.0-stable</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">
                <div className="max-w-6xl mx-auto">
                    {view === 'overview' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="mb-12">
                                <h1 className="text-4xl font-bold tracking-tight mb-2">Overview</h1>
                                <p className="text-muted-foreground">General statistics and recent activity.</p>
                            </header>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <div className="p-8 border border-border rounded-xl bg-white">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Total Items</span>
                                    <p className="text-4xl font-bold mt-4">{totalItems}</p>
                                </div>
                                <div className="p-8 border border-border rounded-xl bg-white">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Collection Value</span>
                                    <p className="text-4xl font-bold mt-4">${totalValue.toLocaleString()}</p>
                                </div>
                                <div className="p-8 border border-border rounded-xl bg-white">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Categories</span>
                                    <p className="text-4xl font-bold mt-4">{categories.length}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Recently Added */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-40 text-charcoal">Recently Added</h3>
                                    <div className="space-y-4">
                                        {recentItems.map(item => (
                                            <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg bg-white/50">
                                                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-secondary">
                                                    <Image src={item.image_url || '/placeholder.png'} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">${item.price}</p>
                                                </div>
                                                <button onClick={() => setView('catalog')} className="text-[10px] font-bold uppercase tracking-widest hover:underline">View</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-40 text-charcoal">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => { setView('catalog'); setShowForm(true); }}
                                            className="p-6 border border-dashed border-charcoal/20 rounded-xl hover:bg-charcoal/5 transition-all text-left group"
                                        >
                                            <span className="material-symbols-outlined !text-xl mb-4 group-hover:scale-110 transition-transform">add_circle</span>
                                            <p className="text-xs font-bold uppercase tracking-widest">New Item</p>
                                        </button>
                                        <button
                                            onClick={() => setView('catalog')}
                                            className="p-6 border border-dashed border-charcoal/20 rounded-xl hover:bg-charcoal/5 transition-all text-left group"
                                        >
                                            <span className="material-symbols-outlined !text-xl mb-4 group-hover:scale-110 transition-transform">inventory</span>
                                            <p className="text-xs font-bold uppercase tracking-widest">Manage Items</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : view === 'hero' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="mb-12">
                                <h1 className="text-4xl font-bold tracking-tight mb-2">Hero Settings</h1>
                                <p className="text-muted-foreground">Manage your 3 landing page background images.</p>
                            </header>

                            <div className="max-w-2xl space-y-8">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="space-y-4 p-6 border border-border rounded-xl bg-white shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold uppercase tracking-widest opacity-40">Background {i + 1}</span>
                                            {heroImages[i] && (
                                                <div className="relative w-16 h-10 rounded border border-border overflow-hidden">
                                                    <img src={heroImages[i]} alt="" className="object-cover w-full h-full" />
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
                                                    disabled={formData.is_preorder}
                                                    required={!formData.is_preorder}
                                                    type="number"
                                                    className="w-full bg-background border border-border rounded-lg p-3 focus:outline-none focus:border-charcoal transition-colors text-sm disabled:opacity-50"
                                                    placeholder={formData.is_preorder ? "Pre-order only" : "0.00"}
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
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
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
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
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
                                                                <Image src={item.image_url || '/placeholder.png'} alt={item.name} fill className="object-cover" />
                                                            </div>
                                                            <div>
                                                                <Link
                                                                    href={`/collection/${item.id}`}
                                                                    target="_blank"
                                                                    className="font-bold text-sm tracking-tight hover:underline flex items-center gap-1"
                                                                >
                                                                    {item.name}
                                                                    <span className="material-symbols-outlined !text-xs opacity-30">open_in_new</span>
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
                                                        {item.price === 0 ? (
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
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

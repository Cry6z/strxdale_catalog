'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';


import { CatalogItem } from '@/components/admin/types';
import Sidebar from '@/components/admin/Sidebar';
import OverviewView from '@/components/admin/OverviewView';
import HeroSettingsView from '@/components/admin/HeroSettingsView';
import GallerySettingsView from '@/components/admin/GallerySettingsView';
import CatalogManagerView from '@/components/admin/CatalogManagerView';

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


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
        <div className="flex min-h-screen bg-background font-sans relative">
            <Sidebar 
                view={view} 
                setView={setView} 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen} 
            />

            <main className="flex-1 md:ml-64 p-6 md:p-12 w-full max-w-[100vw] transition-all">
                <div className="max-w-6xl mx-auto overflow-x-hidden">
                    {/* Mobile Header */}
                    <div className="md:hidden flex items-center justify-between mb-8 bg-white/50 backdrop-blur-lg p-4 rounded-2xl border border-border/40 shadow-sm relative z-30">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg bg-black/5 hover:bg-black/10 transition-colors text-charcoal flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl!">menu</span>
                            </button>
                            <span className="font-bold text-sm tracking-tight text-charcoal">Hallo, Admin!</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-charcoal">
                            <span className="material-symbols-outlined text-[16px]!">admin_panel_settings</span>
                        </div>
                    </div>

                    {view === 'overview' && (
                        <OverviewView 
                            totalItems={totalItems}
                            totalValue={totalValue}
                            categoriesCount={categories.length}
                            recentItems={recentItems}
                            setView={setView}
                            setShowForm={setShowForm}
                        />
                    )}
                    
                    {view === 'hero' && (
                        <HeroSettingsView
                            heroTitle={heroTitle}
                            setHeroTitle={setHeroTitle}
                            heroDescription={heroDescription}
                            setHeroDescription={setHeroDescription}
                            heroImages={heroImages}
                            setHeroImages={setHeroImages}
                            uploadHeroImage={uploadHeroImage}
                            updateHeroSettings={updateHeroSettings}
                            loading={loading}
                        />
                    )}

                    {view === 'gallery' && (
                        <GallerySettingsView 
                            landingGalleryImages={landingGalleryImages}
                            setLandingGalleryImages={setLandingGalleryImages}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    )}

                    {view === 'catalog' && (
                        <CatalogManagerView 
                            items={items}
                            loading={loading}
                            showForm={showForm}
                            setShowForm={setShowForm}
                            editingId={editingId}
                            formData={formData}
                            setFormData={setFormData}
                            handleSubmit={handleSubmit}
                            resetForm={resetForm}
                            categories={categories}
                            updateCategories={updateCategories}
                            deleteCategory={deleteCategory}
                            itemImageFile={itemImageFile}
                            setItemImageFile={setItemImageFile}
                            galleryImageFiles={galleryImageFiles}
                            setGalleryImageFiles={setGalleryImageFiles}
                            galleryUrls={galleryUrls}
                            setGalleryUrls={setGalleryUrls}
                            handleEdit={handleEdit}
                            deleteItem={deleteItem}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

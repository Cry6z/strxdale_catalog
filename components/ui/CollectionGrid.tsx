'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';

interface CatalogItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    gallery?: string[];
    is_showcase?: boolean;
}

interface CollectionGridProps {
    initialItems: CatalogItem[];
    categories: string[];
}

export default function CollectionGrid({ initialItems, categories: propCategories }: CollectionGridProps) {
    const [activeCategory, setActiveCategory] = useState('semua');
    const categories = ['semua', ...propCategories.map(c => c.toLowerCase())];

    const filteredItems = activeCategory === 'semua'
        ? initialItems
        : initialItems.filter(item => item.category?.toLowerCase() === activeCategory);

    return (
        <>
            {/* Filter Bar */}
            <section className="pt-32 pb-12 md:pb-16 px-6 md:px-8 border-b border-charcoal/5">
                <div className="mx-auto max-w-7xl">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-charcoal/30 block mb-4">Arsip Kami</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-charcoal mb-8 md:mb-12 tracking-tighter lowercase">koleksi</h1>

                    <div className="flex flex-wrap gap-x-6 gap-y-4 md:gap-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b pb-1 ${activeCategory === cat
                                    ? 'text-charcoal border-charcoal/40'
                                    : 'text-charcoal/30 border-transparent hover:text-charcoal/60'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="py-16 md:py-24 px-6 md:px-8 min-h-[60vh]">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="animate-in fade-in duration-700">
                                <Card {...item} />
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-32 animate-in fade-in zoom-in-95 duration-500">
                            <p className="text-charcoal/30 font-serif italic">Tidak ada item ditemukan dalam kategori ini.</p>
                            <button
                                onClick={() => setActiveCategory('semua')}
                                className="mt-6 text-[10px] font-bold uppercase tracking-widest text-charcoal border-b border-charcoal/20 pb-1"
                            >
                                lihat semua koleksi
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

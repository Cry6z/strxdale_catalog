'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

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

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.3 }
        }
    };

    return (
        <>
            {/* Filter Bar */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className="pt-32 pb-12 md:pb-16 px-6 md:px-8 border-b border-charcoal/5"
            >
                <div className="mx-auto max-w-7xl">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-charcoal/30 block mb-4">arsip kami</span>
                    <h1 className="text-3xl md:text-5xl font-serif font-black text-charcoal mb-8 md:mb-12 tracking-tighter lowercase">koleksi</h1>

                    <div className="flex flex-wrap gap-x-6 gap-y-4 md:gap-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`relative text-[10px] font-bold uppercase tracking-[0.2em] transition-all pb-2 ${activeCategory === cat
                                    ? 'text-charcoal'
                                    : 'text-charcoal/30 hover:text-charcoal/60'
                                    }`}
                            >
                                {cat}
                                {activeCategory === cat && (
                                    <motion.div
                                        layoutId="activeFilter"
                                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-charcoal"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Grid */}
            <section className="py-16 md:py-24 px-4 md:px-8 min-h-[60vh]">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        layout
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item) => (
                                <motion.div
                                    layout
                                    key={item.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <Card {...item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    <AnimatePresence>
                        {filteredItems.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-32"
                            >
                                <p className="text-charcoal/30 font-serif italic mb-6">Tidak ada item ditemukan dalam kategori ini.</p>
                                <button
                                    onClick={() => setActiveCategory('semua')}
                                    className="text-[10px] font-bold uppercase tracking-widest text-charcoal border-b border-charcoal/20 pb-1"
                                >
                                    lihat semua koleksi
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </>
    );
}

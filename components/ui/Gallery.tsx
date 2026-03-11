'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const Gallery = () => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        async function fetchGallery() {
            const { data, error } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'landing_gallery')
                .single();

            if (data && data.value) {
                setImages(data.value);
            }
            setLoading(false);
            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching gallery:', error);
            }
        }

        fetchGallery();
    }, []);

    // Handle ESC key to close lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedIndex(null);
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, images]);

    const handleNext = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % images.length);
        }
    };

    const handlePrev = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
        }
    };

    if (loading) return null;
    if (images.length === 0) return null;

    const displayImages = images.map((url, i) => {
        // Create a hash from the URL to determine a stable "random" ratio
        const hash = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratios = [
            'aspect-[3/4]',    // Vertical
            'aspect-square',   // Square
            'aspect-[2/3]',    // Long Vertical
            'aspect-[4/3]',    // Horizontal
            'aspect-[16/9]',   // Wide Horizontal
            'aspect-[4/5]',    // Vertical
            'aspect-[3/2]',    // Horizontal
            'aspect-[9/16]',   // Lean Vertical
        ];

        // Use hash to pick a ratio so it feels random but stays consistent for the same image
        const ratioClass = ratios[hash % ratios.length];

        return {
            id: i,
            url,
            height: ratioClass
        };
    });

    return (
        <section className="py-24 bg-white" id="gallery">
            <div className="mx-auto max-w-7xl px-6 md:px-8 mb-12 flex items-end justify-between">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/40 block mb-2 font-mono">inspirasi</span>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-charcoal text-left lowercase">
                        galeri visual
                    </h3>
                </div>
                {/* Mobile Hint */}
                <span className="md:hidden text-[8px] font-bold uppercase tracking-widest text-charcoal/30 flex items-center gap-2">
                    Geser <span className="material-symbols-outlined !text-xs">arrow_forward</span>
                </span>
            </div>

            <div className="mx-auto max-w-7xl px-6 md:px-8">
                {/* Unified Masonry Grid for All Screens */}
                <div className="columns-2 md:columns-3 gap-4 md:gap-8 space-y-4 md:space-y-8">
                    {displayImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="break-inside-avoid"
                            onClick={() => setSelectedIndex(index)}
                        >
                            <div className={`relative overflow-hidden rounded-sm group cursor-pointer ${image.height} bg-beige/30`}>
                                <img
                                    src={image.url}
                                    alt={`Gallery image ${image.id}`}
                                    className="w-full h-full object-cover transition-all duration-700 grayscale hover:grayscale-0 md:grayscale-0 lg:grayscale active:grayscale-0"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="w-8 h-[1px] bg-white opacity-50 md:hidden lg:block group-hover:w-10 transition-all duration-300"></div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
                        onClick={() => setSelectedIndex(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={images[selectedIndex]}
                                alt="Gallery highlight"
                                className="w-full h-full object-contain select-none"
                            />

                            {/* Controls */}
                            <button
                                onClick={() => setSelectedIndex(null)}
                                className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity p-2 z-[101]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70 transition-opacity p-2 bg-charcoal/20 rounded-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70 transition-opacity p-2 bg-charcoal/20 rounded-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </button>
                                </>
                            )}
                        </motion.div>

                        {/* Counter */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-bold uppercase tracking-[0.4em]">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;

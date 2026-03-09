'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] relative bg-beige overflow-hidden">
                <Image src="/placeholder.png" alt={name} fill className="object-cover" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main Image Viewport */}
            <div className="aspect-[4/5] relative bg-beige overflow-hidden group rounded-2xl md:rounded-none">
                <Image
                    src={images[activeIndex] || '/placeholder.png'}
                    alt={`${name} - view ${activeIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-700 ease-in-out"
                    priority
                />

                {/* Navigation Arrows (Only show if > 1 image) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        >
                            <span className="material-symbols-outlined !text-xl">chevron_left</span>
                        </button>
                        <button
                            onClick={() => setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        >
                            <span className="material-symbols-outlined !text-xl">chevron_right</span>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails Carousel */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x px-1">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`relative w-16 md:w-20 aspect-[4/5] bg-beige flex-shrink-0 cursor-pointer border-2 transition-all snap-start rounded-lg md:rounded-none overflow-hidden ${activeIndex === i ? 'border-charcoal' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                            <Image src={img || '/placeholder.png'} alt={`${name} thumb ${i}`} fill className="object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

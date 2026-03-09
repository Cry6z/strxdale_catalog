'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import CardSwap, { Card } from '@/components/CardSwap';
import Image from 'next/image';

const FALLBACK_IMAGES = [
    '/images/hero1.png',
    '/images/hero2.png',
    '/images/hero3.png'
];

export default function Hero() {
    const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);
    const [title, setTitle] = useState("strxdale's catalog");
    const [description, setDescription] = useState("Pilihan terkurasi untuk barang-barang esensial yang tak lekang oleh waktu. Siluet yang dirancang dengan teliti untuk mereka yang percaya pada kesederhanaan.");
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        async function fetchHeroSettings() {
            // Images
            const { data: imgData } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'hero_images')
                .single();

            if (imgData && Array.isArray(imgData.value) && imgData.value.length >= 2) {
                setImages(imgData.value);
            }

            // Title
            const { data: titleData } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'hero_title')
                .single();
            if (titleData?.value) setTitle(String(titleData.value));

            // Description
            const { data: descData } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'hero_description')
                .single();
            if (descData?.value) setDescription(String(descData.value));
        }
        fetchHeroSettings();
    }, []);

    return (
        <section className="relative min-h-[90vh] md:h-screen w-full overflow-hidden bg-beige flex items-center pt-24 md:pt-0">
            {/* Split Layout Container */}
            <div className="mx-auto max-w-7xl px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: Content */}
                <div className="relative z-10 text-left order-2 lg:order-1">
                    <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-charcoal mb-6 tracking-tighter animate-in fade-in slide-in-from-left-8 duration-1000">
                        {title}
                    </h2>
                    <p className="max-w-md text-base md:text-lg font-light text-charcoal/70 mb-10 leading-relaxed animate-in fade-in slide-in-from-left-12 duration-1000 delay-200">
                        {description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-left-16 duration-1000 delay-500">
                        <a className="group relative inline-flex items-center justify-center overflow-hidden border border-charcoal bg-charcoal text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white hover:text-charcoal" href="#featured">
                            <span className="relative z-10">Jelajahi Katalog</span>
                        </a>
                    </div>
                </div>

                {/* Right: Card Stack Visual */}
                <div className="relative h-[450px] md:h-[550px] lg:h-[650px] order-1 lg:order-2 flex items-center justify-center pt-16 md:pt-24 lg:pt-32">
                    <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[480px] h-full flex items-center justify-center">
                        <CardSwap
                            width={isMobile ? "300px" : "480px"}
                            height={isMobile ? "380px" : "600px"}
                            cardDistance={isMobile ? 20 : 40}
                            verticalDistance={isMobile ? 30 : 60}
                            delay={4500}
                        >
                            {images.map((src, index) => (
                                <Card key={index} className="overflow-hidden border-none shadow-2xl rounded-2xl">
                                    <div className="w-full h-full bg-off-white">
                                        <Image
                                            src={src ?? '/placeholder.png'}
                                            alt={`Collection Piece ${index + 1}`}
                                            width={isMobile ? 300 : 480}
                                            height={isMobile ? 380 : 600}
                                            className="w-full h-full object-cover"
                                            loading="eager"
                                        />
                                    </div>
                                </Card>
                            ))}
                        </CardSwap>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-8 text-charcoal/20 hidden lg:block">
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] rotate-90 origin-left translate-x-3 mb-12 whitespace-nowrap">Scroll Kebawah</span>
                    <div className="w-[1px] h-12 bg-charcoal/10"></div>
                </div>
            </div>
        </section>
    );
}

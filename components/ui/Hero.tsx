'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import CardSwap, { Card } from '@/components/CardSwap';
import Image from 'next/image';
import { motion } from 'framer-motion';

const FALLBACK_IMAGES = [
    '/images/hero1.png',
    '/images/hero2.png',
    '/images/hero1.png'
];

interface HeroProps {
    images?: string[];
    title?: string;
    description?: string;
}

export default function Hero({
    images: propImages,
    title: propTitle,
    description: propDescription
}: HeroProps) {
    const [images, setImages] = useState<string[]>(propImages && propImages.length > 0 ? propImages : FALLBACK_IMAGES);
    const [title, setTitle] = useState(propTitle || "strxdale's catalog");
    const [description, setDescription] = useState(propDescription || "Sebuah ruang untuk desain yang lahir dari rasa ingin mencoba. Sederhana, tenang, dan dibuat dengan pendekatan yang minimal.");
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (propImages && propImages.length > 0) setImages(propImages);
        if (propTitle) setTitle(propTitle);
        if (propDescription) setDescription(propDescription);
    }, [propImages, propTitle, propDescription]);

    useEffect(() => {
        if (propImages && propTitle && propDescription) return;

        async function fetchHeroSettings() {
            if (!propImages) {
                const { data: imgData } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'hero_images')
                    .single();
                if (imgData && Array.isArray(imgData.value) && imgData.value.length >= 2) {
                    setImages(imgData.value);
                }
            }

            if (!propTitle) {
                const { data: titleData } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'hero_title')
                    .single();
                if (titleData?.value) setTitle(String(titleData.value));
            }

            if (!propDescription) {
                const { data: descData } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'hero_description')
                    .single();
                if (descData?.value) setDescription(String(descData.value));
            }
        }
        fetchHeroSettings();
    }, [propImages, propTitle, propDescription]);

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                ease: 'easeOut'
            }
        }
    };

    return (
        <section className="relative min-h-[90vh] md:h-screen w-full overflow-hidden bg-beige flex items-center pt-24 md:pt-12">
            <div className="mx-auto max-w-7xl px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: Content */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="relative z-10 text-left order-2 lg:order-1"
                >
                    <motion.h2 
                        variants={itemVariants}
                        className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-charcoal tracking-tighter text-left mb-6 leading-[0.9]"
                    >
                        {title}
                    </motion.h2>
                    
                    <motion.p 
                        variants={itemVariants}
                        className="max-w-md text-base md:text-lg font-light text-charcoal/70 leading-relaxed text-left mb-10"
                    >
                        {description}
                    </motion.p>
                    
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                        <a 
                            className="group relative inline-flex items-center justify-center overflow-hidden border border-charcoal bg-charcoal text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest transition-all" 
                            href="#featured"
                        >
                            <motion.div 
                                className="absolute inset-x-0 bottom-0 h-[2px] bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                            />
                            <span className="relative z-10 group-hover:opacity-80 transition-opacity">jelajahi katalog</span>
                        </a>
                    </motion.div>
                </motion.div>


                {/* Right: Card Stack Visual */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
                    className="relative h-[450px] md:h-[550px] lg:h-[650px] order-1 lg:order-2 flex items-center justify-center pt-16 md:pt-24 lg:pt-32"
                >
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
                                    <div className="w-full h-full bg-off-white relative">
                                        <Image
                                            src={src ?? '/placeholder.png'}
                                            alt={`Collection Piece ${index + 1}`}
                                            width={isMobile ? 300 : 480}
                                            height={isMobile ? 380 : 600}
                                            className="w-full h-full object-cover"
                                            loading="eager"
                                        />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </Card>
                            ))}
                        </CardSwap>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-8 text-charcoal/20 hidden lg:block"
            >
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] rotate-90 origin-left translate-x-3 mb-12 whitespace-nowrap">Scroll Down</span>
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 48 }}
                        transition={{ duration: 1, delay: 2 }}
                        className="w-[1px] bg-charcoal/10"
                    />
                </div>
            </motion.div>
        </section>
    );
}


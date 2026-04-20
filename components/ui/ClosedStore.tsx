'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function ClosedStore({
    title = "Toko Sedang Ditutup",
    description = "Kami sedang merapikan beberapa hal di belakang layar. Seluruh akses katalog dan pemesanan saat ini tidak tersedia. Silakan kembali dalam beberapa waktu ke depan.",
    background
}: {
    title?: string;
    description?: string;
    background?: string;
}) {
    const [isMounted, setIsMounted] = useState(false);

    // Mouse tracking for interactive animation
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        setIsMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            // Normalized coordinates centered at 0 (-1 to 1)
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            mouseX.set(x * 20); // max pixel shift
            mouseY.set(y * 20);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    if (!isMounted) return null;

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center bg-charcoal text-white overflow-hidden selection:bg-white/20 selection:text-white">
            {background && (
                <div
                    className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${background})` }}
                />
            )}

            <div className="absolute inset-0 z-0 bg-charcoal/80" />

            {/* Subtle background grain/noise to look elegant */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'url("/images/noise.png")', backgroundRepeat: 'repeat' }} />

            <div className="relative z-10 p-6 flex flex-col items-center justify-center text-center max-w-2xl px-4 md:px-8">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ x: smoothX, y: smoothY }}
                    className="flex flex-col items-center"
                >
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 0.5, height: 'auto' }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="mb-8"
                    >
                        <span className="material-symbols-outlined text-4xl block font-light">lock</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif italic mb-6 tracking-tight font-black">
                        {title}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-white/60 text-sm md:text-base font-sans tracking-wide leading-relaxed max-w-lg whitespace-pre-line"
                    >
                        {description}
                    </motion.p>
                </motion.div>

            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 2 }}
                className="absolute bottom-12 text-[10px] md:text-xs font-mono lowercase tracking-[0.3em] text-white/30 z-20 pointer-events-none"
            >
                strxdale's catalog
            </motion.div>

            {/* Interactive gradient blobs in background */}
            <motion.div
                style={{ x: smoothX, y: smoothY }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-white opacity-[0.02] blur-3xl pointer-events-none"
            />
        </div>
    );
}

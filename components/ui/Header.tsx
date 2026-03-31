'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-6 left-0 right-0 z-50 px-4 md:px-6">
            <motion.nav 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto max-w-screen-xl bg-white/80 backdrop-blur-md border border-charcoal/5 rounded-full px-6 md:px-10 py-3 md:py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all"
            >
                {/* Left: Brand/Logo */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                        <motion.div 
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-charcoal/60"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 md:w-6 md:h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m7 7-5 5 5 5"></path>
                                <path d="m17 7 5 5-5 5"></path>
                                <path d="m13 17-2-10"></path>
                            </svg>
                        </motion.div>
                        <span className="text-charcoal font-bold tracking-[0.1em] text-sm md:text-base font-serif lowercase">
                            strxdale&apos;s catalog
                        </span>
                    </Link>
                </div>

                {/* Center: Navigation Links (Desktop) */}
                <div className="hidden md:flex items-center gap-14 absolute left-1/2 -translate-x-1/2">
                    {['katalog', 'kisah'].map((item, idx) => (
                        <Link 
                            key={item} 
                            href={item === 'katalog' ? '/collection' : '/story'} 
                            className="relative group text-[10px] font-bold tracking-[0.4em] text-charcoal/50 hover:text-charcoal transition-all duration-300 uppercase font-serif"
                        >
                            {item}
                            <motion.div 
                                className="absolute -bottom-1 left-0 right-0 h-[1px] bg-charcoal origin-left"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                            />
                        </Link>
                    ))}
                </div>

                {/* Right: Mobile Menu Toggle / Spacer */}
                <div className="flex items-center">
                    <button
                        className="md:hidden text-charcoal/60 hover:text-charcoal transition-colors p-1"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <span className="material-symbols-outlined font-light text-2xl">
                            {isMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                    <div className="hidden md:block w-8"></div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden absolute top-20 left-4 right-4 bg-white/90 backdrop-blur-xl border border-charcoal/5 rounded-3xl shadow-xl overflow-hidden"
                    >
                        <div className="flex flex-col p-8 gap-6 text-center">
                            {['katalog', 'kisah'].map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * (i + 1) }}
                                >
                                    <Link
                                        href={item === 'katalog' ? '/collection' : '/story'}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-[11px] font-bold tracking-[0.5em] text-charcoal/60 hover:text-charcoal uppercase font-serif py-2 block"
                                    >
                                        {item}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

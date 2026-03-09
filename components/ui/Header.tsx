'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-6 left-0 right-0 z-50 px-4 md:px-6">
            <nav className="mx-auto max-w-screen-xl bg-white/80 backdrop-blur-md border border-charcoal/5 rounded-full px-6 md:px-10 py-3 md:py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all">
                {/* Left: Brand/Logo */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                        <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-5 h-5 md:w-6 md:h-6 text-charcoal/40 transition-all duration-300 group-hover:text-charcoal group-hover:scale-110"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m7 7-5 5 5 5"></path>
                                <path d="m17 7 5 5-5 5"></path>
                                <path d="m13 17-2-10"></path>
                            </svg>
                        </div>
                        <span className="text-charcoal font-bold tracking-[0.1em] text-sm md:text-base font-serif lowercase">
                            strxdale&apos;s catalog
                        </span>
                    </Link>
                </div>

                {/* Center: Navigation Links (Desktop) */}
                <div className="hidden md:flex items-center gap-14 absolute left-1/2 -translate-x-1/2">
                    <Link href="/collection" className="text-[10px] font-bold tracking-[0.4em] text-charcoal/50 hover:text-charcoal transition-all duration-300 uppercase font-serif">
                        katalog
                    </Link>
                    <Link href="/story" className="text-[10px] font-bold tracking-[0.4em] text-charcoal/50 hover:text-charcoal transition-all duration-300 uppercase font-serif">
                        kisah
                    </Link>
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
                    {/* Balanced spacer for desktop */}
                    <div className="hidden md:block w-8"></div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden absolute top-20 left-4 right-4 bg-white border border-charcoal/5 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
            >
                <div className="flex flex-col p-8 gap-6 text-center">
                    <Link
                        href="/collection"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[11px] font-bold tracking-[0.5em] text-charcoal/60 hover:text-charcoal uppercase font-serif py-2"
                    >
                        katalog
                    </Link>
                    <Link
                        href="/story"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[11px] font-bold tracking-[0.5em] text-charcoal/60 hover:text-charcoal uppercase font-serif py-2"
                    >
                        kisah
                    </Link>
                </div>
            </div>
        </header>
    );
}

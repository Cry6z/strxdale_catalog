import Link from 'next/link';

export default function Footer() {
    return (
        <footer id="footer" className="bg-charcoal text-white pt-16 pb-8 border-t border-white/5">
            <div className="mx-auto max-w-7xl px-8">
                {/* Main Row */}
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-8 pb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-block group">
                            <h2 className="text-base font-bold tracking-[0.2em] font-serif lowercase transition-opacity group-hover:opacity-70">
                                strxdale&apos;s catalog
                            </h2>
                        </Link>
                    </div>

                    {/* Compact Links */}
                    <div className="flex flex-wrap gap-x-8 gap-y-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                        <Link href="/collection" className="hover:text-white transition-colors">katalog</Link>
                        <Link href="/story" className="hover:text-white transition-colors">kisah</Link>
                        <div className="w-[1px] h-3 bg-white/10 self-center hidden md:block"></div>
                        <a href="https://instagram.com/strxdale" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">instagram</a>
                        <a href="https://wa.me/6281379669540" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">whatsapp</a>
                        <a href="mailto:gibran121208@gmail.com" className="hover:text-white transition-colors">gmail</a>
                        <a href="https://github.com/strxdale" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">github</a>
                    </div>
                </div>

                {/* Bottom Bar: Minimalist Copyright */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] tracking-[0.3em] text-white/10 uppercase">
                    <p>© 2026 strxdale&apos;s catalog</p>
                    <p className="hidden md:block">Born From Restlessness</p>
                </div>
            </div>
        </footer>
    );
}

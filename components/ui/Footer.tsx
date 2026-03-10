import Link from 'next/link';

export default function Footer() {
    return (
        <footer id="footer" className="bg-charcoal text-white pt-16 pb-12 border-t border-white/5 overflow-hidden">
            <div className="mx-auto max-w-7xl px-8">
                {/* Main Row */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-baseline gap-12 md:gap-8 pb-16 md:pb-12">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <Link href="/" className="inline-block group">
                            <h2 className="text-lg md:text-base font-bold tracking-[0.3em] font-serif lowercase transition-all group-hover:opacity-70">
                                strxdale&apos;s catalog
                            </h2>
                        </Link>
                        <p className="text-[8px] tracking-[0.4em] uppercase text-white/20 mt-4 md:hidden">Born From Restlessness</p>
                    </div>

                    {/* Compact Links */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-4 md:gap-x-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                        <Link href="/collection" className="hover:text-white transition-colors">katalog</Link>
                        <Link href="/story" className="hover:text-white transition-colors">kisah</Link>
                        <div className="hidden md:block w-[1px] h-3 bg-white/10 self-center"></div>
                        <div className="w-full h-[1px] bg-white/5 md:hidden my-2"></div>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
                            <a href="https://instagram.com/strxdale" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">instagram</a>
                            <a href="https://wa.me/6281379669540" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">whatsapp</a>
                            <a href="mailto:gibran121208@gmail.com" className="hover:text-white transition-colors">gmail</a>
                            <a href="https://github.com/Cry6z" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors peer">github</a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Minimalist Copyright */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] tracking-[0.3em] text-white/10 uppercase">
                    <p>© 2026 strxdale&apos;s catalog</p>
                    <p className="hidden md:block uppercase">Born From Restlessness</p>
                    <div className="md:hidden flex gap-4 text-[8px]">
                        <span>Indonesia</span>
                        <span className="opacity-50">•</span>
                        <span>v1.2.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

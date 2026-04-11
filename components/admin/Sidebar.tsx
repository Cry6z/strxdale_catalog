import Link from 'next/link';

interface SidebarProps {
    view: 'overview' | 'catalog' | 'hero' | 'gallery';
    setView: (view: 'overview' | 'catalog' | 'hero' | 'gallery') => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ view, setView, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)} 
                />
            )}

            <aside className={`w-64 border-r border-border/40 bg-white/90 md:bg-white/50 backdrop-blur-3xl flex flex-col fixed inset-y-0 text-charcoal z-50 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 pb-4 flex justify-between items-center md:block">
                    <div>
                        <h2 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50 mb-1">Portal</h2>
                        <p className="text-xl font-bold tracking-tight">strxdale&apos;s catalog</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 rounded-lg bg-black/5 text-charcoal flex items-center justify-center hover:bg-black/10">
                         <span className="material-symbols-outlined text-xl!">close</span>
                    </button>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                    <button
                        onClick={() => { setView('overview'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'overview' ? 'bg-black/5 text-charcoal font-bold shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:bg-black/5 hover:text-charcoal'}`}
                    >
                        <span className={`material-symbols-outlined text-lg! ${view === 'overview' ? 'opacity-100' : 'opacity-70'}`}>dashboard</span>
                        Ringkasan
                    </button>
                    <button
                        onClick={() => { setView('catalog'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'catalog' ? 'bg-black/5 text-charcoal font-bold shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:bg-black/5 hover:text-charcoal'}`}
                    >
                        <span className={`material-symbols-outlined text-lg! ${view === 'catalog' ? 'opacity-100' : 'opacity-70'}`}>inventory_2</span>
                        Katalog
                    </button>
                    <button
                        onClick={() => { setView('hero'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'hero' ? 'bg-black/5 text-charcoal font-bold shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:bg-black/5 hover:text-charcoal'}`}
                    >
                        <span className={`material-symbols-outlined text-lg! ${view === 'hero' ? 'opacity-100' : 'opacity-70'}`}>image_search</span>
                        Pengaturan Hero
                    </button>
                    <button
                        onClick={() => { setView('gallery'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'gallery' ? 'bg-black/5 text-charcoal font-bold shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:bg-black/5 hover:text-charcoal'}`}
                    >
                        <span className={`material-symbols-outlined text-lg! ${view === 'gallery' ? 'opacity-100' : 'opacity-70'}`}>collections</span>
                        Pengaturan Galeri
                    </button>
                    <div className="pt-4 mt-4 border-t border-border/40">
                        <Link
                            href="/"
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-black/5 hover:text-charcoal transition-all"
                        >
                            <span className="material-symbols-outlined text-lg! opacity-70">open_in_new</span>
                            Lihat Situs
                        </Link>
                    </div>
                </nav>
                <div className="p-8">
                    <p className="text-[10px] font-medium text-muted-foreground/40">v1.2.0-stable</p>
                </div>
            </aside>
        </>
    );
}

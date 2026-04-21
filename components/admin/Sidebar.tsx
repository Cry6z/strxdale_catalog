import Link from 'next/link';

interface SidebarProps {
    view: 'overview' | 'catalog' | 'hero' | 'gallery' | 'store';
    setView: (view: 'overview' | 'catalog' | 'hero' | 'gallery' | 'store') => void;
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

            <aside className={`w-[280px] border-r border-slate-200/50 bg-white/60 backdrop-blur-2xl flex flex-col fixed inset-y-0 text-slate-800 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-slate-200/50' : '-translate-x-full'}`}>
                <div className="p-8 pb-4 flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-1.5 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                            Portal
                        </h2>
                        <p className="text-xl font-black tracking-tight text-slate-900 truncate">strxdale's catalog</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="mt-1 w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-all shrink-0">
                        <span className="material-symbols-outlined text-[18px]!">keyboard_double_arrow_left</span>
                    </button>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                    <button
                        onClick={() => { setView('overview'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden ${view === 'overview' ? 'bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] text-slate-900 ring-1 ring-slate-200/50' : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'}`}
                    >
                        {view === 'overview' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-r-full" />}
                        <span className={`material-symbols-outlined text-[20px]! transition-transform duration-300 group-hover:scale-110 ${view === 'overview' ? 'opacity-100 text-slate-900' : 'opacity-70'}`}>dashboard</span>
                        Ringkasan
                    </button>
                    <button
                        onClick={() => { setView('catalog'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden ${view === 'catalog' ? 'bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] text-slate-900 ring-1 ring-slate-200/50' : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'}`}
                    >
                        {view === 'catalog' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-r-full" />}
                        <span className={`material-symbols-outlined text-[20px]! transition-transform duration-300 group-hover:scale-110 ${view === 'catalog' ? 'opacity-100 text-slate-900' : 'opacity-70'}`}>inventory_2</span>
                        Katalog
                    </button>
                    <button
                        onClick={() => { setView('hero'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden ${view === 'hero' ? 'bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] text-slate-900 ring-1 ring-slate-200/50' : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'}`}
                    >
                        {view === 'hero' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-r-full" />}
                        <span className={`material-symbols-outlined text-[20px]! transition-transform duration-300 group-hover:scale-110 ${view === 'hero' ? 'opacity-100 text-slate-900' : 'opacity-70'}`}>image_search</span>
                        Pengaturan Hero
                    </button>
                    <button
                        onClick={() => { setView('gallery'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden ${view === 'gallery' ? 'bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] text-slate-900 ring-1 ring-slate-200/50' : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'}`}
                    >
                        {view === 'gallery' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-r-full" />}
                        <span className={`material-symbols-outlined text-[20px]! transition-transform duration-300 group-hover:scale-110 ${view === 'gallery' ? 'opacity-100 text-slate-900' : 'opacity-70'}`}>collections</span>
                        Galeri Landing
                    </button>
                    <button
                        onClick={() => { setView('store'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden ${view === 'store' ? 'bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] text-slate-900 ring-1 ring-slate-200/50' : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'}`}
                    >
                        {view === 'store' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-r-full" />}
                        <span className={`material-symbols-outlined text-[20px]! transition-transform duration-300 group-hover:scale-110 ${view === 'store' ? 'opacity-100 text-slate-900' : 'opacity-70'}`}>store</span>
                        Status Toko
                    </button>
                    <div className="pt-4 mt-4 border-t border-border/40">
                        <Link
                            href="/"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-white/50 hover:text-slate-900 transition-all duration-300 group"
                        >
                            <span className="material-symbols-outlined text-[20px]! opacity-70 group-hover:scale-110 transition-transform duration-300">open_in_new</span>
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

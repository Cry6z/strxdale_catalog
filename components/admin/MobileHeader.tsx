'use client';

interface MobileHeaderProps {
    setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function MobileHeader({ setIsSidebarOpen }: MobileHeaderProps) {
    return (
        <div className="md:hidden flex items-center justify-between mb-8 bg-white/50 backdrop-blur-lg p-4 rounded-2xl border border-border/40 shadow-sm relative z-30">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsSidebarOpen(true)} 
                    className="p-2 rounded-lg bg-black/5 hover:bg-black/10 transition-colors text-charcoal flex items-center justify-center"
                >
                    <span className="material-symbols-outlined text-xl!">menu</span>
                </button>
                <span className="font-bold text-sm tracking-tight text-charcoal">Hallo, Admin!</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-charcoal">
                <span className="material-symbols-outlined text-[16px]!">admin_panel_settings</span>
            </div>
        </div>
    );
}

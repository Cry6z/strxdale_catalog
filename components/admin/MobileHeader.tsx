'use client';

interface MobileHeaderProps {
    setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function MobileHeader({ setIsSidebarOpen }: MobileHeaderProps) {
    return (
        <>
            <div className="md:hidden fixed top-6 left-6 right-6 z-40 flex items-center justify-between bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white/40 shadow-sm">
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
            {/* Spacer underneath to compensate for fixed header (+ original top padding + element height) */}
            <div className="md:hidden h-[120px]"></div>
        </>
    );
}

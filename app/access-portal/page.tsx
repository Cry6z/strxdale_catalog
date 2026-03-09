'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple client-side check for MVP. 
        if (password === '121208') {
            localStorage.setItem('admin_auth', 'true');
            router.push('/admin');
        } else {
            setError('kredensial tidak valid');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-serif">
            <div className="w-full max-w-xs space-y-12 animate-in fade-in duration-1000">
                <div className="text-center space-y-4">
                    <h1 className="text-xl font-bold tracking-[0.2em] lowercase">portal akses</h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/40">hanya untuk personil berwenang</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1">
                        <input
                            type="password"
                            placeholder="kata sandi"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b border-charcoal/10 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors placeholder:text-charcoal/20"
                            required
                        />
                        {error && <p className="text-[10px] text-red-500 lowercase tracking-widest">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-charcoal text-white py-4 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-charcoal/90 transition-all"
                    >
                        masuk
                    </button>
                </form>

                <div className="text-center">
                    <Link href="/" className="text-[9px] uppercase tracking-widest text-charcoal/20 hover:text-charcoal transition-colors">
                        kembali ke situs
                    </Link>
                </div>
            </div>
        </div>
    );
}

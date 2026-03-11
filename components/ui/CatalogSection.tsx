'use client';

import { motion } from 'framer-motion';
import Card from './Card';
import Link from 'next/link';

interface CatalogSectionProps {
    items: any[];
}

export default function CatalogSection({ items }: CatalogSectionProps) {
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants: any = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section className="py-16 md:py-32 bg-off-white overflow-hidden" id="featured">
            <div className="mx-auto max-w-7xl px-6 md:px-8 mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-charcoal/30 block mb-4">karya pilihan</span>
                    <h3 className="text-4xl md:text-6xl font-serif font-black text-charcoal tracking-tighter leading-none lowercase">
                        produk unggulan
                    </h3>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="hidden md:block"
                >
                    <p className="max-w-[280px] text-[11px] text-charcoal/50 leading-relaxed uppercase tracking-wider text-right">
                        Desain terbaik yang baru saja saya rilis ke dalam katalog.
                    </p>
                </motion.div>
            </div>

            <div className="mx-auto max-w-7xl px-6 md:px-8">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 md:gap-y-24"
                >
                    {items.map((item) => (
                        <motion.div key={item.id} variants={cardVariants}>
                            <Card {...item} />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-24 md:mt-32 text-center"
                >
                    <Link
                        href="/collection"
                        className="group relative inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-charcoal pb-4 overflow-hidden"
                    >
                        <span className="relative z-10 transition-colors duration-500 group-hover:text-charcoal/60">lihat semua koleksi</span>
                        <motion.div 
                            className="absolute bottom-0 left-0 w-full h-[1px] bg-charcoal/20"
                        />
                        <motion.div 
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                            className="absolute bottom-0 left-0 w-full h-[1px] bg-charcoal origin-left"
                        />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

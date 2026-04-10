'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CatalogItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    is_showcase?: boolean;
    is_featured?: boolean;
}

export default function Card(item: CatalogItem) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group block"
        >
            <Link href={`/collection/${item.id}`} className="snap-start cursor-pointer block">
                <div className="aspect-4/5 overflow-hidden bg-beige relative rounded-2xl md:rounded-none shadow-sm group-hover:shadow-2xl transition-shadow duration-700">
                    <motion.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Image
                            src={item.image_url || '/placeholder.png'}
                            alt={item.name}
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    {/* Featured Tag */}
                    {item.is_featured && (
                        <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute top-4 right-4 z-10"
                        >
                            <span className="bg-charcoal text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                                featured
                            </span>
                        </motion.div>
                    )}

                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/5 transition-colors duration-500" />
                </div>

                <div className="mt-4 md:mt-8 flex justify-between items-baseline px-1 md:px-0">
                    <div className="space-y-1">
                        <h4 className="text-base md:text-lg font-serif font-bold group-hover:text-charcoal/60 transition-colors duration-300 lowercase tracking-tight">
                            {item.name}
                        </h4>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-px bg-charcoal/20" />
                            <p className="text-[10px] md:text-xs text-charcoal/40 font-bold uppercase tracking-widest">
                                {item.category}
                            </p>
                        </div>
                    </div>
                    <span className="text-sm md:text-base font-medium font-sans tabular-nums text-charcoal/80">
                        {item.is_showcase ? (
                            <span className="text-charcoal/30 italic font-medium lowercase">showcase</span>
                        ) : item.price === 0 ? (
                            <span className="text-charcoal/30 italic font-medium lowercase">pre order</span>
                        ) : (
                            `$${item.price.toLocaleString()}`
                        )}
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

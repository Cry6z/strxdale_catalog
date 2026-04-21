'use client';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import ScrollFloat from '@/components/ScrollFloat';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function StoryPage() {
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
    };

    const cardVariants: any = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut'
            }
        }
    };

    return (
        <main className="min-h-screen bg-white font-mono selection:bg-charcoal selection:text-white">
            <Header />

            {/* Hero Narrative */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative pt-32 md:pt-48 pb-24 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
            >
                {/* Decorative background circle */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute top-20 right-10 w-96 h-96 bg-charcoal/5 rounded-full blur-3xl pointer-events-none -z-10" 
                />

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                    <motion.div variants={itemVariants} className="w-full lg:w-1/2 space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-4 mb-4">
                            <span className="w-12 h-px bg-charcoal/30"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-charcoal/50">Awal Mula</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] lowercase">
                            berawal dari rasa <span className="italic text-charcoal/50">bosan</span>, lalu menjadi sesuatu.
                        </h1>

                        <div className="space-y-6 pt-6 text-sm md:text-base leading-relaxed text-charcoal/70 max-w-lg border-l border-charcoal/10 pl-6">
                            <p>
                                Tidak ada rencana besar di awal—hanya sekedar ketertarikan spontan pada bentuk yang tenang dan tampilan yang minimal.
                            </p>
                            <p>
                                Seiring berjalannya waktu, percobaan kecil itu bergulir dan berkembang menjadi serangkaian eksplorasi desain yang berfokus pada kesederhanaan.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        variants={itemVariants} 
                        className="w-full lg:w-1/2 relative"
                    >
                        {/* Adding subtle floating animation to the entire container */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="relative aspect-3/4 w-full max-w-md mx-auto group"
                        >
                            <div className="absolute inset-x-4 -bottom-4 top-4 bg-charcoal/5 -z-10 transition-transform duration-700 group-hover:rotate-3"></div>
                            <div className="absolute inset-0 bg-charcoal/10 origin-bottom-left transition-transform duration-1000 group-hover:-rotate-3 overflow-hidden">
                                <Image
                                    src="/images/story/design.png"
                                    alt="Initial sketch"
                                    fill
                                    className="object-cover opacity-80 mix-blend-multiply group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000"
                                />
                            </div>
                            <div className="absolute -left-8 top-1/4 -rotate-90 origin-left text-[9px] uppercase tracking-[0.4em] text-charcoal/30 font-bold mix-blend-difference">
                                design / prototype 01
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Prototype Showcase */}
            <section className="py-24 md:py-32 bg-charcoal text-white overflow-hidden relative">
                {/* Decorative background grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
                    >
                        <div>
                            <div className="inline-flex items-center gap-4 mb-6">
                                <span className="w-12 h-px bg-white/30"></span>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/50">Evolusi</h2>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tighter lowercase max-w-lg">
                                dari prototipe hingga bentuk komersial.
                            </h3>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
                    >
                        {/* Card 1 */}
                        <motion.div variants={cardVariants} className="group cursor-crosshair">
                            <div className="relative aspect-4/5 overflow-hidden mb-6 bg-white/5">
                                <Image
                                    src="/images/story/renaissance.png"
                                    alt="First Design Prototype"
                                    fill
                                    className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out mix-blend-luminosity group-hover:mix-blend-normal"
                                />
                                <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-500" />
                                <div className="absolute top-6 right-6 text-xs text-white/50 font-mono tracking-widest">01</div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-base font-bold lowercase tracking-tight">Renaissance</h3>
                                <p className="text-[11px] leading-relaxed text-white/50">
                                    Ini merupakan prototipe pertama; didesain secara personal, diproduksi terbatas, hanya untuk merasakan bagaimana kain jatuh pada lekuk badan.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 2 - Offset downwards */}
                        <motion.div variants={cardVariants} className="group cursor-crosshair md:mt-24">
                            <div className="relative aspect-4/5 overflow-hidden mb-6 bg-white/5">
                                <Image
                                    src="/images/story/spacewalk.png"
                                    alt="Material Study"
                                    fill
                                    className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out mix-blend-luminosity group-hover:mix-blend-normal"
                                />
                                <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-500" />
                                <div className="absolute top-6 right-6 text-xs text-white/50 font-mono tracking-widest">02</div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-base font-bold lowercase tracking-tight">Spacewalk</h3>
                                <p className="text-[11px] leading-relaxed text-white/50">
                                    Eksplorasi berlanjut. Desain ini mereduksi elemen visual berlebih, membawa keyakinan penuh menuju arah minimalisme ekstrem.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 3 - Special Link Card */}
                        <motion.div
                            variants={cardVariants}
                            className="bg-white text-charcoal flex flex-col items-center justify-center p-12 text-center group relative overflow-hidden h-full min-h-[400px] lg:mt-48"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                className="absolute -right-20 -top-20 w-64 h-64 bg-charcoal/5 rounded-full blur-3xl pointer-events-none"
                            />
                            
                            <div className="space-y-8 relative z-10 w-full">
                                <div>
                                    <h3 className="text-3xl font-bold tracking-tighter lowercase leading-tight">
                                        perjalanan ini berlanjut...
                                    </h3>
                                    <p className="text-charcoal/50 text-[11px] mt-4 max-w-xs mx-auto leading-relaxed">
                                        Menemukan bentuk esensial bukanlah titik henti, melainkan langkah awal menuju koleksi.
                                    </p>
                                </div>
                                <Link href="/collection" className="group/btn inline-flex items-center gap-4 bg-charcoal text-white px-8 py-4 text-[10px] uppercase tracking-widest hover:bg-charcoal/90 transition-colors">
                                    <span>Katalog Utama</span>
                                    <span className="material-symbols-outlined text-[14px]! group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Closing */}
            <section className="py-32 md:py-48 text-center px-6 md:px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    <ScrollFloat
                        as="p"
                        animationDuration={1}
                        ease="back.inOut(2)"
                        scrollStart="center bottom+=60%"
                        scrollEnd="bottom bottom-=30%"
                        stagger={0.03}
                        containerClassName="w-full"
                        textClassName="text-2xl md:text-3xl font-light italic text-charcoal/60 leading-relaxed max-w-2xl px-4"
                    >
                        &quot;Desain bukan hanya tentang penampilan, tetapi tentang menemukan bentuk yang terasa tepat.&quot;
                    </ScrollFloat>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-[10px] uppercase tracking-[0.6em] text-charcoal/40 font-bold w-full mt-4"
                    >
                        someone
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}


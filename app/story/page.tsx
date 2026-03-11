import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import ScrollFloat from '@/components/ScrollFloat';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function StoryPage() {
    return (
        <main className="min-h-screen bg-white font-mono selection:bg-charcoal selection:text-white">
            <Header />

            {/* Hero Narrative */}
            <section className="pt-32 md:pt-48 pb-16 md:pb-24 px-6 md:px-8 max-w-5xl mx-auto">
                <div className="space-y-12 md:space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-charcoal/30">Asal Usul</span>
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[1] md:leading-[0.9] lowercase max-w-3xl">
                            berawal dari rasa bosan, lalu menjadi sesuatu.
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
                        <div className="space-y-6 md:space-y-8 text-base md:text-lg leading-relaxed text-charcoal/80">
                            <p>
                                Tidak ada rencana besar di awal hanya ketertarikan pada bentuk yang tenang dan tampilan yang minimal.
                            </p>
                            <p>
                                Seiring waktu, percobaan kecil itu berkembang menjadi rangkaian desain yang terus bereksplorasi pada kesederhanaan dan bentuk yang esensial.
                            </p>
                        </div>
                        <div className="relative aspect-[4/5] bg-charcoal/5 overflow-hidden greyscale group">
                            <Image
                                src="/images/story/design.png"
                                alt="Initial sketch"
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            <div className="absolute bottom-6 left-6 text-[9px] uppercase tracking-widest text-charcoal/40">
                                design / strxdale
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Prototype Showcase */}
            <section className="py-16 md:py-24 bg-charcoal/5">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="mb-12 md-16">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-charcoal/40 mb-4">Prototipe</h2>
                        <div className="w-10 md:w-12 h-[1px] bg-charcoal/20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white p-2 group cursor-crosshair">
                            <div className="relative aspect-square overflow-hidden mb-6">
                                <Image
                                    src="/images/story/renaissance.png"
                                    alt="First Design Prototype"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="px-4 pb-6 space-y-2">
                                <h3 className="text-sm font-bold lowercase tracking-tight">Renaissance (Desain Pertama)</h3>
                                <p className="text-[11px] leading-relaxed text-charcoal/50">
                                    Ini merupakan baju yang saya desain sendiri dan sudah saya produksi untuk pemakaian pribadi
                                </p>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white p-2 group cursor-crosshair">
                            <div className="relative aspect-square overflow-hidden mb-6">
                                <Image
                                    src="/images/story/spacewalk.png"
                                    alt="Material Study"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="px-4 pb-6 space-y-2">
                                <h3 className="text-sm font-bold lowercase tracking-tight">spacewalk</h3>
                                <p className="text-[11px] leading-relaxed text-charcoal/50">
                                    Desain ini yang membuat saya yakin untuk memakai gaya minimalis pada desain saya kedepannya
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-charcoal flex flex-col items-center justify-center p-12 text-center group">
                            <div className="space-y-6">
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">proses berkelanjutan</p>
                                <h3 className="text-white text-2xl font-bold tracking-tighter lowercase leading-tight">
                                    perjalanan berlanjut di dalam koleksi.
                                </h3>
                                <Link href="/collection" className="inline-block mt-4 border-b border-white/20 pb-1 text-[10px] uppercase tracking-widest text-white hover:border-white transition-colors">
                                    lihat katalog
                                </Link>
                            </div>
                        </div>
                    </div>
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
                        textClassName="text-2xl md:text-3xl font-light italic text-charcoal/60 leading-relaxed max-w-2xl"
                    >
                        &quot;Desain bukan sekadar tampilan, tetapi tentang menemukan bentuk yang terasa benar&quot;
                    </ScrollFloat>
                    <div className="text-[10px] uppercase tracking-[0.6em] text-charcoal/40 font-bold w-full mt-4">
                        someone
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

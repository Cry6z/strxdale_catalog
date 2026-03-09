import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';

export default function StoryPage() {
    return (
        <main className="min-h-screen bg-white font-serif selection:bg-charcoal selection:text-white">
            <Header />

            {/* Hero Narrative */}
            <section className="pt-32 md:pt-48 pb-16 md:pb-24 px-6 md:px-8 max-w-5xl mx-auto">
                <div className="space-y-12 md:space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-charcoal/30">The Origin</span>
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[1] md:leading-[0.9] lowercase max-w-3xl">
                            it started with a single line on a blank canvas.
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
                        <div className="space-y-6 md:space-y-8 text-base md:text-lg leading-relaxed text-charcoal/80">
                            <p>
                                What started as a restless evening quickly transformed into an obsession with form, texture, and silence. I wasn't looking for a business; I was looking for a language that spoke without noise.
                            </p>
                            <p>
                                Every archive, every prototype, and every line in this catalog is a residue of that journey. It's about stripping away the excess until only the essential remains.
                            </p>
                        </div>
                        <div className="relative aspect-[4/5] bg-charcoal/5 overflow-hidden greyscale group">
                            <Image
                                src="/images/story/proto1.png"
                                alt="Initial sketch"
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            <div className="absolute bottom-6 left-6 text-[9px] uppercase tracking-widest text-charcoal/40">
                                archive_001 / draft_phase
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Prototype Showcase */}
            <section className="py-16 md:py-24 bg-charcoal/5">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="mb-12 md-16">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-charcoal/40 mb-4">Prototypes</h2>
                        <div className="w-10 md:w-12 h-[1px] bg-charcoal/20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white p-2 group cursor-crosshair">
                            <div className="relative aspect-square overflow-hidden mb-6">
                                <Image
                                    src="/images/story/proto2.png"
                                    alt="UI Prototype"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="px-4 pb-6 space-y-2">
                                <h3 className="text-sm font-bold lowercase tracking-tight">digital interfaces</h3>
                                <p className="text-[11px] leading-relaxed text-charcoal/50">
                                    Exploring the intersection of geometric grids and human interaction.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-2 group cursor-crosshair">
                            <div className="relative aspect-square overflow-hidden mb-6">
                                <Image
                                    src="/images/story/proto3.png"
                                    alt="Material Study"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="px-4 pb-6 space-y-2">
                                <h3 className="text-sm font-bold lowercase tracking-tight">textural studies</h3>
                                <p className="text-[11px] leading-relaxed text-charcoal/50">
                                    A deep dive into natural fibers and how light interacts with raw surfaces.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-charcoal flex flex-col items-center justify-center p-12 text-center group">
                            <div className="space-y-6">
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">continuous process</p>
                                <h3 className="text-white text-2xl font-bold tracking-tighter lowercase leading-tight">
                                    the journey continues in the collection.
                                </h3>
                                <a href="/collection" className="inline-block mt-4 border-b border-white/20 pb-1 text-[10px] uppercase tracking-widest text-white hover:border-white transition-colors">
                                    view catalog
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing */}
            <section className="py-32 md:py-48 text-center px-6 md:px-8">
                <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-1000">
                    <p className="text-2xl md:text-3xl font-light italic text-charcoal/60 leading-relaxed">
                        "Design is not what it looks like and feels like. Design is how it works."
                    </p>
                    <div className="text-[10px] uppercase tracking-[0.6em] text-charcoal/40 font-bold">
                        strxdale
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

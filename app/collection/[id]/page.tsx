import { supabase } from '@/lib/supabase';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ProductGallery from '@/components/ui/ProductGallery';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getItem(id: string) {
    const { data, error } = await supabase
        .from('catalog_items')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return null;
    }
    return data;
}

async function getContactInfo() {
    const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'contact_info')
        .single();

    return data?.value || { whatsapp: "6281234567890" };
}

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const [item, contactInfo] = await Promise.all([
        getItem(params.id),
        getContactInfo()
    ]);

    if (!item) {
        notFound();
    }

    const whatsappNumber = contactInfo.whatsapp;
    const message = encodeURIComponent(`Halo, saya tertarik untuk memesan ${item.name} dari katalog Anda.`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Combine main image with gallery images
    const gallery = [item.image_url, ...(item.gallery || [])].filter(Boolean);

    return (
        <div className="relative flex min-h-screen flex-col bg-white">
            <Header />

            <main className="flex-1 pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Image Gallery / Carousel Section */}
                        <ProductGallery images={gallery} name={item.name} />

                        {/* Product Info Section */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-8">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-charcoal/30 block mb-4">
                                    {item.category}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-serif font-black text-charcoal mb-4 md:mb-6 tracking-tighter lowercase">
                                    {item.name}
                                </h1>
                                <p className="text-2xl font-light text-charcoal/80">
                                    {item.is_showcase ? (
                                        <span className="italic">showcase</span>
                                    ) : item.price === 0 ? (
                                        <span className="italic">pre order</span>
                                    ) : (
                                        `$${item.price.toLocaleString()}`
                                    )}
                                </p>
                            </div>

                            <div className="h-[1px] w-full bg-charcoal/5 mb-8" />

                            <div className="mb-12">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40 mb-4">Deskripsi</h3>
                                <p className="text-charcoal/70 leading-relaxed font-sans whitespace-pre-line">
                                    {item.description}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {!item.is_showcase ? (
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-charcoal text-white text-center py-5 rounded-none font-bold text-xs uppercase tracking-[0.4em] hover:bg-charcoal/90 transition-all"
                                    >
                                        pesan via whatsapp
                                    </a>
                                ) : (
                                    <div className="bg-charcoal/5 text-charcoal/40 text-center py-5 rounded-none font-bold text-xs uppercase tracking-[0.4em] cursor-default border border-charcoal/10">
                                        display only
                                    </div>
                                )}
                                <Link
                                    href="/collection"
                                    className="block w-full border border-charcoal/10 text-charcoal/40 text-center py-5 rounded-none font-bold text-xs uppercase tracking-[0.4em] hover:bg-charcoal/5 transition-all"
                                >
                                    kembali ke koleksi
                                </Link>
                            </div>

                            <div className="mt-12 p-6 bg-beige/50 border border-charcoal/5">
                                <p className="text-[10px] text-charcoal/40 font-bold uppercase tracking-[0.2em] leading-relaxed italic">
                                    * mohon dicatat: untuk item pre-order, produksi dapat memakan waktu 7-14 hari kerja. kami akan menghubungi anda via whatsapp untuk konfirmasi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

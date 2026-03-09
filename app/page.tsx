import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import Hero from '@/components/ui/Hero';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ScrollFloat from '@/components/ScrollFloat';

export const dynamic = 'force-dynamic';

async function getItems() {
  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching items:', error);
    return [];
  }
  return data || [];
}

export default async function Home() {
  const items = await getItems();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Hero />

        {/* Catalog Section */}
        <section className="py-16 md:py-24 bg-off-white overflow-hidden" id="featured">
          <div className="mx-auto max-w-7xl px-6 md:px-8 mb-8 md:mb-12 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/40 block mb-2">Karya Pilihan</span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">Produk Unggulan</h3>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
              {items.slice(0, 3).map((item) => (
                <Card key={item.id} {...item} />
              ))}
            </div>

            <div className="mt-20 text-center">
              <a
                href="/collection"
                className="inline-block text-[10px] font-bold uppercase tracking-0.4em text-charcoal border-b border-charcoal/20 pb-2 hover:border-charcoal transition-all"
              >
                lihat semua koleksi
              </a>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="bg-beige py-24 md:py-32 px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="w-full"
              textClassName="font-serif text-3xl md:text-5xl italic text-charcoal leading-tight max-w-4xl mx-auto"
            >
              "Kesederhanaan adalah kecanggihan tertinggi. Koleksi saya mencerminkan komitmen terhadap kualitas dan tekstur alami."
            </ScrollFloat>
            <div className="mt-8 md:mt-12 h-[1px] w-16 md:w-24 bg-charcoal/20 mx-auto"></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

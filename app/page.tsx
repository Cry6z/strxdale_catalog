import { supabase } from '@/lib/supabase';
import Hero from '@/components/ui/Hero';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ScrollFloat from '@/components/ScrollFloat';
import Gallery from '@/components/ui/Gallery';
import CatalogSection from '@/components/ui/CatalogSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getItems() {
  // First, try to fetch featured items
  const { data: featuredData, error: featuredError } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3);

  if (featuredError) {
    if (featuredError.code === '42703') {
      console.warn('Column "is_featured" missing from catalog_items table. Falling back to latest items.');
    } else {
      console.error('Error fetching featured items:', featuredError.message || featuredError);
    }
  }

  let finalItems = featuredData || [];

  // If we have less than 3 featured items, fetch the latest ones to fill up
  if (finalItems.length < 3) {
    const { data: latestData, error: latestError } = await supabase
      .from('catalog_items')
      .select('*')
      .not('id', 'in', `(${finalItems.map(i => i.id).join(',') || '00000000-0000-0000-0000-000000000000'})`)
      .order('created_at', { ascending: false })
      .limit(3 - finalItems.length);

    if (latestError) {
      console.error('Error fetching latest items:', latestError);
    } else if (latestData) {
      finalItems = [...finalItems, ...latestData];
    }
  }

  return finalItems;
}

async function getHeroSettings() {
  try {
    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('*')
      .in('key', ['hero_images', 'hero_title', 'hero_description']);

    if (error) {
      console.error('Error fetching site_settings:', error);
    }

    const heroSettings = {
      images: [] as string[],
      title: "strxdale's catalog",
      description: "Sebuah ruang untuk desain yang lahir dari rasa ingin mencoba. Sederhana, tenang, dan dibuat dengan pendekatan yang minimal."
    };

    if (settings) {
      settings.forEach(s => {
        if (s.key === 'hero_images' && Array.isArray(s.value)) heroSettings.images = s.value;
        if (s.key === 'hero_title' && s.value) heroSettings.title = String(s.value);
        if (s.key === 'hero_description' && s.value) heroSettings.description = String(s.value);
      });
    }

    return heroSettings;
  } catch (err) {
    console.error('Critical error in getHeroSettings:', err);
    return {
      images: [],
      title: "strxdale's catalog",
      description: "Sebuah ruang untuk desain yang lahir dari rasa ingin mencoba. Sederhana, tenang, dan dibuat dengan pendekatan yang minimal."
    };
  }
}

export default async function Home() {
  const [items, heroSettings] = await Promise.all([
    getItems(),
    getHeroSettings()
  ]);

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        <Hero
          images={heroSettings.images && heroSettings.images.length > 0 ? heroSettings.images : undefined}
          title={heroSettings.title}
          description={heroSettings.description}
        />

        <CatalogSection items={items} />

        <Gallery />

        {/* Quote Section */}
        <section className="relative py-24 md:py-48 px-6 md:px-8 overflow-hidden bg-off-white">
          <div
            className="absolute inset-0 z-0 opacity-40 pointer-events-none grayscale"
            style={{
              backgroundImage: 'url("/images/landing page/background.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <ScrollFloat
              animationDuration={1.5}
              ease="power4.out"
              scrollStart="top bottom-=10%"
              scrollEnd="bottom center"
              stagger={0.03}
              containerClassName="w-full"
              textClassName="font-serif text-3xl md:text-6xl italic text-charcoal leading-[1.2] max-w-3xl mx-auto px-4"
            >
              "Behind every simple form, there is a silent phase that has been passed."
            </ScrollFloat>
            <div className="mt-16 h-[1px] w-12 bg-charcoal/20 mx-auto"></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


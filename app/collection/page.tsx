import { supabase } from '@/lib/supabase';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import CollectionGrid from '@/components/ui/CollectionGrid';

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

async function getCategories() {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'catalog_categories')
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching categories:', error);
    }
    return data?.value || ['lifestyle', 'accessories', 'design', 'vintage'];
}

export default async function CollectionPage() {
    const [items, categories] = await Promise.all([
        getItems(),
        getCategories()
    ]);

    return (
        <div className="relative flex min-h-screen flex-col bg-off-white">
            <Header />

            <main className="flex-1">
                <CollectionGrid initialItems={items} categories={categories} />
            </main>

            <Footer />
        </div>
    );
}

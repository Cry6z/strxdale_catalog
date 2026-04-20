import { supabase } from './supabase';

export async function getStoreSettings() {
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['store_status', 'closed_title', 'closed_description', 'closed_background']);

    let status = 'open';
    let title = 'Toko Sedang Ditutup';
    let description = 'Kami sedang merapikan beberapa hal di belakang layar. Seluruh akses katalog dan pemesanan saat ini tidak tersedia. Silakan kembali dalam beberapa waktu ke depan.';
    let background = '';

    if (settings) {
        settings.forEach(s => {
            if (s.key === 'store_status' && s.value) status = s.value;
            if (s.key === 'closed_title' && s.value) title = String(s.value);
            if (s.key === 'closed_description' && s.value) description = String(s.value);
            if (s.key === 'closed_background' && s.value) background = String(s.value);
        });
    }

    return { status, title, description, background };
}

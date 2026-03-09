import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { error: checkError } = await supabase
            .from('site_settings')
            .select('key')
            .limit(1);

        if (checkError && checkError.code === '42P01') {
            return NextResponse.json({
                status: 'error',
                message: 'Table "site_settings" does not exist. Please run this in your Supabase SQL Editor: CREATE TABLE site_settings (key TEXT PRIMARY KEY, value JSONB);'
            }, { status: 400 });
        }

        const keys = ['catalog_categories', 'hero_images', 'hero_title', 'hero_description'];
        for (const key of keys) {
            const { data } = await supabase.from('site_settings').select('*').eq('key', key).single();
            if (!data) {
                let defaultValue: string | string[] = "";
                if (key === 'catalog_categories') defaultValue = ['Lifestyle', 'Accessories', 'Design', 'Vintage'];
                if (key === 'hero_images') defaultValue = ['', '', ''];

                await supabase.from('site_settings').insert({ key, value: defaultValue });
            }
        }

        return NextResponse.json({ status: 'success', message: 'Database schema and settings verified.' });
    } catch (e: unknown) {
        return NextResponse.json({ status: 'error', message: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}

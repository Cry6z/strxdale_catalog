import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Create site_settings table if it doesn't exist (using JS as a check)
        // Note: Real table creation should be done in Supabase SQL Editor, 
        // but we can check if it exists or try a simple operation.

        const { error: checkError } = await supabase
            .from('site_settings')
            .select('key')
            .limit(1);

        if (checkError && checkError.code === '42P01') { // Table doesn't exist
            return NextResponse.json({
                status: 'error',
                message: 'Table "site_settings" does not exist. Please run this in your Supabase SQL Editor: CREATE TABLE site_settings (key TEXT PRIMARY KEY, value JSONB);'
            }, { status: 400 });
        }

        // 2. Ensure basic keys exist
        const keys = ['catalog_categories', 'hero_images', 'hero_title', 'hero_description'];
        for (const key of keys) {
            const { data } = await supabase.from('site_settings').select('*').eq('key', key).single();
            if (!data) {
                let defaultValue: any = "";
                if (key === 'catalog_categories') defaultValue = ['Lifestyle', 'Accessories', 'Design', 'Vintage'];
                if (key === 'hero_images') defaultValue = ['', '', ''];

                await supabase.from('site_settings').insert({ key, value: defaultValue });
            }
        }

        return NextResponse.json({ status: 'success', message: 'Database schema and settings verified.' });
    } catch (e: any) {
        return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
    }
}

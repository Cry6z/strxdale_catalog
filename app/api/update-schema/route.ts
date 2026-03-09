import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Since I can't run raw SQL easily via the client in some configs, 
        // I'll try to use the rpc if available, but usually adding columns is better via dashboard.
        // However, I'll try to use a trick if the user has enabled it, or just advise them.

        // Actually, I'll just check if the column exists first.
        const { data, error } = await supabase
            .from('catalog_items')
            .select('gallery')
            .limit(1);

        if (error && error.code === '42703') { // Column does not exist
            return NextResponse.json({
                error: "Gallery column missing. Please run the following SQL in Supabase Editor: ALTER TABLE catalog_items ADD COLUMN gallery TEXT[] DEFAULT '{}';"
            }, { status: 400 });
        }

        return NextResponse.json({ status: "Gallery column exists" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

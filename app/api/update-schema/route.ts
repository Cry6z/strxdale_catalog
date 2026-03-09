import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { error } = await supabase
            .from('catalog_items')
            .select('gallery')
            .limit(1);

        if (error && error.code === '42703') {
            return NextResponse.json({
                error: "Gallery column missing. Please run the following SQL in Supabase Editor: ALTER TABLE catalog_items ADD COLUMN gallery TEXT[] DEFAULT '{}';"
            }, { status: 400 });
        }

        return NextResponse.json({ status: "Gallery column exists" });
    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}

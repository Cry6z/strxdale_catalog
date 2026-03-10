import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Check for gallery
        const { error: galleryError } = await supabase
            .from('catalog_items')
            .select('gallery')
            .limit(1);

        if (galleryError && galleryError.code === '42703') {
            return NextResponse.json({
                error: "Gallery column missing. Please run: ALTER TABLE catalog_items ADD COLUMN gallery TEXT[] DEFAULT '{}';"
            }, { status: 400 });
        }

        // Check for is_featured
        const { error: featuredError } = await supabase
            .from('catalog_items')
            .select('is_featured')
            .limit(1);

        if (featuredError && featuredError.code === '42703') {
            return NextResponse.json({
                error: "is_featured column missing. Please run: ALTER TABLE catalog_items ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;"
            }, { status: 400 });
        }

        return NextResponse.json({ status: "Schema is up to date" });
    } catch (e: unknown) {
        return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}

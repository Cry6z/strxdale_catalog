import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const { data, error } = await supabase.from('catalog_items').select('*').limit(1)

        if (error) {
            return NextResponse.json({ status: 'error', code: error.code, message: error.message }, { status: 500 })
        }

        return NextResponse.json({
            status: 'success',
            data: data || []
        })
    } catch (error: any) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
    }
}

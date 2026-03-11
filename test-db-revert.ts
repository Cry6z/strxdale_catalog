import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://prbzxwxrctzidccrndir.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYnp4d3hyY3R6aWRjY3JuZGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjE1ODIsImV4cCI6MjA4NjIzNzU4Mn0.u11BUpMRSRmfDsriJWxARI-9pfvZzKsrzGzTrWoRZpY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
    await supabase.from('site_settings').update({ value: "strxdale's catalog" }).eq('key', 'hero_title')
    console.log('REVERTED hero_title')
}

test()

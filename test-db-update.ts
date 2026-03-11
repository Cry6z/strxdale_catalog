import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://prbzxwxrctzidccrndir.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYnp4d3hyY3R6aWRjY3JuZGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjE1ODIsImV4cCI6MjA4NjIzNzU4Mn0.u11BUpMRSRmfDsriJWxARI-9pfvZzKsrzGzTrWoRZpY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
    console.log('Testing UPDATE with ANON key...')
    const { data, error } = await supabase
        .from('site_settings')
        .update({ value: 'TEST' })
        .eq('key', 'hero_title')
        .select()

    if (error) {
        console.error('UPDATE ERROR:', error.message)
    } else if (data && data.length > 0) {
        console.log('UPDATE SUCCESSFUL:', data)
    } else {
        console.log('UPDATE FAILED: No rows affected (maybe key not found or policy restriction)')
    }
}

test()

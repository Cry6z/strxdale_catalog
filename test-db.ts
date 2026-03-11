import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://prbzxwxrctzidccrndir.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYnp4d3hyY3R6aWRjY3JuZGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjE1ODIsImV4cCI6MjA4NjIzNzU4Mn0.u11BUpMRSRmfDsriJWxARI-9pfvZzKsrzGzTrWoRZpY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
    const { data, error } = await supabase.from('site_settings').select('key, updated_at')
    if (error) {
        console.error('Error:', error)
    } else {
        const now = Date.now()
        const tenMin = 10 * 60 * 1000
        const recent = data.filter(d => (now - new Date(d.updated_at).getTime()) < tenMin)
        console.log('RECENT UPDATES COUNT:', recent.length)
        recent.forEach(d => console.log('RECENT KEY:', d.key))
        if (recent.length === 0) {
            const oldest = data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]
            console.log('MOST RECENT IS:', oldest.key, 'AT', oldest.updated_at)
        }
    }
}

test()

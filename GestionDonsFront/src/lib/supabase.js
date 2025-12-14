import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ywfwjnfngbctwiouobrv.supabase.co'
const supabaseAnonKey = 'sb_publishable_Q_-2NY9XYyOzjcNZS2-XCg_dkpqKpA8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

import { createClient } from '@supabase/supabase-js'

// 从Supabase控制台获取这些值
const SUPABASE_URL = 'https://jojjpddfbyniynmwnpcv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_FussiLLRuoUpS-4wJB2U-g_AEq6lAVM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

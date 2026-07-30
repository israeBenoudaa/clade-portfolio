import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
  try { return ['http:', 'https:'].includes(new URL(url).protocol) }
  catch { return false }
}

export const supabase = isValidUrl(SUPABASE_URL)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

export const insertRow = async (table, data) => {
  if (!supabase) {
    console.warn('Supabase non configuré — données non envoyées')
    return { error: null }
  }
  return supabase.from(table).insert([data])
}

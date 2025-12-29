import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey)
let supabase
if (supabaseReady) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  const notConfigured = () => {
    const msg = 'Auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env and restart the dev server.'
    const err = new Error(msg)
    // Add a recognizable name for easier debugging
    err.name = 'SupabaseNotConfiguredError'
    throw err
  }
  supabase = {
    auth: {
      async getSession() { return { data: { session: null } } },
      onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } } },
      async signInWithPassword() { return notConfigured() },
      async signUp() { return notConfigured() },
      async signOut() { return notConfigured() },
    },
  }
}

export { supabaseReady, supabase }
export default supabase

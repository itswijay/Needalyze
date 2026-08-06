import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * The browser-side Supabase client.
 *
 * Its only remaining job is authentication: signing in, keeping the session in
 * local storage, refreshing tokens and broadcasting auth state changes. All
 * table and storage access happens server-side through the repositories, so
 * nothing outside `infrastructure/` should import this.
 */
export const browserClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

/**
 * The current access token, or null when signed out. Used to authorise calls to
 * our own API routes.
 *
 * @returns {Promise<string | null>}
 */
export async function getAccessToken() {
  const {
    data: { session },
  } = await browserClient.auth.getSession()
  return session?.access_token || null
}

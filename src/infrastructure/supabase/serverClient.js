import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/** Server-side clients must never persist or auto-refresh a session. */
const SERVER_AUTH_OPTIONS = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
}

function requireEnv(value, name) {
  if (!value) {
    throw new Error(`Missing ${name} environment variable`)
  }
  return value
}

/**
 * A client that acts as the signed-in caller, so row level security applies.
 * This is the default for anything done on a user's behalf.
 *
 * @param {string} accessToken - the caller's Supabase JWT
 */
export function forUser(accessToken) {
  requireEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL')
  requireEnv(anonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')

  if (!accessToken) {
    throw new Error('forUser() requires an access token')
  }

  return createClient(supabaseUrl, anonKey, {
    ...SERVER_AUTH_OPTIONS,
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}

/**
 * A client that bypasses row level security.
 *
 * Only for work that has no signed-in caller to act as — serving a public form
 * link, or cleaning up an auth user after a failed registration. Every use of
 * this must do its own authorisation check first, because the database will
 * not do one.
 */
export function withServiceRole() {
  requireEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL')
  requireEnv(serviceRoleKey, 'SUPABASE_SERVICE_ROLE_KEY')

  return createClient(supabaseUrl, serviceRoleKey, SERVER_AUTH_OPTIONS)
}

/**
 * A client with no credentials beyond the anon key, for verifying a bearer
 * token before we know who it belongs to.
 */
export function anonymous() {
  requireEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL')
  requireEnv(anonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')

  return createClient(supabaseUrl, anonKey, SERVER_AUTH_OPTIONS)
}

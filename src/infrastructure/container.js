import { forUser, withServiceRole } from './supabase/serverClient'
import { createSupabaseFormLinkRepository } from './supabase/repositories/supabaseFormLinkRepository'
import { createSupabaseNeedAnalysisRepository } from './supabase/repositories/supabaseNeedAnalysisRepository'

/**
 * Composition root.
 *
 * The only module that decides which concrete adapter satisfies which port. Use
 * cases receive their dependencies as arguments and never import an adapter
 * themselves, which is what keeps the application layer independent of Supabase.
 *
 * Route handlers build a container per request, because the Supabase client is
 * scoped to the caller's token.
 *
 * @param {{ accessToken?: string | null, serviceRole?: boolean }} options
 *   `serviceRole: true` bypasses row level security and is only for work with no
 *   signed-in caller to act as — see serverClient.withServiceRole.
 */
export function createContainer({ accessToken = null, serviceRole = false } = {}) {
  const client = serviceRole ? withServiceRole() : forUser(accessToken)

  return {
    client,
    formLinks: createSupabaseFormLinkRepository(client),
    needAnalyses: createSupabaseNeedAnalysisRepository(client),
  }
}

/**
 * The public origin, used to build shareable links.
 */
export function baseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
}

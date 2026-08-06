import { UnauthorizedError, ForbiddenError } from '@/domain/errors'
import { isAdminRole } from '@/domain/services/rolePolicy'
import { USER_STATUS } from '@/domain/constants/userStatus'
import { anonymous, forUser } from '../supabase/serverClient'

/**
 * Route-handler guards.
 *
 * Every mutation that isn't reachable by an anonymous form link goes through one
 * of these. Previously the only authorisation checks lived in browser code —
 * lib/admin.js decided whether a caller was an admin in client JS, and the form
 * route ran on the service-role key while trusting a `user_id` from the request
 * body.
 */

/**
 * @typedef {Object} Caller
 * @property {string} userId
 * @property {string} accessToken
 * @property {import('@supabase/supabase-js').SupabaseClient} client - acts as the
 *   caller, so row level security still applies
 */

function bearerToken(request) {
  const header = request.headers.get('authorization') || ''
  return header.startsWith('Bearer ') ? header.slice(7).trim() : null
}

/**
 * Verify the caller's bearer token.
 *
 * @param {Request} request
 * @returns {Promise<Caller>}
 * @throws {UnauthorizedError}
 */
export async function requireUser(request) {
  const accessToken = bearerToken(request)

  if (!accessToken) {
    throw new UnauthorizedError('Authentication required')
  }

  const {
    data: { user },
    error,
  } = await anonymous().auth.getUser(accessToken)

  if (error || !user) {
    throw new UnauthorizedError('Invalid or expired session')
  }

  return { userId: user.id, accessToken, client: forUser(accessToken) }
}

/**
 * Verify the caller's token, then confirm — server-side, against the database —
 * that they hold the admin role and their own account is approved.
 *
 * @param {Request} request
 * @returns {Promise<Caller & { profile: { role_id: string, status: string } }>}
 * @throws {UnauthorizedError | ForbiddenError}
 */
export async function requireAdmin(request) {
  const caller = await requireUser(request)

  const { data: profile, error } = await caller.client
    .from('user_profile')
    .select('role_id, status')
    .eq('user_id', caller.userId)
    .single()

  if (error || !profile) {
    throw new ForbiddenError('Unable to verify your account permissions')
  }

  if (profile.status !== USER_STATUS.APPROVED || !isAdminRole(profile.role_id)) {
    throw new ForbiddenError('Administrator access required')
  }

  return { ...caller, profile }
}

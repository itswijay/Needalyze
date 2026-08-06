import { browserClient } from './browserClient'
import { anonymous, withServiceRole } from './serverClient'

/**
 * Browser half: establishes and observes the session.
 *
 * @returns {import('@/application/ports/authGateway').BrowserAuthGateway}
 */
export function createBrowserAuthGateway() {
  return {
    async signIn(email, password) {
      const { data, error } = await browserClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw new Error(error.message)

      return {
        user: data.user,
        session: data.session,
        emailConfirmed: Boolean(data.user?.email_confirmed_at),
      }
    },

    async signOut() {
      const { error } = await browserClient.auth.signOut()
      if (error) throw new Error(error.message)
    },

    async getSession() {
      const {
        data: { session },
        error,
      } = await browserClient.auth.getSession()

      if (error) throw new Error(error.message)
      return { user: session?.user || null, session: session || null }
    },

    onAuthStateChange(handler) {
      const { data } = browserClient.auth.onAuthStateChange(handler)
      return () => data?.subscription?.unsubscribe()
    },
  }
}

/**
 * Server half: creates and removes auth users.
 *
 * Sign-up runs on the anon client rather than the admin API so Supabase still
 * sends its confirmation email — the app depends on email verification.
 * Deletion needs the service role.
 *
 * @returns {import('@/application/ports/authGateway').AdminAuthGateway}
 */
export function createAdminAuthGateway() {
  return {
    async createAccount({ email, password }) {
      const { data, error } = await anonymous().auth.signUp({ email, password })

      if (error) {
        const err = new Error(error.message)
        err.code = error.code
        throw err
      }

      if (!data.user) {
        throw new Error('Account creation did not return a user')
      }

      return { userId: data.user.id }
    },

    async deleteAccount(userId) {
      const { error } = await withServiceRole().auth.admin.deleteUser(userId)
      if (error) throw new Error(error.message)
    },
  }
}

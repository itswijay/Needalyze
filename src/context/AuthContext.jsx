'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

// The one sanctioned exception to "presentation must not touch Supabase":
// establishing a session is inherently a browser action, because the client is
// what stores and refreshes the token. The gateway confines that to sign-in,
// sign-out and session reads — no table or storage access goes through it.
// eslint-disable-next-line no-restricted-imports
import { createBrowserAuthGateway } from '@/infrastructure/supabase/supabaseAuthGateway'
import { apiClient } from '@/infrastructure/http/apiClient'
import { checkSignInEligibility } from '@/domain/entities/userProfile'

const AuthContext = createContext(undefined)

const auth = createBrowserAuthGateway()

/**
 * Session and profile state for the signed-in advisor.
 *
 * Sign-in still happens in the browser, because that is what establishes the
 * session the Supabase client persists and refreshes. Everything after it —
 * loading the profile, and deciding whether this account may actually use the
 * app — is answered by the server via /api/me.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [loading, setLoading] = useState(true)

  const clearProfile = useCallback(() => {
    setUserProfile(null)
    setIsAdmin(false)
    setIsApproved(false)
  }, [])

  const loadProfile = useCallback(async () => {
    try {
      const data = await apiClient.get('/api/me')
      setUserProfile(data.profile)
      setIsAdmin(Boolean(data.isAdmin))
      setIsApproved(Boolean(data.isApproved))
      return data
    } catch (error) {
      console.error('Error loading profile:', error)
      clearProfile()
      return null
    }
  }, [clearProfile])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const { user: currentUser, session: currentSession } =
          await auth.getSession()

        if (cancelled) return

        if (currentUser) {
          setUser(currentUser)
          setSession(currentSession)
          await loadProfile()
        }
      } catch (error) {
        console.error('Error restoring session:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()

    const unsubscribe = auth.onAuthStateChange((event, nextSession) => {
      if (event === 'SIGNED_IN') {
        setUser(nextSession?.user || null)
        setSession(nextSession)
        loadProfile()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setSession(null)
        clearProfile()
      } else if (event === 'TOKEN_REFRESHED') {
        setUser(nextSession?.user || null)
        setSession(nextSession)
      }
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [loadProfile, clearProfile])

  /**
   * Authenticate, then confirm the account is actually allowed in. A session
   * that fails the eligibility check is torn down again immediately.
   *
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const signIn = async (email, password) => {
    let emailConfirmed
    try {
      ;({ emailConfirmed } = await auth.signIn(email, password))
    } catch (error) {
      return { success: false, error: error.message }
    }

    const data = await loadProfile()
    const { allowed, reason } = checkSignInEligibility({
      profile: data?.profile || null,
      emailConfirmed,
    })

    if (!allowed) {
      await auth.signOut().catch(() => {})
      return { success: false, error: reason }
    }

    return { success: true }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
      setSession(null)
      clearProfile()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    session,
    userProfile,
    loading,
    isAuthenticated: Boolean(user && session),
    isAdmin,
    isApproved,
    signIn,
    signOut,
    refreshUserProfile: loadProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/** @deprecated Alias kept for callers that used the longer name. */
export const useAuthContext = useAuth

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { apiClient } from '@/infrastructure/http/apiClient'
// The second sanctioned exception to "presentation must not touch Supabase",
// alongside the auth gateway: a change notification arrives over a socket, and
// there is no route handler that can carry one. It stays a notification — no
// row ever reaches the component through it, and the data itself is still
// fetched from /api/dashboard below.
// eslint-disable-next-line no-restricted-imports
import { subscribeToAdvisorForms } from '@/infrastructure/supabase/realtime'

/**
 * The advisor's forms and tile counts, kept current as customers submit.
 *
 * @param {{ enabled?: boolean, advisorUserId?: string | null }} options
 *   `enabled` is false while the session is still being restored, so the
 *   request is not fired unauthenticated. `advisorUserId` turns on the live
 *   subscription; without it the dashboard still loads, just not live.
 */
export function useDashboard({ enabled = true, advisorUserId = null } = {}) {
  const [forms, setForms] = useState([])
  const [cardData, setCardData] = useState({})
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState(null)

  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  /**
   * @param {{ silent?: boolean }} [options] - a background refresh leaves the
   *   current rows on screen instead of flipping the table back to its
   *   loading state, so an arriving submission does not blank the page.
   */
  const refresh = useCallback(
    async ({ silent = false } = {}) => {
      if (!enabled) return

      if (!silent) setIsLoading(true)

      try {
        const data = await apiClient.get('/api/dashboard')
        if (!isMounted.current) return

        setForms(data.forms || [])
        setCardData(data.cardData || {})
        setError(null)
      } catch (err) {
        if (!isMounted.current) return
        console.error('Failed to load dashboard:', err)
        setError(err.message)
      } finally {
        if (isMounted.current && !silent) setIsLoading(false)
      }
    },
    [enabled]
  )

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!enabled || !advisorUserId) return undefined

    return subscribeToAdvisorForms({
      advisorUserId,
      onChange: () => refresh({ silent: true }),
    })
  }, [enabled, advisorUserId, refresh])

  // A socket can miss events across a sleeping laptop or a dropped
  // connection, and returning to the tab is the cheapest moment to reconcile.
  useEffect(() => {
    if (!enabled) return undefined

    const reconcile = () => {
      if (document.visibilityState === 'visible') refresh({ silent: true })
    }

    window.addEventListener('focus', reconcile)
    document.addEventListener('visibilitychange', reconcile)

    return () => {
      window.removeEventListener('focus', reconcile)
      document.removeEventListener('visibilitychange', reconcile)
    }
  }, [enabled, refresh])

  return { forms, cardData, isLoading, error, refresh }
}

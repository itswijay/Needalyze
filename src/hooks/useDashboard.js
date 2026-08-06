'use client'

import { useEffect, useState } from 'react'

import { apiClient } from '@/infrastructure/http/apiClient'

/**
 * The advisor's forms and tile counts.
 *
 * @param {{ enabled?: boolean }} options - false while the session is still
 *   being restored, so the request is not fired unauthenticated
 */
export function useDashboard({ enabled = true } = {}) {
  const [forms, setForms] = useState([])
  const [cardData, setCardData] = useState({})
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      try {
        const data = await apiClient.get('/api/dashboard')
        if (cancelled) return

        setForms(data.forms || [])
        setCardData(data.cardData || {})
        setError(null)
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load dashboard:', err)
        setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [enabled])

  return { forms, cardData, isLoading, error }
}

'use client'

import { useCallback, useEffect, useState } from 'react'

import { apiClient } from '@/infrastructure/http/apiClient'
import { browserClient } from '@/infrastructure/supabase/browserClient'
import { USER_STATUS } from '@/domain/constants/userStatus'

/**
 * Pending-approval queue and its count, for the admin views.
 *
 * Both the dialog and the navbar badge read from here, so approving someone in
 * one place cannot leave the other showing a stale number. Includes automatic
 * background polling and real-time updates when new users register.
 */
export function usePendingUsers({ enabled = true, pollInterval = 15000 } = {}) {
  const [users, setUsers] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [processingState, setProcessingState] = useState(null)

  const refreshCount = useCallback(async () => {
    if (!enabled) return
    try {
      const { stats } = await apiClient.get('/api/admin/stats')
      setPendingCount(stats?.pending || 0)
    } catch (error) {
      console.error('Failed to load user statistics:', error)
    }
  }, [enabled])

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!enabled) return { success: true }

      if (!silent) {
        setIsLoading(true)
      }
      try {
        const { users: pending } = await apiClient.get('/api/admin/users/pending')
        setUsers(pending || [])
        setPendingCount(pending?.length || 0)
        return { success: true }
      } catch (error) {
        if (!silent) {
          setUsers([])
        }
        return { success: false, error: error.message }
      } finally {
        if (!silent) {
          setIsLoading(false)
        }
      }
    },
    [enabled]
  )

  useEffect(() => {
    if (!enabled) return

    // Initial count fetch
    refreshCount()

    // 1. Periodic polling fallback (every 15 seconds)
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshCount()
      }
    }, pollInterval)

    // 2. Refetch on tab focus or visibility change
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        refreshCount()
      }
    }
    window.addEventListener('visibilitychange', handleFocus)
    window.addEventListener('focus', handleFocus)

    // 3. Supabase Real-time table listener
    let channel = null
    try {
      channel = browserClient
        .channel('user_profile_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_profile',
          },
          () => {
            refreshCount()
          }
        )
        .subscribe()
    } catch (err) {
      console.error('Failed to subscribe to realtime updates:', err)
    }

    return () => {
      clearInterval(timer)
      window.removeEventListener('visibilitychange', handleFocus)
      window.removeEventListener('focus', handleFocus)
      if (channel) {
        browserClient.removeChannel(channel)
      }
    }
  }, [enabled, pollInterval, refreshCount])

  /**
   * @param {string} userId
   * @param {'approved'|'rejected'} status
   */
  const decide = useCallback(async (userId, status) => {
    setProcessingState({ id: userId, action: status })
    try {
      await apiClient.post(`/api/admin/users/${userId}/status`, { status })
      setUsers((previous) => previous.filter((user) => user.userId !== userId))
      setPendingCount((previous) => Math.max(0, previous - 1))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setProcessingState(null)
    }
  }, [])

  return {
    users,
    pendingCount,
    isLoading,
    processingId: processingState?.id || null,
    processingAction: processingState?.action || null,
    load,
    refreshCount,
    approve: (userId) => decide(userId, USER_STATUS.APPROVED),
    reject: (userId) => decide(userId, USER_STATUS.REJECTED),
  }
}

'use client'

import { useCallback, useState } from 'react'

import { apiClient } from '@/infrastructure/http/apiClient'
import { USER_STATUS } from '@/domain/constants/userStatus'

/**
 * Pending-approval queue and its count, for the admin views.
 *
 * Both the dialog and the navbar badge read from here, so approving someone in
 * one place cannot leave the other showing a stale number.
 */
export function usePendingUsers({ enabled = true } = {}) {
  const [users, setUsers] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [processingId, setProcessingId] = useState(null)

  const refreshCount = useCallback(async () => {
    if (!enabled) return
    try {
      const { stats } = await apiClient.get('/api/admin/stats')
      setPendingCount(stats?.pending || 0)
    } catch (error) {
      console.error('Failed to load user statistics:', error)
    }
  }, [enabled])

  const load = useCallback(async () => {
    if (!enabled) return { success: true }

    setIsLoading(true)
    try {
      const { users: pending } = await apiClient.get('/api/admin/users/pending')
      setUsers(pending || [])
      setPendingCount(pending?.length || 0)
      return { success: true }
    } catch (error) {
      setUsers([])
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [enabled])

  /**
   * @param {string} userId
   * @param {'approved'|'rejected'} status
   */
  const decide = useCallback(async (userId, status) => {
    setProcessingId(userId)
    try {
      await apiClient.post(`/api/admin/users/${userId}/status`, { status })
      setUsers((previous) => previous.filter((user) => user.userId !== userId))
      setPendingCount((previous) => Math.max(0, previous - 1))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setProcessingId(null)
    }
  }, [])

  return {
    users,
    pendingCount,
    isLoading,
    processingId,
    load,
    refreshCount,
    approve: (userId) => decide(userId, USER_STATUS.APPROVED),
    reject: (userId) => decide(userId, USER_STATUS.REJECTED),
  }
}

import {
  USER_PROFILE_COLUMNS,
  toColumns,
  toUserProfile,
} from '../mappers/userProfileMapper'
import { USER_STATUS } from '@/domain/constants/userStatus'

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @returns {import('@/application/ports/userProfileRepository').UserProfileRepository}
 */
export function createSupabaseUserProfileRepository(client) {
  return {
    async findByUserId(userId) {
      const { data, error } = await client
        .from('user_profile')
        .select(USER_PROFILE_COLUMNS)
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return toUserProfile(data)
    },

    async listByStatus(status) {
      const { data, error } = await client
        .from('user_profile')
        .select(USER_PROFILE_COLUMNS)
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []).map(toUserProfile)
    },

    async create(profile) {
      const { data, error } = await client
        .from('user_profile')
        .insert(toColumns(profile))
        .select(USER_PROFILE_COLUMNS)
        .single()

      if (error) throw error
      return toUserProfile(data)
    },

    async update(userId, changes) {
      const { data, error } = await client
        .from('user_profile')
        .update({ ...toColumns(changes), updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select(USER_PROFILE_COLUMNS)
        .single()

      if (error) throw error
      return toUserProfile(data)
    },

    /**
     * One grouped read instead of the four separate count queries the dashboard
     * statistics helper used to fire.
     */
    async countByStatus() {
      const { data, error } = await client.from('user_profile').select('status')

      if (error) throw error

      const counts = {
        total: data.length,
        [USER_STATUS.PENDING]: 0,
        [USER_STATUS.APPROVED]: 0,
        [USER_STATUS.REJECTED]: 0,
        [USER_STATUS.DELETED]: 0,
      }

      for (const row of data) {
        if (counts[row.status] !== undefined) counts[row.status] += 1
      }

      return counts
    },
  }
}

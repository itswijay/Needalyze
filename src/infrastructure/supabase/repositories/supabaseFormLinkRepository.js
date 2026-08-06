import { toFormLink } from '../mappers/formLinkMapper'
import { LINK_STATUS } from '@/domain/constants/formStatus'

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @returns {import('@/application/ports/formLinkRepository').FormLinkRepository}
 */
export function createSupabaseFormLinkRepository(client) {
  return {
    async findById(linkId) {
      const { data, error } = await client
        .from('form_link')
        .select('*')
        .eq('link_id', linkId)
        .maybeSingle()

      if (error) throw error
      return toFormLink(data)
    },

    async create({ advisorUserId, expiresAt }) {
      const { data, error } = await client
        .from('form_link')
        .insert({
          user_id: advisorUserId,
          expiry_date: expiresAt.toISOString(),
          status: LINK_STATUS.ACTIVE,
        })
        .select()
        .single()

      if (error) throw error
      return toFormLink(data)
    },
  }
}

import { toFormLink } from '../mappers/formLinkMapper'
import { LINK_STATUS } from '@/domain/constants/formStatus'
import { generateSlug } from '@/domain/services/formLinkSlug'

const UNIQUE_VIOLATION = '23505'
const MAX_SLUG_ATTEMPTS = 5

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @returns {import('@/application/ports/formLinkRepository').FormLinkRepository}
 */
export function createSupabaseFormLinkRepository(client) {
  return {
    async findBySlug(slug) {
      const { data, error } = await client
        .from('form_link')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error) throw error
      return toFormLink(data)
    },

    async create({ advisorUserId, expiresAt }) {
      // A 10-char slug isn't collision-proof at DB scale the way the UUID
      // primary key is, so a clash just means "try another one".
      for (let attempt = 1; attempt <= MAX_SLUG_ATTEMPTS; attempt++) {
        const { data, error } = await client
          .from('form_link')
          .insert({
            user_id: advisorUserId,
            expiry_date: expiresAt.toISOString(),
            status: LINK_STATUS.ACTIVE,
            slug: generateSlug(),
          })
          .select()
          .single()

        if (!error) return toFormLink(data)
        if (error.code !== UNIQUE_VIOLATION || attempt === MAX_SLUG_ATTEMPTS) {
          throw error
        }
      }
    },
  }
}

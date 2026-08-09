import { browserClient, getAccessToken } from './browserClient'

/**
 * Postgres change notifications, kept behind the same boundary as every other
 * Supabase call.
 *
 * This is the one place a browser subscription is set up, so hooks can react
 * to a row changing without importing the client themselves.
 */

/**
 * Call `onChange` whenever one of an advisor's forms is written.
 *
 * The customer submits from their own device, so the change reaches this tab
 * from Postgres rather than from anything the advisor did. Which rows are
 * delivered is decided by the table's RLS select policy — the `user_id` filter
 * below only narrows what has already been authorised, it does not grant
 * anything.
 *
 * @param {{ advisorUserId: string, onChange: () => void }} options
 * @returns {() => void} unsubscribe
 */
export function subscribeToAdvisorForms({ advisorUserId, onChange }) {
  if (!advisorUserId) return () => {}

  let channel = null
  let cancelled = false

  // The socket authorises against RLS, so it needs the current access token
  // before it subscribes — without it the subscription is anonymous and
  // receives nothing.
  getAccessToken().then((token) => {
    if (cancelled) return
    if (token) browserClient.realtime.setAuth(token)

    channel = browserClient
      .channel(`advisor-forms:${advisorUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'need_analysis_form',
          filter: `user_id=eq.${advisorUserId}`,
        },
        onChange
      )
      .subscribe()
  })

  return () => {
    cancelled = true
    if (channel) browserClient.removeChannel(channel)
  }
}

import { FORM_STATUS } from '@/domain/constants/formStatus'

/**
 * Maps a form's stored status onto a Badge variant.
 *
 * This lived inside Dashtable as a switch over display strings — `'Completed'`,
 * `'In Progress'` — while the value reaching it comes straight from the
 * database via `toRow`, where a completed form is the lowercase `'completed'`
 * that domain/constants/formStatus defines. Nothing ever matched, so every
 * status fell through to the neutral grey. The `capitalize` class on the cell
 * made it look correct, which is why it survived so long.
 *
 * Comparing against the domain constants rather than against what the cell
 * happens to render is what stops the two drifting apart again.
 *
 * The two extra cases have no constant behind them: they are statuses the old
 * UI knew about but the domain never defined. They are kept so any legacy row
 * still gets a sensible colour rather than silently going grey.
 *
 * @param {string | null | undefined} status
 * @returns {'success' | 'info' | 'warning' | 'destructive' | 'muted'}
 */
export function statusVariant(status) {
  switch (String(status ?? '').trim().toLowerCase()) {
    case FORM_STATUS.COMPLETED:
      return 'success'
    case FORM_STATUS.PENDING:
      return 'warning'
    case 'in progress':
      return 'info'
    case 'on hold':
      return 'destructive'
    default:
      return 'muted'
  }
}

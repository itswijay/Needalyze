import { describe, expect, it } from 'vitest'

import { statusVariant } from './formStatusView'
import { FORM_STATUS } from '@/domain/constants/formStatus'

describe('statusVariant', () => {
  // The regression this file exists for: the mapping used to switch over the
  // capitalised words the table renders, while the value handed to it is the
  // lowercase one the domain stores. Every badge came out grey.
  it('colours the statuses the domain actually stores', () => {
    expect(statusVariant(FORM_STATUS.COMPLETED)).toBe('success')
    expect(statusVariant(FORM_STATUS.PENDING)).toBe('warning')
  })

  it('is not fooled by the casing used for display', () => {
    expect(statusVariant('Completed')).toBe('success')
    expect(statusVariant('COMPLETED')).toBe('success')
    expect(statusVariant('  completed  ')).toBe('success')
  })

  it('keeps colouring the statuses the old UI knew but the domain never defined', () => {
    expect(statusVariant('In Progress')).toBe('info')
    expect(statusVariant('On Hold')).toBe('destructive')
  })

  it('falls back to neutral for anything unrecognised', () => {
    expect(statusVariant('Unknown')).toBe('muted')
    expect(statusVariant('')).toBe('muted')
    expect(statusVariant(null)).toBe('muted')
    expect(statusVariant(undefined)).toBe('muted')
  })
})

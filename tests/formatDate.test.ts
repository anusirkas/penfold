import { describe, expect, it } from 'vitest'
import { formatDate } from '../src/lib/formatDate'

describe('formatDate', () => {
  it('shows the day, short month and year', () => {
    expect(formatDate(new Date('2026-11-08T12:00:00Z'))).toBe('8 Nov 2026')
  })

  it('uses UTC, so late evening stays on the same day', () => {
    expect(formatDate(new Date('2026-11-08T23:59:00Z'))).toBe('8 Nov 2026')
  })
})

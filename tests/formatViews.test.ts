import { describe, expect, it } from 'vitest'
import { formatViews } from '../src/lib/formatViews'

describe('formatViews', () => {
  it('uses the plural for zero', () => {
    expect(formatViews(0)).toBe('0 views')
  })

  it('uses the singular for one', () => {
    expect(formatViews(1)).toBe('1 view')
  })

  it('uses the plural for more than one', () => {
    expect(formatViews(2)).toBe('2 views')
  })
})

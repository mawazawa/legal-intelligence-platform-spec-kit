/**
 * Verifies Jest can resolve the `@/` alias used across the app.
 * This test fails when `moduleNameMapper` is misconfigured.
 */
import { cn } from '@/lib/utils'

describe('Jest moduleNameMapper for @/ alias', () => {
  it('resolves @/lib/utils and imports cn()', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })
})


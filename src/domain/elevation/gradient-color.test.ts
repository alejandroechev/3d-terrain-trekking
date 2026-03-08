import { describe, it, expect } from 'vitest'
import { gradientToColor } from './gradient-color'

describe('gradientToColor', () => {
  it('returns green for flat gradient (0%)', () => {
    const color = gradientToColor(0)
    expect(color.g).toBeGreaterThan(color.r)
  })

  it('returns yellow for moderate gradient (~15%)', () => {
    const color = gradientToColor(15)
    expect(color.r).toBeGreaterThan(0.5)
    expect(color.g).toBeGreaterThan(0.5)
  })

  it('returns red for steep gradient (>30%)', () => {
    const color = gradientToColor(40)
    expect(color.r).toBeGreaterThan(color.g)
  })

  it('uses absolute value (downhill same color as uphill)', () => {
    const uphill = gradientToColor(20)
    const downhill = gradientToColor(-20)
    expect(uphill.r).toBeCloseTo(downhill.r, 5)
    expect(uphill.g).toBeCloseTo(downhill.g, 5)
    expect(uphill.b).toBeCloseTo(downhill.b, 5)
  })
})

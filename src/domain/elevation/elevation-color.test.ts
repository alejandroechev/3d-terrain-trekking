import { describe, it, expect } from 'vitest'
import { elevationToColor } from './elevation-color'

describe('elevationToColor', () => {
  it('returns a green-ish color for low elevation (0-200m)', () => {
    const color = elevationToColor(100, 0, 2000)
    // Low elevation should be greenish (g > r)
    expect(color.g).toBeGreaterThan(color.r)
  })

  it('returns a brown/tan color for mid elevation (~1000m)', () => {
    const color = elevationToColor(1000, 0, 2000)
    // Mid elevation: r and g should be similar (brown/tan)
    expect(color.r).toBeGreaterThan(0.3)
    expect(color.g).toBeGreaterThan(0.3)
  })

  it('returns a white-ish color for high elevation (near max)', () => {
    const color = elevationToColor(1900, 0, 2000)
    // High elevation should be bright (all channels high)
    expect(color.r).toBeGreaterThan(0.7)
    expect(color.g).toBeGreaterThan(0.7)
    expect(color.b).toBeGreaterThan(0.7)
  })

  it('clamps to valid range', () => {
    const color = elevationToColor(-100, 0, 2000)
    expect(color.r).toBeGreaterThanOrEqual(0)
    expect(color.g).toBeGreaterThanOrEqual(0)
    expect(color.b).toBeGreaterThanOrEqual(0)
  })

  it('returns an object with r, g, b properties', () => {
    const color = elevationToColor(500, 0, 2000)
    expect(typeof color.r).toBe('number')
    expect(typeof color.g).toBe('number')
    expect(typeof color.b).toBe('number')
  })
})

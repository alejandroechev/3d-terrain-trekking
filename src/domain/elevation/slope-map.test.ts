import { describe, it, expect } from 'vitest'
import { computeSlopeMap } from './slope-map'
import type { Heightmap } from './heightmap'

function makeHeightmap(grid: number[][]): Heightmap {
  let min = Infinity, max = -Infinity
  for (const row of grid) for (const v of row) {
    if (v < min) min = v
    if (v > max) max = v
  }
  const hm = grid as Heightmap
  hm.minElevation = min
  hm.maxElevation = max
  return hm
}

describe('computeSlopeMap', () => {
  it('returns same dimensions as input heightmap', () => {
    const hm = makeHeightmap([[0, 0, 0], [0, 100, 0], [0, 0, 0]])
    const slopes = computeSlopeMap(hm, 10)
    expect(slopes.length).toBe(3)
    expect(slopes[0].length).toBe(3)
  })

  it('returns 0 slope for a flat terrain', () => {
    const hm = makeHeightmap([[100, 100, 100], [100, 100, 100], [100, 100, 100]])
    const slopes = computeSlopeMap(hm, 10)
    for (const row of slopes) for (const s of row) {
      expect(s).toBeCloseTo(0, 1)
    }
  })

  it('returns non-zero slopes for a ramp', () => {
    const hm = makeHeightmap([[0, 0, 0], [100, 100, 100], [200, 200, 200]])
    const slopes = computeSlopeMap(hm, 10)
    // All cells on a uniform ramp in Y direction should have non-zero slope
    expect(slopes[1][1]).toBeGreaterThan(0)
  })

  it('slope values are in degrees (0-90)', () => {
    const hm = makeHeightmap([[0, 100], [100, 500]])
    const slopes = computeSlopeMap(hm, 10)
    for (const row of slopes) for (const s of row) {
      expect(s).toBeGreaterThanOrEqual(0)
      expect(s).toBeLessThanOrEqual(90)
    }
  })
})

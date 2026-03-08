import { describe, it, expect } from 'vitest'
import { projectRouteToMesh, segmentGradients } from './route-projection'
import type { GPXPoint } from '../gpx/gpx-parser'
import type { BBox } from './elevation'

const BBOX: BBox = {
  north: -41.30,
  south: -41.35,
  east: -72.95,
  west: -73.00,
}

const POINTS: GPXPoint[] = [
  { lat: -41.32, lng: -72.98, elevation: 100 },
  { lat: -41.33, lng: -72.97, elevation: 300 },
  { lat: -41.34, lng: -72.96, elevation: 200 },
]

describe('projectRouteToMesh', () => {
  it('returns 3D positions mapped to mesh coordinate space', () => {
    const positions = projectRouteToMesh(POINTS, BBOX, { meshSize: 100, exaggeration: 1 })
    // Should have 3 points * 3 components = 9 values
    expect(positions.length).toBe(9)
  })

  it('maps lat/lng within bbox to [-meshSize/2, meshSize/2]', () => {
    const positions = projectRouteToMesh(POINTS, BBOX, { meshSize: 100, exaggeration: 1 })
    // All X and Z values should be within [-50, 50]
    for (let i = 0; i < positions.length; i += 3) {
      expect(positions[i]).toBeGreaterThanOrEqual(-50)
      expect(positions[i]).toBeLessThanOrEqual(50)
      expect(positions[i + 2]).toBeGreaterThanOrEqual(-50)
      expect(positions[i + 2]).toBeLessThanOrEqual(50)
    }
  })

  it('applies exaggeration to Y (elevation)', () => {
    const pos1 = projectRouteToMesh(POINTS, BBOX, { meshSize: 100, exaggeration: 1 })
    const pos2 = projectRouteToMesh(POINTS, BBOX, { meshSize: 100, exaggeration: 3 })
    // Y values at index 1 should scale by 3
    expect(pos2[1]).toBeCloseTo(pos1[1] * 3, 5)
  })
})

describe('segmentGradients', () => {
  it('returns one gradient per segment (N-1 for N points)', () => {
    const gradients = segmentGradients(POINTS)
    expect(gradients.length).toBe(2)
  })

  it('returns positive gradient for uphill segments', () => {
    const gradients = segmentGradients(POINTS)
    // 100→300 is uphill
    expect(gradients[0]).toBeGreaterThan(0)
  })

  it('returns negative gradient for downhill segments', () => {
    const gradients = segmentGradients(POINTS)
    // 300→200 is downhill
    expect(gradients[1]).toBeLessThan(0)
  })

  it('returns gradient as percentage', () => {
    const gradients = segmentGradients(POINTS)
    // Should be reasonable percentages (not > 100% for these points)
    expect(Math.abs(gradients[0])).toBeLessThan(200)
    expect(Math.abs(gradients[1])).toBeLessThan(200)
  })
})

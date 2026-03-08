import { describe, it, expect } from 'vitest'
import { buildElevationProfileData } from './elevation-profile'
import type { GPXPoint } from '../gpx/gpx-parser'

const POINTS: GPXPoint[] = [
  { lat: -41.320, lng: -72.980, elevation: 100 },
  { lat: -41.321, lng: -72.979, elevation: 250 },
  { lat: -41.322, lng: -72.978, elevation: 500 },
  { lat: -41.323, lng: -72.977, elevation: 450 },
  { lat: -41.324, lng: -72.976, elevation: 200 },
]

describe('buildElevationProfileData', () => {
  it('returns one data point per GPX point', () => {
    const data = buildElevationProfileData(POINTS)
    expect(data.points.length).toBe(5)
  })

  it('first point has cumulative distance of 0', () => {
    const data = buildElevationProfileData(POINTS)
    expect(data.points[0].distanceM).toBe(0)
  })

  it('cumulative distances are monotonically increasing', () => {
    const data = buildElevationProfileData(POINTS)
    for (let i = 1; i < data.points.length; i++) {
      expect(data.points[i].distanceM).toBeGreaterThan(data.points[i - 1].distanceM)
    }
  })

  it('preserves elevation values', () => {
    const data = buildElevationProfileData(POINTS)
    expect(data.points[0].elevation).toBe(100)
    expect(data.points[2].elevation).toBe(500)
    expect(data.points[4].elevation).toBe(200)
  })

  it('includes gradient percentage for each point', () => {
    const data = buildElevationProfileData(POINTS)
    // First point has no gradient (no previous segment)
    expect(data.points[0].gradientPercent).toBe(0)
    // Second point is uphill
    expect(data.points[1].gradientPercent).toBeGreaterThan(0)
  })

  it('provides min/max elevation and total distance', () => {
    const data = buildElevationProfileData(POINTS)
    expect(data.minElevation).toBe(100)
    expect(data.maxElevation).toBe(500)
    expect(data.totalDistanceM).toBeGreaterThan(0)
  })

  it('handles single point', () => {
    const data = buildElevationProfileData([POINTS[0]])
    expect(data.points.length).toBe(1)
    expect(data.totalDistanceM).toBe(0)
  })
})

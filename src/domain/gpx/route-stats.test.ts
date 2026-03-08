import { describe, it, expect } from 'vitest'
import { calculateRouteStats } from './route-stats'
import type { GPXPoint } from './gpx-parser'

const SIMPLE_ROUTE: GPXPoint[] = [
  { lat: -41.3200, lng: -72.9800, elevation: 100 },
  { lat: -41.3210, lng: -72.9790, elevation: 250 },
  { lat: -41.3220, lng: -72.9780, elevation: 500 },
  { lat: -41.3215, lng: -72.9785, elevation: 450 },
]

describe('calculateRouteStats', () => {
  it('calculates total distance in meters', () => {
    const stats = calculateRouteStats(SIMPLE_ROUTE)
    // ~150m per segment * 3 segments ≈ 400-500m
    expect(stats.totalDistanceM).toBeGreaterThan(200)
    expect(stats.totalDistanceM).toBeLessThan(1000)
  })

  it('calculates total ascent correctly', () => {
    const stats = calculateRouteStats(SIMPLE_ROUTE)
    // 100→250 (+150), 250→500 (+250), 500→450 (descent, skip)
    expect(stats.totalAscentM).toBeCloseTo(400, 0)
  })

  it('calculates total descent correctly', () => {
    const stats = calculateRouteStats(SIMPLE_ROUTE)
    // only 500→450 = 50m descent
    expect(stats.totalDescentM).toBeCloseTo(50, 0)
  })

  it('calculates max and average grade', () => {
    const stats = calculateRouteStats(SIMPLE_ROUTE)
    expect(stats.maxGradePercent).toBeGreaterThan(0)
    expect(stats.avgGradePercent).toBeGreaterThan(0)
    expect(stats.maxGradePercent).toBeGreaterThanOrEqual(stats.avgGradePercent)
  })

  it('calculates min and max elevation', () => {
    const stats = calculateRouteStats(SIMPLE_ROUTE)
    expect(stats.minElevationM).toBe(100)
    expect(stats.maxElevationM).toBe(500)
  })

  it('estimates hiking time using Naismith rule', () => {
    const stats = calculateRouteStats(SIMPLE_ROUTE)
    // Naismith: 5km/h + 1min per 10m ascent
    // ~400m distance → ~4.8min + 400m ascent → 40min ≈ ~45min
    expect(stats.estimatedTimeMinutes).toBeGreaterThan(10)
    expect(stats.estimatedTimeMinutes).toBeLessThan(120)
  })

  it('handles a route with only one point', () => {
    const stats = calculateRouteStats([SIMPLE_ROUTE[0]])
    expect(stats.totalDistanceM).toBe(0)
    expect(stats.totalAscentM).toBe(0)
    expect(stats.totalDescentM).toBe(0)
  })

  it('handles an empty route', () => {
    const stats = calculateRouteStats([])
    expect(stats.totalDistanceM).toBe(0)
  })
})

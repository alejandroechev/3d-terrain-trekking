import { describe, it, expect } from 'vitest'
import type { GPXRoute } from '../gpx/gpx-parser'
import { buildTrek, type Trek } from './trek'
import { sortTreks, filterByRegion, getRegions } from './trek-catalog'

const HOME_LAT = -41.3195
const HOME_LNG = -72.9854

function makeRoute(name: string, startLat: number, startLng: number): GPXRoute {
  return {
    name,
    points: [
      { lat: startLat, lng: startLng, elevation: 100 },
      { lat: startLat + 0.001, lng: startLng + 0.001, elevation: 200 },
      { lat: startLat + 0.002, lng: startLng + 0.002, elevation: 300 },
    ],
  }
}

function makeTrekWithOverrides(
  name: string,
  region: string,
  overrides: Partial<Trek> = {}
): Trek {
  const route = makeRoute(name, -41.1 + Math.random() * 0.01, -72.5 + Math.random() * 0.01)
  const trek = buildTrek(route, region, `Descripción de ${name}`, HOME_LAT, HOME_LNG)
  return { ...trek, ...overrides }
}

// Build deterministic test treks with controlled stats
const trekA = makeTrekWithOverrides('Alpha Trail', 'Puerto Varas', {
  difficulty: { score: 3, label: 'Moderada', color: 'orange' },
  stats: { totalDistanceM: 5000, totalAscentM: 300, totalDescentM: 200, maxGradePercent: 10, avgGradePercent: 5, maxElevationM: 500, minElevationM: 200, estimatedTimeMinutes: 90 },
})

const trekB = makeTrekWithOverrides('Bravo Path', 'Cochamó', {
  difficulty: { score: 5, label: 'Difícil', color: 'red' },
  stats: { totalDistanceM: 12000, totalAscentM: 900, totalDescentM: 800, maxGradePercent: 25, avgGradePercent: 12, maxElevationM: 1500, minElevationM: 200, estimatedTimeMinutes: 300 },
})

const trekC = makeTrekWithOverrides('Charlie Route', 'Puerto Varas', {
  difficulty: { score: 1, label: 'Fácil', color: 'green' },
  stats: { totalDistanceM: 2000, totalAscentM: 50, totalDescentM: 40, maxGradePercent: 5, avgGradePercent: 2, maxElevationM: 150, minElevationM: 100, estimatedTimeMinutes: 30 },
})

const trekD = makeTrekWithOverrides('Delta Walk', 'Cochamó', {
  difficulty: { score: 3, label: 'Moderada', color: 'orange' },
  stats: { totalDistanceM: 8000, totalAscentM: 400, totalDescentM: 350, maxGradePercent: 15, avgGradePercent: 7, maxElevationM: 700, minElevationM: 200, estimatedTimeMinutes: 150 },
})

const trekE = makeTrekWithOverrides('Echo Ascent', 'Frutillar', {
  difficulty: { score: 3, label: 'Moderada', color: 'orange' },
  stats: { totalDistanceM: 3000, totalAscentM: 200, totalDescentM: 150, maxGradePercent: 8, avgGradePercent: 4, maxElevationM: 400, minElevationM: 200, estimatedTimeMinutes: 60 },
  distanceFromHomeKm: 25,
})

const allTreks = [trekA, trekB, trekC, trekD, trekE]

describe('sortTreks', () => {
  it('sorts by difficulty ascending', () => {
    const sorted = sortTreks(allTreks, [{ field: 'difficulty', direction: 'asc' }])
    expect(sorted[0].difficulty.score).toBe(1)
    expect(sorted[sorted.length - 1].difficulty.score).toBe(5)
  })

  it('sorts by difficulty descending', () => {
    const sorted = sortTreks(allTreks, [{ field: 'difficulty', direction: 'desc' }])
    expect(sorted[0].difficulty.score).toBe(5)
    expect(sorted[sorted.length - 1].difficulty.score).toBe(1)
  })

  it('sorts by length ascending', () => {
    const sorted = sortTreks(allTreks, [{ field: 'length', direction: 'asc' }])
    const distances = sorted.map((t) => t.stats.totalDistanceM)
    for (let i = 1; i < distances.length; i++) {
      expect(distances[i]).toBeGreaterThanOrEqual(distances[i - 1])
    }
  })

  it('sorts by distance ascending', () => {
    const trekNear = makeTrekWithOverrides('Near', 'Puerto Varas', { distanceFromHomeKm: 5 })
    const trekFar = makeTrekWithOverrides('Far', 'Cochamó', { distanceFromHomeKm: 100 })
    const trekMid = makeTrekWithOverrides('Mid', 'Frutillar', { distanceFromHomeKm: 30 })

    const sorted = sortTreks([trekFar, trekNear, trekMid], [{ field: 'distance', direction: 'asc' }])
    expect(sorted[0].distanceFromHomeKm).toBe(5)
    expect(sorted[1].distanceFromHomeKm).toBe(30)
    expect(sorted[2].distanceFromHomeKm).toBe(100)
  })

  it('sorts by name ascending', () => {
    const sorted = sortTreks(allTreks, [{ field: 'name', direction: 'asc' }])
    expect(sorted[0].name).toBe('Alpha Trail')
    expect(sorted[1].name).toBe('Bravo Path')
    expect(sorted[2].name).toBe('Charlie Route')
    expect(sorted[3].name).toBe('Delta Walk')
    expect(sorted[4].name).toBe('Echo Ascent')
  })

  it('applies multi-criteria: difficulty primary, length secondary', () => {
    // trekA: diff=3, dist=5000
    // trekD: diff=3, dist=8000
    // trekE: diff=3, dist=3000
    const sameDiffTreks = [trekA, trekD, trekE, trekC, trekB]
    const sorted = sortTreks(sameDiffTreks, [
      { field: 'difficulty', direction: 'asc' },
      { field: 'length', direction: 'asc' },
    ])

    // First should be diff=1 (trekC)
    expect(sorted[0].name).toBe('Charlie Route')
    // Then diff=3 sorted by length: E(3000) < A(5000) < D(8000)
    expect(sorted[1].name).toBe('Echo Ascent')
    expect(sorted[2].name).toBe('Alpha Trail')
    expect(sorted[3].name).toBe('Delta Walk')
    // Last should be diff=5 (trekB)
    expect(sorted[4].name).toBe('Bravo Path')
  })

  it('returns a new array without mutating the original', () => {
    const original = [...allTreks]
    const sorted = sortTreks(allTreks, [{ field: 'name', direction: 'asc' }])
    expect(sorted).not.toBe(allTreks)
    expect(allTreks).toEqual(original)
  })

  it('returns a copy when criteria is empty', () => {
    const sorted = sortTreks(allTreks, [])
    expect(sorted).toEqual(allTreks)
    expect(sorted).not.toBe(allTreks)
  })
})

describe('filterByRegion', () => {
  it('returns only treks from the specified region', () => {
    const result = filterByRegion(allTreks, 'Puerto Varas')
    expect(result).toHaveLength(2)
    result.forEach((t) => expect(t.region).toBe('Puerto Varas'))
  })

  it('returns empty array for non-existent region', () => {
    const result = filterByRegion(allTreks, 'Patagonia')
    expect(result).toHaveLength(0)
  })

  it('is case-sensitive', () => {
    const result = filterByRegion(allTreks, 'puerto varas')
    expect(result).toHaveLength(0)
  })
})

describe('getRegions', () => {
  it('returns unique sorted region names', () => {
    const regions = getRegions(allTreks)
    expect(regions).toEqual(['Cochamó', 'Frutillar', 'Puerto Varas'])
  })

  it('returns empty array for empty trek list', () => {
    const regions = getRegions([])
    expect(regions).toEqual([])
  })
})

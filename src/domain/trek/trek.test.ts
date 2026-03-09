import { describe, it, expect } from 'vitest'
import type { GPXRoute } from '../gpx/gpx-parser'
import { slugify, getGoogleMapsUrl, buildTrek } from './trek'

// Puerto Varas center
const HOME_LAT = -41.3195
const HOME_LNG = -72.9854

const SAMPLE_ROUTE: GPXRoute = {
  name: 'Cerro La Picada',
  points: [
    { lat: -41.1100, lng: -72.5200, elevation: 600 },
    { lat: -41.1110, lng: -72.5190, elevation: 800 },
    { lat: -41.1120, lng: -72.5180, elevation: 1100 },
    { lat: -41.1130, lng: -72.5170, elevation: 1400 },
    { lat: -41.1125, lng: -72.5175, elevation: 1300 },
  ],
}

describe('slugify', () => {
  it('converts a simple name to kebab-case', () => {
    expect(slugify('Cerro La Picada')).toBe('cerro-la-picada')
  })

  it('handles accented characters', () => {
    expect(slugify('Volcán Osorno')).toBe('volcan-osorno')
  })

  it('handles ñ', () => {
    expect(slugify('Sendero Ñuble Alto')).toBe('sendero-nuble-alto')
  })

  it('collapses multiple spaces and hyphens', () => {
    expect(slugify('Lago  Todos - Los Santos')).toBe('lago-todos-los-santos')
  })

  it('trims leading and trailing whitespace', () => {
    expect(slugify('  Río Petrohué  ')).toBe('rio-petrohue')
  })

  it('removes special characters', () => {
    expect(slugify('Trail #1 (easy)')).toBe('trail-1-easy')
  })
})

describe('getGoogleMapsUrl', () => {
  it('builds correct Google Maps URL', () => {
    const url = getGoogleMapsUrl(-41.3195, -72.9854)
    expect(url).toBe('https://www.google.com/maps?q=-41.3195,-72.9854')
  })

  it('works with positive coordinates', () => {
    const url = getGoogleMapsUrl(48.8566, 2.3522)
    expect(url).toBe('https://www.google.com/maps?q=48.8566,2.3522')
  })
})

describe('buildTrek', () => {
  it('creates a Trek with correct id from route name', () => {
    const trek = buildTrek(SAMPLE_ROUTE, 'PN Vicente Pérez Rosales', 'A challenging climb', HOME_LAT, HOME_LNG)
    expect(trek.id).toBe('cerro-la-picada')
  })

  it('preserves name, region, and description', () => {
    const trek = buildTrek(SAMPLE_ROUTE, 'Cochamó', 'Beautiful valley', HOME_LAT, HOME_LNG)
    expect(trek.name).toBe('Cerro La Picada')
    expect(trek.region).toBe('Cochamó')
    expect(trek.description).toBe('Beautiful valley')
  })

  it('stores the gpxRoute reference', () => {
    const trek = buildTrek(SAMPLE_ROUTE, 'Puerto Varas', 'desc', HOME_LAT, HOME_LNG)
    expect(trek.gpxRoute).toBe(SAMPLE_ROUTE)
  })

  it('computes route stats via calculateRouteStats', () => {
    const trek = buildTrek(SAMPLE_ROUTE, 'Puerto Varas', 'desc', HOME_LAT, HOME_LNG)
    expect(trek.stats.totalAscentM).toBeGreaterThan(0)
    expect(trek.stats.totalDistanceM).toBeGreaterThan(0)
    expect(trek.stats.estimatedTimeMinutes).toBeGreaterThan(0)
  })

  it('computes difficulty via calculateDifficulty', () => {
    const trek = buildTrek(SAMPLE_ROUTE, 'Puerto Varas', 'desc', HOME_LAT, HOME_LNG)
    expect(trek.difficulty.score).toBeGreaterThanOrEqual(0)
    expect(typeof trek.difficulty.label).toBe('string')
    expect(typeof trek.difficulty.color).toBe('string')
  })

  it('computes haversine distance from home to trail start', () => {
    const trek = buildTrek(SAMPLE_ROUTE, 'Puerto Varas', 'desc', HOME_LAT, HOME_LNG)
    // Home is Puerto Varas (-41.3195, -72.9854)
    // Trail starts at (-41.1100, -72.5200) — roughly 45–55 km away
    expect(trek.distanceFromHomeKm).toBeGreaterThan(30)
    expect(trek.distanceFromHomeKm).toBeLessThan(80)
  })

  it('stores start coordinates from first point of route', () => {
    const trek = buildTrek(SAMPLE_ROUTE, 'Puerto Varas', 'desc', HOME_LAT, HOME_LNG)
    expect(trek.startLat).toBe(-41.1100)
    expect(trek.startLng).toBe(-72.5200)
  })
})

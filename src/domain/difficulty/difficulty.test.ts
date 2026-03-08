import { describe, it, expect } from 'vitest'
import { calculateDifficulty } from './difficulty'
import type { GPXPoint } from '../gpx/gpx-parser'

const EASY_ROUTE: GPXPoint[] = [
  { lat: -41.320, lng: -72.980, elevation: 100 },
  { lat: -41.321, lng: -72.979, elevation: 110 },
  { lat: -41.322, lng: -72.978, elevation: 105 },
]

const HARD_ROUTE: GPXPoint[] = [
  { lat: -41.320, lng: -72.980, elevation: 100 },
  { lat: -41.321, lng: -72.979, elevation: 400 },
  { lat: -41.325, lng: -72.975, elevation: 900 },
  { lat: -41.330, lng: -72.970, elevation: 1200 },
  { lat: -41.335, lng: -72.965, elevation: 800 },
]

describe('calculateDifficulty', () => {
  it('returns a score, label, and color', () => {
    const rating = calculateDifficulty(EASY_ROUTE)
    expect(typeof rating.score).toBe('number')
    expect(typeof rating.label).toBe('string')
    expect(typeof rating.color).toBe('string')
  })

  it('easy route gets a low score', () => {
    const rating = calculateDifficulty(EASY_ROUTE)
    expect(rating.score).toBeLessThan(30)
  })

  it('hard route gets a high score', () => {
    const rating = calculateDifficulty(HARD_ROUTE)
    expect(rating.score).toBeGreaterThan(50)
  })

  it('hard route has higher score than easy route', () => {
    const easy = calculateDifficulty(EASY_ROUTE)
    const hard = calculateDifficulty(HARD_ROUTE)
    expect(hard.score).toBeGreaterThan(easy.score)
  })

  it('label is in Spanish', () => {
    const rating = calculateDifficulty(EASY_ROUTE)
    expect(['Fácil', 'Moderado', 'Difícil', 'Muy difícil']).toContain(rating.label)
  })

  it('handles empty route', () => {
    const rating = calculateDifficulty([])
    expect(rating.score).toBe(0)
    expect(rating.label).toBe('Fácil')
  })
})

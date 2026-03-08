import type { GPXPoint } from '../gpx/gpx-parser'
import { calculateRouteStats } from '../gpx/route-stats'

export interface DifficultyRating {
  score: number
  label: string
  color: string
}

/**
 * Calculate a difficulty score (0–100) inspired by IBP Index.
 * Considers: total ascent, max grade, distance, and elevation range.
 * Labels are in Spanish per UI convention.
 */
export function calculateDifficulty(points: GPXPoint[]): DifficultyRating {
  if (points.length <= 1) {
    return { score: 0, label: 'Fácil', color: '#22c55e' }
  }

  const stats = calculateRouteStats(points)

  // Weighted scoring (each factor 0–25, total 0–100)
  const ascentScore = Math.min(25, (stats.totalAscentM / 1500) * 25)
  const gradeScore = Math.min(25, (stats.maxGradePercent / 40) * 25)
  const distanceScore = Math.min(25, (stats.totalDistanceM / 15000) * 25)
  const rangeScore = Math.min(25, ((stats.maxElevationM - stats.minElevationM) / 1000) * 25)

  const score = Math.round(ascentScore + gradeScore + distanceScore + rangeScore)

  if (score < 25) return { score, label: 'Fácil', color: '#22c55e' }
  if (score < 50) return { score, label: 'Moderado', color: '#eab308' }
  if (score < 75) return { score, label: 'Difícil', color: '#f97316' }
  return { score, label: 'Muy difícil', color: '#ef4444' }
}

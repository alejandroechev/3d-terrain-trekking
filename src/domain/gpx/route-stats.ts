import type { GPXPoint } from './gpx-parser'

export interface RouteStats {
  totalDistanceM: number
  totalAscentM: number
  totalDescentM: number
  maxGradePercent: number
  avgGradePercent: number
  minElevationM: number
  maxElevationM: number
  estimatedTimeMinutes: number
}

/**
 * Calculate statistics for a GPX route.
 * Uses Haversine for distance and Naismith's rule for time estimation.
 */
export function calculateRouteStats(points: GPXPoint[]): RouteStats {
  if (points.length <= 1) {
    return {
      totalDistanceM: 0,
      totalAscentM: 0,
      totalDescentM: 0,
      maxGradePercent: 0,
      avgGradePercent: 0,
      minElevationM: points.length === 1 ? points[0].elevation : 0,
      maxElevationM: points.length === 1 ? points[0].elevation : 0,
      estimatedTimeMinutes: 0,
    }
  }

  let totalDistance = 0
  let totalAscent = 0
  let totalDescent = 0
  let maxGrade = 0
  let gradeSum = 0
  let gradeCount = 0
  let minElev = points[0].elevation
  let maxElev = points[0].elevation

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const dist = haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng)
    const elevDiff = curr.elevation - prev.elevation

    totalDistance += dist

    if (elevDiff > 0) totalAscent += elevDiff
    if (elevDiff < 0) totalDescent += Math.abs(elevDiff)

    if (dist > 0) {
      const grade = Math.abs(elevDiff / dist) * 100
      maxGrade = Math.max(maxGrade, grade)
      gradeSum += grade
      gradeCount++
    }

    minElev = Math.min(minElev, curr.elevation)
    maxElev = Math.max(maxElev, curr.elevation)
  }

  // Naismith's rule: 5 km/h base + 1 min per 10m ascent
  const baseTimeMin = (totalDistance / 1000 / 5) * 60
  const ascentTimeMin = totalAscent / 10
  const estimatedTime = baseTimeMin + ascentTimeMin

  return {
    totalDistanceM: totalDistance,
    totalAscentM: totalAscent,
    totalDescentM: totalDescent,
    maxGradePercent: maxGrade,
    avgGradePercent: gradeCount > 0 ? gradeSum / gradeCount : 0,
    minElevationM: minElev,
    maxElevationM: maxElev,
    estimatedTimeMinutes: estimatedTime,
  }
}

/** Haversine distance between two lat/lng points in meters */
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000 // Earth radius in meters
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

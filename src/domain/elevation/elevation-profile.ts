import type { GPXPoint } from '../gpx/gpx-parser'

export interface ProfilePoint {
  distanceM: number
  elevation: number
  gradientPercent: number
}

export interface ElevationProfileData {
  points: ProfilePoint[]
  minElevation: number
  maxElevation: number
  totalDistanceM: number
}

/**
 * Build elevation profile data from GPX points.
 * Computes cumulative distance and per-segment gradient.
 */
export function buildElevationProfileData(points: GPXPoint[]): ElevationProfileData {
  if (points.length === 0) {
    return { points: [], minElevation: 0, maxElevation: 0, totalDistanceM: 0 }
  }

  let cumDist = 0
  let minElev = points[0].elevation
  let maxElev = points[0].elevation

  const profilePoints: ProfilePoint[] = [
    { distanceM: 0, elevation: points[0].elevation, gradientPercent: 0 },
  ]

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const segDist = haversine(prev.lat, prev.lng, curr.lat, curr.lng)
    cumDist += segDist

    const elevDiff = curr.elevation - prev.elevation
    const gradient = segDist > 0 ? (elevDiff / segDist) * 100 : 0

    minElev = Math.min(minElev, curr.elevation)
    maxElev = Math.max(maxElev, curr.elevation)

    profilePoints.push({
      distanceM: cumDist,
      elevation: curr.elevation,
      gradientPercent: gradient,
    })
  }

  return {
    points: profilePoints,
    minElevation: minElev,
    maxElevation: maxElev,
    totalDistanceM: cumDist,
  }
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

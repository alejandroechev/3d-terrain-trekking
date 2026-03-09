import type { GPXRoute } from '../gpx/gpx-parser'
import { calculateRouteStats, haversineDistance } from '../gpx/route-stats'
import type { RouteStats } from '../gpx/route-stats'
import { calculateDifficulty } from '../difficulty/difficulty'
import type { DifficultyRating } from '../difficulty/difficulty'

export interface Trek {
  id: string
  name: string
  description: string
  region: string
  gpxRoute: GPXRoute
  stats: RouteStats
  difficulty: DifficultyRating
  distanceFromHomeKm: number
  startLat: number
  startLng: number
}

export function buildTrek(
  gpxRoute: GPXRoute,
  region: string,
  description: string,
  homeLat: number,
  homeLng: number
): Trek {
  const start = gpxRoute.points[0]
  const distanceM = haversineDistance(homeLat, homeLng, start.lat, start.lng)

  return {
    id: slugify(gpxRoute.name),
    name: gpxRoute.name,
    description,
    region,
    gpxRoute,
    stats: calculateRouteStats(gpxRoute.points),
    difficulty: calculateDifficulty(gpxRoute.points),
    distanceFromHomeKm: distanceM / 1000,
    startLat: start.lat,
    startLng: start.lng,
  }
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`
}

export function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/ñ/gi, 'n')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')    // remove special chars
    .trim()
    .replace(/[\s-]+/g, '-')         // spaces/hyphens → single hyphen
}

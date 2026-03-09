import { TRAIL_MANIFEST } from './trail-manifest'
import { parseGPX } from '../gpx/gpx-parser'
import { buildTrek } from './trek'
import type { Trek } from './trek'

// Puerto Varas center coordinates
const HOME_LAT = -41.3195
const HOME_LNG = -72.9854

export async function loadAllTreks(): Promise<Trek[]> {
  const treks: Trek[] = []

  for (const entry of TRAIL_MANIFEST) {
    try {
      const response = await fetch(entry.gpxPath)
      const gpxText = await response.text()
      const routes = parseGPX(gpxText)
      if (routes.length > 0) {
        treks.push(
          buildTrek(routes[0], entry.region, entry.description, HOME_LAT, HOME_LNG),
        )
      }
    } catch {
      console.warn(`Failed to load trek: ${entry.gpxPath}`)
    }
  }

  return treks
}

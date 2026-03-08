import { gpx as gpxToGeoJSON } from '@tmcw/togeojson'

export interface GPXPoint {
  lat: number
  lng: number
  elevation: number
}

export interface GPXRoute {
  name: string
  points: GPXPoint[]
}

/**
 * Parse a GPX XML string into an array of routes.
 * Handles both tracks (trk/trkseg) and routes (rte/rtept).
 * UI-facing default name is in Spanish per convention.
 */
export function parseGPX(gpxString: string): GPXRoute[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(gpxString, 'text/xml')
  const geojson = gpxToGeoJSON(doc)

  const routes: GPXRoute[] = []

  for (const feature of geojson.features) {
    if (
      feature.geometry.type !== 'LineString' &&
      feature.geometry.type !== 'MultiLineString'
    ) {
      continue
    }

    const name =
      (feature.properties?.name as string) || 'Ruta sin nombre'

    const coordinates =
      feature.geometry.type === 'MultiLineString'
        ? feature.geometry.coordinates.flat()
        : feature.geometry.coordinates

    const points: GPXPoint[] = coordinates.map(
      (coord: number[]) => ({
        lat: coord[1],
        lng: coord[0],
        elevation: coord[2] ?? 0,
      })
    )

    if (points.length > 0) {
      routes.push({ name, points })
    }
  }

  return routes
}

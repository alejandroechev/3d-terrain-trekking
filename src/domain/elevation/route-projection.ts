import type { GPXPoint } from '../gpx/gpx-parser'
import type { BBox } from './elevation'

export interface MeshProjectionOptions {
  meshSize: number
  exaggeration: number
}

/**
 * Project GPX route points from lat/lng into the 3D mesh coordinate system.
 * Returns a flat Float32Array of [x, y, z, x, y, z, ...] positions.
 * X maps lng within bbox to [-meshSize/2, meshSize/2].
 * Z maps lat within bbox to [-meshSize/2, meshSize/2].
 * Y is elevation * exaggeration.
 */
export function projectRouteToMesh(
  points: GPXPoint[],
  bbox: BBox,
  options: MeshProjectionOptions
): Float32Array {
  const { meshSize, exaggeration } = options
  const half = meshSize / 2
  const lngRange = bbox.east - bbox.west
  const latRange = bbox.north - bbox.south

  const positions = new Float32Array(points.length * 3)

  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    const x = lngRange > 0
      ? ((p.lng - bbox.west) / lngRange) * meshSize - half
      : 0
    const z = latRange > 0
      ? ((p.lat - bbox.south) / latRange) * meshSize - half
      : 0
    const y = p.elevation * exaggeration

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }

  return positions
}

/**
 * Calculate the gradient (slope percentage) for each segment of a route.
 * Positive = uphill, negative = downhill.
 */
export function segmentGradients(points: GPXPoint[]): number[] {
  const gradients: number[] = []
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const dist = haversine(prev.lat, prev.lng, curr.lat, curr.lng)
    const elevDiff = curr.elevation - prev.elevation
    gradients.push(dist > 0 ? (elevDiff / dist) * 100 : 0)
  }
  return gradients
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

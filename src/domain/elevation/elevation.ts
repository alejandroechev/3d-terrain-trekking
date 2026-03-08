export interface TileCoord {
  x: number
  y: number
  z: number
}

export interface BBox {
  north: number
  south: number
  east: number
  west: number
}

/**
 * Decode Mapbox Terrain-RGB pixel to elevation in meters.
 * Formula: height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
 */
export function decodeTerrainRGB(r: number, g: number, b: number): number {
  return -10000 + (r * 65536 + g * 256 + b) * 0.1
}

/**
 * Convert lat/lng to slippy map tile coordinates at a given zoom level.
 * Uses Web Mercator projection (EPSG:3857).
 */
export function latLngToTile(lat: number, lng: number, zoom: number): TileCoord {
  const n = Math.pow(2, zoom)
  const x = Math.floor(((lng + 180) / 360) * n)
  const latRad = (lat * Math.PI) / 180
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  )
  return { x, y, z: zoom }
}

/**
 * Convert tile coordinates back to a lat/lng bounding box.
 */
export function tileToBBox(x: number, y: number, z: number): BBox {
  const n = Math.pow(2, z)
  const west = (x / n) * 360 - 180
  const east = ((x + 1) / n) * 360 - 180
  const north = tileToLat(y, n)
  const south = tileToLat(y + 1, n)
  return { north, south, east, west }
}

function tileToLat(y: number, n: number): number {
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)))
  return (latRad * 180) / Math.PI
}

import { decodeTerrainRGB } from './elevation'

export interface Heightmap extends Array<number[]> {
  minElevation: number
  maxElevation: number
}

/**
 * Extract a 2D heightmap grid from Mapbox Terrain-RGB ImageData.
 * Returns a row-major 2D array where heightmap[y][x] = elevation in meters,
 * plus min/max elevation metadata.
 */
export function extractHeightmap(imageData: ImageData): Heightmap {
  const { data, width, height } = imageData
  let minElevation = Infinity
  let maxElevation = -Infinity

  const grid: number[][] = []
  for (let y = 0; y < height; y++) {
    const row: number[] = []
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const elevation = decodeTerrainRGB(data[idx], data[idx + 1], data[idx + 2])
      row.push(elevation)
      if (elevation < minElevation) minElevation = elevation
      if (elevation > maxElevation) maxElevation = elevation
    }
    grid.push(row)
  }

  const heightmap = grid as Heightmap
  heightmap.minElevation = minElevation
  heightmap.maxElevation = maxElevation
  return heightmap
}

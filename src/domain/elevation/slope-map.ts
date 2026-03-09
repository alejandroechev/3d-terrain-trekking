import type { Heightmap } from './heightmap'

/**
 * Compute slope angle (degrees) for each cell of a heightmap.
 * Uses central differences where possible, forward/backward at edges.
 * cellSizeM is the real-world distance between adjacent cells in meters.
 */
export function computeSlopeMap(heightmap: Heightmap, cellSizeM: number): number[][] {
  const rows = heightmap.length
  const cols = heightmap[0].length
  const slopes: number[][] = []

  for (let r = 0; r < rows; r++) {
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      const dzdx = centralDiff(heightmap, r, c, 0, 1, cols, cellSizeM)
      const dzdy = centralDiff(heightmap, r, c, 1, 0, rows, cellSizeM)
      const slopeDeg = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy)) * (180 / Math.PI)
      row.push(slopeDeg)
    }
    slopes.push(row)
  }

  return slopes
}

function centralDiff(
  hm: Heightmap, r: number, c: number,
  dr: number, dc: number, limit: number, cellSize: number
): number {
  const idx = dr !== 0 ? r : c
  if (idx === 0) {
    const next = hm[r + dr][c + dc]
    const curr = hm[r][c]
    return (next - curr) / cellSize
  } else if (idx === limit - 1) {
    const curr = hm[r][c]
    const prev = hm[r - dr][c - dc]
    return (curr - prev) / cellSize
  } else {
    const next = hm[r + dr][c + dc]
    const prev = hm[r - dr][c - dc]
    return (next - prev) / (2 * cellSize)
  }
}

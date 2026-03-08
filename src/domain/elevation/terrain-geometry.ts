import type { Heightmap } from './heightmap'

export interface TerrainGeometryOptions {
  width: number
  height: number
  exaggeration: number
}

export interface TerrainGeometryData {
  positions: Float32Array
  uvs: Float32Array
  indices: Uint32Array
}

/**
 * Build raw geometry data (positions, UVs, indices) from a heightmap.
 * Produces a grid mesh centered at origin, spanning [-width/2, width/2] on X
 * and [-height/2, height/2] on Z. Y is elevation * exaggeration.
 */
export function buildTerrainGeometryData(
  heightmap: Heightmap,
  options: TerrainGeometryOptions
): TerrainGeometryData {
  const rows = heightmap.length
  const cols = heightmap[0].length
  const { width, height, exaggeration } = options

  const vertexCount = rows * cols
  const positions = new Float32Array(vertexCount * 3)
  const uvs = new Float32Array(vertexCount * 2)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c
      const x = (c / (cols - 1)) * width - width / 2
      const z = (r / (rows - 1)) * height - height / 2
      const y = heightmap[r][c] * exaggeration

      positions[idx * 3] = x
      positions[idx * 3 + 1] = y
      positions[idx * 3 + 2] = z

      uvs[idx * 2] = c / (cols - 1)
      uvs[idx * 2 + 1] = r / (rows - 1)
    }
  }

  const cellRows = rows - 1
  const cellCols = cols - 1
  const indices = new Uint32Array(cellRows * cellCols * 6)
  let triIdx = 0

  for (let r = 0; r < cellRows; r++) {
    for (let c = 0; c < cellCols; c++) {
      const tl = r * cols + c
      const tr = tl + 1
      const bl = (r + 1) * cols + c
      const br = bl + 1

      indices[triIdx++] = tl
      indices[triIdx++] = bl
      indices[triIdx++] = tr

      indices[triIdx++] = tr
      indices[triIdx++] = bl
      indices[triIdx++] = br
    }
  }

  return { positions, uvs, indices }
}

import { describe, it, expect } from 'vitest'
import { buildTerrainGeometryData } from './terrain-geometry'
import type { Heightmap } from './heightmap'

function makeHeightmap(rows: number, cols: number, valueFn: (r: number, c: number) => number): Heightmap {
  const grid: number[][] = []
  let min = Infinity
  let max = -Infinity
  for (let r = 0; r < rows; r++) {
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      const v = valueFn(r, c)
      row.push(v)
      if (v < min) min = v
      if (v > max) max = v
    }
    grid.push(row)
  }
  const hm = grid as Heightmap
  hm.minElevation = min
  hm.maxElevation = max
  return hm
}

describe('buildTerrainGeometryData', () => {
  it('returns positions array with 3 components per vertex', () => {
    const hm = makeHeightmap(3, 3, () => 100)
    const data = buildTerrainGeometryData(hm, { width: 10, height: 10, exaggeration: 1 })
    // 3x3 grid = 9 vertices, 3 floats each = 27
    expect(data.positions.length).toBe(27)
  })

  it('returns UVs array with 2 components per vertex', () => {
    const hm = makeHeightmap(3, 3, () => 100)
    const data = buildTerrainGeometryData(hm, { width: 10, height: 10, exaggeration: 1 })
    // 3x3 grid = 9 vertices, 2 floats each = 18
    expect(data.uvs.length).toBe(18)
  })

  it('returns indices for triangle faces', () => {
    const hm = makeHeightmap(3, 3, () => 100)
    const data = buildTerrainGeometryData(hm, { width: 10, height: 10, exaggeration: 1 })
    // (3-1)*(3-1) = 4 cells, 2 triangles each, 3 indices each = 24
    expect(data.indices.length).toBe(24)
  })

  it('applies vertical exaggeration to Y positions', () => {
    const hm = makeHeightmap(2, 2, () => 500)
    const data1 = buildTerrainGeometryData(hm, { width: 10, height: 10, exaggeration: 1 })
    const data2 = buildTerrainGeometryData(hm, { width: 10, height: 10, exaggeration: 3 })
    // Y is at index 1 for first vertex
    expect(data2.positions[1]).toBeCloseTo(data1.positions[1] * 3, 5)
  })

  it('maps positions to the specified width and height', () => {
    const hm = makeHeightmap(2, 2, () => 0)
    const data = buildTerrainGeometryData(hm, { width: 20, height: 30, exaggeration: 1 })
    // 2x2 grid: vertices (0,0), (0,1), (1,0), (1,1)
    // vertex 0: x=-10, z=-15; vertex 1: x=10, z=-15
    // vertex 2: x=-10, z=15;  vertex 3: x=10, z=15
    const x0 = data.positions[0] // vertex 0, x
    const x1 = data.positions[3] // vertex 1, x
    const z0 = data.positions[2] // vertex 0, z
    const z2 = data.positions[8] // vertex 2, z
    expect(Math.abs(x1 - x0)).toBeCloseTo(20, 1)
    expect(Math.abs(z2 - z0)).toBeCloseTo(30, 1)
  })

  it('UVs range from 0 to 1', () => {
    const hm = makeHeightmap(4, 4, (r, c) => r * 100 + c * 50)
    const data = buildTerrainGeometryData(hm, { width: 10, height: 10, exaggeration: 1 })
    for (const uv of data.uvs) {
      expect(uv).toBeGreaterThanOrEqual(0)
      expect(uv).toBeLessThanOrEqual(1)
    }
  })
})

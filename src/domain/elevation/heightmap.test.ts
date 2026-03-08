import { describe, it, expect } from 'vitest'
import { extractHeightmap } from './heightmap'

function makeImageData(width: number, height: number, fillFn: (x: number, y: number) => [number, number, number]): ImageData {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = fillFn(x, y)
      const idx = (y * width + x) * 4
      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = 255
    }
  }
  return { data, width, height } as unknown as ImageData
}

describe('extractHeightmap', () => {
  it('returns a 2D array of the correct dimensions', () => {
    const img = makeImageData(4, 4, () => [1, 134, 160]) // sea level
    const heightmap = extractHeightmap(img)
    expect(heightmap.length).toBe(4)
    expect(heightmap[0].length).toBe(4)
  })

  it('decodes uniform sea-level pixels to ~0m elevation', () => {
    const img = makeImageData(2, 2, () => [1, 134, 160])
    const heightmap = extractHeightmap(img)
    for (const row of heightmap) {
      for (const h of row) {
        expect(h).toBeCloseTo(0, 0)
      }
    }
  })

  it('decodes varying pixels to varying elevations', () => {
    const img = makeImageData(2, 2, (x, y) => {
      if (x === 0 && y === 0) return [1, 134, 160] // 0m
      return [1, 212, 192] // 2000m
    })
    const heightmap = extractHeightmap(img)
    expect(heightmap[0][0]).toBeCloseTo(0, 0)
    expect(heightmap[0][1]).toBeCloseTo(2000, 0)
    expect(heightmap[1][0]).toBeCloseTo(2000, 0)
  })

  it('returns min and max elevation metadata', () => {
    const img = makeImageData(2, 2, (x, y) => {
      if (x === 0 && y === 0) return [1, 134, 160] // 0m
      return [1, 212, 192] // 2000m
    })
    const heightmap = extractHeightmap(img)
    expect(heightmap.minElevation).toBeCloseTo(0, 0)
    expect(heightmap.maxElevation).toBeCloseTo(2000, 0)
  })
})

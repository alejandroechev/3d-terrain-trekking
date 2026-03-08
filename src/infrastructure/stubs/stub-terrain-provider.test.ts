import { describe, it, expect } from 'vitest'
import { StubTerrainTileProvider } from './stub-terrain-provider'

describe('StubTerrainTileProvider', () => {
  describe('fetchTerrainTile', () => {
    it('returns an ImageData-like object with the correct dimensions', async () => {
      const provider = new StubTerrainTileProvider()
      const tile = await provider.fetchTerrainTile({ x: 0, y: 0, z: 0 })
      expect(tile.width).toBe(256)
      expect(tile.height).toBe(256)
      expect(tile.data).toBeInstanceOf(Uint8ClampedArray)
      expect(tile.data.length).toBe(256 * 256 * 4)
    })

    it('generates elevation data that decodes to reasonable heights', async () => {
      const provider = new StubTerrainTileProvider()
      const tile = await provider.fetchTerrainTile({ x: 0, y: 0, z: 0 })
      // Check center pixel — should decode to a non-extreme value
      const centerIdx = (128 * 256 + 128) * 4
      const r = tile.data[centerIdx]
      const g = tile.data[centerIdx + 1]
      const b = tile.data[centerIdx + 2]
      const height = -10000 + (r * 65536 + g * 256 + b) * 0.1
      // Stub generates terrain between 0 and ~2000m
      expect(height).toBeGreaterThanOrEqual(0)
      expect(height).toBeLessThanOrEqual(3000)
    })

    it('generates different elevations across the tile (not flat)', async () => {
      const provider = new StubTerrainTileProvider()
      const tile = await provider.fetchTerrainTile({ x: 0, y: 0, z: 0 })
      const heights = new Set<number>()
      for (let i = 0; i < 256; i += 32) {
        const idx = (i * 256 + i) * 4
        const r = tile.data[idx]
        const g = tile.data[idx + 1]
        const b = tile.data[idx + 2]
        heights.add(-10000 + (r * 65536 + g * 256 + b) * 0.1)
      }
      // Should have some variation
      expect(heights.size).toBeGreaterThan(1)
    })
  })

  describe('fetchSatelliteTile', () => {
    it('returns a placeholder image element', async () => {
      const provider = new StubTerrainTileProvider()
      const img = await provider.fetchSatelliteTile({ x: 0, y: 0, z: 0 })
      expect(img).toBeDefined()
    })
  })
})

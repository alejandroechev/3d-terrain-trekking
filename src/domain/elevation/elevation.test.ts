import { describe, it, expect } from 'vitest'
import {
  decodeTerrainRGB,
  latLngToTile,
  tileToBBox,
} from './elevation'

describe('elevation', () => {
  describe('decodeTerrainRGB', () => {
    it('decodes RGB (0, 0, 0) to -10000m (Mapbox formula)', () => {
      const height = decodeTerrainRGB(0, 0, 0)
      expect(height).toBeCloseTo(-10000, 1)
    })

    it('decodes sea level correctly (R=1, G=134, B=160 ≈ 0m)', () => {
      // height = -10000 + ((1 * 256 * 256 + 134 * 256 + 160) * 0.1)
      // = -10000 + ((65536 + 34304 + 160) * 0.1)
      // = -10000 + 10000.0 = 0.0
      const height = decodeTerrainRGB(1, 134, 160)
      expect(height).toBeCloseTo(0, 1)
    })

    it('decodes a known high elevation (e.g. ~2000m)', () => {
      // For 2000m: (R*65536 + G*256 + B) * 0.1 = 12000
      // R*65536 + G*256 + B = 120000
      // R=1, remainder = 120000 - 65536 = 54464
      // G = floor(54464 / 256) = 212, B = 54464 % 256 = 192
      // But we also need to add back the base offset
      // height = -10000 + (120000 * 0.1) = -10000 + 12000 = 2000
      const height = decodeTerrainRGB(1, 212, 192)
      // (1*65536 + 212*256 + 192) = 65536 + 54272 + 192 = 120000
      // -10000 + 120000 * 0.1 = -10000 + 12000 = 2000
      expect(height).toBeCloseTo(2000, 1)
    })

    it('handles max RGB values', () => {
      const height = decodeTerrainRGB(255, 255, 255)
      // (255*65536 + 255*256 + 255) = 16777215
      // -10000 + 16777215 * 0.1 = -10000 + 1677721.5 = 1667721.5
      expect(height).toBeCloseTo(1667721.5, 1)
    })
  })

  describe('latLngToTile', () => {
    it('converts Puerto Varas coordinates to tile at zoom 12', () => {
      const tile = latLngToTile(-41.32, -72.98, 12)
      expect(tile.x).toBeGreaterThan(0)
      expect(tile.y).toBeGreaterThan(0)
      expect(tile.z).toBe(12)
      expect(Number.isInteger(tile.x)).toBe(true)
      expect(Number.isInteger(tile.y)).toBe(true)
    })

    it('converts equator/prime meridian to known tile at zoom 0', () => {
      const tile = latLngToTile(0, 0, 0)
      expect(tile.x).toBe(0)
      expect(tile.y).toBe(0)
      expect(tile.z).toBe(0)
    })

    it('handles negative coordinates correctly', () => {
      const tile = latLngToTile(-41.32, -72.98, 10)
      // Southern hemisphere, western hemisphere
      // x should be less than half of 2^10 = 512 (western)
      expect(tile.x).toBeLessThan(512)
      // y should be greater than half of 2^10 = 512 (southern)
      expect(tile.y).toBeGreaterThan(512)
    })
  })

  describe('tileToBBox', () => {
    it('returns a valid bounding box with south < north and west < east', () => {
      const bbox = tileToBBox(1234, 2048, 12)
      expect(bbox.south).toBeLessThan(bbox.north)
      expect(bbox.west).toBeLessThan(bbox.east)
    })

    it('returns bbox within valid lat/lng ranges', () => {
      const bbox = tileToBBox(1234, 2048, 12)
      expect(bbox.south).toBeGreaterThanOrEqual(-90)
      expect(bbox.north).toBeLessThanOrEqual(90)
      expect(bbox.west).toBeGreaterThanOrEqual(-180)
      expect(bbox.east).toBeLessThanOrEqual(180)
    })

    it('zoom 0 tile (0,0) covers the whole world', () => {
      const bbox = tileToBBox(0, 0, 0)
      expect(bbox.west).toBeCloseTo(-180, 0)
      expect(bbox.east).toBeCloseTo(180, 0)
      // Web Mercator doesn't go all the way to ±90
      expect(bbox.north).toBeCloseTo(85.05, 0)
      expect(bbox.south).toBeCloseTo(-85.05, 0)
    })
  })
})

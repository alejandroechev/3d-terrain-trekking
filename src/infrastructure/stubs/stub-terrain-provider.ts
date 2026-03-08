import type { TileCoord } from '../../domain/elevation/elevation'
import type { TerrainTileProvider } from '../../types/terrain-provider'

/**
 * In-memory stub that generates procedural terrain data.
 * Uses simple sine waves to create varied elevation patterns
 * without any network calls. Elevations range 0–2000m.
 */
export class StubTerrainTileProvider implements TerrainTileProvider {
  async fetchTerrainTile(tile: TileCoord): Promise<ImageData> {
    const size = 256
    const data = new Uint8ClampedArray(size * size * 4)

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const elevation = this.generateElevation(tile, x, y, size)
        const encoded = Math.round((elevation + 10000) / 0.1)
        const r = Math.floor(encoded / 65536)
        const g = Math.floor((encoded % 65536) / 256)
        const b = encoded % 256

        const idx = (y * size + x) * 4
        data[idx] = r
        data[idx + 1] = g
        data[idx + 2] = b
        data[idx + 3] = 255
      }
    }

    return { data, width: size, height: size } as unknown as ImageData
  }

  async fetchSatelliteTile(_tile: TileCoord): Promise<HTMLImageElement> {
    // Return a minimal placeholder — real satellite imagery requires Mapbox
    const img = new Image(256, 256)
    return img
  }

  private generateElevation(tile: TileCoord, px: number, py: number, size: number): number {
    const globalX = tile.x + px / size
    const globalY = tile.y + py / size

    // Layer multiple sine waves for varied terrain
    const base = Math.sin(globalX * 0.5) * Math.cos(globalY * 0.5) * 500 + 500
    const detail = Math.sin(globalX * 3) * Math.sin(globalY * 3) * 200
    const ridge = Math.max(0, Math.sin(globalX * 1.5 + globalY) * 400)

    return Math.max(0, Math.min(2000, base + detail + ridge))
  }
}

import type { TileCoord } from '../../domain/elevation/elevation'
import type { TerrainTileProvider } from '../../types/terrain-provider'

/**
 * Real Mapbox terrain tile provider. Fetches Terrain-RGB and satellite tiles
 * from the Mapbox API. Requires a valid access token.
 */
export class MapboxTerrainTileProvider implements TerrainTileProvider {
  private readonly accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async fetchTerrainTile(tile: TileCoord): Promise<ImageData> {
    const url = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${tile.z}/${tile.x}/${tile.y}@2x.pngraw?access_token=${this.accessToken}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch terrain tile ${tile.z}/${tile.x}/${tile.y}: ${response.status}`)
    }
    const blob = await response.blob()
    const bitmap = await createImageBitmap(blob)
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(bitmap, 0, 0)
    return ctx.getImageData(0, 0, bitmap.width, bitmap.height)
  }

  async fetchSatelliteTile(tile: TileCoord): Promise<ImageBitmap> {
    const url = `https://api.mapbox.com/v4/mapbox.satellite/${tile.z}/${tile.x}/${tile.y}@2x.jpg?access_token=${this.accessToken}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch satellite tile ${tile.z}/${tile.x}/${tile.y}: ${response.status}`)
    }
    const blob = await response.blob()
    return createImageBitmap(blob)
  }
}

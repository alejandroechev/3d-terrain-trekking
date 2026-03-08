import type { TileCoord } from '../domain/elevation/elevation'

export interface TerrainTileProvider {
  fetchTerrainTile(tile: TileCoord): Promise<ImageData>
  fetchSatelliteTile(tile: TileCoord): Promise<ImageBitmap | HTMLImageElement>
}

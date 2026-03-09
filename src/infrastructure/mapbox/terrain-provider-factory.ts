import type { TerrainTileProvider } from '../../types/terrain-provider'
import type { TileCoord } from '../../domain/elevation/elevation'
import { StubTerrainTileProvider } from '../stubs/stub-terrain-provider'
import { MapboxTerrainTileProvider } from './mapbox-terrain-provider'
import { mapboxCounter } from '../../domain/geo/mapbox-request-counter'

/**
 * Wraps a real provider to count Mapbox tile requests.
 */
class CountingTerrainProvider implements TerrainTileProvider {
  private inner: TerrainTileProvider
  constructor(inner: TerrainTileProvider) {
    this.inner = inner
  }

  async fetchTerrainTile(tile: TileCoord): Promise<ImageData> {
    mapboxCounter.increment()
    return this.inner.fetchTerrainTile(tile)
  }

  async fetchSatelliteTile(tile: TileCoord): Promise<ImageBitmap | HTMLImageElement> {
    mapboxCounter.increment()
    return this.inner.fetchSatelliteTile(tile)
  }
}

/**
 * Factory that auto-selects the real Mapbox provider when an API key is
 * available, falling back to the in-memory stub for offline dev/testing.
 */
export function createTerrainProvider(apiKey?: string): TerrainTileProvider {
  if (apiKey) {
    return new CountingTerrainProvider(new MapboxTerrainTileProvider(apiKey))
  }
  return new StubTerrainTileProvider()
}

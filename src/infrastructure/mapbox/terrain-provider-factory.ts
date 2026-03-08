import type { TerrainTileProvider } from '../../types/terrain-provider'
import { StubTerrainTileProvider } from '../stubs/stub-terrain-provider'
import { MapboxTerrainTileProvider } from './mapbox-terrain-provider'

/**
 * Factory that auto-selects the real Mapbox provider when an API key is
 * available, falling back to the in-memory stub for offline dev/testing.
 */
export function createTerrainProvider(apiKey?: string): TerrainTileProvider {
  if (apiKey) {
    return new MapboxTerrainTileProvider(apiKey)
  }
  return new StubTerrainTileProvider()
}

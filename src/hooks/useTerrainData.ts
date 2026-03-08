import { useState, useEffect } from 'react'
import type { TileCoord } from '../domain/elevation/elevation'
import type { Heightmap } from '../domain/elevation/heightmap'
import { extractHeightmap } from '../domain/elevation/heightmap'
import { createTerrainProvider } from '../infrastructure/mapbox/terrain-provider-factory'

/**
 * Hook that fetches terrain tile data and extracts a heightmap.
 * Uses the provider factory to auto-select real Mapbox or stub.
 */
export function useTerrainData(tile: TileCoord, apiKey?: string): Heightmap | null {
  const [heightmap, setHeightmap] = useState<Heightmap | null>(null)

  useEffect(() => {
    let cancelled = false
    const provider = createTerrainProvider(apiKey)

    provider.fetchTerrainTile(tile).then((imageData) => {
      if (!cancelled) {
        setHeightmap(extractHeightmap(imageData))
      }
    })

    return () => {
      cancelled = true
    }
  }, [tile.x, tile.y, tile.z, apiKey])

  return heightmap
}
